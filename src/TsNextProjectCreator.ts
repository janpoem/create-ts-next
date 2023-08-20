import { terminal } from 'terminal-kit';
import {
  ProjectCreator,
  ProjectCreatorBasicOptions,
  ProjectStructure,
} from './ProjectCreator';
import {
  eslintrc,
  srcIndex,
  mocharc,
  packageJson,
  prettierrc,
  rollupConfig,
  swcrc,
  tsconfig,
  gitignore,
  srcHelloSpec,
  srcHello,
} from './templates';
import { nodemon } from './templates/nodemon';
import {
  DependenciesKey,
  installDeps,
  TypeScriptModule,
  TypeScriptTarget,
} from './utils';

export interface CreateTsNextProjectOptions extends ProjectCreatorBasicOptions {
  target: TypeScriptTarget;
  module: TypeScriptModule;
  libs: DependenciesKey[];
  isPackageModule: boolean;
}

export type CreateTsNextProjectState = Record<
  DependenciesKey,
  boolean | undefined
>;

export class TsNextProjectCreator extends ProjectCreator<
  CreateTsNextProjectOptions,
  CreateTsNextProjectState
> {
  constructor(opts: CreateTsNextProjectOptions) {
    super(
      opts,
      opts.libs.reduce((map, lib) => {
        map[lib] = true;
        return map;
      }, {} as CreateTsNextProjectState),
    );
  }

  async startUp(): Promise<this> {
    await this.detectPackageCmd();
    const { name, target, module, libs } = this.options;
    terminal(`Create project `).cyan(name);
    terminal(', module: ').green(module);
    terminal(', target: ').green(target);
    process.stdout.write('\n');

    terminal('With libs: \n');
    libs.forEach(lib => {
      terminal(' - ').cyan(lib);
      process.stdout.write('\n');
    });

    if (this.packageCmd != null) {
      terminal('Packages manager used: ').cyan(this.packageCmd);
      process.stdout.write('\n');
    }

    process.stdout.write('\n');
    this.create(this.getStructure());
    process.stdout.write('\n');

    terminal('Project ').cyan(name);
    terminal(' created. ');

    let installed = false;

    if (this.packageCmd != null) {
      terminal('Install dependencies by ').cyan(this.packageCmd);
      terminal('... \n');
      try {
        await installDeps(this.projectRoot, this.packageCmd);
        installed = true;
      } catch (e) {
        //
      }
    }

    process.stdout.write('\n');
    terminal('You can try the follow commands:\n');
    terminal.blue(`cd ${name}`);
    process.stdout.write('\n');

    if (this.packageCmd == null || !installed) {
      terminal.blue(`npm install`);
      terminal.gray(` or `);
      terminal.blue(`yarn install`);
      terminal.gray(` or `);
      terminal.blue(`pnpm install`);
      process.stdout.write('\n');
    }

    terminal.blue(`ts-node src/index.ts`);
    process.stdout.write('\n');
    process.stdout.write('\n');

    terminal('Have fun!\n');
    return this;
  }

  getStructure(): ProjectStructure {
    return {
      name: '',
      type: 'dir',
      children: [
        {
          name: 'src',
          type: 'dir',
          children: [
            { name: 'index.ts', data: srcIndex(this.options) },
            { name: 'hello.ts', data: srcHello() },
            this.options.libs.includes('mocha')
              ? { name: 'index.spec.ts', data: srcHelloSpec() }
              : undefined,
          ],
        },
        { name: '.gitignore', data: gitignore() },
        {
          name: 'package.json',
          data: packageJson(this.options),
        },
        {
          name: 'tsconfig.json',
          data: tsconfig(this.options),
        },
        {
          name: '.eslintrc.' + (this.options.isPackageModule ? 'cjs' : 'js'),
          data: eslintrc(),
        },
        { name: '.prettierrc', data: prettierrc() },
        { name: '.swcrc', data: swcrc(this.options) },
        this.options.libs.includes('nodemon')
          ? { name: 'nodemon.json', data: nodemon() }
          : undefined,
        this.options.libs.includes('mocha')
          ? { name: '.mocharc.json', data: mocharc(this.options) }
          : undefined,
        this.options.libs.includes('rollup')
          ? { name: 'rollup.config.js', data: rollupConfig() }
          : undefined,
      ],
    };
  }
}
