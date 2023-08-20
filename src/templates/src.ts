import { CreateTsNextProjectOptions } from '../TsNextProjectCreator';

export const srcIndex = ({
  name,
  isPackageModule,
}: CreateTsNextProjectOptions): string => {
  if (isPackageModule) {
    return `import { fileURLToPath } from 'url';
import { hello } from './hello';

function main() {
  console.log(hello('${name}'));
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}

export default main;
`;
  } else {
    return `import { hello } from './hello';

function main() {
  console.log(hello('${name}'));
}

if (__filename === process.argv[1]) {
  main();
}

export default main;
`;
  }
};

export const srcHello = () => {
  return `export function hello(name?: string): string {
  return ['Hello', name].filter(Boolean).join(', ') + '!';
}`;
};

export const srcHelloSpec = () => `import 'mocha';
import { expect } from 'chai';
import { hello } from './hello';

describe('test hello', () => {
  it('should be typescript', () => {
    expect(hello('typescript')).to.eq('Hello, typescript!');
  });
});
`;
