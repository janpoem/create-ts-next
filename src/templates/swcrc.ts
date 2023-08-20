import { CreateTsNextProjectOptions } from '../TsNextProjectCreator';
import { filterSWCTarget } from '../utils';

export const swcrc = ({ target }: CreateTsNextProjectOptions) => {
  const data = {
    $schema: 'https://json.schemastore.org/swcrc',
    // jsc config: https://swc.rs/docs/configuration/compilation
    jsc: {
      parser: {
        syntax: 'typescript',
        decorators: true,
        dynamicImport: true,
      },
      target: filterSWCTarget(target),
      loose: false,
      externalHelpers: true,
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true,
        optimizer: {
          simplify: true,
        },
      },
    },
    // module config: https://swc.rs/docs/configuration/modules
    // module: {
    //   type: filterSWCModule(module),
    // },
    // sourceMaps: true,
  };
  return JSON.stringify(data, null, 2);
};
