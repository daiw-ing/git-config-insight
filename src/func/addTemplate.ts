import * as vscode from "vscode";
import {
  getGlobalGitTemplates,
  setGitConfig,
  setGlobalGitTemplates,
} from "./utils";

const addTemplate = function (context: vscode.ExtensionContext) {
  vscode.window
    .showInputBox({
      prompt: "请输入模板名称",
      placeHolder: "例如：Personal",
    })
    .then((templateName) => {
      if (!templateName) {
        return;
      }

      vscode.window
        .showInputBox({
          prompt: "请输入用户名称",
          placeHolder: "例如：Your Name",
        })
        .then((userName) => {
          if (!userName) {
            return;
          }

          vscode.window
            .showInputBox({
              prompt: "请输入用户邮箱",
              placeHolder: "例如：your.email@example.com",
            })
            .then((email) => {
              if (!email) {
                return;
              }

              const template = {
                name: templateName,
                user: userName,
                email: email,
              };
              const globalTemplates = getGlobalGitTemplates(context);

              //  判断是否已存在同名模板
              if (
                globalTemplates.filter(
                  (template) => template.name === templateName
                ).length > 1
              ) {
                vscode.window.showErrorMessage(
                  `已存在同名模板 "${templateName}"！`
                );
                return;
              }
              globalTemplates.push(template);
              setGlobalGitTemplates(globalTemplates, context);

              vscode.window.showInformationMessage(
                `已添加全局 Git 模板 "${templateName}"！`
              );
            });
        });
    });
};

const applyTemplate = function (context: vscode.ExtensionContext) {
  const globalTemplates = getGlobalGitTemplates(context);
  if(globalTemplates.length === 0) {
    vscode.window.showErrorMessage("没有可用的全局 Git 模板, 请新建！");
  }

  vscode.window
    .showQuickPick(
      globalTemplates.map((template) => template.name),
      { placeHolder: "请选择要应用的全局 Git 模板" }
    )
    .then((selectedTemplateName) => {
      if (!selectedTemplateName) {
        return;
      }

      const selectedTemplate = globalTemplates.find(
        (template) => template.name === selectedTemplateName
      );

      if (selectedTemplate) {
        vscode.window.showInformationMessage(
          `已为当前应用Git模板 "${selectedTemplate?.name}" \n
        user: "${selectedTemplate?.user}" \n
        email: "${selectedTemplate?.email}
        ！`
        );
        setGitConfig(selectedTemplate.user, selectedTemplate.email);
      }
    });
};

export { addTemplate, applyTemplate };
