---
title: 6.记录修改Redux后没有触发渲染的问题
date: 2020-06-30 23:44:00
tags:
  - 微信小程序
  - Taro
  - Redux
  - Hook
---

### 问题起因
由于刚开始熟悉Taro + Redux + Hook的技术栈，  
开发过程中有时候用的还很蹩脚，  
出现了很多问题，也踩了许多坑。  
今天就遇到这么个问题，  
页面是根据Redux中的数据来渲染的，  
可是明明已经修改了Redux的数据，  
而且redux-logger也打印出来日志了，  
页面却没有重新刷新渲染。  
  
<!-- more -->

### 定位问题
由于技术栈的不熟悉，想过了很多可能性，  
比如：需要主动触发刷新函数、Hook的底层实现不一样等等……  
疯狂的确认constants、reducers、actions这一流程的书写方式。  
也尝试调用其他可以实现渲染有效的actions来找异同点。
最终还是通过日志发现了一些端倪。  
  
**不渲染的日志**  
本意是将两个数组长度从5,2 改变成4,3。  
``` javascript
action POP_MODULE_SETTING_INFO
prev state
ModuleSettingInfo: {
  ...
  arrShowModuleInfo: Array(4), 
  arrHideModuleInfo: Array(3),
  ...
}

action
type: "POP_MODULE_SETTING_INFO"
...

next state
ModuleSettingInfo: {
  ...
  arrShowModuleInfo: Array(4), 
  arrHideModuleInfo: Array(3),
  ...
}
```
可是日志记录的是从4,3 改变成4,3。  
那么是不是因为数据没有变化，所以没有触发渲染。  
可是数据又是什么时候被改成4,3了呢？  
  
### 解决方法
代码此处的逻辑是，  
通过Hook的useSelector，  
来获取到Redux中的ModuleSettingInfo。  
对取到的ModuleSettingInfo直接修改后，  
使之作为参数再执行了action。  
  
简单的来说，我修改了两次。  
第一次是直接因为浅拷贝，引用到那块内存给修改了，  
第二次是使用Redux的action，通过正规操作又修改一次。  
也是因为这次action日志被打印出来了，  
不过因为第二次修改的时候，数值已经被修改过了，  
所以日志的prev state和next state数值是一样的。  
这样即使执行了action，因为数值没有变化，所以就没有触发页面的渲染。  

**错误的代码**  
``` javascript
// 找到移出项将其剔除
const arrItemTmp = arrShowModuleInfo.splice(nModuleItemIndex, 1); 
// 将移出项塞入隐藏列表数组
arrHideModuleInfo.unshift(arrItemTmp[0]);
// 结果存入redux并渲染
popModuleSettingInfo({
  arrShowModuleInfo,
  arrHideModuleInfo
});
```
  
**修改后的代码**  
``` javascript
// 将Redux取到的对象深拷贝
const arrShowModuleInfoTmp = JSON.parse(JSON.stringify(arrShowModuleInfo));
const arrHideModuleInfoTmp = JSON.parse(JSON.stringify(arrHideModuleInfo));
// 找到移出项将其剔除
const arrItemTmp = arrShowModuleInfoTmp.splice(nModuleItemIndex, 1); 
// 将移出项塞入隐藏列表数组
arrHideModuleInfoTmp.unshift(arrItemTmp[0]);
// 结果存入redux并渲染
popModuleSettingInfo({
  arrShowModuleInfo: arrShowModuleInfoTmp,
  arrHideModuleInfo: arrHideModuleInfoTmp
});
```
  
### 后记
这个问题，总得来说还是对Taro、Redux、Hook的一些东西不熟悉。  
这就让在定位问题的时候比较浪费时间，  
怀疑自身Hook的使用方法、怀疑Redux的写法、  
怀疑Hook底层实现、怀疑小程序的实现机制、  
怀疑Taro的版本更新不靠谱等等……  
结果，却是因为自身的Redux用法错误。  
  
好在最后终于找到问题，并且解决了。  
附上正确的日志做个纪念。  

**实现渲染的日志**  
``` javascript
action POP_MODULE_SETTING_INFO
prev state
ModuleSettingInfo: {
  ...
  arrShowModuleInfo: Array(5), 
  arrHideModuleInfo: Array(2),
  ...
}

action
type: "POP_MODULE_SETTING_INFO"
...

next state
ModuleSettingInfo: {
  ...
  arrShowModuleInfo: Array(4), 
  arrHideModuleInfo: Array(3),
  ...
}
```