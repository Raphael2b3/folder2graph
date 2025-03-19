import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';

export function activate(context: vscode.ExtensionContext) {
  // Track the current panel with a webview
  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  const mainProgramm =  vscode.commands.registerCommand('folder2graph.start', () => {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (currentPanel) {
      // If we already have a panel, show it in the target column
      currentPanel.reveal(columnToShowIn);
    } else {
      // Otherwise, create a new panel
      currentPanel = vscode.window.createWebviewPanel(
        'folder2graph',
        'folder2graph',
        columnToShowIn || vscode.ViewColumn.One,
        {enableScripts: true}
      );
      // load the string from the file"./index.html" in the variable:
      

      // const app = mount(App, {
      //   target: document.getElementById('app')!,
      // });


      const filePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'src', 'index.html'));
      currentPanel.webview.html = fs.readFileSync(filePath.fsPath, 'utf8');
      // Reset when the current panel is closed
      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  });
  context.subscriptions.push(
    mainProgramm
  );
}
