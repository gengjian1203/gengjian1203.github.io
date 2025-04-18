---
title: 4.关于Taro框架中装饰器的使用方法
date: 2020-06-21 22:29:31
tags:
  - 微信小程序
  - Taro
  - 设计模式
---

### 关于装饰器

装饰器模式是在不影响原来的类/方法/属性的基础上，  
增加的新功能的方式。  
一般可以运用在权限校验、日志打印、性能测验、属性保护、节流防抖、耦合度低的重复性工作（加积分）等等……  
或者说，你干脆不想动别人写的代码，免得背锅，  
这个时候就可以通过装饰器模式进行改造。

<!-- more -->

### 装饰器的几种模式

1. 对类进行的装饰  
   以类为单元，可以对类中的声明周期，以及所有类中的属性和方法进行装饰。  
   虽然都能够包括在内，不过以类为单元过于庞大，  
   需要做精准的筛选和操作。  
   而 Taro 可能是因为框架的原因，只能够修饰类，其他两种方式都不能被使用，所以只能硬着头皮去装饰类。

2. 对方法进行的装饰  
   这个用起来比较精准，用起来比较顺眼，便于理解，  
   也是常用的装饰器模式。

3. 对属性进行的装饰  
   同时，装饰器也能装饰一些变量，  
   比如给某个变量增加只读的属性，  
   这样如果无意间修改了变量，编译器也能做出对应的提示。

### 代码示例

装饰模式装饰类的实现。

```typescript
// Demo装饰器示例
// 功能在类中所有方法前后都打印Log，并且屏蔽指定的方法，替换成输出数字。
// 使用方式
// @Demo(['componentDidMount'], 123)
function Demo(arrFunc: Array<string> = [], num: Number = 9999) {
  return function Demo(target, key, descriptor) {
    console.log("Demo Params", { target, key, descriptor, arrFunc, num });
    if (target.prototype) {
      // 拷贝对象，获取类中的所有方法
      const desc = Object.getOwnPropertyDescriptors(target.prototype);
      // 遍历该对象中所有方法
      for (let key of Object.keys(desc)) {
        const func = desc[key].value;
        if (typeof func === "function") {
          // 修改对象的现有属性key，并且返回这个对象
          Object.defineProperty(target.prototype, key, {
            value(...args: any[]) {
              // 指定方法则屏蔽原方法，打印个参数
              if (arrFunc && arrFunc.indexOf(key) > -1) {
                console.log(`${key} - ${num}`);
                return {};
              }
              // 其他方法 装饰前后log
              console.log(`${key} - before.`);
              const res = func.apply(this, args);
              console.log(`${key} - after.`);
              return res;
            },
          });
        }
      }
    }
  } as any;
}

export default Demo;
```

```typescript
let lastTime = null;
let lastMethodTime = null;

/**
 * 处理业务逻辑
 * @returns
 */
const dealFun = async (that, args, gapTime) => {
  // console.log('CheckLogin args', gapTime)
  if (lastMethodTime) {
    clearTimeout(lastMethodTime);
    lastMethodTime = null;
  }
  // 处理业务逻辑
  const nowTime = new Date().getTime();
  if (!lastTime || nowTime - lastTime >= gapTime) {
    that.apply(this, args);
    lastTime = nowTime;
  } else {
    lastMethodTime = setTimeout(() => {
      if (lastMethodTime) {
        lastMethodTime = null;
      }
      that.apply(this, args);
    }, gapTime);
  }
  return false;
};

/**
 * 节流装饰器：固定一段时间内只有一次有效操作，第一次立即执行，且保证最后一次也会执行
 * @param {*} gapTime
 * @returns
 */
const Throttle =
  (gapTime = 200) =>
  (...args) => {
    const descriptor = args[2];
    // 兼容箭头函数
    if (descriptor.initializer) {
      const replaceInitializer = function () {
        // 此处传入了指向类实例的this
        const fn = descriptor.initializer.call(this);
        return async (...retArgs) => {
          return dealFun(fn, retArgs, gapTime);
        };
      };
      return {
        enumerable: true,
        configurable: true,
        writable: true,
        initializer: replaceInitializer,
      };
    }

    const oldValue = descriptor.value;
    descriptor.value = dealFun(oldValue, args, gapTime);
    return descriptor;
  };

export default Throttle;
```

Taro 的装饰器使用方法

```tsx
import { Demo, Throttle } from '@/kits/decorator/index';

@Demo(['componentDidMount'], 123)
export default class AvatarModule extends Component {

  @Throttle(200)
  handleTestClick = () => {
    console.log('handleTestClick')
  }

  //
  render () {
    (
      // ...
    )
  }
}
```

### 后记

话说，刚刚说过的 Redux 的 connect 其实也是装饰器的实现。  
另外，装饰器其实也是高阶函数的一种实现，  
那么通过 Hook 的方法也能够实现类似装饰器带来的效用。
