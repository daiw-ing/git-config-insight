import * as vscode from "vscode";
import { getGlobalGitTemplates, setGlobalGitTemplates } from "./utils";

const removeTemplate = function (context: vscode.ExtensionContext) {
  const templates = getGlobalGitTemplates(context);
  if (templates.length === 0) {
    vscode.window.showInformationMessage("没有可删除的全局 Git 模板。");
    return;
  }

  vscode.window
    .showQuickPick(
      templates.map((template) => template.name),
      {
        placeHolder: "请选择要删除的全局 Git 模板",
      }
    )
    .then((selectedTemplateName) => {
      if (!selectedTemplateName) {
        return;
      }

      removeGitTemplate(selectedTemplateName, context);
    });
};

function removeGitTemplate(
  templateName: string,
  context: vscode.ExtensionContext
) {
  const templates = getGlobalGitTemplates(context);
  const updatedTemplates = templates.filter(
    (template) => template.name !== templateName
  );
  setGlobalGitTemplates(updatedTemplates, context);
  vscode.window.showInformationMessage(
    `已删除Git模板 "${templateName}"！`
  );
}

export { removeTemplate };
