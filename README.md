# create-ts-next

[![version](https://img.shields.io/npm/v/create-ts-next?style=for-the-badge)](https://www.npmjs.com/package/create-ts-next) [![dt](https://img.shields.io/npm/dt/create-ts-next?style=for-the-badge)](https://www.npmjs.com/package/create-ts-next)

## 基本介绍

这是一个用于在 node 环境，迅速建立 Typescript 项目的脚手架。

主要以 ts-node + swc + mocha（可选） 的方式直接启动 Typescript 的开发。

默认 typescript 依赖如下：

- `@types/node`
- `typescript`
- `tslib`
- `eslint`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `prettier`
- `ts-node`
- `@swc/cli`
- `@swc/core`
- `@swc/helpers`

目前可选库调整为 `nodemon` `mocha` `rollup` ，根据 `--lib|-l` 参数，创建的项目的内容会有少许不同（如初始配置文件）。

相较 1.0.x 的版本，1.1 主要做了如下调整：

1. `eslint`、`prettier` 和 `swc` 不再作为选项，而是默认安装。
2. 可选库调整为更加实用的，并自动添加相关的配置和 scripts。
3. 根据 `--module|-m` 参数识别是否为 esm 项目，根据 esm 生成的代码有所不同，大人时代变了，要上 es module 这趟车了（rollup 也默认生成 `cjs` 和 `es` 两种格式）。
4. 调整模板的实现，`ejs` 仍然保留（依赖关系）。
5. 增加 `rollup` 作为选项，默认添加简单通用的 `rollup.config.js` 的脚本。

## 命令行使用

```shell
npx create-ts-next <name>

# 使用帮助和查看版本号
npx create-ts-next --help
npx create-ts-next --version

# 更新新版本
# 如果之前通过 npx 指令使用过
npx create-ts-next@latest --help

# nodemon / mocha / rollup 全选
# 包管理器选择 pnpm
# module: commonjs
npx create-ts-next <name> -l all -p pnpm -i
# rollup / mocha
# 包管理器选择 npm 默认
# module: es ，即 es2022
npx create-ts-next <name> -m es -l rollup,mocha
```

默认 `es` 指代 node 当前的 18 LTS 版本，未来会根据 node 版本调整。

### --module|-m

指定 module 模式，默认 `commonjs` 。

可选 `commonjs|es|es6|es2015|es2020|esnext` 等。

### --target|-t

TS 编译目标，默认 `ES2022` [nodejs ES2022](https://node.green/#ES2022)

### --lib|-l

附加库，可选值 `nodemon|mocha|rollup` ，可多项。

如果添加相关库，则会在新建的项目中添加相关的文件：

nodemon

- `nodemon`
- `@types/nodemon`

mocha

- `mocha`
- `@types/mocha`
- `chai`
- `@types/chai`

rollup

- `rollup`
- `@rollup/plugin-commonjs`
- `@rollup/plugin-node-resolve`
- `rollup-plugin-swc3`
- `rollup-plugin-dts`

### --mock|-M

启用 mock 模式，该模式不会检查是否存在重名目录，也不会创建任何目录和文件，只是模拟正常执行的流程。

### --package-manager|-p

默认为 `npm`，可选 `npm` `yarn` `pnpm`，选择本地 node 包管理器。

### --install|-i

默认为 `true`

是否自动安装依赖包，根据指定的 `--package-manager|-p` 安装项目依赖。

## API 说明

`create-ts-next`
亦可作为一个编程库而被使用，如：[create-webpack-next](https://gitee.com/janpoem/create-webpack-next/blob/master/src/WebpackNextProjectCreator.ts)

### ProjectCreator

ProjectCreator 提供了创建 node.js 模板项目的抽象类。

1. 继承类应该声明泛型 `Options` 和 `State`，`class YourCreator extends ProjectCreator<YourOptions, YourState>`
    - `Options` 为藉由外部环境（如
      CLI）传入的配置选项，要求限定继承自 [ProjectCreatorBasicOptions](https://gitee.com/janpoem/create-ts-next/blob/master/src/ProjectCreator.ts#L7)
    - `State` 藉由配置选项，生成的运行时状态，如果无，可指定一个任意的结构。
2. 继承类应该实现抽象方法 `getStructure(): ProjectStructure` 和 `startUp(): Promise<this>`
    - `getStructure(): ProjectStructure` 获取需要创建的项目的目录结构
    - `startUp(): Promise<this>` 启动执行创建项目
3. 重载 `getTemplatePath(relative: string): string` 方法，根据相对路径返回对应的模板所在路径。
    - 因为不同的 package ，实际存放 template 的位置有所不同，所以每个 Creator 都应重载此方法。
    - `relative` 为相对于项目根目录的相对路径，如：
        - 项目根目录为 `/my-app`，处理创建文件 `/my-app/src/index.ts` ，则此时的 `relative` 为 `src/index.ts`
4. 项目创建实际执行流程：
    1. **[可选]** `await this.detectPackageCmd();` 检查本地可使用的 package manager 指令，如果你需要 install 的话
    2. **[必要]** `this.create(this.getStructure());` 传入创建项目的结构，并创建项目
    3. **[可选]** `await installDeps(this.projectRoot, this.packageCmd);` 安装依赖，如果你需要 install 的话

> installDeps 同样由 create-ts-next 提供，`import { installDeps } from 'create-ts-next'`

#### ProjectCreatorBasicOptions

用于描述创建项目的基本配置选项。

```ts
interface ProjectCreatorBasicOptions {
  // 创建的项目名称
  name: string,
  // 是否要 install
  install: boolean,
  // 指定的包管理器
  packageManager: 'npm' | 'yarn' | 'pnpm',
  // 是否启用调试
  debug?: boolean,
  // 是否启用模拟模式
  mock?: boolean,
}
```

#### ProjectStructure

用于描述项目的目录结构，可以将一个 ProjectStructure 数据实体，理解为对应的一个目录或文件的描述，其结构声明如下：

```ts
type ProjectStructure = {
  // 文件或目录名称
  name: string,
  // 是一个文件还是目录，undeinfed 时默认为 file
  type?: 'dir' | 'file',
  // 仅对 type = file 有效，文件的数据内容文本格式
  data?: string,
  // 忽略 ejs 模板处理
  // ignoreTpl = true 时，仍旧会尝试去加载模板内容，但不会进行 ejs 模板处理
  ignoreTpl?: boolean,
  // 目录下的内容，仅对 type = dir 有效
  children?: (ProjectStructure | undefined)[]
}
```

## 更新日志

### 1.1.1

参考如上

### 1.0.9

- 更新开发所需库版本 `ejs^3`, `mocha^10`
- 更新依赖库版本，`typescript^5`, 及其他

### 1.0.8 

- 增加 `prettier`
- 更新依赖库版本
- 转用 gitee workflow

### 1.0.7

- 更新依赖库版本
- 使用 `nodemon` 替换 `chokidar` 库

### 1.0.6

- 增加 `ProjectCreator.generateFileContent` 方法，使继承类可使用自定义的模板处理器。

### 1.0.5

- 增加 `ProjectCreator.getTemplatePath` 方法

### 1.0.4

- 增加参数 `--package-manager|-p` 选择本地 node 包管理器，默认为 `npm`；
- 调整匹配本地包管理器状态，从过去检查 3 个，改为只检查用户指定的包管理器；
- 调整目录结构，`src/index.ts` （对应 `dist/index.js`）导出全部代码，增加 `src/cli.ts` 作为脚本启动环境（便于可复用代码）；
- 分离 `ProjectCreator` 和 `TsNextProjectCreator`。

### 1.0.3

- 增加参数 `--install|-i` 控制创建项目后，是否自动安装依赖包；
- 修正生成的 package.json 的项目名称，只使用创建项目的目录名（不包含父路径）；
- 添加项目的可执行 `scripts` ，增加 `dev:start` `build` `lint`（如果包含 eslint） `test` （如果包含 mocha）。
