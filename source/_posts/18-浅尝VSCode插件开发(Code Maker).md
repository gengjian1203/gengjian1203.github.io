---
title: 18.浅尝VSCode插件开发(Code Maker)
date: 2020-12-17 23:05:40
tags:
  - VSCode
categories:
  - projects
---

### 研究背景

工作中写前端的业务代码，说白了也就是写好“页面”和“组件”。（也可以说就是只有“组件”）  
而在项目结构上，每个组件就是一个文件或者文件夹。  
每次新写组件的时候，都需要新建文件，  
然后开始依次写好 import、template、style、data、methods、生命周期、render 等等……  
为了应对这样重复的工作，  
我甚至单独建立一套空的模板，每次都是复制一下改个名字，并窃喜于自己的机智。  
直到遇到了 VSCode 插件，才给我打开一扇新世界的大门。  
且 VSCode 插件给我带来的惊喜不仅仅于此。

<!-- more -->

### 需求痛点

1. 每次新建页面，新建组件都需要复制一套空模板，可以一键生成空页面、空组件。(可用命令实现)
2. 常用组件、常用 API 、可以通过简短命令自动实现引用。（可用代码片段实现）
3. 页面 import、template、style、data、methods、生命周期、render 有固定顺序。
4. 通过插件配置页面`settings.json`，可支持自定义开关支持框架（如：Vue、React、Wepy、Taro 等）。(可用配置自定义变量实现)
5. 发布 VSCode 插件市场，可供大家使用。

### 设计架构

项目结构如下所示（带\*文件为实现重要功能）：

```text
.
├── CHANGELOG.md // 版本更新日志
├── README.md // 插件说明
├── cli.js // 自动化生成 VSCode 插件命令的 CLI 工具
├── code-maker-1.0.7.vsix // VSCode 打包后文件，通过该文件可本地安装或发布线上插件
├── images
│   └── icon.png // 插件 icon
├── package-lock.json
├── package.json // 核心配置文件*
├── snippets // 代码片段*
│   └── mapx.json
├── src // 代码实现*
│   ├── command // 命令*
│   │   ├── index.ts // 命令索引
│   │   ├── taroqmCreateComponent.ts
│   │   ├── taroqmCreatePage.ts
│   │   ├── taroqmEditComponent.ts
│   │   └── taroqmEditPage.ts
│   ├── extension.ts // 程序入口*
│   ├── test
│   │   ├── runTest.ts
│   │   └── suite
│   └── utils // 公共方法
│       ├── copyFile.ts
│       ├── index.ts // 方法索引
│       └── openFile.ts
├── template // 模板文件*
│   ├── TaroQmComponent
│   │   ├── less.tmp
│   │   └── tsx.tmp
│   ├── TaroQmPage
│   │   ├── less.tmp
│   │   └── tsx.tmp
│   └── VSCodeCommand
│       └── ts.tmp
├── tsconfig.json
└── vsc-extension-quickstart.md
```

通过`package.json`文件配置字段：

1. activationEvents - 注册命令
2. contributes.snippets - 代码片段
3. contributes.commands - 命令名称
4. contributes.menus - 配置菜单
5. contributes.configuration - 配置自定义变量

根据`开闭原则`，为方便以后拓展命令：  
将每个命令单独建立文件，  
在插件入口文件 extension.ts 逻辑内，  
循环遍历由./src/command/index.ts 引用来的命令对象，进行命令注册。  
这样好处在于，  
再新增命令的时候，只需要新增加文件对其引用，而无需去修改注册逻辑。

### 实现方式

1. 每次新建页面，新建组件都需要复制一套空模板，可以一键生成空页面、空组件。(可用命令实现)

   首先，封装`拷贝文件`、`打开文件`的公共方法。  
   其次，通过`注册命令`、`修改命令名称`、`配置菜单`，生成一个命令文件。  
   然后，通过文档以及其他参考资料，找到`应用项目文件路径`和`模板文件路径`的字段。  
   最后，将模板文件复制过去，并将自动将模板名字改成所需的页面、组件名字。

2. 常用组件、常用 API 、可以通过简短命令自动实现引用。（可用代码片段实现）  
   通过`代码片段`、生成一个代码片段文件。  
   即可再对应语言的文件内使用。

3. 页面 import、template、style、data、methods、生命周期、render 有固定顺序。
   待实现。

4. 通过插件配置页面`settings.json`，可支持自定义开关支持框架（如：Vue、React、Wepy、Taro 等）。(可用配置自定义变量实现)  
   通过`配置自定义变量`，定义对应自定义变量。  
   在`package.json`文件内，可通过`when`字段对该字段进行使用。  
   在 js 文件内，可通过`vscode.workspace.getConfiguration('myExtension')`API 方法，取到对应自定义变量。

5. 发布 VSCode 插件市场，可供大家使用。
   全局安装`vsce`工具，并将 VSCode 插件打包成 vsix 文件。  
   另需要`Microsoft账号`、`Azure账号`。  
   在网页版[https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)，将打包好的插件发布出去。

### 后记

成熟的开发工作应该如同流水线一般。  
拥有完成的工具体系，而不是遇到需求都是一个人一个想法的自由发挥。  
无论遇到什么需求都能够有一套对应的技术方案去应对。

以前端常见的业务场景来说：  
比如：分页加载、分享溯源、详情页面加载、授权鉴权等等……  
这些业务场景都是有迹可循，都可以套用模板去实现。

参考资料：

- [1. Code Maker](https://github.com/gengjian1203/code-maker)
- [2. VSCode 插件英文文档](https://code.visualstudio.com/api/references/vscode-api#window)
- [3. VSCode 插件中文文档（残卷）](https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/api/README)
- [4. 小茗同学的博客园-VSCode 插件开发全攻略](https://www.cnblogs.com/liuxianan/p/vscode-plugin-overview.html)
- [5. 有赞美业前端团队-VS Code 插件开发介绍](https://segmentfault.com/a/1190000016641617)
- [6. VSCode 插件示例](https://github.com/microsoft/vscode-extension-samples)
