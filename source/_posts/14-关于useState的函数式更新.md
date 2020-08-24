---
title: 14.关于useState的函数式更新
date: 2020-08-21 08:33:09
tags:
  - 微信小程序
  - Taro
  - React
  - Hook
---

### 关于 useState

useState 可谓是在 Taro 的开发过程中最常用的一个 hook。  
由于函数式组件每次渲染都会执行一次函数，  
他的作用就是在函数内保存一个变量，并且这个变量能够保存的住。  
可以通过对应 setXXX 函数来对这个变量进行修改。  
那么如果变量是一个对象或者一个数组，  
我只想修改其中一个元素的时候，很容易因为闭包的情况误伤其他元素。  
这个时候我们可以用到 useState 函数式更新。

<!-- more -->

### 问题场景

比如我再页面中声明了这样一个变量。

```ts
interface IImageType {
  id: string;
  url: string;
  isUpload: boolean;
}

const [arrImageList, setImageList] = useState<Array<IImageType>>([]);
```

这是一个图片列表，而每个图片上传成功后，我会把每个元素的标志位置 isUpload 再置为 true。  
如果用普通最直接的方法：

```ts
onUploadSuccess: (res) => {
  const arrImageListTmp = deepClone(arrImageList);
  const nIndex = arrImageListTmp.findIndex((item) => {
    return item.id === res.id;
  });
  if (nIndex > 0) {
    arrImageListTmp[nIndex].isUpload = true;
  }
  setImageList(arrImageListTmp);
};
```

这个时候，由于闭包的存在，导致每个异步回调函数都是闭塞的。  
不知道 arrImageList 的即时状态。  
在图片上传成功回调的时候，  
其 arrImageList 的状态还是执行上传图片时候的状态。  
效果是，每一个新的图片状态被改变，他同时也会将其他图片状态还原。
最后的结果是，只有最后上传成功的图片 isUpload 标志位为 true，  
其他已经上传成功的图片 isUpload 标志位又被改回了 false。

### 解决问题

这个问题究其根本就是闭包的原因。  
并且因为这个可爱可憎闭包，  
也将会在未来 Taro 的开发过程中，不小心就会留下很多坑。  
那么，面对刚刚的问题，  
使用 useState 的函数式更新就能很优雅的解决这个问题。
只需要在上传成功回调函数中改为以下方法实现：

```ts
onUploadSuccess: (res) => {
  setImageList((pervImageList) => {
    const arrImageListTmp = deepClone(pervImageList);
    const nIndex = arrImageListTmp.findIndex((item) => {
      return item.id === res.id;
    });
    if (nIndex > 0) {
      arrImageListTmp[nIndex].isUpload = true;
    }
    return arrImageListTmp;
  });
};
```

这样一来，  
每次被深拷贝的 ImageList，  
都会是当前最新状态的 ImageList。  
所以，也就不会有之前的问题了。

### 后记

解决这个问题的时候，  
真的是抓心挠肝，想了很多奇葩的方法。  
尝试 useCallback， useRef，  
不仅绕路，而且会让代码逻辑导致混乱不堪，没有使用。  
也想到一种方式是利用 Redux 来存储状态，这样也是可以实现的。  
不过折腾了一圈，最后从官方文档处发现了解决方法。
真是，  
众里寻他千百度，  
蓦然回首，  
那人却在灯火阑珊处。

[官方文档](https://taro-docs.jd.com/taro/docs/hooks#usestate)原文是这么写的：  
**函数式更新**  
如果新的 state 需要通过使用先前的 state 计算得出，  
那么可以将函数传递给 setState。  
该函数将接收先前的 state，并返回一个更新后的值。  
下面的计数器组件示例展示了 setState 的两种用法：

```tsx
function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  return (
    <View>
      Count: {count}
      <Button onClick={() => setCount(initialCount)}>Reset</Button>
      <Button onClick={() => setCount((prevCount) => prevCount + 1)}>+</Button>
      <Button onClick={() => setCount((prevCount) => prevCount - 1)}>-</Button>
    </View>
  );
}
```

最后也说明了

> `useReducer` 是另一种可选方案，它更适合用于管理包含多个子值的 state 对象。
