#!/bin/bash
##################################################
# 本地打码脚本（兼容版）
##################################################
# 环境搭建
# 1、macOS:
# <安装路径>/Contents/MacOS/cli
# 2、Windows:
# 配置环境变量 WECHAT_DEVTOOL_PATH_CLI: <安装路径>/cli.bat
# 重启电脑以应用环境变量 ※ 确保安装路径不能有空格！
# 配置nodejs/npm/wepy环境
# https://www.jianshu.com/p/a988ccb34fe7
# https://www.jianshu.com/p/2d9fa3659645
# 3、开发者工具配置
# 设置 -> 安全设置 -> 服务端口
# 设置为：开启
##################################################
# 脚本应用示例（版本号规则：必须为V/v开头，且20个字符以内）
# ./autoPackage.sh V0.1.8 1111版本
# ./autoPackage.sh v0.1.8 1111版本
##################################################
# https://blog.csdn.net/kakabuqinuo/article/details/99845797
# getJsonString
# 获取json 字符串型字段
# $1 文件
# $2 键
##################################################
getJsonString() {
  echo "getJsonString($*)"
  #grep -Po 'extAppid[": ]+\K[^"]+' ${1}

  value=`echo $1 | sed 's/.*"extAppid": \([^,}]*\).*/\1/'`
  echo $value | sed 's/\"//g'
  #dev_id=$(grep -Po 'extAppid[": ]+\K[^"]+' ${1})
  #echo $dev_id
}

##################################################
# setJsonBooleanWin
# 修改json 布尔型字段
# $1 文件
# $2 键
# $3 值
##################################################
setJsonBooleanWin() {
  echo "setJsonBooleanWin($*)"
  sed -i 's/\("'"${2}"'": \).*/\1'"${3}"',/g' ${1}
  cat ${1}
}

##################################################
# setJsonStringWin
# 修改json 字符串型字段
# $1 文件
# $2 键
# $3 值
##################################################
setJsonStringWin() {
  echo "setJsonStringWin($*)"
  sed -i 's/\("'"${2}"'": "\).*/\1'"${3}"'",/g' ${1}
}

##################################################
# uploadPackageWin
# 将代码打包上传
# $1 开发者工具路径
# $2 当前路径
# $3 小程序标识（是否专属版）
# $4 AppId
# $5 版本号
# $6 版本备注
##################################################
uploadPackageWin() {
  echo "uploadPackageWin($*)"
  # 修改小程序标识
  setJsonBooleanWin ./src/ext.json extEnable ${3}
  sleep 1
  # 代码编译
  npm run build
  sleep 1
  # 修改开发者工具appid
  setJsonStringWin ./dist/project.config.json appid ${4}
  sleep 8
  # 修正为windows可用的路径
  WIN_PROJECT_PATH=${2:1:1}:${2:2}
  echo ${WIN_PROJECT_PATH}
  # 上传代码
  ${1} -u ${5}@${WIN_PROJECT_PATH}/dist --upload-desc ${6} --upload-info-output ${WIN_PROJECT_PATH}/uploadinfo.json
  sleep 1
  echo "===== 上传完毕 ====="
}

##################################################
# setJsonBooleanMac
# 修改json 布尔型字段
# $1 文件
# $2 键
# $3 值
##################################################
setJsonBooleanMac() {
  echo "setJsonBooleanMac($*)"
  sed -i '' 's/\("'"${2}"'": \).*/\1'"${3}"',/g' ${1}
  cat ${1}
}

##################################################
# setJsonStringMac
# 修改json 字符串型字段
# $1 文件
# $2 键
# $3 值
##################################################
setJsonStringMac() {
  echo "setJsonStringMac($*)"
  sed -i '' 's/\("'"${2}"'": "\).*/\1'"${3}"'",/g' ${1}
}

##################################################
# uploadPackageMac
# 将代码打包上传
# $1 开发者工具路径
# $2 当前路径
# $3 小程序标识（是否专属版）
# $4 AppId
# $5 版本号
# $6 版本备注
##################################################
uploadPackageMac() {
  # 修改小程序标识
  setJsonBooleanMac ./src/ext.json extEnable ${3}
  sleep 1
  # 代码编译
  npm run build
  sleep 1
  # 修改开发者工具appid
  setJsonStringMac ./dist/project.config.json appid ${4}
  sleep 8
  # 上传代码
  ${1} -u ${5}@${2}/dist --upload-desc ${6} --upload-info-output ${2}/uploadinfo.json
  sleep 1
  echo "===== 上传完毕 ====="
}

##################################################
# main
# $0 执行文件
# $1 版本号
# $2 版本备注
##################################################

echo "=====小程序本地打码脚本====="
# 版本号规则
VERSION_RULE="^[Vv].{1,19}$"
# 路径
SHELL_FOLDER=$(cd "$(dirname "$0")";pwd)
echo "当前路径：${SHELL_FOLDER}"
# 微信开发者工具路径
DEVTOOL_PATH_WIN="${WECHAT_DEVTOOL_PATH_CLI}"
DEVTOOL_PATH_MAC="/Applications/wechatwebdevtools.app/Contents/MacOS/cli"
DEVTOOL_PATH=""
SYSTEM_SIGN=""
# Appid wx821aadcd431646f9
APPID_SERVICE=wxcc5359605cfd8630
APPID_PLATFORM=wxbd3e6f9c3b2c9a33
# 版本号
VERSION_SERVICE="${1}"
VERSION_PLATFORM="${1}"
# 打包信息
VERSION_INFO="info:${2}"

# TMP=getJsonString ./src/ext.json extAppid
# echo ${TMP}

# 获取操作系统 / 开发者工具路径
if [[ "${DEVTOOL_PATH_WIN}" != "" && -e ${DEVTOOL_PATH_WIN} ]]; then
 DEVTOOL_PATH=${DEVTOOL_PATH_WIN}
 SYSTEM_SIGN="WIN"
elif [[ "${DEVTOOL_PATH_MAC}" != "" && -e ${DEVTOOL_PATH_MAC} ]]; then
 DEVTOOL_PATH=${DEVTOOL_PATH_MAC}
 SYSTEM_SIGN="MAC"
fi
if [[ "${SYSTEM_SIGN}" != "" ]]; then
 echo "当前系统为：${SYSTEM_SIGN}，开发者工具路径：${DEVTOOL_PATH}"
else
 echo "微信开发者工具未找到，可能路径错误。"
 exit
fi

# 打包
if [[ "${SYSTEM_SIGN}" == "WIN" ]]; then
 # 打包WIN
 if [[ ${1} =~ ${VERSION_RULE} ]]; then
   # 打包专属版
   uploadPackageWin ${DEVTOOL_PATH} ${SHELL_FOLDER} true ${APPID_SERVICE} ${VERSION_SERVICE} ${VERSION_INFO}
	 # 打包平台版
   uploadPackageWin ${DEVTOOL_PATH} ${SHELL_FOLDER} false ${APPID_PLATFORM} ${VERSION_PLATFORM} ${VERSION_INFO}
   echo -e "专属版本号：${VERSION_SERVICE}\n平台版本号：${VERSION_PLATFORM}"
 else
   echo "版本号：${1} 非正常版本号，无法上传打码。"
   exit
 fi
elif [[ "${SYSTEM_SIGN}" == "MAC" ]]; then
 # 打包MAC
 if [[ ${1} =~ ${VERSION_RULE} ]]; then
   # 打包专属版
   uploadPackageMac ${DEVTOOL_PATH} ${SHELL_FOLDER} true ${APPID_SERVICE} ${VERSION_SERVICE} ${VERSION_INFO}
   # 打包平台版
   uploadPackageMac ${DEVTOOL_PATH} ${SHELL_FOLDER} false ${APPID_PLATFORM} ${VERSION_PLATFORM} ${VERSION_INFO}
   echo -e "专属版本号：${VERSION_SERVICE}\n平台版本号：${VERSION_PLATFORM}"
 else
   echo "版本号：${1} 非正常版本号，无法上传打码。"
   exit
 fi
else
 echo "异常错误。"
 exit
fi
