---
title: 28.Node脚本之微信小程序持续集成自动上传
date: 2022-02-03 16:16:06
tags:
  - Node脚本
---

### 折腾背景

开发过程中，每次需要打小程序的体验版，供测试同学测试的时候。  
都需要压缩编译代码，然后点击上传按钮，对小程序进行上传的操作。  
一次两次还好，手上事情多的时候，这个上传操作是很挑战心态的一件事情。  
所以为了避免每次人肉点击上传操作，  
写了一个脚本，放在命令里面，方便了开发人员的压力。  
（如果一套代码供多个小程序使用的时候效果更佳 (＾－＾)V）

<!-- more -->

### CI 是什么

CI 是一种通过在应用开发阶段引入自动化来频繁向客户交付应用的方法。  
通过自动构建应用并运行不同级别的自动化测试（通常是单元测试和集成测试）来验证这些更改，  
确保这些更改没有对应用造成破坏。
微信小程序自身也具备这项功能，给开发人员提供了库和对应方法，实现通过代码上传小程序的能力。

### 微信小程序 CI 上传代码流程

1. 微信小程序后台的配置
   在`微信公众平台`->`开发`->`开发设置`后下载`代码上传密钥`。  
   秘钥需要妥善保管，弄丢了就只能重新生成了。  
   同时将自身的公网 IP，放到代码上传的白名单内。  
   不然上传的时候会提示报错。  
   或者关闭这个白名单，任何 IP 都可以允许上传，不过这样无疑风险会变大一些。

2. 脚本所在项目添加依赖库 miniprogram-ci

   ```bash
   npm install miniprogram-ci --save
   或者
   yarn add miniprogram-ci
   ```

3. js 脚本实现

   引用 CI 库

   ```js
   const ci = require("miniprogram-ci");
   ```

   声明 CI 对象 注意： new ci.Project 调用时，请确保项目代码已经是完整的，避免编译过程出现找不到文件的报错

   ```js
   const project = new ci.Project({
     appid: "wxsomeappid",
     type: "miniProgram",
     projectPath: "the/project/path",
     privateKeyPath: "the/privatekey/path",
     ignores: ["node_modules/**/*"],
   });
   ```

   上传操作

   ```js
   const uploadResult = await ci.upload({
     project,
     version: "1.1.1",
     desc: "hello",
     setting: {
       es6: true,
     },
     onProgressUpdate: console.log,
   });
   ```

   对应的 api 参数可以参考下方的官方文档。

4. 执行脚本。

   ```bash
   node ./script/uploadWeapp.js
   ```

5. 集成到 package.json

   ```json
   "scripts": {
      "upload": "node ./script/uploadWeapp.js",
   }
   ```

### 参考资料

[微信官方文档/CI](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)

### 附件

[自动上传微信小程序体验版脚本](../../../../assets/assets_28_1.js)
