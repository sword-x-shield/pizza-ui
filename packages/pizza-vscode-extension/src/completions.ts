import {
  CompletionItem,
  CompletionItemKind,
  type CompletionItemProvider,
  type ExtensionContext,
  languages,
} from 'vscode';
import uppercamelcase from 'uppercamelcase';
import { kebabCase } from './utils';
import { type ComponentDescriptor, componentsMap } from './componentsMap';

// The plugin will take effect when the file belongs to the following types
const documentSelector = ['vue', 'typescript', 'javascript', 'javascriptreact', 'typescriptreact'];

const componentsProvider: CompletionItemProvider = {
  provideCompletionItems() {
    const completionItems: CompletionItem[] = [];

    Object.keys(componentsMap).forEach((key) => {
      const name = `p-${key}`;

      completionItems.push(
        new CompletionItem(name, CompletionItemKind.Field),
        new CompletionItem(uppercamelcase(name), CompletionItemKind.Field),
      );
    });

    return completionItems;
  },
  resolveCompletionItem(item: CompletionItem) {
    const name = kebabCase(item.label as string).slice(2);
    const descriptor: ComponentDescriptor = componentsMap[name];

    const templateText = descriptor.template ? `${descriptor.template.replace(/\n/, '')}` : '';

    item.insertText = templateText;

    return item;
  },
};

export function registerCompletions(context: ExtensionContext) {
  const providerItems = [componentsProvider];

  providerItems.forEach((provider) => {
    context.subscriptions.push(languages.registerCompletionItemProvider(documentSelector, provider));
  });
}
