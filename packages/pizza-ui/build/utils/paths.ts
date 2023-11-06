import { basename, dirname, resolve } from 'node:path';

export const projRoot = resolve(__dirname, '..', '..', '..');
export const pizzaUIRoot = resolve(projRoot, 'pizza-ui');

export const pizzaUIPackage = resolve(pizzaUIRoot, 'package.json');

export const buildOutput = resolve(pizzaUIRoot, 'dist');
export const jsonOutput = resolve(pizzaUIRoot, 'json');

export function getParentDirName(path: string, { deep = 1 }) {
  let _deep = deep;
  let dirName = path;

  while (_deep-- > 0) {
    dirName = dirname(dirName);
  }

  return basename(dirName);
}
