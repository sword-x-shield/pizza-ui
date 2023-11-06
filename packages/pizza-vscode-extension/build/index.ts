import path from 'node:path';
import process from 'node:process';
import { build } from 'vite';

async function buildComponentsMap() {
  // env setting
  const [env = 'dev'] = process.argv.slice(2);
  const cwd = process.cwd();
  const extensionEntry = path.resolve(cwd, 'src/extension.ts');

  await build({
    build: {
      sourcemap: env === 'dev' ? 'inline' : false,
      watch: env === 'dev' ? {} : null,
      lib: {
        entry: extensionEntry,
        name: 'extension',
        fileName: 'extension',
        formats: ['cjs'],
      },
      rollupOptions: {
        external: ['vscode'],
        output: {
          globals: {
            vscode: 'vscode',
          },
        },
      },
    },
  });
}

buildComponentsMap();
