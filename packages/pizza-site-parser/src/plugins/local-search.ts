import path from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs-extra';
import MiniSearch from 'minisearch';
import fg from 'fast-glob';

const LOCAL_SEARCH_INDEX_ID = '@localSearchIndex';
const LOCAL_SEARCH_INDEX_REQUEST_PATH = `/${LOCAL_SEARCH_INDEX_ID}`;

interface IndexObject {
  id: string
  text: string
  title: string
  titles: string[]
}

export interface ILocalSearchOption {
  enable?: true // Whether to turn on
  srcDir: string // Root path of the MD file
  srcExclude?: Array<string> // Select the MD files to filter
  base?: string // The base URL the site will be deployed at
}

function slash(p: string): string {
  return p.replace(/\\/g, '/');
}

async function resolvePages(srcDir: ILocalSearchOption['srcDir'], srcExclude: ILocalSearchOption['srcExclude']) {
  const allMarkdownFiles = (
    await fg(['**.md'], {
      cwd: srcDir,
      ignore: ['**/node_modules', ...(srcExclude || [])],
    })
  ).sort();

  return allMarkdownFiles;
}

export async function localSearchPlugin(siteConfig: ILocalSearchOption): Promise<Plugin> {
  let server: ViteDevServer | undefined;

  function getDocId(file: string) {
    const relFile = slash(path.relative(siteConfig.srcDir, file));
    let id = slash(path.join(siteConfig.base || '/', relFile));
    id = id.replace(/\/index\.md$/, '/');
    return id;
  }

  function getLocaleForPath(file: string) {
    const relativePath = slash(path.relative(siteConfig.srcDir, file));
    const siteData = resolveSiteDataByRoute(siteConfig.site, relativePath);
    return siteData?.localeIndex ?? 'root';
  }

  async function indexAllFiles(files: string[]) {
    const documentsByLocale = new Map<string, IndexObject[]>();
    await Promise.all(files
      .filter(file => fs.existsSync(file))
      .map(async (file) => {
        const fileId = getDocId(file);
        const sections = splitPageIntoSections(md.render(await fs.readFile(file, 'utf-8')));
        const locale = getLocaleForPath(file);
        let documents = documentsByLocale.get(locale);
        if (!documents) {
          documents = [];
          documentsByLocale.set(locale, documents);
        }
        documents.push(...sections.map(section => ({
          id: `${fileId}#${section.anchor}`,
          text: section.text,
          title: section.titles.at(-1)!,
          titles: section.titles.slice(0, -1),
        })));
      }));
    for (const [locale, documents] of documentsByLocale) {
      const index = getIndexByLocale(locale);
      index.removeAll();
      await index.addAllAsync(documents);
    }
  }

  async function scanForBuild() {
    const { srcDir, srcExclude } = siteConfig;
    const pages = await resolvePages(srcDir, srcExclude);
    await indexAllFiles(pages);
  }

  const indexByLocales = new Map<string, MiniSearch<IndexObject>>();

  return {
    name: 'pizza:local-search',

    async configureServer(_server) {
      server = _server;
      await scanForBuild();
      onIndexUpdated();
    },

    resolveId(id) {
      if (id.startsWith(LOCAL_SEARCH_INDEX_ID)) {
        return `/${id}`;
      }
    },

    async load(id) {
      if (id === LOCAL_SEARCH_INDEX_REQUEST_PATH) {
        if (process.env.NODE_ENV === 'production') {
          await scanForBuild();
        }
        const records: string[] = [];
        for (const [locale] of indexByLocales) {
          records.push(`${JSON.stringify(locale)}: () => import('@localSearchIndex${locale}')`);
        }
        return `export default {${records.join(',')}}`;
      } else if (id.startsWith(LOCAL_SEARCH_INDEX_REQUEST_PATH)) {
        return `export default ${JSON.stringify(JSON.stringify(indexByLocales.get(id.replace(LOCAL_SEARCH_INDEX_REQUEST_PATH, '')) ?? {}))}`;
      }
    },

    async handleHotUpdate(ctx) {
      if (ctx.file.endsWith('.md')) {
        const fileId = getDocId(ctx.file);
        if (!fs.existsSync(ctx.file)) {
          return;
        }
        const index = getIndexForPath(ctx.file);
        const sections = splitPageIntoSections(md.render(await fs.readFile(ctx.file, 'utf-8')));
        for (const section of sections) {
          const id = `${fileId}#${section.anchor}`;
          if (index.has(id)) {
            index.discard(id);
          }
          index.add({
            id,
            text: section.text,
            title: section.titles.at(-1)!,
            titles: section.titles.slice(0, -1),
          });
        }

        onIndexUpdated();
      }
    },
  };
}
