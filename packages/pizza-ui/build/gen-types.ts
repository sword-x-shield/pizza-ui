import { createProgram } from 'vue-tsc';
import * as ts from 'typescript';

const host = ts.createCompilerHost({
  rootDir: '.',
  outDir: './es',
  module: 7,
  target: 9,
  baseUrl: '.',
  paths: {
    '@pizza-ui/*': ['./*'],
  },
  noEmit: true,
  declaration: true,
});

createProgram({
  rootNames: ['../components/index.ts'],
  options: {
    rootDir: '.',
    outDir: './es',
    module: 7,
    target: 9,
    baseUrl: '.',
    paths: {
      '@pizza-ui/*': ['./*'],
    },
    noEmit: true,
    declaration: true,
  },
  host,
});
