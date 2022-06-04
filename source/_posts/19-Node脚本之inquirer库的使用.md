---
title: 19.Node脚本之inquirer库的使用
date: 2020-12-19 21:26:12
tags:
  - Node脚本
---

### inquirer 库是什么

这是一个可以实现用户与命令行交互的工具。  
他封装了`一问一答`式更友好的输入、单选、多选的交互，  
比如常见的 npm init、 Vue-cli 等脚手架工具都可以通过他来实现。  
像是我在`18.浅尝VSCode插件开发(Code Maker)`一文中，提到的`自动化生成 VSCode 插件命令的 CLI 工具`也就是用他来实现的。

<!-- more -->

### 如何使用

创建一个`index.js`搭建好脚本基本框架

```js
const inquirer = require("inquirer");

// 具体交互内容
const promptList = [
  {
    type: "input", // input - 输入文本, confirm - (Y/N), list - 列表单选, rawlist - 输入数字单选列表, expand - key值快速选择列表, checkbox - 多选, password - 密文, editor - 编译器长文本
    message: "请输入11位数字:", // 提示文本
    name: "number", // 变量命名
    default: "默认文本", // 默认值
    when: (answers) => {
      // 可通过answers获取刚刚回答的答案
      // 返回值为true的时候才会提问当前问题
      return true;
    },
    validate: (val) => {
      // 校验规则字段
      if (val.match(/\d{11}/g)) {
        return val;
      }
      return "请输入11位数字";
    },
    filter: (val) => {
      // 使用filter将答案字符串进行处理
      return "tel:" + val;
    },
    prefix: "前缀",
    suffix: "后缀",
    // choices: [] // list 、rawlist、expand、checkbox会用到
    // pageSize: 2, //修改某些type类型下的渲染行数；
  },
];

inquirer.prompt(promptList).then((answers) => {
  console.log(answers); // 返回刚刚输入的结果
});
```

接下来只需要拓展 promptList 的元素即可实现自己想要的功能。
如果功能逻辑过于复杂的话，建议还是将功能实现通过文件拆分开来。

### 运行脚本

```bash
node ./index.js
```

即可看到刚刚自己所设计的交互了。

### 后记

其实，搭建 inquirer 以及使用还是很简单的。  
真正复杂的部分应该是在得到刚刚交互结果之后，  
所需要操作的功能实现。

参考资料：

- [1. inquirer.js —— 一个用户与命令行交互的工具](https://blog.csdn.net/qq_26733915/article/details/80461257)
- [2. inquirer - npm](https://www.npmjs.com/package/inquirer)
