---
title: 47.配置mongodb副本集的翻车笔记
date: 2024-09-26 20:19:15
tags:
  - 后端
---

### 聊聊起源

在自己练手的小玩具功能不断复杂之后,  
开始出现一个请求需要操作多个表的场景.

面对这个情况,  
考虑到如果操作一个数据库的时候失败报错, 那之前操作的还需要手动恢复,  
感觉会给业务代码里面掺杂很多复杂逻辑.  
不利于后续开发,

经过研究之后, 发现事务回滚机制正好试用这个场景,  
那高低研究一波.

<!-- more -->

### 代码改造

```js
const mongoose = require("mongoose");

// 创建会话
const session = await mongoose.startSession();

try {
  // 开始会话
  session.startTransaction();
  // do something...
  // const resTry = await funTry?.();

  // 提交会话
  await session.commitTransaction();

  return resTry;
} catch (error) {
  // 会话报错终止, 该会话内操作开始回滚
  session.abortTransaction();

  // do catch something...
  // const resCatch = await funCatch?.(error);
  return resCatch;
} finally {
  // 会话结束
  session.endSession();
}
```

代码改造后测试了一下,  
当抛出异常, 代码也执行了 `session.abortTransaction`,  
不过之前写入数据库的数据并没有撤销.  
经过查询资料之后发现,  
mongodb 想要事务回滚必须要设置为副本集模式.

### 配置改造

登录服务器执行如下命令

```bash
// 创建一个名为 "mongodbnet" 的 Docker 网络，可以将多个容器连接到同一个网络中，使它们能够相互通信。
docker network create mongodbnet

// 查看 Docker 中的所有网络
docker network ls

// 创建 conf/mongod.keyfile （为副本集共用）
openssl rand -base64 756 > /usr/local/mongo/conf/mongod.keyfile

// 创建 conf/mongod.conf （为副本集共用）
vim /usr/local/mongo/conf/mongod.conf

#

security:
authorization: enabled
keyFile: /conf/mongod.keyfile

#

replication:
replSetName: rs0

#

net:
port: 27017
bindIp: 127.0.0.1

// 创建 mongod.conf.orig（为副本集共用）

#

security:
authorization: enabled
keyFile: /conf/mongod.keyfile

#

replication:
replSetName: rs0

// 放开权限
chmod 600 /usr/local/mongo/conf/mongod.keyfile

// 启动容器
docker run \
--name mongo1 \
--net mongodbnet \
-p 27001:27017 \
-v /usr/local/mongo/mongod.conf.orig:/etc/mongod.conf.orig \
-v /usr/local/mongo/conf/mongod.conf:/conf/mongod.conf \
-v /usr/local/mongo/conf/mongod.keyfile:/conf/mongod.keyfile \
-v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime \
-e MONGO_INITDB_ROOT_USERNAME=yourusername \
-e MONGO_INITDB_ROOT_PASSWORD=yourpassword \
-d --restart=always mongo:4.2 \
--replSet rs0 \
--auth

docker run \
--name mongo2 \
--net mongodbnet \
-p 27002:27017 \
-v /usr/local/mongo/mongod.conf.orig:/etc/mongod.conf.orig \
-v /usr/local/mongo/conf/mongod.conf:/conf/mongod.conf \
-v /usr/local/mongo/conf/mongod.keyfile:/conf/mongod.keyfile \
-v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime \
-e MONGO_INITDB_ROOT_USERNAME=yourusername \
-e MONGO_INITDB_ROOT_PASSWORD=yourpassword \
-d --restart=always mongo:4.2 \
--replSet rs0 \
--auth

docker run \
--name mongo3 \
--net mongodbnet \
-p 27003:27017 \
-v /usr/local/mongo/mongod.conf.orig:/etc/mongod.conf.orig \
-v /usr/local/mongo/conf/mongod.conf:/conf/mongod.conf \
-v /usr/local/mongo/conf/mongod.keyfile:/conf/mongod.keyfile \
-v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime \
-e MONGO_INITDB_ROOT_USERNAME=yourusername \
-e MONGO_INITDB_ROOT_PASSWORD=yourpassword \
-d --restart=always mongo:4.2 \
--replSet rs0 \
--auth

// 考虑关闭三个 mongodb 容器，然后按照先开启主节点容器、再开启父节点容器的顺序启动。(选做)
docker stop mongo3 mongo2 mongo1

docker restart mongo1
docker restart mongo2
docker restart mongo3

// 进入主 mongo 容器
docker exec -it mongo1 bash

chmod 600 /conf/mongod.keyfile

// 查看通用配置文件
cat etc/mongod.conf.orig

// 进入 mongo 数据库
mongo -u yourusername -p yourpassword --authenticationDatabase admin

// 初始化副本集

> rs.initiate()
> rs.initiate({ \_id: "rs0", members: [ { _id: 0, host: "mongo1:27017" }, { _id: 1, host: "mongo2:27017" }, { _id: 2, host: "mongo3:27017" } ]})

rs0:PRIMARY> rs.status()
rs0:PRIMARY> rs.isMaster()

// 关联副本
rs0:PRIMARY> rs.add("mongo2:27017")
rs0:PRIMARY> rs.add("mongo3:27017")

// ===== 备份操作 =====
// 启动容器
-v /usr/local/mongo/conf/mongod.conf:/conf/mongod.conf \
-v /usr/local/mongo/mongod.conf.orig:/etc/mongod.conf.orig \
--keyFile /conf/mongod.keyfile \
--config /conf/mongod.conf \

// 矫正时区
docker cp /usr/share/zoneinfo/Asia/Shanghai mongo1:/etc/localtime
docker cp /usr/share/zoneinfo/Asia/Shanghai mongo2:/etc/localtime
docker cp /usr/share/zoneinfo/Asia/Shanghai mongo3:/etc/localtime

// 容器内操作配置
mongo --config /conf/mongod.conf --keyFile /conf/mongod.keyfile --replSet rs0

// 需要携带账号密码么？
rs.add("mongo2:27017", { username: "yourusername", password: "yourpassword", authenticationDatabase: "admin" })
// =================
```

库库一顿配置,  
不好使...
裂开了,  
后面再说吧

### 数据迁移

后面如果副本集配置好之后,  
那么就需要将旧的数据库数据迁移到新的副本集数据库之中.  
操作待学习...

### 后续

事务回滚的优先级不是那么高,  
先暂时搁置一波了,  
太浪费时间了.  
真在实际中遇到这种问题,
到时候再抱住运维大哥大腿好了.  
那么再完善这个机制好了.
