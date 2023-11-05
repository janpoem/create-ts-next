type DependenciesItem = Record<string, string>;

export type DependenciesDef = {
  dependencies?: DependenciesItem;
  devDependencies?: DependenciesItem;
};

const Dependencies = {
  typescript: {
    devDependencies: {
      '@types/node': '^18.18.8',
      typescript: '^5.2.2',
      tslib: '^2.6.2',
      eslint: '^8.53.0',
      '@typescript-eslint/eslint-plugin': '^6.9.1',
      '@typescript-eslint/parser': '^6.9.1',
      prettier: '^3.0.3',
      'ts-node': '^10.9.1',
      '@swc/cli': '^0.1.62',
      '@swc/core': '^1.3.96',
      '@swc/helpers': '^0.5.3',
    },
  },
  nodemon: {
    devDependencies: {
      nodemon: '^3.0.1',
      '@types/nodemon': '^1.19.2',
    },
  },
  mocha: {
    devDependencies: {
      mocha: '^10.2.0',
      '@types/mocha': '^10.0.3',
      chai: '^4.3.10',
      '@types/chai': '^4.3.9',
    },
  },
  rollup: {
    devDependencies: {
      rollup: '^3.29.4',
      '@rollup/plugin-commonjs': '^25.0.7',
      '@rollup/plugin-node-resolve': '^15.2.0',
      'rollup-plugin-swc3': '^0.10.3',
      'rollup-plugin-dts': '^6.1.0',
    },
  },
};

export type DependenciesKey = keyof typeof Dependencies;

const depLibs = Object.keys(Dependencies).slice(1);

export const choicesDependencies = depLibs.concat('all');

type AllowLibName = 'all';
export type FilterLibsInput = DependenciesKey | AllowLibName | (DependenciesKey | AllowLibName)[];

export function filterLibs(
  libs?: FilterLibsInput
): DependenciesKey[] {
  const res: DependenciesKey[] = ['typescript'];
  if (typeof libs === 'string') {
    return filterLibs([libs]);
  }
  if (Array.isArray(libs) && libs.length > 0) {
    if (libs.indexOf('all') > -1) {
      return Object.keys(Dependencies) as DependenciesKey[];
    }
    libs.forEach(lib => {
      if (lib != null) {
        const str = (lib + '').trim() as DependenciesKey;
        if (Dependencies[str] && res.indexOf(str) < 0) {
          res.push(str);
        }
      }
    });
  }
  return res;
}

const objectMerge = (
  o1?: DependenciesItem,
  o2?: DependenciesItem,
): DependenciesItem | undefined => {
  if (o1 == null && o2 == null) return undefined;
  if (o1 == null) return Object.assign({}, o2);
  if (o2 == null) return Object.assign({}, o1);
  return Object.assign({}, o1, o2);
};

export const dependenciesMerge = (
  { dependencies: d1, devDependencies: dd1 }: DependenciesDef = {},
  { dependencies: d2, devDependencies: dd2 }: DependenciesDef = {},
): DependenciesDef | undefined => {
  const dependencies = objectMerge(d1, d2);
  const devDependencies = objectMerge(dd1, dd2);
  let count = 0;
  const res: DependenciesDef = {};
  if (dependencies) {
    count += 1;
    res.dependencies = dependencies;
  }
  if (devDependencies) {
    count += 1;
    res.devDependencies = devDependencies;
  }
  if (count <= 0) return undefined;
  return res;
};

export const getDependencies = (
  lib: DependenciesKey,
): DependenciesDef | undefined => {
  if (Dependencies[lib]) {
    return Dependencies[lib];
  }
  return undefined;
};

export type GenerateDependenciesOptions = {
  importHelpers?: boolean;
  libs: (DependenciesKey | AllowLibName)[];
};

export const generateDependencies = ({
  libs,
}: GenerateDependenciesOptions): DependenciesDef | undefined => {
  let count = 0;
  let deps: DependenciesDef | undefined = undefined;
  filterLibs(libs).forEach(_lib => {
    const lib = getDependencies(_lib);
    if (lib != null) {
      count += 1;
      deps = dependenciesMerge(deps, lib);
    }
  });
  if (count <= 0) {
    return undefined;
  }
  return deps;
};
