---
title: 39.自己瞎捉摸之CSS动画实现
date: 2022-09-21 22:52:01
tags:
  - CSS
---

### 琢磨原因

自己也是做过一些项目，  
总感觉自己写出来的项目，  
跟日常我们使用的应用 App 相比较，  
总是有那么点说不清道不明的差距。  
抽象讲就是粗糙，可是往细了说也说不出来到底差了哪里。  
我琢磨了一段时间，感觉可能就是差在了动画上面。

<!-- more -->

### 常见动画

一个友好的动画反馈，可以让页面的元素不是那么突兀。
比如点击按钮，有一个微弱的放大后还原的动画过程，这样就比较有爱。  
这样就会给用户一个反馈，  
否则用户都无法感知，不知道是因为自己没有点到，还是因为页面卡住没有反应了，就会有焦虑的感觉。

比如需求需要弹出一个弹层，这个弹层如果从屏幕边缘出现或者屏幕中间从小到大缩放出现，  
肯定是要比突然闪现在屏幕上要更好一些，  
因为这样比较符合自然的规律，让用户有一个时间更容易接受这个弹层的交互。

比如说一个个性化的 loading，肯定要比早已经看腻了的转圈圈要有趣俏皮的多，  
这个有趣的 loading 也能让用户有新鲜感，分散一下他的注意力，缓解等待页面数据加载时候的焦虑。

### CSS 实现

目前 CSS 想要实现动画，通过两个属性是都可以实现的，  
具体选择哪一种就可以通过具体的需求来使用对应的属性。

我个人认为 `transition`适用于两个状态的相互切换，
只要设置好 transition 相关属性，然后设置好元素的`初始状态`和`结束状态`，即可实现动画的样式。

而`animation`更实用于对于动画的复杂变化，对于动画的可控制程度更高，  
比如一个动画周期的对应几个时间节点实现对应的样式，做好对应的`关键帧(keyframe)`，  
然后通过 animation 的相关属性去绑定这些关键帧，即可实现动画的样式。

粗糙的总结一下，  
如果简单的动画我会选择使用`transition`，  
如果需要复杂控制的动画我会选择使用`animation`

具体的动画的属性如下表所示：

1. transition

| 属性                       | 描述                              |                            可使用值(第一个为默认值)                            |
| :------------------------- | :-------------------------------- | :----------------------------------------------------------------------------: |
| transition-property        | 规定设置过渡效果的 CSS 属性的名称 |                            none \| all \| property                             |
| transition-duration        | 规定完成过渡效果需要多少秒或毫秒  |                                   0 \| time                                    |
| transition-timing-function | 规定速度效果的速度曲线            | linear \| ease \| ease-in \| ease-out \| ease-in-out \| cubic-bezier(n,n,n,n); |
| transition-delay           | 定义过渡效果何时开始              |                                   0 \| time                                    |

参考示例：
```css
.demoTransition {
  transition-property: all;
  transition-duration: 0.5s;
  transition-timing-function: linear;
  transition-delay: 0;
}
```

2. animation

| 属性                      | 描述                                   |                            可使用值(第一个为默认值)                            |
| :------------------------ | :------------------------------------- | :----------------------------------------------------------------------------: |
| animation-name            | 规定需要绑定到选择器的 keyframe 名称   |                              keyframename \| none                              |
| animation-duration        | 规定完成动画所花费的时间，以秒或毫秒计 |                                   0 \| time                                    |
| animation-timing-function | 规定动画的速度曲线                     | linear \| ease \| ease-in \| ease-out \| ease-in-out \| cubic-bezier(n,n,n,n); |
| animation-delay           | 规定在动画开始之前的延迟               |                                   0 \| time                                    |
| animation-iteration-count | 规定动画应该播放的次数                 |                               1 \| n \| infinite                               |
| animation-direction       | 规定是否应该轮流反向播放动画           |                              normal \| alternate                               |


参考示例：
```css
.demoAnimation {
  animation-name: press;
  animation-duration: 0.5s;
  animation-timing-function: ease;
  animation-delay: 0;
  animation-iteration-count: 1;
  animation-direction: normal;
}

@keyframes press {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
```

### 后记

可能平时开发过程中，  
产品和 UI 只是把东西的功能说清楚了，  
具体的交互细节就没有一个很标准的验收结果，  
再加上评估工时紧张，前端开发同学也是只能完成需求基本功能开发。  
（如果还有空自己给加动画实现，是不是说明了工作量不饱和 😈）
自然而然就会产生这种廉价粗糙之嫌。
再加上 CSS 动画的适配再各个端可能也会有坑，也可能会对性能有些影响，  
那么抱着多一事不如少一事的态度，就只能把需求的功能完成就是万事大吉了，  
再者说，万一加个动画说不定能加出来一大坨 bug，  
所以在产品不特意要求的情况下，也就自然不愿意给自己加戏了。

### 参考资料

- [1. CSS transition 属性](https://www.w3school.com.cn/cssref/pr_transition.asp)
- [2. CSS animation 属性](https://www.w3school.com.cn/cssref/pr_animation.asp)
