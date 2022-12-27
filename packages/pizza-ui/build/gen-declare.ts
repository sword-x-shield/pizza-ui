import path from 'path';
import process from 'process';
import fs from 'fs-extra';
// import * as globalComponents from '../components/components';
import anchor from '../components/anchor';

const root = process.cwd();

console.log(anchor);

// async function genDeclare() {
//   const components: Record<string, string> = {};
//   Object.keys(globalComponents).forEach((key) => {
//     const entry = `typeof import('pizza-ui')['${key}']`;
//     components[key] = entry;
//   });

//   const lines = Object.entries(components).map(([name, v]) => {
//     if (!/^\w+$/.test(name))
//       name = `'${name}'`;

//     return `${name}: ${v}`;
//   });
//   const code = `
// declare module 'vue' {
//   export interface GlobalComponents {
//     ${lines.join('\n    ')}
//   }
// }
// export {}
// `;
//   await fs.writeFile(path.resolve(root, 'global.d.ts'), code, 'utf-8');
// }

genDeclare();
