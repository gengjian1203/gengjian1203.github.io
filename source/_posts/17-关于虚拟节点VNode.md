---
title: 17.关于虚拟节点VNode
date: 2020-11-25 22:36:08
tags:
  - Vue
  - React
---

### 何为 VNode

在开发过程中，或许总会听到有人提到过虚拟节点，  
那么这个究竟是个什么东西？  
首先我们要有一个认知，  
那就是 js 的操作的执行速度是远远高于 DOM 的操作的。  
基于这个认知，为了提升页面的性能，  
我们宁可多执行一些 js 操作，也要减少对 DOM 的操作（重绘、回流）次数。  
所以需要用 js 以对象的形式来模拟 DOM 节点，
那么经过 js 的计算，只照着最后的结果去操作 DOM 渲染到页面即可。
而这个数据结构就是虚拟节点 VNode。

<!-- more -->

### VNode 的数据结构

正常的 html 标签一共可以分为三部分：

1. 标签名
2. 标签属性
3. 子元素标签

那么 VNode 同样可以用一个对象的结构模拟这样的结构：

1. tag
2. props
3. children

具体可以用这个例子来展示将这个 html 转换成 VNode：

```html
<ul class="list-wrap">
  <li class="list-item">AAA</li>
  <li class="list-item">BBB</li>
</ul>
```

```javascript
{
  tag: "ul",
  props: {
    className: "list-wrap",
  },
  children: [{
    tag: 'li',
    props: {
      className: 'list-item'
    },
    children: 'AAA'
  },{
    tag: 'li',
    props: {
      className: 'list-item'
    },
    children: 'BBB'
  }]
}
```

### VNode 的作用

那么我们将 html 转换成一个对象之后对我们的性能优化能起到什么帮助呢？

1. 数据驱动视图

不用自己手动操作 DOM。  
只要写好 VM 的代码逻辑，
即可通过响应式，来实现数据-视图的绑定。  
让我们将关注点更多的放在数据上，  
从而能够实现更复杂的开发业务。

2. 精准更新节点

可以通过 diff 算法，  
将有改变的节点进行处理（销毁、新建、更新），  
而不变的节点则可以不去处理。
比起手动粗暴的操作 DOM ，性能方面会更有优势。

3. 可以整理合并我们的操作

比如我们多次增加节点，  
如果每次增加一个节点都渲染一次页面做很多无用功，  
实际上我们想要的就是在多次增加节点后，  
把最后的一个结果在页面上渲染出来即可。

### 后记

VNode 拥有这么多优势，  
但是还是有几个问题需要我们去想通的。

1. 如何将 html 转换为 VNode，然后再将 VNode 转换为 html？
2. 当我们 useData 之后，Vue 是如何知道数值改变了呢？
3. 当页面需要重新渲染的时候，新旧节点是如何去对比的？（13 中有提到部分）
