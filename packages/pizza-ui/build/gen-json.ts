import { basename, dirname, join, resolve } from 'node:path';
import { getPackageInfo } from 'local-pkg';
import fg from 'fast-glob';
import { createWriteStream, emptyDir, readFile } from 'fs-extra';
import { API_REG, parseComponentDocsFromTag } from '@pizza/site-parser';
import { ComponentDoc, parse as parseComponent } from 'vue-docgen-api';
import { getParentDirName, jsonOutput, pizzaUIPackage, templateRE } from './utils';
import { Snippet } from './types/snippets';

interface WebTypesConfig {
  /**
  * 包版本，将写入 web-types
  */
  packageVersion: string
  /**
   * 包名，将写入 web-types
   */
  packageName: string
}

async function getComponentsDocsFromMdEntry() {
  const mds = await fg('components/**/index.entry.md');

  const components: ComponentDoc[] = [];

  for (const md of mds) {
    const dir = join(dirname(md), '../src');
    const source = await readFile(md, 'utf8');
    const matches = Array.from(source.matchAll(API_REG));

    for (const matchItem of matches) {
      components.push(...await parseComponentDocsFromTag({
        apiTagSource: matchItem[0],
        parser: parseComponent,
        dir,
      }));
    }
  }

  return components;
}

async function writeWebTypesFile(components: ComponentDoc[], {
  packageVersion,
  packageName,
}: WebTypesConfig, destFilePath: string) {
  const contents = {
    $schema:
      'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    framework: 'vue',
    name: packageName,
    version: packageVersion,
    contributions: {
      html: {
        'types-syntax': 'typescript',
        'description-markup': 'markdown',
        'tags': [] as any[] | undefined,
      },
    },
  };

  for (const component of components) {
    const data = {
      name: `p-${component.displayName}`,
      attributes: component.props?.map(item => ({
        name: item.name,
        required: item.required,
        description: item.description,
        value: {
          type: item.type,
          kind: 'expression',
        },
        default: item.defaultValue?.value,
      })),
      events: component.events?.map(item => ({
        name: item.name,
        description: item.description,
      })),
      slots: component.slots?.map(item => ({
        name: item.name,
        description: item.description,
      })),
    };

    contents.contributions.html.tags!.push(data);
  }

  const html = contents.contributions.html!;
  if (html.tags?.length === 0) {
    html.tags = undefined;
  }

  const writeStream = createWriteStream(destFilePath);
  writeStream.write(JSON.stringify(contents, null, 2));

  writeStream.close();
}

async function getComponentsSnippets() {
  const files = await fg('components/**/snippets/*.vue');

  const components: {
    [name: string]: Snippet
  } = {};

  for (const file of files) {
    // 文件名为 index, 优先获取父级目录名，其余直接使用文件名
    const componentName = basename(file, '.vue') === 'index'
      ? getParentDirName(file, {
        deep: 2,
      })
      : basename(file, '.vue');
    const source = await readFile(file, 'utf8');
    const matches = source.match(templateRE);

    if (Array.isArray(matches) && matches[1]) {
      components[componentName] = {
        prefix: `p-${componentName}`,
        body: matches[1].split('\n').map(s => s.slice(2)).filter(Boolean),
        scope: ['vue', 'typescript', 'javascript', 'javascriptreact', 'typescriptreact'],
      };
    }
  }

  return components;
}

async function writeSnippetsFile(componentsMap: {
  [name: string]: Snippet
}, { destFilePath }: { destFilePath: string }) {
  const writeStream = createWriteStream(destFilePath);

  writeStream.write(JSON.stringify(componentsMap, null, 2));

  writeStream.close();
}

async function genJSON() {
  const packageInfo = (await getPackageInfo(pizzaUIPackage))!;

  const components = await getComponentsDocsFromMdEntry();

  await emptyDir(jsonOutput);

  await writeWebTypesFile(components, {
    packageVersion: packageInfo.version,
    packageName: packageInfo.packageJson.name,
  }, resolve(jsonOutput, 'web-types.json'));

  const componentsSnippetsMap = await getComponentsSnippets();

  writeSnippetsFile(componentsSnippetsMap, {
    destFilePath: resolve(jsonOutput, 'pizza-ui-snippets.json'),
  });
}

genJSON();
