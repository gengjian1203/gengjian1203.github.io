---
title: 5.阻止Taro框架中的事件冒泡
date: 2020-06-22 00:24:06
tags:
  - 微信小程序
  - Taro
---

### 问题起因
在书写Taro的一个弹窗组件的时候，  
在弹窗按钮和蒙层分别绑定了点击事件。  
结果点击按钮的时候，  
蒙层事件也被触发了。  
这个就是事件冒泡很正常的事情，  
``` typescript
e.stopPropagation();
```
本以为阻止一下就可以了，  
结果发现并不好用。  
  
<!-- more -->

### 解决过程
网上找了很多文档都是这么说的，  
后来在一条评论下面找到了答案。  
原因是我绑定事件的写法不对。  
正确的写法应该是。  
``` typescript
onClick={this.handleMaskClick.bind(this)}
```
参考代码  
``` typescript
// 点击蒙板
handleMaskClick (e: Event) {
  e.stopPropagation();
  console.log('handleMaskClick');
  this.setShow(false);
}

// 点击登录按钮
handleLoginClick (e: Event) {
  e.stopPropagation();
  console.log('handleLoginClick');
  this.setShow(false);
}

render() {
    const {
      m_isShow
    } = this.state;

    return (
      <View className='login-dialog-wrap'>
        <View 
          className='login-dialog-mask'
          onClick={this.handleMaskClick.bind(this)}
        >
          <View className={classNames(m_isShow ? 
                                      'fade-in-from-btottom login-dialog-content' : 
                                      'fade-out-from-btottom login-dialog-content')}
          >
              <View className='content-text'>
                登录后即可体验更多服务
              </View>
              <Button 
                className='content-button'
                openType='getUserInfo'
                onClick={this.handleLoginClick.bind(this)}
              >
                微信登录
              </Button>
            </View>
        </View>
      </View>
    )
  }
```

### 后记
虽然Taro是一个能够多端开发，跨平台的优秀框架，  
不过不知道是不是菜鸟手生的缘故，  
总是感觉遇到了很多奇奇怪怪的坑。  
比如这个阻止事件冒泡，  
还有不能使用修饰方法的装饰器什么的，  
反正踩着踩着，  
也就习惯了。  
