# seedit-login [![spm version](https://moekit.com/badge/seedit-login)](https://moekit.com/package/seedit-login)

---



## Install

```
$ mk install seedit-login --save
```

## 说明
> 该模块只用来做PC端登录弹框  
> 模块依赖jquery，内部没有引用，使用时请自己引入jquery

## 使用方法
```
var seeditLogin = require('seedit-login');
var login = new loginBox();
login.on('authSuccess', function() {
    document.location.reload();
}).show();

```
## 初始化参数

+ trigger     目标对象
+ width       弹框宽度
+ dialogClass 自定义类名，默认'mk-login-box'
+ title       自定义标题纯文字或html格式,默认'播种网帐号登录'
+ closeTpl    自定义关闭按钮纯文字或html格式,默认'x'

## 事件机制

+ show   触发弹框显示
+ hide   触发弹框隐藏
+ on 事件绑定,详细如下


## on事件说明

+ submitStart 提交开始
+ submitDone  提交结束
+ authSuccess 登录成功
+ authError 登录失败
+ userinfoGotSuccess 用户信息获取成功	
+ open 弹框显示后回调
+ close 弹框隐藏后回调


