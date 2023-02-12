const axios = require("axios")
const scpClient = require("scp2")
const sshClient = require("ssh2").Client

const exec = async (url, params) => {
  const payload =
    params && params.method && params.method.toUpperCase && params.method.toUpperCase() === "GET"
      ? { params: params && params.data }
      : { data: params && params.data }

  const res = await axios({
    url: url,
    timeout: 30000,
    ...params,
    ...payload
  })
  // console.debug("api exec res", url, params, res);

  if (res && res.data) {
    return res.data
  } else {
    return {}
  }
}

/**
 * Axios发起GET请求
 * @param {*} url
 * @param {*} params
 * @param {*} config
 * @return
 */
const execAxiosGET = async (url = "", params = {}, config = {}) => {
  let res = {}

  try {
    res = await axios.get(url, { params, ...config })
    // console.debug("api get res", res);
  } catch (e) {
    console.debug("api get err", e)
  }
  return res
}

/**
 * Axios发起POST请求
 * @param {*} url
 * @param {*} params
 * @param {*} config
 * @return
 */
const execAxiosPOST = async (url = "", params = {}, config = {}) => {
  let res = {}

  try {
    res = await axios.post(url, params, config)
    // console.debug("api post res", res);
  } catch (e) {
    console.debug("api post err", e)
  }
  return res
}

/**
 * scp上传文件
 * @param {object} params 相关信息
 * @param {object} params.remote 远端服务器相关信息
 * @param {string} params.remote.host 服务器的IP地址
 * @param {number} params.remote.port 服务器端口 一般为 22
 * @param {string} params.remote.username 用户名
 * @param {string} params.remote.password 密码
 * @param {string} params.remote.path 服务器存放文件路径
 * @param {string} params.pathFile 本地文件的路由
 * @return
 */
const execSCP = async (params = {}) => {
  const { remote, pathFile } = params || {}
  return new Promise((resolve) => {
    scpClient.scp(pathFile, remote, (err) => {
      if (err) {
        console.log("上传失败!", err)
        resolve(null)
      } else {
        // console.log("上传成功!")
        resolve(true)
      }
    })
  })
}

/**
 * ssh执行命令
 * @param {object} params 相关信息
 * @param {object} params.remote 远端服务器相关信息
 * @param {string} params.remote.host 服务器的IP地址
 * @param {number} params.remote.port 服务器端口 一般为 22
 * @param {string} params.remote.username 用户名
 * @param {string} params.remote.password 密码
 * @param {string} params.remote.path 服务器存放文件路径
 * @param {string} params.command 要执行的命令
 * @return
 */
const execSSH = async (params = {}) => {
  const { remote, command = "" } = params || {}
  return new Promise((resolve) => {
    const conn = new sshClient()
    conn
      .on("ready", function () {
        // 删除上个版本的文件
        conn.exec(command, (err, stream) => {
          if (err) {
            console.log("命令执行失败!", err)
            resolve(null)
          }
          stream
            .on("close", (code, signal) => {
              // console.log("命令执行成功!")
              resolve(true)
              conn.end()
            })
            .on("data", (data) => {
              // console.log("STDOUT: " + data)
            })
            .stderr.on("data", (data) => {
              // console.log("STDERR: " + data)
            })
        })
      })
      .connect(remote)
  })
}

module.exports = {
  exec,
  execAxiosGET,
  execAxiosPOST,
  execSCP,
  execSSH
}
