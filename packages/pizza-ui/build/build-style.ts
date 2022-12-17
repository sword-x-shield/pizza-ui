import path from 'path';
import glob from 'glob';

const root = process.cwd();

const files = glob.sync('**/*.{scss,js}', {
  cwd: path.resolve(root, 'src/components'),
});

console.log(files);
