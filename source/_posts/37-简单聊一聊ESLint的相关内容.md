---
title: 37.简单聊一聊ESLint的相关内容
date: 2022-09-09 08:21:52
tags:
  - 代码规范
---

### 讲个笑话

最近开发自己的项目的时候，感觉自己如有神助，  
写出来的代码，编译器竟然一个报错有没有。  
正暗自感慨自身的技术，竟在不知不觉之中已然出神入化，  
瞥了一眼，发现编译器的 ESLint 正在疯狂的报错。😒😒😒

<!-- more -->

### .eslintrc 参考配置

```json
{
  "extends": ["taro/react"],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
      "tsx": true
    },
    "useJSXTextNode": true,
    "useTSXTextNode": true
  },
  "rules": {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "no-const-assign": 2, // 禁止修改const声明的变量
    "no-fallthrough": 1, // 禁止switch穿透
    "no-func-assign": 2, // 禁止重复的函数声明
    "no-multiple-empty-lines": [1, { "max": 2 }], // 空行最多不能超过2行
    "no-param-reassign": 2, // 禁止给参数重新赋值
    "no-mixed-spaces-and-tabs": [2, false], // 禁止混用tab和空格
    "no-sequences": 0, //禁止使用逗号运算符
    "no-unneeded-ternary": 2, // 禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
    "no-unused-vars": [1, { "vars": "all", "args": "after-used" }], // 不能有声明后未被使用的变量或参数
    "no-var": 0, // 禁用var，用let和const代替
    "arrow-parens": 0, // 箭头函数用小括号括起来
    "arrow-spacing": 0, // =>的前/后括号
    "curly": [2, "all"], // 必须使用 if(){} 中的{}
    "default-case": 2, // switch语句最后必须有default
    "eqeqeq": 2, // 必须使用全等
    "init-declarations": 0, // 声明时必须赋初值
    "import/order": 1, // import顺序有误
    "import/no-commonjs": 0, // 忽略require使用告警
    "import/no-named-as-default": 0 // 忽略默认导出方法的名称
  }
}
```

### .prettierrc 参考配置

```json
{
  "jsxSingleQuote": true,
  "printWidth": 150,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": false,
  "trailingComma": "none",
  "jsxBracketSameLine": false,
  "arrowParens": "always",
  "quoteProps": "preserve"
}
```

### 参考资料

- [1. ESLint 简介](https://blog.csdn.net/chengqiuming/article/details/109958407)
- [2. vscode 中关于 eslint 的各种报黄线错误](https://blog.csdn.net/resolverr/article/details/109495981)

😈 没错，我水了一贴
