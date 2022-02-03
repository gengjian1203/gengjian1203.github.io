const ci = require("miniprogram-ci");

const main = async () => {
  const project = new ci.Project({
    appid: "wx821aadcd431646f9",
    type: "miniProgram",
    projectPath: "./client/dist/weapp",
    privateKeyPath: `./script/keys/private.wx821aadcd431646f9.key`,
    ignores: ["node_modules/**/*"],
  });

  // 静态网站
  console.log("静态网站上传中...");
  const result = await ci.cloud.uploadStaticStorage({
    project,
    env: "prod-5gkxku5cdb510bb2",
    path: "./gengjian1203",
    remotePath: "/gengjian1203",
  });

  console.log("静态网站完毕.", result);
};

// 主函数
main();
