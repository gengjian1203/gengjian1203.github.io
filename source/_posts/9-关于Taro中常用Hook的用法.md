---
title: 9.关于Taro中常用Hook的用法
date: 2020-07-09 00:15:36
tags:
  - 微信小程序
  - Taro
  - React
  - Hook
---

### 关于 Hook

Hook 这个特性，是 React16.8 中新增的，  
随着小程序框架 Taro 对 React 的支持，  
让 Taro 也能开始使用，  
甚至在 Taro3.0.0 开始，在底层 api 做了代理，  
让 Hook 方法直接可以从 React 包中引用。  
值得注意的是，  
Hook 的方法，只能在函数组件的主体内部调用。

<!-- more -->

### React 系的 Hook

#### useState

由于函数式组件每次渲染都会执行一次函数，  
那么函数内的变量是无法被保存住的。  
所以如果想要将数据保存住的话，  
需要使用这个 Hook，来将数据存储起来。

```tsx
const [nCount, setCount] = useState<number>(0);
// 使用nCount
console.log("nCount", nCount);
// 更新Count
setCount(nCount++);
```

#### useEffect

这个 Hook 可谓是最常用的方法，  
同时也是一个很危险的 Hook，  
因为他可以模拟出来 3 种以类方式 React 的声明周期。

- 可以模拟刚加载页面或者组件的声明周期 **componentsDidMount**
- 可以模拟销毁页面或者组件的声明周期 **componentsWillUnmount**
- 如果有依赖项 **deps** 的时候，那么就会监听 **deps** 中的数据，一旦数据有变化，则也会执行一次函数。

```tsx
useEffect(() => {
  // componentsDidMount
  // componentsDidUpdate
  return () => {
    // componentsWillUnmount
  };
}, [deps]);
```

值得注意的是，  
正因为会检测数值变化，就会执行一次函数，  
所以如果在函数内又修改了该数值，  
就会很容易产生死循环，  
所以要谨慎的对书写函数内的逻辑。

那么，你也应该发现了，  
这个函数也是一个闭包，内部的数据存在于独立的存储空间，  
内部的数据永远都只会是第一次创建时候的数据。  
如果需要跟外接数据同步，就需要将想同步的变量加入依赖 **deps** 中，  
这样变量发生变化一次之后，内部闭包函数重新调用一次以更新数据。

#### useMemo

#### useCallBack

#### useRef

将数据绑定到页面节点之上，
该数据的范围提升到一个页面级的纬度。
同时也可以帮助父组件拿到子组件属性。

#### useContext

父组件的数据传递给子组件。  
先要 createContext,  
通过 Provider 标签传递 value，  
在子组件里 useContext 拿到传递下来的 value。

---

### Taro 系（小程序专用）的 Hook

这些 Hook 对开发过小程序的小伙伴应该是非常友好的了。

#### useDidShow

页面再度激活，  
返回或者切回前台的生命周期，  
等同于 **onShow(componentDidShow)**

#### useDidHide

切到后台，页面隐藏的生命周期，  
等同于 **onHide(componentDidHide)**

#### usePullDownRefresh

下拉刷新的生命周期，  
等同于 **onPullDownRefresh**

#### useReachBottom

页面拉到底部的生命周期，  
等同于 **onReachBottom**

#### usePageScroll

页面发生滚动的生命周期，  
等同于 **onPageScroll**

#### useResize

页面尺寸发生变化的生命周期，  
等同于 **onResize**

#### useShareAppMessage

分享的生命周期，
等同于 **onShareAppMessage**

#### useRouter

获取路由信息。
等同于 **getCurrentInstance().router**

#### useReady

页面节点加载完毕的生命周期，  
等同于 **onReady**

### 自定义 Hook

#### useXXXX

### 后记

其实，我自身对 Hook 的语法也是刚刚接触，  
可能有些理解不是很深刻，也比较懵懂。  
那么随着自身对这些 Hook 的理解，  
我也会对这篇文章的内容不断更新。
