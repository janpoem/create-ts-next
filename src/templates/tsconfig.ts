import { CreateTsNextProjectOptions } from '../TsNextProjectCreator';


type TsNode = {
  swc: boolean;
  esm?: boolean;
  experimentalSpecifierResolution?: string;
};

export const tsconfig = ({
  target,
  module,
  libs,
  isPackageModule,
}: CreateTsNextProjectOptions) => {
  const tsNode: TsNode = { swc: true };
  if (isPackageModule) {
    tsNode.esm = true;
    tsNode.experimentalSpecifierResolution = 'node';
  }

  const types = ['node'];
  if (libs.includes('mocha')) {
    types.push('mocha', 'chai');
  }

  const data = {
    compilerOptions: {
      target,
      module,
      moduleResolution: 'node',
      strict: true,
      declaration: true,
      esModuleInterop: true,
      resolveJsonModule: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      importHelpers: false,
      skipLibCheck: true,
      pretty: true,
      outDir: 'dist',
      types: types,
    },
    include: ['src/**/*'],
    exclude: ['./node_modules', 'src/**/*.spec.ts'],
    'ts-node': tsNode,
  };

  return JSON.stringify(data, null, 2);
};
