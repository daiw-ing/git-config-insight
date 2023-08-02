import * as vscode from "vscode";
import { execSync } from "child_process";
const gitTemplateConfigKey = "gitTemplates";

export function setGitConfig(user: string, email: string) {
  const currentFolder = getDocumentWorkspaceFolder();
  try {
    execSync(`git config user.name "${user}"`, { cwd: currentFolder });
    execSync(`git config user.email "${email}"`, { cwd: currentFolder });
  } catch (err: any) {
    vscode.window.showErrorMessage("设置 user 和 email 失败：" + err.message);
  }
}

export function getDocumentWorkspaceFolder(): string | undefined {
  const fileName = vscode.window.activeTextEditor?.document.fileName;
  return vscode.workspace.workspaceFolders
    ?.map((folder) => folder.uri.fsPath)
    .filter((fsPath) => fileName?.startsWith(fsPath))[0];
}

export function getGlobalGitConfig() {
  try {
    const configOutput = execSync("git config --global --list");
    return configOutput.toString();
  } catch (err: any) {
    vscode.window.showErrorMessage("获取全局的Git配置失败：" + err.message);
    return null;
  }
}
export function isGitRepository(folderPath: string) {
  try {
    const gitCommand = "git rev-parse --is-inside-work-tree";
    const result = execSync(gitCommand, { cwd: folderPath });
    return result.toString().trim() === "true";
  } catch (err) {
    return false;
  }
}

export function getGlobalGitTemplates(context: vscode.ExtensionContext) {
  const globalState = context.globalState;

  if (!globalState) {
    vscode.window.showInformationMessage(`获取到的全局模板为空`);
    return [];
  } else {
    const templates = globalState.get(gitTemplateConfigKey) as {
      name: string;
      user: string;
      email: string;
    }[];

    if (templates && templates?.length > 0) {
      return templates;
    } else {
      vscode.window.showInformationMessage(`获取到的全局模板为空`);
      return [];
    }
    return [];
  }
}

export function setGlobalGitTemplates(
  templates: {
    name: string;
    user: string;
    email: string;
  }[],
  context: vscode.ExtensionContext
) {
  const globalState = context.globalState;
  globalState.update(gitTemplateConfigKey, templates);
}
