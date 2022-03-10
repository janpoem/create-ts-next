import { join, basename } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { terminal } from 'terminal-kit';
import {
  DependenciesDef,
  DependenciesKey,
  generateFileByTemplate,
  generateMochaRC,
  generatePackageInfo,
  generateSWCRC,
  generateTSConfig,
  TypeScriptModule,
  TypeScriptTarget
} from './utils';

export type ProjectCreatorParams = {
  name: string,
  target: TypeScriptTarget,
  module: TypeScriptModule,
  importHelpers: boolean,
  libs: DependenciesKey[],
  debug?: boolean,
  mock?: boolean,
}

export type ProjectItem = {
  name: string,
  type?: 'dir' | 'file',
  data?: string,
  children?: (ProjectItem | undefined)[]
}

export type ProjectState = {
  mocha: boolean,
  tsnode: boolean,
  swc: boolean,
  eslint: boolean
}

export type PathContext = {
  dir: string,
  path: string,
}

const json = (data: Record<string, unknown>): string => JSON.stringify(data, null, 2);

export class ProjectCreator {

  deps: DependenciesDef | undefined;

  packageInfo: Record<string, unknown> = {};

  state: ProjectState = {
    mocha : false,
    tsnode: false,
    swc   : false,
    eslint: false
  };

  basePath: string;

  constructor(public opts: ProjectCreatorParams) {
    this.basePath = process.cwd();
    this.state.mocha = opts.libs.indexOf('mocha') > -1;
    this.state.tsnode = opts.libs.indexOf('ts-node') > -1;
    this.state.swc = opts.libs.indexOf('swc') > -1;
    this.state.eslint = opts.libs.indexOf('eslint') > -1;
    Object.freeze(opts);
  }

  startUp() {
    const { name, target, module, importHelpers, libs } = this.opts;
    terminal(`Create project `).cyan(name);
    terminal(', module: ').green(module);
    terminal(', target: ').green(target);
    if (importHelpers) {
      terminal(', import-helpers: ').green(importHelpers + '');
    }
    process.stdout.write('\n');

    terminal('With libs: \n');
    libs.forEach((lib) => {
      terminal(' - ').cyan(lib);
      process.stdout.write('\n');
    });

    process.stdout.write('\n');
    this.create(this.getStructure());
    process.stdout.write('\n');

    terminal('Project ').cyan(name);
    terminal(' created. You can try the follow commands:\n')

    terminal.bgBrightGreen(`cd ${name}`);
    process.stdout.write('\n');
    terminal.bgBrightGreen(`npm install`);
    process.stdout.write('\n');
    process.stdout.write('\n');
    terminal('Have fun!\n')
  }

  getStructure(): ProjectItem {
    return {
      name    : '',
      type    : 'dir',
      children: [
        {
          name    : 'src',
          type    : 'dir',
          children: [
            { name: 'index.ts' },
          ]
        },
        { name: '.gitignore' },
        { name: 'package.json', data: json(generatePackageInfo(this.opts)) },
        { name: 'tsconfig.json', data: json(generateTSConfig(this.opts, this.state)) },
        this.state.eslint ? { name: '.eslintrc.js' } : undefined,
        this.state.swc ? { name: '.swcrc', data: json(generateSWCRC(this.opts)) } : undefined,
        this.state.mocha ? { name: '.mocharc.json', data: json(generateMochaRC()) } : undefined,
      ]
    };
  }

  create(item: ProjectItem, ctx?: PathContext): this {
    ctx = ctx || { dir: '', path: join(this.basePath, this.opts.name) };
    if (item.type === 'dir') {
      this.createDir(item, ctx);
    } else {
      this.createFile(item, ctx);
    }
    return this;
  }

  createDir({ type, name, children }: ProjectItem, { dir, path }: PathContext): this {
    if (type !== 'dir') return this;
    const relative = dir ? join(dir, name) : name;
    const fullPath = join(path, relative);
    if (!this.opts.mock) {
      if (existsSync(fullPath)) {
        throw new Error(`directory ${basename(fullPath)} is exists`);
      }
    }
    !this.opts.mock && mkdirSync(fullPath, { recursive: true });
    terminal('create dir: ').green(name || this.opts.name);
    process.stdout.write('\n');
    if (Array.isArray(children) && children.length > 0) {
      children.forEach((item) => {
        if (item != null) {
          this.create(item, { dir: relative, path });
        }
      });
    }
    return this;
  }

  createFile({ type = 'file', name, data }: ProjectItem, { dir, path }: PathContext): this {
    if (type !== 'file') return this;
    const relative = dir ? join(dir, name) : name;
    if (!this.opts.mock) {
      const content = typeof data === 'string' ? data : generateFileByTemplate(relative, this.opts);
      writeFileSync(join(path, relative), content);
    }
    terminal('write file: ').yellow(relative);
    process.stdout.write('\n');
    return this;
  }
}
