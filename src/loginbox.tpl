
<div class="ui-mask" id="{{maskID}}"></div>
    <div class="ui-dialog {{dialogClass}}" style="width:{{width}}px;" id="{{dialogID}}">
        <a class="ui-dialog-close" title="Close" href="javascript:;" data-role="close" style="display: inline;">{{closeTpl}}</a>
        <div class="ui-dialog-content" data-role="content">
        <div class="login-box">
            <form method="POST" action="{{account}}" class="lb_form">
                <h3>{{title}}</h3>
                <ul>
                    <li>
                        <label for="lb_username">用户名:</label>
                        <input type="text" class="lb_username" tabindex="1" name="account"> <a href="{{account}}/register/index" class="lb_signup" tabindex="4">新用户注册</a>
                    </li>
                    <li>
                        <label for="lb_password">密码:</label>
                        <input type="password" class="lb_password" tabindex="2" name="password">
                        <a href="{{account}}/register/findpwd" class="lb_findpwd" tabindex="5"> <i class="lb-tip-icon">&#13545</i>忘记密码</a>
                    </li>
                    <li class="login-code-box" style="display:none;">
                        <label for="login_code">验证码:</label>
                        <div class="login-code-check" style="padding-left: 70px; height: 32px;"></div>
                    </li>
                </ul>
                <button type="button" class="geetest-login" style="display: none;">点击登陆</button>
                <button type="submit" class="lb_signin x-btn x-btn-danger x-btn-small" tabindex="3">登 录</button>
                <div class="alert alert-error lb_alert"> <i class="lb-tip-icon">&#13544</i>
                    <span>登录失败了，请重试</span>
                </div>
            </form>
            <div class="lb_bottom">
                <div class="lb_social">
                    <h4>快捷登录：</h4> <a href="{{account}}/oauth/qq" class="lb_qq" title="使用QQ帐号登录" tabindex="6">QQ登录</a>  <a href="{{account}}/oauth/sina" class="lb_weibo" title="使用微博帐号登录" tabindex="7">微博</a>
                    <a href="{{account}}/oauth/wechat" class="lb_wechat" title="使用微信帐号登录" tabindex="8">微信</a> 
                </div>
            </div>
        </div>
    </div>
</div>