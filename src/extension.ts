import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {
  // Track the current panel with a webview
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand('folder2graph.hello', () => {
      vscode.window.showInformationMessage('Hello World!');
    }),
    vscode.commands.registerCommand('folder2graph.start', () => {
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
          {}
        );
        
        const htmlfile = vscode.Uri.file(context.asAbsolutePath('src/webview.html')).with({ scheme: 'vscode-resource' }).toString();
        currentPanel.webview.html = htmlfile;  

        // Reset when the current panel is closed
        currentPanel.onDidDispose(
          () => {
            currentPanel = undefined;
          },
          null,
          context.subscriptions
        );
      }
    })
  );
}
