// TODO: 后续还有命令的话，就用 cli 模式组织吧
import path from 'node:path';
import process from 'node:process';

import { fileURLToPath } from 'node:url';
import uppercamelcase from 'uppercamelcase';
import fse from 'fs-extra';
import {
  cancel,
  group,
  intro,
  outro,
  text,
} from '@clack/prompts';
import chalk from 'chalk';
import { template } from 'lodash-es';

export interface ScaffoldOptions {
  componentName: string
}

interface RenderTemplateFileOptions {
  /** 模板文件 */
  templateFile: string
  /** 目标文件，如果无则取模板文件 */
  targetFile?: string
}

function toKebabCase(str: string) {
  let kebabCaseName = str.replace(/[A-Z]/g, (match) => {
    return `-${match.toLowerCase()}`;
  });

  if (kebabCaseName.slice(0, 1) === '-') {
    kebabCaseName = kebabCaseName.slice(1);
  }

  return kebabCaseName;
}

function scaffold({
  componentName,
}: ScaffoldOptions) {
  const upperComponentName = uppercamelcase(componentName);
  const kebabCaseComponentName = toKebabCase(componentName);
  const templateDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../templates/gen-component/[component]',
  );
  const newComponentTargetDir = path.resolve(
    __dirname,
    '../../packages/pizza-ui/components',
    kebabCaseComponentName,
  );

  // TODO: components/components.ts 也需要追加
  const templateOptionsList: RenderTemplateFileOptions[] = [
    {
      templateFile: 'index.ts',
    },
    {
      templateFile: '__tests__/[component].spec.ts',
      targetFile: `__tests__/${kebabCaseComponentName}.spec.ts`,
    },
    {
      templateFile: 'src/[component].vue',
      targetFile: `src/${kebabCaseComponentName}.vue`,
    },
    {
      templateFile: 'style/index.ts',
    },
    {
      templateFile: 'style/index.scss',
    },
  ];

  const data = {
    componentName,
    upperComponentName,
    kebabCaseComponentName,
  };

  const renderFile = (options: RenderTemplateFileOptions) => {
    const { templateFile, targetFile = templateFile } = options;

    const filePath = path.resolve(templateDir, templateFile);
    const targetPath = path.resolve(newComponentTargetDir, targetFile);

    const src = fse.readFileSync(filePath, 'utf-8');
    const compiled = template(src)(data);
    fse.outputFileSync(targetPath, compiled);
  };

  const startGenerateNewComponent = () => {
    fse.ensureDirSync(newComponentTargetDir);

    templateOptionsList.forEach((options) => {
      renderFile(options);
    });
  };

  startGenerateNewComponent();

  return `创建 ${chalk.green(componentName)} 组件成功！！！`;
}

async function init() {
  intro(chalk.cyan('[pizza-cli]🍕 准备创建组件...'));
  const options = await group({
    componentName: () =>
      text({
        message: '请输入组件名',
        validate(componentName) {
          if (!componentName) {
            return '[组件名]必填！！请输入组件名';
          }

          if (/^\d+$/.test(componentName)) {
            return '请使用非纯数字的字符串作为组件名';
          }

          const kebabCaseComponentName = toKebabCase(componentName);
          const newComponentDir = path.resolve(
            __dirname,
            '../../packages/pizza-ui/components',
            kebabCaseComponentName,
          );

          if (fse.existsSync(newComponentDir)) {
            return `已存在 ${kebabCaseComponentName} 组件`;
          }
        },
      }),
  }, {
    onCancel: () => {
      cancel('已取消本次操作');
      process.exit(0);
    },
  });

  outro(scaffold(options));
}

init();
