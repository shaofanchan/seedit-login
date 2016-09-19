# 自动弹出

---

<script type="text/javascript" src="http://scdn.bozhong.com/source/common/js/jquery.min.js"></script>

````html

````

````javascript

    var loginBox = require('seedit-login');

    var box = new loginBox({
        title: '我是新的标题<span style="font-size:12px;color:#666;padding-left:5px;">我是小标题呀</span></span>'
    }).show();
    box.on('open',function(){
    console.log('open');
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
        console.log('event::',name);
    });
    
````
