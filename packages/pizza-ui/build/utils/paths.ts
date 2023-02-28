import { resolve } from 'path';

export const projRoot = resolve(__dirname, '..', '..', '..');
export const pizzaUIRoot = resolve(projRoot, 'pizza-ui');

export const pizzaUIPackage = resolve(pizzaUIRoot, 'package.json');

export const buildOutput = resolve(pizzaUIRoot, 'dist');
export const jsonOutput = resolve(pizzaUIRoot, 'json');
