import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import * as ejs from 'ejs';
import { ProjectCreatorParams, ProjectState } from '../ProjectCreator';
import { generateDependencies } from './lib-deps';
import { filterSWCModule, filterSWCTarget } from './ts-vars';

export const generatePackageInfo = (opts: ProjectCreatorParams): Record<string, unknown> => {
  return {
    'name'       : opts.name,
    'version'    : '1.0.0',
    'description': '',
    'scripts'    : {},
    'engines'    : {
      'node': '>= 16.0.0'
    },
    'author'     : '',
    'license'    : 'UNLICENSED',
    ...generateDependencies(opts),
  };
};

export const generateTSConfig = ({
  module,
  target,
  importHelpers,
}: ProjectCreatorParams, { mocha, tsnode, swc }: ProjectState): Record<string, unknown> => {
  const types = ['node'];
  if (mocha) {
    types.push('mocha', 'chai');
  }
  const config: Record<string, unknown> = {
    'compilerOptions': {
      'target'                : target,
      'module'                : module,
      'strict'                : true,
      'declaration'           : true,
      'esModuleInterop'       : true,
      'experimentalDecorators': true,
      'emitDecoratorMetadata' : true,
      'importHelpers'         : importHelpers,
      'pretty'                : true,
      'rootDir'               : 'src',
      'outDir'                : 'dist',
      'baseUrl'               : './',
      'types'                 : types
    },
    'include'        : ['src/**/*'],
    'exclude'        : ['node_modules', 'src/**/*.spec.ts']
  };
  if (tsnode) {
    if (swc) {
      config['ts-node'] = { swc: true };
    } else {
      // placeholder
      config['ts-node'] = {};
    }
  }
  return config;
};

export const generateSWCRC = ({ target, module, importHelpers }: ProjectCreatorParams) => {
  return {
    'jsc'   : {
      'parser'         : {
        'syntax'       : 'typescript',
        'decorators'   : true,
        'dynamicImport': false
      },
      'baseUrl'        : './',
      'target'         : filterSWCTarget(target),
      'transform'      : null,
      'loose'          : true,
      'externalHelpers': importHelpers,
      'keepClassNames' : true
    },
    'module': {
      'type'      : filterSWCModule(module),
      'strict'    : false,
      'strictMode': true,
      'lazy'      : false,
      'noInterop' : false
    }
  };
};

export const generateMochaRC = (): Record<string, unknown> => {
  return {
    'require'   : 'ts-node/register',
    'extensions': [
      'ts'
    ],
    'spec'      : [
      'src/**/*.spec.ts'
    ]
  };
};

export const generateFileByTemplate = (relativePath: string, opts: ProjectCreatorParams): string => {
  const tplPath = join(__dirname, `../../template/${relativePath}.ejs`);
  try {
    if (existsSync(tplPath)) {
      const tpl = readFileSync(tplPath);
      return ejs.render(tpl.toString('utf8'), opts);
    }
  } catch (err) {
    console.log(`generateFileByTemplate ${relativePath} error: `, err);
  }
  return '';
};
