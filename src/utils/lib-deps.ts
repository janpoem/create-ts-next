
type DependenciesItem = Record<string, string>

export type DependenciesDef = {
  dependencies?: DependenciesItem,
  devDependencies?: DependenciesItem,
}

const Dependencies: Record<string, DependenciesDef> = {
  // 0
  typescript: {
    devDependencies: {
      '@types/node': '^16',
      'typescript' : '^4.6.2',
    }
  },
  // 1
  eslint: {
    devDependencies: {
      'eslint'                          : '^8',
      '@typescript-eslint/parser'       : '^5',
      '@typescript-eslint/eslint-plugin': '^5',
    }
  },
  /////////////////////////////////////////////////////////////////
  'ts-node': {
    devDependencies: {
      'ts-node': '^10.4.0',
    }
  },
  swc      : {
    devDependencies: {
      'chokidar'           : '^3.5.3',
      '@swc/cli'           : '^0.1.55',
      '@swc/core'          : '^1.2.151',
      'regenerator-runtime': '^0.13.9',
    }
  },
  mocha    : {
    devDependencies: {
      'mocha'       : '^9.2.1',
      '@types/mocha': '^9.1.0',
      'chai'        : '^4.3.6',
      '@types/chai' : '^4.3.0',
    }
  }
} as const;

const DependenciesHelpers: Record<string, DependenciesDef> = {
  typescript: {
    dependencies: {
      'tslib': '^2.3.1'
    },
  },
  swc       : {
    dependencies: {
      '@swc/helpers': '^0.3.6',
    },
  }
};

export type DependenciesKey = keyof typeof Dependencies;

const depLibs = Object.keys(Dependencies).slice(2);

export const choicesDependencies = depLibs.concat('all');

export const filterCliLibs = (eslint: boolean, libs?: (string | number | null)[] | null): DependenciesKey[] => {
  const res: string[] = ['typescript'];
  if (eslint) {
    res.push('eslint');
  }
  if (Array.isArray(libs) && libs.length > 0) {
    if (libs.indexOf('all') > -1) {
      return res.concat(depLibs);
    }
    libs.forEach((lib) => {
      if (lib != null) {
        const str = lib + '';
        if (Dependencies[str] && res.indexOf(str) < 0) {
          res.push(str);
        }
      }
    });
  }
  return res;
};

const objectMerge = (o1?: DependenciesItem, o2?: DependenciesItem): DependenciesItem | undefined => {
  if (o1 == null && o2 == null) return undefined;
  if (o1 == null) return Object.assign({}, o2);
  if (o2 == null) return Object.assign({}, o1);
  return Object.assign({}, o1, o2);
};

export const dependenciesMerge = (
  { dependencies: d1, devDependencies: dd1 }: DependenciesDef = {},
  { dependencies: d2, devDependencies: dd2 }: DependenciesDef = {}
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

export const getDependencies = (lib: DependenciesKey, importHelpers: boolean): DependenciesDef | undefined => {
  if (Dependencies[lib]) {
    if (importHelpers && DependenciesHelpers[lib]) {
      return dependenciesMerge(Dependencies[lib], DependenciesHelpers[lib]);
    }
    return Dependencies[lib];
  }
  return undefined;
};

export type GenerateDependenciesOptions = {
  importHelpers: boolean,
  libs: DependenciesKey[],
}

export const generateDependencies = ({
  libs,
  importHelpers
}: GenerateDependenciesOptions): DependenciesDef | undefined => {
  let count = 0;
  let deps: DependenciesDef | undefined = undefined;
  libs.forEach(_lib => {
    const lib = getDependencies(_lib, importHelpers);
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