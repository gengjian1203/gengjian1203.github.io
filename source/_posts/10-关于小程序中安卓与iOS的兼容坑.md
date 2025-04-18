---
title: 10.关于小程序中安卓与iOS的兼容适配坑
date: 2020-07-10 20:09:51
tags:
  - 微信小程序
  - 机型兼容适配
---

### 小程序兼容适配

机型适配，安卓与 iOS 系统的兼容，  
是做前端永恒不变的话题。  
现在随着终端设备的五花八门，
系统繁杂，尺寸比各式各样，  
导致前端的适配工作就是一个永远也填不完的神坑。  
随即新建了这个文章，  
用来记录一下自己踩过的兼容适配坑。

<!-- more -->

### 遇到的坑

#### 小程序中右滑返回

可能由于随着手机屏幕过大，  
在返回交互上，手指够不到左上角的返回键，  
新增了右滑返回的交互。  
设计的初衷是好的，不过坑惨了前端开发人员。  
[“右滑手势返回”能力调整](https://developers.weixin.qq.com/community/develop/doc/000868190489286620a8b27f156c01?highLine=disableSwipeBack)  
微信 7.0.5 客户端版本之后，页面配置中的 **disableSwipeBack** 属性将不再生效。  
同时也没有 api 能获取到右划返回的回调。

目前能够想到的办法：

- 通过产品交互来回避这个返回坑。
- 通过检测点击屏幕左边边缘，向右滑动这个动作来捕捉这个事件。（但是无法阻止返回上一页面的交互）

#### Textarea 标签

关于输入表单，多行文本一般会使用 Textarea 组件。  
这个时候在样式上，就有文本对齐的坑。  
安卓机型：没有默认内边距，可以正常显示。  
iOS 机型：会有默认的 padding 偏移，且无法置 0。  
虽然在微信小程序官方文档中提到了，  
基础库版本 2.10.0 以上，
新增 disable-default-padding 属性可以去掉 iOS 下的默认内边距。  
不过实测之后，发现并没有用。

像是 vant 这样的 ui 组件库，
对 Textarea 封装的 Field 组件，
在源码上是对 ios 机型上增加 margin-top: -9rpx;样式
只能说是尽量抹除机型的差距。

#### 长机型的底部安全距离预留

类似 iphoneX 长机型将样式填满屏幕的时候会有：

- 底部圆边被裁掉样式
- 底部黑色长条遮挡样式
- 误触发 Home Indicator 事件

这个时候就需要给底部留出安全的距离。  
可以使用该样式来处理。

```css
.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
  padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
}
```

因为这个变量是 iOS 系统内核提供的，  
安卓和开发者工具上用的 chromium 内核没有这个变量，  
导致这个样式只支持 iOS 系统，对安卓系统还需要单独处理。

后补js判断逻辑：
```js
// 计算安全区域信息
const calcSafeAreaInfo = (env, isScreenFringe, systemInfo) => {
  const { safeArea = {}, windowHeight = 0, statusBarHeight = 0 } = systemInfo || {}
  const { top = 0, left = 0, right = 0, bottom = 0, width = 0, height = 0 } = safeArea || {}
  let safeAreaInfoTmp = {}

  switch (env) {
    case "WEB": {
      safeAreaInfoTmp.safeTop = 0
      safeAreaInfoTmp.safeBottom = 0
      break
    }
    case "RN": {
      safeAreaInfoTmp.safeTop = isScreenFringe ? 44 : 22
      safeAreaInfoTmp.safeBottom = 0
      break
    }
    default: {
      const safeTopTmp = Math.max(top, statusBarHeight)
      const safeBottomTmp = windowHeight - bottom

      safeAreaInfoTmp.safeTop = safeTopTmp
      safeAreaInfoTmp.safeBottom = safeBottomTmp
      break
    }
  }

  return safeAreaInfoTmp
}
```


#### replaceAll 方法个别机型报错

android 8.0.1 的 vivo 手机，android 系统内微信版本 7.0.22 里面直接报错。  
建议改为通过正则实现替换。

#### 渐变色为透明场景iOS真机情况不满足预期

当有需求要做到一个渐变效果，上方填充红色，下方填充透明颜色，实现渐变效果。  
样式如下书写时，透明色在iOS真机情况下，透明色会被渲染成黑色
```less
background-image: linear-gradient(to bottom, red, transparent);
```

主要的原因应该是渐变样式对`transparent`属性的不兼容，改为`#fff0`或者`rgba(255, 255, 255, 0)`即可。  
正确的写法如下：  
```less
background-image: linear-gradient(to bottom, red, rgba(255, 255, 255, 0));
```
### 后记

未完待续，随时新坑。
