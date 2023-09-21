const path = require("path");
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
  const masterPath = path.resolve(__dirname, "../gengjian1203_master");
  const strCommit = `Update Blog By Local ${new Date().getTime()}`;

  execSync(`pwd`, { stdio: "inherit", cwd: masterPath });

  execSync(`rm -rf .git`, { stdio: "inherit", cwd: masterPath });

  execSync(`git init`, { stdio: "inherit", cwd: masterPath });

  execSync(`git config user.name "Hugh Geng"`, { stdio: "inherit", cwd: masterPath });

  execSync(`git config user.email "gengjian1203@foxmail.com"`, { stdio: "inherit", cwd: masterPath });

  execSync(`git add .`, { stdio: "inherit", cwd: masterPath });

  execSync(`git commit -m "${strCommit}"`, {
    stdio: "inherit",
    cwd: masterPath,
  });

  for (let i = 0; i < 10; i++) {
    console.log("github Page 网站上传中...");
    try {
      execSync(
        `git push --force --quiet https://github.com/gengjian1203/gengjian1203.github.io.git master:master`,
        { stdio: "inherit", cwd: masterPath }
      );
    } catch (e) {
      console.log("git push error", e);
    }

    console.log("git push done.");

    resCommit =
      JSON.parse(
        execSync(
          `git log -1 --pretty=format:"{\\"hash\\":\\"%H\\",\\"author\\":\\"%an\\",\\"date\\":\\"%ad\\",\\"commit\\":\\"%s\\"}"`,
          { encoding: "utf8", cwd: masterPath }
        )
      ) || {};

    console.log("resPush", resCommit);

    if (resCommit.commit === strCommit) {
      console.log("github Page 网站上传完毕.");
      break;
    } else {
      if (i === 9) {
        console.log("github Page 网站上传失败.");
      }
    }

    // console.log("是否重新上传(Y/N)");

    // const result = await readInput();
    // if (result === "Y") {
    //   console.log("重新上传");
    // } else {
    //   console.log("上传成功");
    //   break;
    // }
  }

  process.exit();
};

// 主函数
main();
