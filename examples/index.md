# 演示文件

---

````html
<script type="text/javascript" src="http://scdn.bozhong.com/source/common/js/jquery.min.js"></script>

<a href="javascript:" id="trigger" class="btn btn-danger">点我登录</a>

打开浏览器调试窗口查看输出

````

````javascript
var loginBox = require('seedit-login'),
    $ = require('jquery');
var box = new loginBox({
    trigger:'#trigger',
    width:500,
    dialogClass:'mk-login-box mk-loginbox',
    title:'我是登陆框',
    closeTpl:'Close'
});
  
box.on('open',function(){
    console.log('open');
}).on('submitStart',function(){
     console.log('提交开始')
}).on('submitDone',function(){
    console.log('提交结束')
}).on('authSuccess',function(uid){
    console.log('登录成功啦',uid)
}).on('authError',function(error,times){
    console.log('登录失败啦',error.error_message,times);
}).on('userinfoGotSuccess',function(user){
    console.log('信息获取成功啦',user);
}).on('close',function(){
    console.log('close');
});
box.on('all',function(name){
    // 打开调试工具查看输出 
    console.log('event::',name);
});
console.log(box);
````


````html
<a href="javascript:" id="JS_renderAgain" class="btn btn-danger">重新实例化登录</a>
````

````javascript
var loginBox = require('seedit-login'),
    $ = require('jquery');
l = [];
$("#JS_renderAgain").on("click", function(){
	l.push(new loginBox().on("authSuccess", function(){
		console.log("render again and login success");
	}).show());
});
````
