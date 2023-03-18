import * as compiler from 'vue/compiler-sfc';
import { BindingMetadata, CompilerOptions, SFCDescriptor } from 'vue/compiler-sfc';
import { transform } from 'sucrase';

/**
 * 转换 ts 代码
 * @param src 源码
 */
async function transformTS(src: string) {
  return transform(src, {
    transforms: ['typescript'],
  }).code;
}

export async function compileFile(code: string, id: string) {
  const { errors, descriptor } = compiler.parse(code);

  if (errors.length) {
    throw errors;
  }

  if (
    descriptor.styles.some(s => s.lang)
    || (descriptor.template && descriptor.template.lang)
  ) {
    throw new Error('lang="x" pre-processors for <template> or <style> are currently not supported.');
  }

  const scriptLang
    = (descriptor.script && descriptor.script.lang)
    || (descriptor.scriptSetup && descriptor.scriptSetup.lang);
  const isTS = scriptLang === 'ts';
  if (scriptLang && !isTS) {
    throw new Error('Only lang="ts" is supported for <script> blocks.');
  }

  // TODO: 支持 ssr
  let clientCode = '';

  // script
  const clientScriptResult = await doCompileScript(descriptor, id, {
    isTS,
  });
  if (!clientScriptResult) {
    return;
  }

  const [clientScript, bindings] = clientScriptResult;
  clientCode += clientScript;

  // template
  if (
    descriptor.template
    && !descriptor.scriptSetup
  ) {
    const clientTemplateResult = await doCompileTemplate(
      descriptor,
      bindings,
      id,
      {
        ssr: false,
        isTS,
      },
    );
    if (!clientTemplateResult) {
      return;
    }

    clientCode += clientTemplateResult;
  }

  const hasScoped = descriptor.styles.some(s => s.scoped);
  if (hasScoped) {
    clientCode += `\n${id}.__scopeId = ${JSON.stringify(`data-v-${id}`)}`;
  }

  // styles
  let css = '';
  for (const style of descriptor.styles) {
    if (style.module) {
      throw new Error('<style module> is not supported in the playground.');
    }

    const styleResult = await compiler.compileStyleAsync({
      source: style.content,
      filename: id,
      id,
      scoped: style.scoped,
      modules: !!style.module,
    });

    if (styleResult.errors.length) {
      // postcss uses pathToFileURL which isn't polyfilled in the browser
      // ignore these errors for now
      if (!styleResult.errors[0].message.includes('pathToFileURL')) {
        throw styleResult.errors;
      }

      // proceed even if css compile errors
    } else {
      css += `${styleResult.code}\n`;
    }
  }

  return {
    js: clientCode.trimStart(),
    css: css ? css.trim() : '/* No <style> tags present */',
  };
}

async function doCompileScript(
  descriptor: SFCDescriptor,
  id: string,
  options: {
        ssr?: boolean
        isTS?: boolean
    } = {},
): Promise<[string, BindingMetadata | undefined] | undefined> {
  const { ssr = false, isTS = true } = options;

  if (descriptor.script || descriptor.scriptSetup) {
    try {
      const expressionPlugins: CompilerOptions['expressionPlugins'] = isTS
        ? ['typescript']
        : undefined;
      const compiledScript = compiler.compileScript(descriptor, {
        inlineTemplate: true,
        id,
        templateOptions: {
          ssr,
          ssrCssVars: descriptor.cssVars,
          compilerOptions: {
            expressionPlugins,
          },
        },
      });
      let code = '';
      if (compiledScript.bindings) {
        code += `\n/* Analyzed bindings: ${JSON.stringify(
          compiledScript.bindings,
          null,
          2,
        )} */`;
      }
      code
          += `\n${
          compiler.rewriteDefault(
            compiledScript.content,
            id,
            expressionPlugins,
          )}`;

      if ((descriptor.script || descriptor.scriptSetup)!.lang === 'ts') {
        code = await transformTS(code);
      }

      return [code, compiledScript.bindings];
    } catch (e: any) {
      throw new Error(e.stack.split('\n').slice(0, 12).join('\n'));
    }
  } else {
    return [`\nconst ${id} = {}`, undefined];
  }
}

async function doCompileTemplate(
  descriptor: SFCDescriptor,
  bindingMetadata: BindingMetadata | undefined,
  id: string,
  options: {
        ssr?: boolean
        isTS?: boolean
    },
) {
  const { ssr = false, isTS = true } = options;
  const templateResult = compiler.compileTemplate({
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.some(s => s.scoped),
    slotted: descriptor.slotted,
    ssr,
    ssrCssVars: descriptor.cssVars,
    isProd: false,
    compilerOptions: {
      bindingMetadata,
      expressionPlugins: isTS ? ['typescript'] : undefined,
      mode: 'module',
    },
  });
  if (templateResult.errors.length) {
    throw new Error(templateResult.errors.join(' '));
  }

  const fnName = ssr ? 'ssrRender' : 'render';

  let code
    = `\n${templateResult.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`,
    )}` + `\n${id}.${fnName} = ${fnName}`;

  if ((descriptor.script || descriptor.scriptSetup)?.lang === 'ts') {
    code = await transformTS(code);
  }

  return code;
}
