import { basename } from 'path';
import { CreateTsNextProjectOptions } from '../TsNextProjectCreator';
import { generateDependencies } from '../utils';

const convertPackageName = (name: string): string => {
  return basename(name);
};

export const packageJson = ({
  name,
  isPackageModule,
  libs,
}: CreateTsNextProjectOptions) => {
  const scripts: Record<string, string> = {
    dev: 'ts-node src/index.ts',
    lint: 'eslint src --ext .ts,.tsx,.js,.jsx',
  };

  if (libs.includes('mocha')) {
    scripts.test = 'mocha';
  }
  if (libs.includes('nodemon')) {
    scripts.nodemon = 'nodemon';
  }
  scripts.lint = 'eslint src --ext .ts,.tsx,.js,.jsx';

  if (libs.includes('rollup')) {
    scripts.rollup = 'rollup -c --bundleConfigAsCjs';
  }
  // build 指令留空
  scripts.build = '';

  const data = {
    name: convertPackageName(name),
    version: '1.0.0',
    description: '',
    keywords: [],
    author: '',
    private: true,
    license: 'UNLICENSED',
    files: ['dist'],
    type: isPackageModule ? 'module' : undefined,
    main: 'dist/index.js',
    module: 'dist/index.mjs',
    types: 'dist/index.d.ts',
    scripts,
    repository: '',
    ...generateDependencies({ libs }),
  };
  return JSON.stringify(data, null, 2);
};
