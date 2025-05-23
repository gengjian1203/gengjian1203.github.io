---
title: 16.关于setState、setData后数值不及时更新的问题
date: 2020-11-22 08:34:49
tags:
  - Vue
  - React
---

### 问题背景

在开始写 setState 的时候，  
都会有这个疑问。  
为什么我已经对 state 的数值赋值了，  
可是我接下来去用这个值的时候，却不是刚刚赋值过的数据。  
其实原因很简单。

> Because, setState is asynchronously.

<!-- more -->

### 为什么要异步赋值

那么为什么要把赋值功能设置成异步，  
做成同步难道不香么？  
如果做成了同步的功能，  
我们的每次 set 操作，  
就去触发一次页面的渲染也是一件很可怕的事情。  
更多时候我们只是要一个结果，  
而不是把每次数据变化精准的展示给用户。  
而异步赋值的好处就是可以整合我们的操作。  
这样在主线程之内无论我们一个数组 push 多少次，  
那么实际上只是会渲染一次。

### 关于 nexttick

所谓 nexttick 就是当 DOM 渲染结束之后的一个回调函数。  
我们可以在 nexttick 的回调函数中获得最新的数值。

要知道我们所有同步任务都是在主线程上执行的。  
所有异步任务有了运行结果就会在任务队列中放置一个事件。  
直到主线程的任务结束完毕，  
就会去查看任务队列，将已完成的异步事件处理完毕。

而 nexttick 就是一个这样的异步任务。  
在主线程的任务完成后，  
就会开始执行更新渲染 DOM。  
直到 DOM 渲染完毕，  
这样 nexttick 就获取到了改变后的 DOM。

### 后记

之所以异步赋值也是为了优化性能，尽量减少 DOM 操作而考虑的。
