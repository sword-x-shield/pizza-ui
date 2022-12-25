import path from 'path';
import glob from 'glob';
import fs from 'fs-extra';
import sass from 'sass';
import CleanCSS from 'clean-css';

const root = process.cwd();
const resolvePath = (relativePath: string) => {
  return path.resolve(root, relativePath);
};

const files = glob.sync('**/*.scss', {
  cwd: resolvePath('components'),
});

for (const filename of files) {
  const absolute = resolvePath(`components/${filename}`);
  fs.copySync(absolute, resolvePath(`es/${filename}`));
  fs.copySync(absolute, resolvePath(`lib/${filename}`));

  if (/index\.scss$/.test(filename)) {
    try {
      const result = sass.compile(absolute);
      const cssFilename = filename.replace('.scss', '.css');
      fs.writeFileSync(
        resolvePath(`es/${cssFilename}`),
        result.css,
      );
      fs.writeFileSync(
        resolvePath(`lib/${cssFilename}`),
        result.css,
      );
      console.log(`${filename} build success`);
    }
    catch (error) {
      console.log(error);
    }
  }
}

// copt & complier scss entry file
console.log('build target css');
const indexPath = resolvePath('components/index.scss');
fs.copySync(indexPath, resolvePath('es/index.scss'));
fs.copySync(indexPath, resolvePath('lib/index.scss'));

// terser & copy to dist
const result = sass.compile(indexPath);

fs.ensureDirSync(resolvePath('dist'));

fs.writeFileSync(
  resolvePath('dist/index.less'),
  '@import \'../es/index.scss\';\n\n',
);

fs.writeFileSync(
  resolvePath('dist/index.css'),
  result.css,
);

const compress = new CleanCSS().minify(result.css);

fs.writeFileSync(
  resolvePath('dist/index.min.css'),
  compress.styles,
);
