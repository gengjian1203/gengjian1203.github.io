#!/bin/bash
##################################################
# 同步更新master分支号脚本
# main
# $0 执行文件
# $1 type
# 示例
# ./uploadMaster.sh
##################################################
echo "开始同步更新master分支"

cd ./gengjian1203_master

pwd

rm -rf .git

git init 

git add .

git commit -m "Update Blog By Local"

while true
do
  git push --force --quiet https://github.com/gengjian1203/gengjian1203.github.io.git master:master
  echo "是否重新上传(Y/N)"
  read SUCCESS
  if [ ${SUCCESS} != 'Y' ] 
  then
    break
  fi
done

echo "更新master分支完毕"
exit