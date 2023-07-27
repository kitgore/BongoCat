import * as vscode from 'vscode';

export function activate({ subscriptions, extensionUri }: vscode.ExtensionContext) {
  const statusTextArray = [`$(bg-leftup)$(bg-rightup)`, `$(bg-leftdown)$(bg-rightup)`, `$(bg-leftup)$(bg-rightdown)`];
  let currentIndex = 0;
  let leftWasLastDown = false;
  let lastStateBeforeReset = currentIndex;
  let timeout: NodeJS.Timeout | undefined;
  let statusBarVisible = true;
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  statusBarItem.text = `${statusTextArray[currentIndex]}`;
  statusBarItem.show();

  const onTextChanged = vscode.workspace.onDidChangeTextDocument((event) => {
    if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
      if(leftWasLastDown) {
        currentIndex = 2;
      } else {
        currentIndex = 1;
      }

      leftWasLastDown = !leftWasLastDown;
      statusBarItem.text = `${statusTextArray[currentIndex]}`;

      if (timeout) {
        clearTimeout(timeout);
      }

      // Store the last state before the reset
      lastStateBeforeReset = currentIndex;

      // Reset to default state after half a second of no typing
      timeout = setTimeout(() => {
        currentIndex = 0;
        statusBarItem.text = `${statusTextArray[currentIndex]}`;
      }, 500); // 500 milliseconds = 0.5 seconds
    }
  });

  // Command to toggle the status bar visibility
  const toggleStatusBarCommand = vscode.commands.registerCommand('extension.toggleStatusBar', () => {
    statusBarVisible = !statusBarVisible;
    if (statusBarVisible) {
      statusBarItem.show();
    } else {
      statusBarItem.hide();
    }
  });

  subscriptions.push(onTextChanged, toggleStatusBarCommand);
}