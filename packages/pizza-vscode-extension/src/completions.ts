import {
  CompletionItem,
  CompletionItemKind,
  type CompletionItemProvider,
  type ExtensionContext,
  Position,
  Range,
  SnippetString,
  TextDocument,
  languages,
  window,
} from 'vscode';
import componentSnippets from 'pizza-ui/json/pizza-ui-snippets.json';
import uppercamelcase from 'uppercamelcase';
import { kebabCase } from './utils';
import { type ComponentDescriptor } from './componentsMap';

// The plugin will take effect when the file belongs to the following types
const documentSelector = ['vue', 'typescript', 'javascript', 'javascriptreact', 'typescriptreact'];

const componentsProvider: CompletionItemProvider = {
  provideCompletionItems(document, position) {
    const linePrefix = document.lineAt(position).text.substring(0, position.character);
    if (!linePrefix.trimStart().startsWith('<'))
      return [];

    const completionItems: CompletionItem[] = [];

    Object.keys(componentSnippets).forEach((key) => {
      const name = `p-${key}`;

      completionItems.push(
        new CompletionItem(name, CompletionItemKind.Snippet),
        new CompletionItem(uppercamelcase(name), CompletionItemKind.Snippet),
      );
    });

    return completionItems;
  },
  resolveCompletionItem(item: CompletionItem) {
    const editor = window.activeTextEditor;
    if (!editor)
      return item;

    const document = editor.document;
    const position = editor.selection.active;
    const line = document.getText(new Range(new Position(position.line, 0), new Position(position.line, position.character)));
    const shouldRemovedCharacters = line.trimStart();

    const name = kebabCase(item.label as string).slice(2);
    const descriptor: ComponentDescriptor = componentSnippets[name];

    const templateText = new SnippetString(descriptor.body
      ? `${descriptor.body.map((l, index) => {
        // TODO: 待优化，这里处理了单行多标签情况，误打误撞了属于是
        const lArr = l.split('<');
        return index === 0 ? lArr[lArr.length - 1].replace(shouldRemovedCharacters, '') : l;
      }).join('\n')}`
      : '');

    console.log(templateText);

    item.insertText = templateText;

    return item;
  },
};

export function registerCompletions(context: ExtensionContext) {
  const providerItems = [componentsProvider];

  providerItems.forEach((provider) => {
    context.subscriptions.push(languages.registerCompletionItemProvider(documentSelector, provider, '<'));
  });
}
