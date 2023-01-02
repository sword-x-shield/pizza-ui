import * as compiler from 'vue/compiler-sfc';
import { BindingMetadata, CompilerOptions, SFCDescriptor } from 'vue/compiler-sfc';
import { transform } from 'sucrase';

export const COMP_IDENTIFIER = '__sfc__';

/**
 * 转换 ts 代码
 * @param src 源码
 */
async function transformTS(src: string) {
  return transform(src, {
    transforms: ['typescript'],
  }).code;
}

export async function compileFile(code: string, count) {
  const { errors, descriptor } = compiler.parse(code);

  if (errors.length) {
    // TODO: 收集错误
    console.log(errors);
    return;
  }

  if (
    descriptor.styles.some(s => s.lang)
    || (descriptor.template && descriptor.template.lang)
  ) {
    // TODO: 收集错误
    console.log('lang="x" pre-processors for <template> or <style> are currently not '
        + 'supported.');
    return;
  }

  const scriptLang
    = (descriptor.script && descriptor.script.lang)
    || (descriptor.scriptSetup && descriptor.scriptSetup.lang);
  const isTS = scriptLang === 'ts';
  if (scriptLang && !isTS) {
    // TODO: 收集错误
    console.log('Only lang="ts" is supported for <script> blocks.');
  }

  // TODO: 支持 ssr
  let clientCode = '';

  const clientScriptResult = await doCompileScript(descriptor, {
    isTS,
  }, count);
  if (!clientScriptResult)
    return;

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
      {
        ssr: false,
        isTS,
      },
      count,
    );
    if (!clientTemplateResult)
      return;

    console.log({ clientTemplateResult });
    clientCode += clientTemplateResult;
  }

  return {
    js: clientCode.trimStart(),
  };
}

async function doCompileScript(
  descriptor: SFCDescriptor,
  options: {
        ssr?: boolean
        isTS?: boolean
    } = {},
  count: number,
): Promise<[string, BindingMetadata | undefined] | undefined> {
  const { ssr = false, isTS = true } = options;

  if (descriptor.script || descriptor.scriptSetup) {
    try {
      const expressionPlugins: CompilerOptions['expressionPlugins'] = isTS
        ? ['typescript']
        : undefined;
      const compiledScript = compiler.compileScript(descriptor, {
        inlineTemplate: true,
        id: 'example', // FIXME: 待修复
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
            COMP_IDENTIFIER + count,
            expressionPlugins,
          )}`;

      if ((descriptor.script || descriptor.scriptSetup)!.lang === 'ts')
        code = await transformTS(code);

      return [code, compiledScript.bindings];
    } catch (e: any) {
      // TODO: 收集错误
      console.log(e.stack.split('\n').slice(0, 12).join('\n'));
    }
  } else {
    return [`\nconst ${COMP_IDENTIFIER}${count} = {}`, undefined];
  }
}

async function doCompileTemplate(
  descriptor: SFCDescriptor,
  bindingMetadata: BindingMetadata | undefined,
  options: {
        ssr?: boolean
        isTS?: boolean
    },
  count: number,
) {
  const { ssr = false, isTS = true } = options;
  const templateResult = compiler.compileTemplate({
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id: 'example', // FIXME: 待替换
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
    // TODO: 待收集错误
    console.log(templateResult.errors.join(' '));
    return;
  }

  const fnName = ssr ? 'ssrRender' : 'render';

  let code
    = `\n${templateResult.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`,
    )}` + `\n${COMP_IDENTIFIER}${count}.${fnName} = ${fnName}`;

  if ((descriptor.script || descriptor.scriptSetup)?.lang === 'ts')
    code = await transformTS(code);

  return code;
}
