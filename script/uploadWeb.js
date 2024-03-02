const { execSync } = require("child_process");
const path = require("path");
const dayjs = require("dayjs");

const { execSCP, execSSH } = require("./api");

const main = async () => {
  const appCode = "gengjian1203";
  const pathRoot = path.resolve(`.`);
  const nameTar = `${appCode}_${dayjs().format("YYYYMMDDHHmmss")}.tar.gz`; // 你的压缩包名字
  const pathTar = path.resolve(`./${nameTar}`); // 压缩包保存到本地的指定位置
  const pathSource = path.resolve(`./${appCode}`); // 前端发布包打包好的文件路由位置
  const pathPrivateRemote = path.resolve(`./script/private/remote/zero.json`); // 远端服务器配置

  const remote = require(pathPrivateRemote);
  const { path: pathBK, pathReal } = remote || {};

  // 压缩文件
  execSync(
    `tar -zcvPf ${pathTar} -C ${pathSource} .`, // 打包临时切换工作目录，否则会把绝对路径都打包进去
    {
      stdio: "inherit",
      cwd: pathRoot,
    }
  );

  console.log(`🔥静态网站开始上传...`);

  // 上传压缩包
  const resSCP = await execSCP({
    remote,
    pathFile: pathTar,
  });
  if (!resSCP) {
    console.log(`tar上传失败`);
    return;
  }

  // 服务器解压
  const resSSH = await execSSH({
    remote,
    command:
      `rm -rf ${pathReal}/${appCode}` + // 删除原版本
      ` && mkdir -p ${pathReal}/${appCode}` + // 新建文件夹
      ` && tar -xvf ${pathBK}/${nameTar} -C ${pathReal}/${appCode}`, // 解压到新文件夹
  });
};

// 主函数
main();
