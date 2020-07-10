---
title: 3.关于Taro框架中Redux的使用方法
date: 2020-06-20 11:22:18
tags:
  - 微信小程序
  - Taro
  - Redux
---

### 关于Redux
个人认为，一些轻量级的项目是完全用不到Redux。  
简单的单例出一个全局变量管理器，就可以满足项目的需要。  
不过如果项目一旦沉重起来，需求逻辑繁琐，父子组件通讯错综复杂，  
开发人员思路又不统一，  
这个时候如果只是使用全局变量管理，  
那么数据随时都可能被更改，全局变量将会成为一团乱麻，变得不可被信任。  
项目的迭代和维护成本也将会迎来指数级的上升，  
如果这个时候能有一个全局的对象，  
可随时被观察状态，只能用特殊方式修改状态，  
将会对项目的维护非常有帮助。  
而这也就是Redux。  
  
<!-- more -->

### 官方文档
[Taro的Redux官方文档](https://taro-docs.jd.com/taro/docs/redux/)

### Redux数据流程图
借用网上流传的图片，发现有个箭头的遗漏，  
一切起源是因为组件触发了action，  
才引发了这一系列的流程。  
![Redux数据流程图](/images/image_3_1.jpg)

### 使用流程
1. 准备好仓库state。（只操作一次，聚合所有数据）  
``` typescript
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

const middlewares = [
  thunkMiddleware,
  createLogger()
]

export default function configStore () {
  const store = createStore(rootReducer, applyMiddleware(...middlewares));
  return store;
}
```
  
2. 准备一个数据对象。  
举个例子，我准备将主页的相关信息都存储在仓库的这个对象里MainPageInfo。  
所以我会创建3个文件。  
``` bash
../actions/MainPageInfo.ts    # 做逻辑处理
../constants/MainPageInfo.ts  # 更新Redux标记
../reducers/MainPageInfo.ts   # 小片段的数据，处理数据，更新数据
```
  
3. 准备好对这个对象操作的指令代号。  
我会将指令代号以及类型声明存放在这个文件中。  
../actions/MainPageInfo.ts  
``` typescript
// 切换主页底部导航
export const SET_MAIN_PAGE_SELECT: string = 'SET_MAIN_PAGE_SELECT';
export type MainPageInfoType = {
  nSelectIndex: number
}
```
  
4. 准备对这个对象的行动。  
我会将所需要的操作存放在这个文件中。  
../actions/MainPageInfo.ts  
``` typescript
import {
  SET_MAIN_PAGE_SELECT
} from '@/constants/MainPageInfo';

export function setMainPageSelect (nSelectIndex: number) {
  return {
    type: SET_MAIN_PAGE_SELECT,
    nMainPageSelect: nSelectIndex
  }
}

export default {
  setMainPageSelect,
}
```

5. 准备对这个对象数据的改动。  
我会将操作之后的数据改动放在这个文件中。
../reducers/MainPageInfo.ts  
``` typescript
import {
  SET_MAIN_PAGE_SELECT
} from '@/constants/MainPageInfo';

const INITIVAL_STATE = {
  nSelectIndex: 0,
}

export default function MainPageInfo (state = INITIVAL_STATE, action) {
  switch (action.type) {
    case SET_MAIN_PAGE_SELECT:
      return {
        ...state,
        nSelectIndex: action.nMainPageSelect
      }
    default:
      return {
        ...state
      }
  }
}
```

6. 准备阶段完毕  
那么准备阶段完毕，  
我可以通过setMainPageSelect方法传入的参数，  
来修改store.MainPageInfo.nSelectIndex
而此时我的期望数据结构就会是这样。  
``` typescript
store = {
  MainPageInfo: {
    nSelectIndex: number
  }
}
```

7. 在Taro中运用  
其实TS近乎强迫症的语法，在这一步折腾了好久，不断的在语法错误提示中挣扎。  
在参考了多方资料之后，总算摸索出来一套不再错误提示的写法。  
示例是用最基本的方法来操作Redux。  
``` tsx
import { 
  connect 
} from '@tarojs/redux';
import { 
  MainPageInfoType 
} from '@/constants/MainPageInfo';
import { 
  setMainPageSelect,
} from '@/actions/MainPageInfo';

// 类型声明：传递过来的变量
type PageStateProps = {
  MainPageInfo: MainPageInfoType;
};

// 类型声明：传递过来的dispatch方法
type PageDispatchProps = {
  setMainPageSelect: (nSelectIndex: number) => any;
};

// 类型声明：传递过来的普通方法
type PageOwnProps = { };

// 类型声明：组件内变量
type PageState = { };

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

type IState = PageState;

@connect(
  ({ MainPageInfo }) => ({
    MainPageInfo
  }),
  dispatch => ({
    setMainPageSelect (nSelectIndex: number) {
      dispatch(setMainPageSelect(nSelectIndex));
    }
  })
)
export default class Main extends Component<IProps, IState> {
  // 测试按钮
  handleTestClick () {
    const {
      MainPageInfo,
      setMainPageSelect
    } = this.props;
    console.log('handleTestClick before.', MainPageInfo);
    setMainPageSelect(9999);
    console.log('handleTestClick after.', MainPageInfo);
  }

  // 
  render () {
    (
      // ...
    )
  }
}
```
我们不能直接的去修改store中的数据，  
我们可以触发handleTestClick，  
通过dispatch，调用setMainPageSelect方法，  
来对store.MainPageInfo.nSelectIndex的数值进行修改。  

### 后记
前端的框架语法更新很快，  
React 16.8版本新增了React Hook的写法。  
这也让操作Redux的方式更加灵活了。  
我会在接下来的时间里研究一下Hook的写法，整理出来。  