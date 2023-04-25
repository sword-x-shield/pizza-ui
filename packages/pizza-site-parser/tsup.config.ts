import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: ['cjs', 'esm'],
  watch: !!process.env.DEV,
  dts: process.env.DEV
    ? false
    : {
      compilerOptions: {
        composite: false,
        customConditions: [],
      },
    },
});
