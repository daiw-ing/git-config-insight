import * as vscode from "vscode";
import { setGitConfig } from "./utils";

// 注册为当前仓库设置 user 和 email 的命令
const setConfig = () => {
  vscode.window
    .showInputBox({
      prompt: "请输入新的 user 名称",
      placeHolder: "例如：John Doe",
    })
    .then((userName) => {
      if (!userName) {
        return;
      }

      vscode.window
        .showInputBox({
          prompt: "请输入新的 email 地址",
          placeHolder: "例如：johndoe@example.com",
        })
        .then((email) => {
          const emailRegex = /\S+@\S+\.\S+/;
          if (!emailRegex.test(email || "")) {
            vscode.window.showErrorMessage("邮箱格式不正确！");
            return;
          }

          if (!email) {
            return;
          }
          setGitConfig(userName, email);
        });
    });
};
export { setConfig };
