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
  provideCompletionItems(document: TextDocument, position: Position) {
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
  resolveCompletionItem(item: CompletionItem, token) {
    const editor = window.activeTextEditor;
    if (!editor)
      return item;

    const document = editor.document;
    const position = editor.selection.active;
    const line = document.getText(new Range(new Position(position.line, 0), new Position(position.line, position.character)));
    const shouldRemovedCharacters = line.trimStart().startsWith('<') ? line.trimStart() : '';

    const name = kebabCase(item.label as string).slice(2);
    const descriptor: ComponentDescriptor = componentSnippets[name];

    const templateText = new SnippetString(descriptor.body
      ? `${descriptor.body.map((l, index) => {
        return index === 0 ? l.replace(shouldRemovedCharacters, '') : l;
      }).join('\n')}`
      : '');

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
