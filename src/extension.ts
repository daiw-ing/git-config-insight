import * as vscode from "vscode";
import {
  showConfig,
  addConfigDisposable,
  setConfig,
  addTemplate,
  applyTemplate,
  removeTemplate,
} from "./func";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "git-config-insight" is now active!'
  );

  let actionsGroup = vscode.commands.registerCommand(
    "extension.gitConfigActions",
    function () {
      vscode.window
        .showQuickPick(
          [
            "Show Current Repo Git Config",
            "Set Current Repo Git Config",
            "Select Config To Add To Current Repo",
            "Add Git Template",
            "Apply Git Template",
            "Remove Git Template",
          ],
          { placeHolder: "请选择要执行的操作" }
        )
        .then((selectedAction) => {
          if (!selectedAction) {
            return;
          }

          if (selectedAction === "Show Current Repo Git Config") {
            showConfig();
          } else if (selectedAction === "Set Current Repo Git Config") {
            setConfig();
          } else if (selectedAction === "Add Git Template") {
            addTemplate(context);
          } else if (selectedAction === "Apply Git Template") {
            applyTemplate(context);
          } else if (selectedAction === "Remove Git Template") {
            removeTemplate(context);
          } else if (
            selectedAction === "Select Config To Add To Current Repo"
          ) {
            addConfigDisposable();
          }
        });
    }
  );

  context.subscriptions.push(actionsGroup);
}

export function deactivate() {}
