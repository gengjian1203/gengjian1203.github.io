---
title: 15.flex布局下文字超出宽度后省略号不起作用解决方法
date: 2020-08-21 08:34:09
tags:
  - 微信小程序
  - CSS
---

### 需求情况

在项目开发过程中，  
曾经遇到过这样一个样式需求。  
在一行中，分为三个部分。  
左右部分固定宽度，  
中间部分适配机型宽度，  
如果中间的文字超出宽度则以省略号显示。

当时没有觉得很复杂，  
结果在实现的时候，兜兜转转踩了好多坑，  
其实这个应该算是比较常见的样式吧，  
决定把他记录下来，防止以后忘记。

<!-- more -->

### 关于省略号

其实，文本超出范围以省略号显示，这个样式还是很常见的。  
一行文本超出宽度以省略号显示。

```less
.text-ellipsis {
  display: block;
  width: 100%; /* 固定宽度 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出部分文本以省略号显示 */
  white-space: nowrap; /* 文本禁止换行 */
}
```

多行文本超出宽度以省略号显示。（只能适配 webkit 浏览器和移动端）

```less
.textarea-ellipsis {
  display: -webkit-box; /* 对象作为弹性伸缩盒子模型显示 */
  width: 100%;
  overflow: hidden;
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  -webkit-line-clamp: 3; /* 展示行数 */
  /* 如果多行文本内有可能存在长单词英文，那么需要对长单词英文进行打断 */
  word-wrap: break-word; /* 是否允许在单词内进行断句 */
  word-break: break-all; /* 可以在任何位置断句 */
  /* 让多行文字两端对齐 */
  text-align: justify; /* 多行文本样式最好加上：文本两端对齐 */
}
```

在刚刚上述的需求里面。
通过 flex 布局，左右宽度固定，中间宽度自适应。
那么在中间的模块里面，  
直接使用 text-ellipsis 的样式是不生效的。

### 解决方法

```tsx
<View className="wrap">
  <View className="module-left"></View>
  <View className="module-mid">
    <View className="mid-text">abcabcabcabcabcabcabcabcabc</View>
  </View>
  <View className="module-right"></View>
</View>
```

```less
.wrap {
  width: 100%;
  display: flex;
  flex-direction: row;

  .module-left {
    height: 100%;
    flex: 0 0 120px;
  }
  .mid-text {
    flex: 1 1 auto;
    width: 0; /* 此处的宽度为关键 */
    height: 100%;

    .text-ellipsis {
      display: block;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .module-right {
    height: 100%;
    flex: 0 0 120px;
  }
}
```

### 后记

其实这个问题之前遇到过一次，  
当时为了解决线上问题，  
就那么默默的划过去了。

不过前几天正巧又遇到了这个样式的需求，  
只记得当初是这么做过，  
不记得具体怎么实现的了。  
结果又是重复的踩了一轮坑。

吸取教训，及时复盘，  
将这个 CSS 样式整理出来，引以为戒。
