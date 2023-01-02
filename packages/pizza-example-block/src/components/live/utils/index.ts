export * from './fileCompiler';

// eslint-disable-next-line import/no-mutable-exports
export let count = 1;

export function raiseCount() {
  count++;
}
