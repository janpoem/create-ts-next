import 'mocha';
import { expect } from 'chai';
import { generateDependencies } from './lib-deps';

describe('generateDependencies', function () {
  it('typescript + nodemon', () => {
    const deps = generateDependencies({ libs: ['typescript', 'nodemon'], importHelpers: false });
    expect(deps).to.have.nested.property('devDependencies.typescript');
    expect(deps).to.have.nested.property('devDependencies.@types/node');
    expect(deps).to.have.nested.property('devDependencies.ts-node');
    expect(deps).to.have.nested.property('devDependencies.@swc/cli');
    expect(deps).to.have.nested.property('devDependencies.@swc/core');
    expect(deps).to.have.nested.property('devDependencies.@swc/helpers');
    expect(deps).to.have.nested.property('devDependencies.nodemon');
    expect(deps).to.have.nested.property('devDependencies.@types/nodemon');
  });

  it('typescript + mocha', () => {
    const deps = generateDependencies({ libs: ['typescript', 'mocha'], importHelpers: true });
    expect(deps).to.have.nested.property('devDependencies.typescript');
    expect(deps).to.have.nested.property('devDependencies.@types/node');
    expect(deps).to.have.nested.property('devDependencies.ts-node');
    expect(deps).to.have.nested.property('devDependencies.@swc/cli');
    expect(deps).to.have.nested.property('devDependencies.@swc/core');
    expect(deps).to.have.nested.property('devDependencies.@swc/helpers');
    expect(deps).to.have.nested.property('devDependencies.mocha');
    expect(deps).to.have.nested.property('devDependencies.@types/mocha');
    expect(deps).to.have.nested.property('devDependencies.chai');
    expect(deps).to.have.nested.property('devDependencies.@types/chai');
  });

  it('typescript + eslint + swc + ts-node', () => {
    const deps = generateDependencies({ libs: ['all'], importHelpers: true });

    // ts
    expect(deps).to.have.nested.property('devDependencies.typescript');
    expect(deps).to.have.nested.property('devDependencies.@types/node');
    expect(deps).to.have.nested.property('devDependencies.ts-node');
    expect(deps).to.have.nested.property('devDependencies.@swc/cli');
    expect(deps).to.have.nested.property('devDependencies.@swc/core');
    expect(deps).to.have.nested.property('devDependencies.@swc/helpers');

    // mocha
    expect(deps).to.have.nested.property('devDependencies.mocha');
    expect(deps).to.have.nested.property('devDependencies.@types/mocha');
    expect(deps).to.have.nested.property('devDependencies.chai');
    expect(deps).to.have.nested.property('devDependencies.@types/chai');

    // nodemon
    expect(deps).to.have.nested.property('devDependencies.nodemon');
    expect(deps).to.have.nested.property('devDependencies.@types/nodemon');

    // rollup
    expect(deps).to.have.nested.property('devDependencies.rollup');
    expect(deps).to.have.nested.property('devDependencies.rollup-plugin-swc3');
    expect(deps).to.have.nested.property('devDependencies.rollup-plugin-dts');
    expect(deps).to.have.nested.property('devDependencies.@rollup/plugin-commonjs');
    expect(deps).to.have.nested.property('devDependencies.@rollup/plugin-node-resolve');
  });
});
