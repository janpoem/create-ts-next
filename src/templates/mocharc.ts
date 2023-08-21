import { CreateTsNextProjectOptions } from '../TsNextProjectCreator';

export const mocharc = ({ isPackageModule }: CreateTsNextProjectOptions) => {
  const data = {
    require: 'ts-node/register',
    extensions: ['ts'],
    spec: ['src/**/*.spec.ts'],
    'node-option': isPackageModule
      ? ['loader=ts-node/esm', 'no-warnings=ExperimentalWarning']
      : undefined,
  };
  return JSON.stringify(data, null, 2);
};
