---
title: 21.自定义Hook分页加载的实现
date: 2021-01-03 09:22:13
tags:
  - Hook
---

### 痛点分析

在实际业务开发的过程中，  
有很多关于长列表分页加载的场景。  
比如 feed 信息流，数据统计，成员设置等等。  
那么如果每个页面都单独写一套长列表分页加载的逻辑，  
代码重复臃肿，且每个页面实现方式不一样。  
很难统一管理。

而 Hook 的概念，可以使你在无需修改组件结构的情况下复用状态逻辑。  
所以才有了封装分页加载 useQueryPageList 的想法。

<!-- more -->

### 功能实现

那么封装一个功能，`入参`与`返回值`都是必要的。  
`入参`就是：  
需要调用的接口函数、以及对应的传入参数。  
`返回值`就是：  
用以展示的列表数据。

所以在 useQueryPageList 里面同时需要使用生命周期：
`useEffect`初次加载：用以加载第一组分页数据
`useReachBottom`触底加载分页：用以加载下组分页数据
`usePullDownRefresh`下拉刷新：用以重新加载第一组分页数据

同时我们需要绑定变量保存当前加载情况：
`nPageNum`当前加载的分页编号
`nPageSize`每组分页加载多少条数据
`arrPageList`目前已经加载的数据

最后在之前的三个声明周期分别触发回调函数，将获取到的分页数据返回即可。

### 代码实现

useQueryPageList.ts

```ts
import Taro, {
  useDidShow,
  useReachBottom,
  usePullDownRefresh,
} from "@tarojs/taro";
import { useEffect, useRef } from "react";

const PAGE_SIZE = 50;

const useQueryPageList = (
  callback: any,
  funFetchApi: any = null,
  param: any = {}
) => {
  const nPageNum = useRef<number>(0);
  const arrPageList = useRef<Array<any>>([]);
  const nPageSize = param.nPageSize ? param.nPageSize : PAGE_SIZE;

  // // 重新加载
  // useDidShow(async () => {
  // 	console.log('useQueryPageList useDidShow')
  // 	callback({ state: 'LOADING' })
  // 	const paramReal = {
  // 		...param,
  // 		nPageNum: 0,
  // 		nPageSize: (nPageNum.current + 1) * nPageSize,
  // 	}
  // 	const res = await funFetchApi(paramReal)
  // 	arrPageList.current = res ? res.data : []
  // 	callback({ state: 'RESULT', data: arrPageList.current, total: 100000 })
  // })

  // 初次加载
  useEffect(() => {
    if (!funFetchApi) {
      return;
    }
    console.log("useQueryPageList useEffect");
    callback({ state: "LOADING" });
    const paramReal = {
      ...param,
      nPageNum: 0,
      nPageSize: nPageSize,
    };
    funFetchApi(paramReal).then((res) => {
      arrPageList.current = res ? res.data : [];
      callback({ state: "RESULT", data: arrPageList.current });
    });
  }, []);

  // 触底加载分页
  useReachBottom(() => {
    if (!funFetchApi) {
      return;
    }
    console.log("useQueryPageList useReachBottom");
    callback({ state: "REACH_BOTTOM" });
    nPageNum.current++;
    const paramReal = {
      ...param,
      nPageNum: nPageNum.current,
      nPageSize: nPageSize,
    };
    funFetchApi(paramReal).then((res) => {
      arrPageList.current = arrPageList.current.concat(res ? res.data : []);
      callback({ state: "RESULT", data: arrPageList.current });
    });
  });

  // 下拉刷新
  usePullDownRefresh(() => {
    if (!funFetchApi) {
      return;
    }
    console.log("useQueryPageList usePullDownRefresh");
    callback({ state: "LOADING" });
    nPageNum.current = 0;
    const paramReal = {
      ...param,
      nPageNum: nPageNum.current,
      nPageSize: nPageSize,
    };
    funFetchApi(paramReal).then((res) => {
      arrPageList.current = res ? res.data : [];
      callback({ state: "RESULT", data: arrPageList.current });
    });
  });
};

export default useQueryPageList;
```

### 问题解决

基本功能是已经实现了。  
不过实际还有一些隐藏问题。

1. 不能在组件内使用。  
   因为如果该组件涉及到多次注册和销毁的逻辑。会导致组件内声明的`useReachBottom`等 Hook 不会销毁。就会多次注册这些 hook。  
   意味着组件销毁、创建 N 次，那么在下拉刷新或者触底的时候就会触发 N 次这些 Hook。
2. 关于页面刷新的交互  
   比如有以下业务场景：列表中有点赞数，当通过列表进入详情，点赞后返回，列表中点赞数要+1。

   `方案 1`：列表页面 onShow 生命周期再次加载一次。  
   优点：onShow 操作简单，再次调取接口即可。
   缺点：比如刚刚点赞的是第 1000 条。页面只会再次加载一次第一组分页数据，页面就会被强制拉上去。要是页面再次加载是将刚刚加载的数据再次请求一次，那么一次请求数据过于庞大也会有问题。且接口请求需要时间，点赞数更新需要等待。  
   `方案 2`：本地数据管理，进行本地刷新。  
   列表页面 onShow 声明周期的时候，不做任何处理。  
   点赞评论等操作的时候，除了接口调用，同时也要将本地数据同步进行修改。
   优点：减少接口调用，提升性能，优化体验。
   缺点：需要精确管理本地数据，给点赞、评论等操作增加副作用冗余操作，逻辑复杂。后期维护增加困难。且如果是帖子取消置顶等交互操作无法判定帖子原来的位置，同样需要接口支持。

   根据项目来决定使用哪种方案。相比之下，个人比较倾向于方案 2 的使用。

### 后记

Hook 是一个非常好用的功能。  
他类似于一种纬度，横向切片式的操作。  
可以封装一些无需依赖状态的公共方法。

同样 Hook 也要时刻注意他的触发时机，  
很容易就造成莫名其妙的多触发了很多次。  
埋下了性能的深坑。
