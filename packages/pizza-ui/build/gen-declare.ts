import path from 'path';
import process from 'process';
import uppercamelcase from 'uppercamelcase';
import fs from 'fs-extra';
import glob from 'glob';

const root = process.cwd();
const resolvePath = (relativePath: string) => {
  return path.resolve(root, relativePath);
};

const files = glob.sync('**/index.ts', {
  cwd: resolvePath('components'),
}).filter(v => v.split('/').length === 2).map(v => uppercamelcase(v.split('/')[0]));

async function genDeclare() {
  const components: Record<string, string> = {};
  files.forEach((key) => {
    const entry = `typeof import('pizza-ui')['P${key}']`;
    components[key] = entry;
  });

  const lines = Object.entries(components).map(([name, v]) => {
    if (!/^\w+$/.test(name)) name = `'${name}'`;

    return `P${name}: ${v}`;
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
