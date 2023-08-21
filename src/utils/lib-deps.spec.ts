import 'mocha';
import { expect } from 'chai';
import { dependenciesMerge, filterLibs, getDependencies } from './lib-deps';

describe('dependencies', function () {
  describe('filterLibs', () => {
    it('should contain typescript', () => {
      expect(filterLibs()).to.contain('typescript');
      expect(filterLibs('all')).to.contain('typescript');
    });

    it('should contain libs', () => {
      expect(filterLibs('mocha')).to.contain('mocha');
      expect(filterLibs('all')).to.contain('mocha');
      expect(filterLibs(['nodemon', 'mocha'])).to.contain('nodemon');
      expect(filterLibs(['all'])).to.contain('rollup');
      expect(filterLibs(['rollup'])).to.contain('rollup');
    });
  })

  describe('getDependencies', function () {
    it('typescript', () => {
      const deps = getDependencies('typescript');
      expect(deps).to.have.property('devDependencies');
      expect(deps).to.have.nested.property('devDependencies.typescript');
      expect(deps).to.have.nested.property('devDependencies.@types/node');
    });

    it('typescript with helpers', () => {
      const deps = getDependencies('typescript');
      expect(deps).to.have.property('devDependencies');
      expect(deps).to.have.nested.property('devDependencies.typescript');
      expect(deps).to.have.nested.property('devDependencies.@types/node');
      expect(deps).to.have.nested.property('devDependencies.tslib');
    });

    it('eslint', () => {
      const deps = getDependencies('typescript');
      expect(deps).to.have.property('devDependencies');
      expect(deps).to.have.nested.property('devDependencies.eslint');
      expect(deps).to.have.nested.property('devDependencies.@typescript-eslint/eslint-plugin');
      expect(deps).to.have.nested.property('devDependencies.@typescript-eslint/parser');
    });

    it('swc', () => {
      const deps = getDependencies('typescript');
      expect(deps).to.have.property('devDependencies');
      expect(deps).to.have.nested.property('devDependencies.ts-node');
      expect(deps).to.have.nested.property('devDependencies.@swc/cli');
      expect(deps).to.have.nested.property('devDependencies.@swc/core');
      expect(deps).to.have.nested.property('devDependencies.@swc/helpers');
    });

    it('nodemon', () => {
      const deps = getDependencies('nodemon');
      expect(deps).to.have.property('devDependencies');
      expect(deps).to.have.nested.property('devDependencies.nodemon');
      expect(deps).to.have.nested.property('devDependencies.@types/nodemon');
    });

    it('mocha', () => {
      const deps = getDependencies('mocha');
      expect(deps).to.have.property('devDependencies');
      expect(deps).to.have.nested.property('devDependencies.mocha');
      expect(deps).to.have.nested.property('devDependencies.@types/mocha');
      expect(deps).to.have.nested.property('devDependencies.chai');
      expect(deps).to.have.nested.property('devDependencies.@types/chai');
    });

    it('mocha', () => {
      const deps = getDependencies('rollup');
      expect(deps).to.have.property('devDependencies');
      expect(deps).to.have.nested.property('devDependencies.rollup');
      expect(deps).to.have.nested.property('devDependencies.rollup-plugin-swc3');
      expect(deps).to.have.nested.property('devDependencies.rollup-plugin-dts');
      expect(deps).to.have.nested.property('devDependencies.@rollup/plugin-commonjs');
      expect(deps).to.have.nested.property('devDependencies.@rollup/plugin-node-resolve');
    });


    it('undefined', () => {
      // @ts-ignore abc key
      const deps = getDependencies('abc');
      expect(deps).to.eql(undefined);
    });
  });

  describe('dependenciesMerge', () => {
    it('test 1', () => {
      const deps = dependenciesMerge(
        {
          dependencies: {
            a: 'a1',
            b: 'b1',
          }
        },
        {
          dependencies: {
            a: 'a2',
            // no b
            c: 'c2'
          }
        }
      );
      expect(deps).to.have.nested.property('dependencies.a', 'a2');
      expect(deps).to.have.nested.property('dependencies.b', 'b1');
      expect(deps).to.have.nested.property('dependencies.c', 'c2');
    });

    it('test 2', () => {
      const deps = dependenciesMerge(
        {
          dependencies: {
            a: 'a1',
            b: 'b1',
          }
        },
        {
          dependencies   : {
            c: 'c2'
          },
          devDependencies: {
            x: 'x2',
            // no b
            y: 'y2'
          }
        }
      );
      expect(deps).to.have.nested.property('dependencies.a', 'a1');
      expect(deps).to.have.nested.property('dependencies.b', 'b1');
      expect(deps).to.have.nested.property('dependencies.c', 'c2');
      expect(deps).to.have.nested.property('devDependencies.x', 'x2');
      expect(deps).to.have.nested.property('devDependencies.y', 'y2');
    });
  });
});
