import yargs from 'yargs';
import { ProjectCreator } from './ProjectCreator';
import {
  choicesDependencies,
  choicesTypeScriptModules,
  choicesTypeScriptTargets, defaultTypeScriptModule, defaultTypeScriptTarget, filterCliLibs,
  filterTypeScriptModule,
  filterTypeScriptTarget
} from './utils';

async function cli() {
  const argv = yargs(process.argv.slice(2))
    .usage('$0 <name>', 'Specify the project name')
    .options({
      target          : {
        alias      : 't',
        type       : 'string',
        description: 'Set compile target',
        default    : defaultTypeScriptTarget,
        choices    : choicesTypeScriptTargets(),
      },
      module          : {
        alias      : 'm',
        type       : 'string',
        description: 'Set module system',
        default    : defaultTypeScriptModule,
        choices    : choicesTypeScriptModules(),
      },
      'import-helpers': {
        alias      : 'H',
        type       : 'boolean',
        description: 'Use import helpers',
        default    : true,
      },
      'eslint'        : {
        alias      : 'e',
        type       : 'boolean',
        description: 'With libs',
        default    : true,
      },
      'lib'           : {
        alias  : 'l',
        type   : 'array',
        choices: choicesDependencies,
      },
      debug           : {
        alias  : 'd',
        type   : 'boolean',
        default: false,
      },
      mock            : {
        alias  : 'M',
        type   : 'boolean',
        default: false,
      },
      install         : {
        alias  : 'i',
        type   : 'boolean',
        default: true,
      }
    })
    .parseSync();

  const { name, target, module, importHelpers, lib, eslint, debug, mock, install } = argv;

  if (name == null) {
    throw new Error('unspecified project name');
  }
  const _name = name + '';

  await (new ProjectCreator({
    name  : _name,
    target: filterTypeScriptTarget(target),
    module: filterTypeScriptModule(module),
    libs  : filterCliLibs(eslint, lib),
    importHelpers, debug, mock, install
  })).startUp();
}

cli().catch(console.error);
