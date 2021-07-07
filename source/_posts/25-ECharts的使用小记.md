---
title: 25.ECharts的使用小记
date: 2021-07-07 07:51:12
tags:
  - ECharts
---

### 折腾背景

最近项目疯狂折腾报表，很多图表纯使用 CSS 实现是不现实的，  
专业的事情还是得交给专业的库去实现。  
趁此机会在 ECharts 里面疯狂搪坑。

<!-- more -->

### 使用方法

ECharts 生成对象、初始化等操作没什么太过特殊的地方。  
主要核心是`setOptions()`这个核心方法。

我们通过 set 不同的 options 来实现对不同图表样式的调整。
一般来说我们在 options 的第一层级里面主要设置一下几个属性字段。

1. title
   标题组件，包含主标题和副标题。

2. grid
   直角坐标系内绘图网格。

3. xAxis
   直角坐标系 grid 中的 x 轴。

4. yAxis
   直角坐标系 grid 中的 y 轴。

5. tooltip
   提示框组件。

6. geo
   地理坐标系组件。

7. series
   核心字段，我们的数据信息，数据展示形态，都会存放在这里。

### 踩坑

1. 层级复杂的 options 对象  
   由于我们大部分操作都是为了拼凑这个大 options 对象。  
   导致有时候设置一个属性字段，无论怎么设置都不生效，最后发现是搞错了层级。  
   另外，不同层级同名的属性字段也非常多，在设置 options 属性字段的时候要格外认真比对。

2. 注意效果的支持版本号
   如果是一些老旧项目，可能引用 ECharts 库的版本不够高，  
   导致即使是参照文档按照标准设置某个属性字段，依旧不会生效。  
   所以也要注意属性支持的最低版本。  
   如：  
   `series-bar.selectedMode` 属性从`v5.0.0`开始支持。  
   `series-bar. showBackground`属性从`v4.7.0`开始支持。

3. 更换 ECharts 库的版本，报错 "fp is not a function"  
   坑在官方定制 ECharts 库的网站的“代码压缩”选项有毒，不要勾选。  
   如果下载下来的包过大，可以自己手动通过其他网站[https://tool.lu/js/](https://tool.lu/js/)进行混淆压缩。  
   即可正常使用。

### 参考资料

1. [官方 options 文档](https://echarts.apache.org/zh/option.html)
2. [官方示例](https://echarts.apache.org/examples/zh/index.html)
3. [定制 ECharts 库](https://echarts.apache.org/zh/builder.html)
4. [echarts 多个地区合并并实现标注](https://blog.csdn.net/liuy_1314/article/details/108866987)
5. [echarts 合并地图，把中国各个省份分成大区](https://blog.csdn.net/weixin_33743661/article/details/93469931)
6. [echarts 示例](https://www.makeapie.com/explore.html)
