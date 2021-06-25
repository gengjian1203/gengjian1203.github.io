---
title: 24.Taro多端开发之RN踩坑记录（IOS）
date: 2021-06-21 15:51:36
tags:
  - Taro
  - RN
  - IOS
---

### 折腾背景

前几天偶尔听到隔壁组的人在 call，
“balabala...对，做过 RN 就行，会不会 Taro 无所谓，就缺个会 RN 的...，balabala ...”
心中萌生了去研究一波 RN 的想法。
作为一个程序猿，还是应该对技术时刻准备奔赴山海，保持热爱的。
Taro 这么一个可以实现跨端的框架，结果我却天天只去用来写微信小程序，实在是有些可惜。
正好最近有精力去折腾一波。脱离自己的舒适区，看看外面的世界。
（话说，这个环境配的真的好难，太糟心了）

<!-- more -->

### 踩坑步骤

1. 新建工程。
   由于经常用模板搭建，很多坑都忘了。保证 taro 库版本一致，否则就会很多奇葩问题摸不到头脑。

```
taro init classesMini
cd classesMini
taro update project
yarn add @tarojs/cli@2.0.7
yarn install
```

2. 优化配置，方便多平台开发

```
./classesMini/config/index.js
outputRoot: 'dist'
替换为
outputRoot: `dist/${process.env.TARO_ENV}`,
```

3. RN 端的编译命令

```bash
npm run dev:rn
```

如果成功，则会命令行下方出现描述

```bash
✅  编译成功，
请按 React Native 端开发流程 https://taro-docs.jd.com/taro/docs/react-native.html 进行查看
监听文件修改中...
启动 Metro Server 成功！监听目录：/Users/gengjian/Documents/github/classesMini。
```

4. 如果没有正常启动 Metro Server，可以手动新开终端去启动。如果启动 Metro Server 成功则跳过此步骤。

```bash
react-native start --port 8082
```

5. 访问本地触发对应终端平台的 js bundle 构建。

```bash
https://127.0.0.1:8081/
https://127.0.0.1:8081/rn_temp/index.bundle?platform=ios&dev=true
```

如果成功，则会在 Metro Server 终端下会新增一段描述

```
::ffff:127.0.0.1 - - [25/Jun/2021:09:31:39 +0000] "GET /favicon.ico HTTP/1.1" 404 150 "http://127.0.0.1:8081/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
```

6. taro-native-shell RN 壳子项目 clone 下来。与 Taro 项目分开独立存放，否则会混淆报错。

   https://github.com/NervJS/taro-native-shell
   不过要注意 Taro1/2/3 版本的情况，分别对应不同的分支。

```bash
git clone https://github.com/NervJS/taro-native-shell.git
cd taro-native-shell
yarn install
```

7. IOS 安装依赖
   如果没有安装 CocoaPods，如果安装失败，可参考 Q&A 第 2 条。

```
taro-native-shell git:(0.59.9) ✗ cd ios
ios git:(0.59.9) ✗ sudo gem install cocoapods
ios git:(0.59.9) ✗ pod install
```

如果出现以下提示，则为安装成功

```
Pod installation complete! There are 40 dependencies from the Podfile and 28 total pods installed.
```

8. 编译代码
   编译成功之后，模拟器红屏，可参考 Q&A 第 5 条。

```
ios git:(0.59.9) ✗ cd ..
taro-native-shell git:(0.59.9) ✗ react-native run-ios
```

### Q&A

1. [!] No `Podfile' found in the project directory.
   确认路径，是否为 ios 目录下。

2. M1 芯片（Apple Silicon）的 Mac 上完全安装 cocoapods
   https://stackoverflow.com/questions/64901180/running-cocoapods-on-apple-silicon-m1/65334677#65334677

```
sudo arch -x86_64 gem install ffi
arch -x86_64 pod install
```

3. 解决 React-Native mac 运行报错 error Failed to build iOS project. We ran "xcodebuild" command but it exited with error code 65. To debug build logs further, consider building your app with Xcode.app, by opening reactNative.xcodeproj
   https://www.cnblogs.com/stevexu/archive/2019/04/21/10745769.html

```
error Failed to build iOS project. We ran "xcodebuild" command but it exited with error code 65. To debug build logs further, consider building your app with Xcode.app, by opening reactNative.xcodeproj
taro-native-shell git:(0.59.9) ✗ rm -rf node_modules && yarn cache clean
taro-native-shell git:(0.59.9) ✗ yarn install
taro-native-shell git:(0.59.9) ✗ rm -rf ~/.rncache
taro-native-shell git:(0.59.9) ✗ node_modules/react-native/scripts/ios-install-third-party.sh
~ pwd
/Users/gengjian
~ mv ../*.gz ./
```

4. react-native 在新版 Xcode（10+）中运行出现的问题： node_modules/react-native/third-party/glog-0.3.4 , C compiler ca
   https://blog.csdn.net/qq_15057213/article/details/83859251

```
taro-native-shell git:(0.59.9) ✗ cd node_modules/react-native/third-party/glog-0.3.5/
glog-0.3.5 git:(0.59.9) ✗ sh ../../scripts/ios-configure-glog.sh
```

5. react-native run-ios 编译成功之后，模拟器红屏，显示 Application taroDemo has not been registered.
   设置项目名称不一致。
   在 AppDelegate.m 和 index.ios.js 中不一致。
   ./taro-native-shell/ios/taroDemo/AppDelegate.m 文件中：moduleName:@"classesMini"，
   ./classesMini/rn_temp/app.json 文件中： { "name": "classesMini" }
   名称保持一致。
