import path from 'path';
import process from 'process';
import uppercamelcase from 'uppercamelcase';
import fs from 'fs-extra';
import fg from 'fast-glob';

const componentPrefix = 'P';
const root = process.cwd();
const resolvePath = (relativePath: string) => {
  return path.resolve(root, relativePath);
};

const files = fg.sync('**/src/**.vue', {
  cwd: resolvePath('components'),
}).map(v => uppercamelcase((v.split('/').pop() as string).replace('.vue', '')));

async function genDeclare() {
  const components: Record<string, string> = {};
  files.forEach((key) => {
    const entry = `typeof import('pizza-ui')['${componentPrefix}${key}']`;
    components[key] = entry;
  });

  const lines = Object.entries(components).map(([name, v]) => {
    if (!/^\w+$/.test(name)) {
      name = `'${name}'`;
    }

    return `${componentPrefix}${name}: ${v}`;
  });
  const code = `declare module 'vue' {
  export interface GlobalComponents {
    ${lines.join('\n    ')}
  }
}

export {}
`;
  await fs.writeFile(path.resolve(root, 'global.d.ts'), code, 'utf-8');
}

genDeclare();
