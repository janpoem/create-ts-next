# create-ts-next

## 基本介绍

这是一个 node.js 的项目创建脚手架，用于创建次世代的 TypeScript 项目模板。

本项目主要针对 node.js 的后端项目环境或独立库开发，不针对前端创建项目，因为 vite webpack 已经有很多比较好的脚手架了）。

该项目将自动创建基础的 TypeScript 项目环境，并可通过参数增加部分相关库：

1. typescript
    - `typescript@^4.6.2`
    - `@types/node@^16` 该项目只保持对 node.js LTS 版本对齐，不考虑兼容更早的 node.js 版本。
2. eslint，可通过命令行参数 `--eslint|-e false` 控制，默认开启。推荐阅读：[https://typescript-eslint.io/](https://typescript-eslint.io/)
    - `eslint@^8`
    - `@typescript-eslint/parser@^5`
    - `@typescript-eslint/eslint-plugin@^5`
3. [ts-node](https://typestrong.org/ts-node/docs/) ，可通过命令行参数 `--lib ts-node` 添加。
    - `ts-node@^10.4.0` 
4. [swc](https://swc.rs/) ，可通过命令行参数 `--lib swc` 添加。
    - `chokidar^@3.5.3` ，要以 watch 模式执行 swc 编译，需要增加这个库
    - `@swc/cli@^0.1.55`
    - `@swc/core@^1.2.151`
    - `regenerator-runtime@^0.13.9`
5. mocha ，可通过命令行参数 `--lib mocha` 添加，默认整合 mocha 和 chai。
    - `mocha@^9.2.1`
    - `@types/mocha@^9.1.1`
    - `chai@^4.3.6`
    - `@types/chai@^4.3.0`

现阶段 `ts-node` x `swc` ，构成了完美的 TypeScript 的本地开发环境，而且开发时完全可以用 `ts-node` x `swc` 直接解释执行，而无需编译。

当通过参数添加了相关库以后，除了在创建项目时自动创建 `package.json` 文件，相关的 `tsconfig.json` `.swcrc` `.mocharc.json` `.gitignore` `.eslintrc.js` 也会根据参数自动添加。

## 命令行使用

```shell
npm install create-ts-next -g
create-ts-next -h
# typescript, eslint, ts-node, swc 
create-ts-next <name> --eslint -lib ts-node swc -M
# typescript, ts-node, swc, mocha
create-ts-next <name> --eslint false -lib all -M
```

### --module|-m

指定 module 模式，默认 `commonjs` 。

### --target|-t

TS 编译目标，默认 `ES2019` [nodejs@16.0.0](https://node.green/#ES2019)


### --eslint|-E

是否开启 eslint ，默认**开启**。

如果开启，则自动添加相关依赖库，并在新建项目中添加基础 `.eslintrc.js` 文件。

### --lib|-l

附加库，可选值 `ts-node|swc|mocha|all` ，可多项。

如果添加相关库，则会在新建的项目中添加相关的文件：

- **ts-node** - 无文件创建，`tsconfig.json` 文件，会增加 `"ts-node": {}` 字段。 
- **swc** - 添加 `.swcrc` 文件。
  - 如果同时包含 `ts-node` 则在 `tsconfig.json` 文件，增加 `"ts-node": { "swc": true }` 字段。
- **mocha** - 添加 `.mocharc.json` 文件

### --mock|-M

启用 mock 模式，该模式不会检查是否存在重名目录，也不会创建任何目录和文件，只是模拟正常执行的流程。

### --import-helpers|-H

是否开启 [引用 helpers 模式](https://www.typescriptlang.org/tsconfig#importHelpers) ，默认开启。

- 当开启了 `--import-helpers` ，将自动添加 `tslib`
- 如果同时添加 `swc` ，也会添加 `@swc/helper`

