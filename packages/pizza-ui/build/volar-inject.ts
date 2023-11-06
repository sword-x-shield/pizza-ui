import path from 'node:path';
import process from 'node:process';
import fse from 'fs-extra';

const cwd = process.cwd();
const dic = path.resolve(cwd, './dist/pizza-ui.esm.js');
const targetDic = path.resolve(cwd, '../site/public/pizza-ui/pizza-ui.esm.js');

fse.copySync(dic, targetDic, {
  overwrite: true,
});
