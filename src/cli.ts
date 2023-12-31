import yargs from 'yargs';
import { TsNextProjectCreator } from './TsNextProjectCreator';
import {
  choicesDependencies,
  choicesPackageManages,
  choicesTypeScriptModules,
  choicesTypeScriptTargets,
  defaultTypeScriptModule,
  defaultTypeScriptTarget,
  filterLibs,
  FilterLibsInput,
  filterPackageManager,
  filterTypeScriptModule,
  filterTypeScriptTarget, isEsModule,
} from './utils';

export async function createTsNext() {
  const argv = yargs(process.argv.slice(2))
    .usage('$0 <name>', 'Specify the project name')
    .options({
      target: {
        alias: 't',
        type: 'string',
        description: 'Set compile target',
        default: defaultTypeScriptTarget,
        choices: choicesTypeScriptTargets(),
      },
      module: {
        alias: 'm',
        type: 'string',
        description: 'Set module system',
        default: defaultTypeScriptModule,
        choices: choicesTypeScriptModules(),
      },
      lib: {
        alias: 'l',
        type: 'array',
        choices: choicesDependencies,
      },
      debug: {
        alias: 'd',
        type: 'boolean',
        default: false,
      },
      mock: {
        alias: 'M',
        type: 'boolean',
        default: false,
      },
      install: {
        alias: 'i',
        type: 'boolean',
        default: true,
      },
      'package-manager': {
        alias: 'p',
        type: 'string',
        default: 'npm',
        choices: choicesPackageManages(),
      },
    })
    .parseSync();

  const {
    name,
    target,
    module,
    lib,
    debug,
    mock,
    install,
    packageManager
  } = argv;

  if (name == null) {
    throw new Error('unspecified project name');
  }
  const _name = name + '';

  await new TsNextProjectCreator({
    name: _name,
    target: filterTypeScriptTarget(target),
    module: filterTypeScriptModule(module),
    libs: filterLibs(lib as FilterLibsInput),
    debug,
    mock,
    install,
    isPackageModule: isEsModule(module),
    packageManager: filterPackageManager(packageManager),
  }).startUp();
}
