import * as vscode from "vscode";
import { execSync } from "child_process";
import {
  getDocumentWorkspaceFolder,
  getGlobalGitConfig,
  isGitRepository,
} from "./utils";

const showConfig = () => {
  const currentRepoGitConfig = getCurrentRepoGitConfig();
  const globalGitConfig = getGlobalGitConfig();

  if (currentRepoGitConfig) {
    vscode.window.showInformationMessage(
      "当前仓库的Git配置：" + currentRepoGitConfig
    );
  }

  if (globalGitConfig) {
    vscode.window.showInformationMessage("全局的Git配置：" + globalGitConfig);
  }
};

function getCurrentRepoGitConfig() {
  try {
    const foldPath = getDocumentWorkspaceFolder();

    vscode.window.showInformationMessage("当前文件路径：" + foldPath);

    if (!foldPath) {
      vscode.window.showErrorMessage(
        "Please open a file in a workspace folder"
      );
      return;
    }

    const isGitRepo = isGitRepository(foldPath);
    if (!isGitRepo) {
      vscode.window.showErrorMessage(
        "The workspace folder is not a git repository"
      );
      return;
    }

    const configOutput = execSync("git config --list", {
      cwd: foldPath,
    });

    return configOutput.toString();
  } catch (err: any) {
    vscode.window.showErrorMessage("获取当前仓库的Git配置失败: " + err.message);
    return null;
  }
}

export { showConfig };
