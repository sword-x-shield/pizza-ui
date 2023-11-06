import type { ExtensionContext } from 'vscode';
import { registerCompletions } from './completions';

export function activate(context: ExtensionContext) {
  registerCompletions(context);
}

export function deactivate() {}
