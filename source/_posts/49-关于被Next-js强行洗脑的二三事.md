---
title: 49.关于被Next.js强行洗脑的二三事
date: 2025-02-15 22:37:25
tags:
  - React
  - Next.js
  - 前端框架
---

### 写在前面

前端时间，想用 React 重构一下我的工具官网，  
正好看看 19 有啥新的黑科技，  
结果官网直接把 Create React App 取缔了，  
心中无限羊驼翻腾，这 React 是不想干了么，  
定睛一看推荐使用框架使用(这 Next.js 绝对是给 React 塞钱了)，

作为一个习惯了传统 React SPA 开发的前端工程师，  
我对这种"新潮"的开发方式充满了疑惑和不适应。  
今天就来聊聊这强行被 Next.js 洗脑二三事。

<!-- more -->

### 接触 Next.js

简单看了一下 Next.js 的文档，感觉自己又成为了一名初学者，  
从 13 版本开始，App Router、Server Components、React Server Components...  
这些概念仿佛一夜之间填满了我的技术雷达。

不过如果针对官网类型的业务，  
我们的应用需要更好的首屏加载速度和搜索引擎优化，  
传统的 SPA 应用确实已经无法满足需求。  
选择使用 Next.js 也确实是一个很好的选择。( Next.js 也支持 SSG 模式)

一开始的感受是：

```
// 心理活动
"这不就是 React 加了点服务端功能吗？有什么了不起的..."
"为什么我要把数据获取写在 getServerSideProps 里？直接在组件里用 useEffect 多好"
"路由配置这么复杂，还不如 React Router 直观"
```

但随着深入使用，我开始逐渐理解 Next.js 的设计理念和优势。

### App Router 的冲击

Next.js 13 (目前已经是 15) 推出 App Router 后，我的认知再次被颠覆。

从 Pages Router 的:

```tsx
// pages/blog/[slug].js
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const post = await fetchPost(slug);
  return { props: { post } };
}

export default function BlogPost({ post }) {
  return <div>{post.title}</div>;
}
```

到 App Router 的：

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const post = await fetchPost(params.slug);
  return <div>{post.title}</div>;
}
```

代码看起来更简洁了，但我一时无法接受组件函数居然可以是 async 的！  
这打破了我对 React 组件的认知 —— 组件不是应该是纯函数吗？

更让我困惑的是 Server Components 和 Client Components 的区分：

```jsx
// 服务端组件
export default async function ServerComponent() {
  const data = await fetchData(); // 直接在组件中获取数据
  return <div>{data}</div>;
}

// 客户端组件
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

这种混合使用的方式让我一开始很不适应，  
但慢慢地，我发现这种模式确实能解决很多传统 React 应用的痛点。

### 意外收获

在经过几个项目的实践后，我发现 Next.js 带来了一些意想不到的好处：

1. **代码组织更合理**  
   App Router 的文件系统路由让项目结构更加清晰，  
   相关的组件、样式、API 处理都可以放在同一个目录下。

2. **性能提升明显**  
   服务端渲染 + 自动静态优化 + 增量静态再生成，  
   这些技术组合起来，网站性能有了质的飞跃。  
   最直观的感受是 Lighthouse 分数从 70 多分蹭蹭往上涨。

3. **开发体验改善**  
   数据获取直接写在组件中，不再需要复杂的状态管理模式，  
   很多时候甚至不需要用到 Redux 或者 MobX。

4. **全栈开发更自然**  
   Next.js 的 API Routes 和数据获取功能，  
   让我这个前端开发者也能轻松处理后端逻辑，  
   不再需要单独搭建后端服务。

### 概念转变

使用 Next.js 最大的改变是我的思维方式：

从"一切都在客户端处理"到"服务端能做的就交给服务端"。  
这种转变不仅仅是技术层面的，更是对整个 Web 应用架构认知的提升。

我开始思考每段代码最合适的执行位置：

- 数据获取？服务端更安全、更快
- 用户交互？客户端处理
- 敏感操作？服务端 API 封装
- 静态内容？构建时生成

这种思考方式让我的应用架构更加合理，性能和用户体验也随之提升。

### 踩坑记录

当然，学习过程中也踩了不少坑：

1. **Server Components 限制多**  
   不能使用 useState、useEffect、浏览器 API 等，  
   这点刚开始很难适应，经常忘记给组件添加 'use client' 指令。

2. **部署复杂度增加**  
   与单纯的静态网站相比，Next.js 应用需要 Node.js 环境或专门的服务，  
   部署和运维成本有所提高。

3. **调试体验变差**  
   服务端渲染的代码调试比客户端复杂，  
   报错提示只会提示水合错误，一开始真的是一头雾水。  
   有时候出了问题很难定位到具体原因。

### 最佳实践

经过一段时间的摸索，我总结了一些个人觉得好用的实践：

1. **合理划分 Server 和 Client 组件**  
   默认使用 Server Components，只在需要交互、钩子或浏览器 API 时才使用 Client Components。

2. **善用 React Cache**  
   使用 React Cache 可以在不同组件之间共享数据请求，减少重复请求。

   ```jsx
   import { cache } from "react";

   export const getUser = cache(async (id) => {
     const res = await fetch(`/api/user/${id}`);
     return res.json();
   });
   ```

3. **模块化 API 处理**  
   将 API 处理逻辑单独提取到服务函数中，方便在多个组件和路由处理程序中复用。

4. **混合渲染策略**  
   根据页面性质选择不同的渲染策略：静态内容用 Static Generation，  
   动态但不频繁更新的内容用 ISR，实时性要求高的用 SSR。

### 后记

回顾整个学习过程，我从最初的抵触到现在的接受甚至推崇，  
这种转变让我意识到技术更新迭代永远是行业常态，  
保持开放的心态去学习新事物非常重要。

Next.js 的思想确实"洗脑"了我，  
改变了我对前端开发的认知和实践方式。  
当然，它并不是万能的，对于简单的单页应用或纯静态网站来说，  
Next.js 可能是"杀鸡用牛刀"。

选择合适的技术栈仍然是最重要的，  
但不管怎样，Next.js 代表的全栈式 React 框架方向，  
很可能是未来前端开发的主流趋势。  
学会它，对技术视野的拓展和职业发展都会有所裨益。

### 链接

[1. Next.js](https://nextjs.org/docs)

[2. next-intl](https://next-intl.dev/docs/getting-started)
