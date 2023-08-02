import * as vscode from "vscode";
import { execSync } from "child_process";
import { getDocumentWorkspaceFolder, getGlobalGitConfig } from "./utils";

// 注册为当前仓库添加全局Git配置的命令
const addConfig = () => {
  const globalConfig = getGlobalGitConfig();
  if (!globalConfig) {
    vscode.window.showWarningMessage(
      "获取全局的Git配置失败，请确保已正确配置全局Git！"
    );
    return;
  }

  // 显示QuickPick供用户选择全局Git配置
  vscode.window
    .showQuickPick(globalConfig.split("\n"), {
      placeHolder: "请选择要添加的全局Git配置",
    })
    .then((selectedConfig) => {
      if (selectedConfig) {
        addGitConfigToRepo(selectedConfig.trim());
      }
    });
};

function addGitConfigToRepo(globalConfig: any) {
  const currentFolder = getDocumentWorkspaceFolder();
  try {
    execSync(`git config --add --local ${globalConfig}`, {
      cwd: currentFolder,
    });
    vscode.window.showInformationMessage("已添加Git配置到当前仓库！");
  } catch (err: any) {
    vscode.window.showErrorMessage("添加Git配置到当前仓库失败：" + err.message);
  }
}

export { addConfig as addConfigDisposable };
