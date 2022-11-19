import path from 'path';
import fse from 'fs-extra';
// @ts-expect-error is ok
import uppercamelcase from 'uppercamelcase';
import { error, pending, success } from '../build/utils/log';

function toKebabCase(str: string) {
  let kebabCaseName = str.replace(/[A-Z]/g, (match) => {
    return `-${match.toLowerCase()}`;
  });

  if (kebabCaseName.slice(0, 1) === '-')
    kebabCaseName = kebabCaseName.slice(1);

  return kebabCaseName;
}

const componentName = process.argv[2] || '';
const upperComponentName = uppercamelcase(componentName);
const kebabCaseComponentName = toKebabCase(componentName);

function init() {
  if (!componentName) {
    error('[组件名]必填！！请输入组件名');
    return;
  }
  if (/^\d+$/.test(componentName)) {
    error('请使用非纯数字的字符串作为组件名。');
    return;
  }

  const newComponentPath = path.resolve(
    __dirname,
    '../packages/pizza-ui/components',
    kebabCaseComponentName,
  );
  if (fse.existsSync(newComponentPath)) {
    error(`已存在${kebabCaseComponentName}组件`);
    return;
  }

  const genVueTemplate = (newComponentPath: string) => {
    fse.outputFileSync(
      path.join(newComponentPath, `src/${kebabCaseComponentName}.vue`),
      `<template>
  <div>P${upperComponentName}</div>
</template>

<script lang='ts' setup>
defineOptions({
  name: 'P${upperComponentName}',
})

</script>
        `,
    );
  };

  const genTestTemplate = (newComponentPath: string) => {
    fse.outputFileSync(
      path.join(newComponentPath, `__tests__/${kebabCaseComponentName}.spec.ts`),
      `import { mount } from '@vue/test-utils'
import ${upperComponentName} from '../src/${kebabCaseComponentName}.vue'

describe('${kebabCaseComponentName}.vue', () => {
  test('should render ${kebabCaseComponentName}', () => {
    // Arrange
    const wrapper = mount(${upperComponentName})
    
    // Act
    

    // Assert
    
  })
})`,
    );
  };

  const genExportTemplate = (newComponentPath: string) => {
    fse.outputFileSync(
      path.join(newComponentPath, 'index.ts'),
      `import { withInstall } from '@pizza-ui/utils'\n
import ${upperComponentName} from './src/${kebabCaseComponentName}.vue'\n
export const P${upperComponentName} = withInstall(${upperComponentName})\n
export default P${upperComponentName}\n`,
    );
  };

  const genTemplateList = [
    genVueTemplate,
    genTestTemplate,
    genExportTemplate,
  ];

  const generateNewComponent = (componentName: string) => {
    pending(`Start creating ${componentName} component templates...`);
    fse.ensureDirSync(newComponentPath);

    genTemplateList.forEach((template) => {
      template(newComponentPath);
    });

    success(`create ${componentName} template success!!!`);
  };

  // 生成新组件模板
  generateNewComponent(componentName);
}

init();

