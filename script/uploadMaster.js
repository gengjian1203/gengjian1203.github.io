const { execSync } = require("child_process");

const readInput = async () => {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.on("data", (data) => {
      const enterString = data.toString().slice(0, -2);
      resolve(enterString);
    });
  });
};

const main = async () => {
  console.log("开始同步更新master分支");

  execSync(`cd ./gengjian1203_master`, { stdio: "inherit" });

  execSync(`pwd`, { stdio: "inherit" });

  execSync(`rm -rf .git`, { stdio: "inherit" });

  execSync(`git init `, { stdio: "inherit" });

  execSync(`git add .`, { stdio: "inherit" });

  execSync(`git commit -m "Update Blog By Local"`, { stdio: "inherit" });

  while (true) {
    const resPush = execSync(
      `git push --force --quiet https://github.com/gengjian1203/gengjian1203.github.io.git master:master`,
      { stdio: "inherit" }
    );

    console.log("resPush", resPush);

    console.log("是否重新上传(Y/N)");

    const result = await readInput();
    if (result === "Y") {
      console.log("重新上传");
    } else {
      console.log("上传成功");
      break;
    }
  }

  process.exit();
};

// 主函数
main();
