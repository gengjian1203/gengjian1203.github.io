const fs = require("fs");
const ci = require("miniprogram-ci");
const app = require("../client/src/config/app.js");

const strGitHead = fs.readFileSync("./.git/HEAD", "utf8").trim() || "";
const strGitCommit =
  fs.readFileSync("./.git/COMMIT_EDITMSG", "utf8").trim() || "";

const strBranchSign = "refs/heads/";
const nBranchIndex = strGitHead.indexOf(strBranchSign);
const branch =
  nBranchIndex >= 0
    ? strGitHead.substring(nBranchIndex + strBranchSign.length)
    : strGitHead;

const strVersionSign = "br-";
const nVersionIndex = branch.indexOf(strVersionSign);
const version =
  nVersionIndex >= 0
    ? branch.substring(nVersionIndex + strVersionSign.length)
    : "0.0.1";

// console.log("app version", strGitCommit);

const createTask = (params) => {
  const { appId, pathKey, version, desc } = params || {};
  return new Promise((resolve) => {
    const project = new ci.Project({
      appid: appId,
      type: "miniProgram",
      projectPath: "./client/dist/weapp",
      privateKeyPath: pathKey,
      ignores: ["node_modules/**/*"],
    });

    ci.upload({
      project,
      version: version,
      desc: desc,
      setting: {
        es6: true,
      },
      onProgressUpdate: (res) => {
        const { _msg, _status } = res || {};
        if (_msg === "upload" && _status !== "doing") {
          console.log(`【${appId}, ${app[appId].appName}】上传完毕`, res);
          resolve({
            name: `【${appId}, ${app[appId].appName}】`,
            ...res,
          });
        }
      },
    });
  });
};

const main = async () => {
  const arrTaskList = [];

  Object.keys(app).forEach((key) => {
    const pathKey = `./script/keys/private.${key}.key`;
    if (fs.existsSync(pathKey)) {
      console.log(`【${key}, ${app[key].appName}】开始上传...`);
      const task = createTask({
        appId: key,
        pathKey: pathKey,
        version: version,
        desc: `分支：${branch}，提交：${strGitCommit}`,
      });
      arrTaskList.push(task);
    } else {
      console.log(`【${key}, ${app[key].appName}】未找到上传配置`);
    }
  });

  console.log("代码上传中...", "任务数：", arrTaskList.length);
  const res = await Promise.allSettled(arrTaskList);
  console.log(res, "任务列表完成");
};

// 主函数
main();
