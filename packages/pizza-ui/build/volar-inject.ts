import path from 'path';
import fse from 'fs-extra';

const cwd = process.cwd();
const dic = path.resolve(cwd, './dist/pizza-ui.esm.js');
const targetDic = path.resolve(cwd, '../site/public/pizza/pizza-ui.esm.js');
// 同步拷贝
fse.copySync(dic, targetDic, {
  overwrite: true,
});