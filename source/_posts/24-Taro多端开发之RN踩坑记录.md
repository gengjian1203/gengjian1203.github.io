---
title: 24.Taro多端开发之RN踩坑记录
date: 2021-06-21 15:51:36
tags:
  - Taro
  - RN
  - IOS
---

### 折腾背景

前几天偶尔跟虎爷聊天，
“...App 才显得高端，小程序看起来就 low...”
于是乎心中萌生了去研究一波 RN 的想法。
作为一个程序猿，还是应该对技术时刻准备奔赴山海，保持热爱的。
Taro 这么一个可以实现跨端的框架，结果我却天天只去用来写微信小程序，实在是有些可惜。
不过，配置这个恶心的环境真的是太痛苦了，用了 2 天的时间疯狂踩坑。
把遇到的问题整理一波。

<!-- more -->

### 准备工作

```
➜ ~ nvm -v
0.38.0

➜ ~ node -v
v14.17.0

➜ ~ npm -v
6.14.13

➜ ~ yarn -v
1.22.17

➜ ~ taro -v
👽 Taro v3.3.13

➜ ~ pod --version
1.11.2

# 提前安装好 cocoapods
➜ ~ brew install cocoapods
# 或者使用gem
➜ ~ sudo gem
# M1芯片需要再执行下条语句
➜ ~ sudo arch -x86_64 gem install ffi

# 提前安装XCode并更新至最新版本，并手动先启动一次XCode，同意相关条款
# 如果最新版本XCode依赖最新系统，则更新MacOS至最新系统
➜ ~ sudo xcode-select --switch /Applications/Xcode.app
```

### 踩坑步骤

1. 新建工程。
   Taro 3.3.3 版本起支持了模板集成 RN 的模式，不用采取业务代码一套项目，RN 外壳一套项目了，还是比较有爱。
   Taro 3.3.13 版本又支持了 Github Action 的 CI，每次 master 分支有改动，或者打 v 开头的 tag 就会触发打包集成，还是蛮舒适的。

```
# 创建Taro项目
taro init SmartApp
...
选择 react-native 模板
...
```

2. 项目安装

在`yarn upgradePeerdeps`这一步就卡了很久。  
本质上就是会在 ios 目录下，执行了`pod install`。  
不过多方面原因，  
有的是没有安装 XCode 情况，会在安装 glog 时候报错；此时安装 XCode，并手动先启动一次 XCode 同意相关条款即可。  
有的是单纯 github 网络问题，提示连接超时，克隆失败；这个就只能多试几次，要么更改网络环境配置，具体下面的参考文档。
如果出现以下字样即为安装成功。
`Pod installation complete! There are 40 dependencies from the Podfile and 28 total pods installed.`

在`yarn ios`阶段就是本地打个包，然后启动 XCode 的模拟器。
报错 Command PhaseScriptExecution failed with a nonzero exit code. 这个是设备的版本太新，采用老版本模拟器就好，具体下面的参考文档。

```
cd SmartApp

# 更新相关依赖。在初始化完成后或 Taro 版本更新后执行，用于同步 peerDependencies。
#
$ yarn upgradePeerdeps

# 打包 js bundle 及静态资源。在初始化完成后执行，用于打包默认使用的 bundle。platform 可选 ios, android
$ yarn build:rn --platform ios

# 启动 bundle server
$ yarn start

# 启动 iOS
$ yarn ios

# 启动安卓
$ yarn android
```

3. Taro 新增的 Taro Playground APP 进行调试

开发者仅需要正常运行 JS 工程，通过这个 APP,  
扫`yarn start`阶段出现二维码即可进行调试。

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

### 打包

### Q&A

1. [!] No `Podfile' found in the project directory.
   确认路径，是否为 ios 目录下。

2. M1 芯片（Apple Silicon）的 Mac 上完全安装 cocoapods
   https://stackoverflow.com/questions/64901180/running-cocoapods-on-apple-silicon-m1/65334677#65334677

```
sudo arch -x86_64 gem install ffi
arch -x86_64 pod install
```

3. 如果执行 pod install 报错

可能是因为没有勾选使用 Rosetta 打开
(应用程序-实用工具-终端-显示简介-勾选“Rosetta”)就执行

4. 解决 React-Native mac 运行报错 error Failed to build iOS project. We ran "xcodebuild" command but it exited with error code 65. To debug build logs further, consider building your app with Xcode.app, by opening reactNative.xcodeproj
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

5. N/A: version "default -> N/A" is not yet installed.

You need to run "nvm install default" to install it before using it.
Command PhaseScriptExecution failed with a nonzero exit code

指定默认版本即可解决
➜ nvm alias default 14.17.0

6. react-native 在新版 Xcode（10+）中运行出现的问题： node_modules/react-native/third-party/glog-0.3.4 , C compiler ca

https://blog.csdn.net/qq_15057213/article/details/83859251

```
taro-native-shell git:(0.59.9) ✗ cd node_modules/react-native/third-party/glog-0.3.5/
glog-0.3.5 git:(0.59.9) ✗ sh ../../scripts/ios-configure-glog.sh
```

7. react-native run-ios 编译成功之后，模拟器红屏，显示 Application taroDemo has not been registered.（正常情况应该不用特殊处理）

设置项目名称不一致。
在 AppDelegate.m 和 index.ios.js 中不一致。
./taro-native-shell/ios/taroDemo/AppDelegate.m 文件中：moduleName:@"classesMini"，
./classesMini/rn_temp/app.json 文件中： { "name": "classesMini" }
名称保持一致。

8. 当集成模式的 Taro 项目，真机调试命令行报错，打包却能跑通完成。

即，执行`yarn ios`调试模式状态如下报错

```
The following build commands failed:
CompileC /Users/gengjian/Library/Developer/Xcode/DerivedData/taroDemo-djzgdiaepvktgegyrmjouhzoeriw/Build/Intermediates.noindex/taroDemo.build/Debug-iphonesimulator/taroDemo.build/Objects-normal/x86_64/AppDelegate.o /Users/gengjian/Documents/github/SmartApp/ios/taroDemo/AppDelegate.m normal x86_64 objective-c com.apple.compilers.llvm.clang.1_0.compiler
```

不过`yarn build:rn --platform ios`打包却没有问题。

感觉跟 M1 芯片的坑有关系，最后解决方法直接修改报错文件的语句。
打开 XCode 找到报错文件`./ios/taroDemo/AppDelegate.m`，  
报错语句为一个宏判断，如果是 DEBUG 模式执行另外的语句，  
直接简单粗暴了一波，修改如下：

```m
#if DEBUG
//  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:@"main"];
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
```

### 参考文档

1. [Mac M1 处理器 无法安装 cocoapods 的解决办法](https://blog.csdn.net/weixin_42362496/article/details/109986611)
2. [项目第一次 pod install 时 glog 报错](https://blog.csdn.net/qq_38735649/article/details/107954287)
3. [CocoaPods 的简单快速安装方法](https://www.cnblogs.com/gchlcc/p/6068801.html)
4. [推荐几个 cocoapods 镜像源](https://www.jianshu.com/p/7812bc768844)
5. [Mac 安装 CocoaPods 详解](https://www.jianshu.com/p/93c4cd8390d3)
6. [解决首次 CocoaPods 拉取 repos 过慢问题](https://www.jianshu.com/p/c8116c167ce5)
7. [【笔记】Mac M1 搭建 React Native 环境](https://zhuanlan.zhihu.com/p/356820165)
8. [Command PhaseScriptExecution failed with a nonzero exit code 问题](https://blog.csdn.net/ios_xumin/article/details/106888970)
9. [Flutter 爬坑记录](https://www.cnblogs.com/shaoting/p/10235652.html)
10. [RN 项目的坑 （M1 Mac）](https://blog.csdn.net/henryzyk/article/details/118029141)
11. [iOS 申请证书，Certificates, Identifiers &Profiles 简介](http://t.zoukankan.com/lisa090818-p-4134376.html)
12. [苹果企业开发者账号，P12 证书如何生成？](http://news.sohu.com/a/573939453_120174355)
13. [上架 App Store](https://www.react-native.cn/docs/publishing-to-app-store)
14. [打包发布 Android](https://www.react-native.cn/docs/signed-apk-android)
