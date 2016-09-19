'use strict';
var loginBox;
	// Config 
	var Config = require('seedit-config'),
	// COMMON API support
	API = require('seedit-api'),
	// BBS API
	bbsAPI = API.scope('bbs'),
	// user module
	User = require('seedit-user'),
	// event emitter
	Events = require('eventor'),
	// fail times
	authFailNo = 0;

	// cahce document
	var $doc;
	//引入样式
	require('./src/loginBox.css');

	if(!window.initGeetest){
	    var script = document.createElement('script');
	    script.src = 'http://static.geetest.com/static/tools/gt.js';
	    document.body.appendChild( script );
	}
	//防止$被重定义
	if (!!jQuery && $!= jQuery) {
		var $ = jQuery;
	}
	var lastLoginInfo = User.getLastLoginInfo(),
    lastLoginName = lastLoginInfo['username'] || '',
    // html模板，account地址解析为当前环境地址
    loginHTML = require('./src/loginbox.tpl').replace(/{{account}}/g, Config.getSiteUrl('account').replace(/:\d+$/, ''));

    //对话框
    var dialog = {
    	closeTpl:'x',
    	dialogClass:'mk-login-box',
    	width:480,
    	title:'播种网帐号登录',
    	maskID:'mask_'+ new Date().getTime(),
    	dialogID:'dialog_'+ new Date().getTime()
    }
    var Dialog = function(opt){
    	var optKey ;
    	for(optKey in opt){
    		if (!!dialog[optKey]) {
    			dialog[optKey] = opt[optKey]
    		}
    	}
    	this.maskID = dialog.maskID;
    	this.dialogID = dialog.dialogID;
    	this.event = {
			before: {},
			after: {}
		}
    }
    Dialog.prototype = {
    	html : function(opt){
    		var _html = loginHTML.replace(/{{closeTpl}}/g,opt.closeTpl)
    							 .replace(/{{width}}/g,opt.width)
    							 .replace(/{{dialogClass}}/g,opt.dialogClass)
    							 .replace(/{{maskID}}/g,opt.maskID)
    							 .replace(/{{dialogID}}/g,opt.dialogID)
    							 .replace(/{{title}}/g,opt.title);
			$('body').append(_html);

			$('#'+this.dialogID).css('margin-left','-'+opt.width/2+'px');
    	},
    	show: function(){
    		this.event.before.show && this.event.before.show.apply(this);
    		$('#'+this.maskID).css('display','block');
    		$('#'+this.dialogID).css('display','block');
    		this.event.after.show && this.event.after.show.apply(this);

		},
		hide:function(){
			this.event.before.hide && this.event.before.hide.apply(this);
    		$('#'+this.maskID).css('display','none');
    		$('#'+this.dialogID).css('display','none');
    		this.event.after.hide && this.event.after.hide.apply(this);
		},
		bindevent:function(){
			var _this = this;
			$('#'+this.dialogID).find('.ui-dialog-close').off('click').on('click',function(){
				_this.hide();
			})
		},
		before:function(type,fn){
			this.event.before[type] = fn;
			return this;
		},
		after:function(type,fn){
			// fn();
			this.event.after[type] = fn;
			return this;
		},
		render:function(){	
			this.html(dialog);		
    		this.bindevent();
    		return this;
		}

    }

    var loginBox = function(option) {

		//var aa = new Dialog(test)
		$doc = $(document);
	    option = option || {};
	    var o = {};
	    $.extend(o, option);
	    this.o = (function() {
	        return o;
	    })();
	    // token
	    this.token = window.login_token || '';
	    this.prepare();

	    // 找到验证码相关
	    this.$tokenBox = this.$box.find('.login-code-box').eq(0);
	    this.$token = this.$box.find('.login-token-input').eq(0);
	    this.$code = this.$box.find('.login-code-input').eq(0);
	    this.$captcha = this.$box.find('.login-captcha').eq(0);
	    this.shouldValidate = false;
	    return this.init(o);
	};

	// mixin
	Events.mixTo(loginBox);

	loginBox.prototype.bind = function() {
	    var _this = this;
	    var $username = _this.$box.find('.lb_username').eq(0),
	        $pwd = _this.$box.find('.lb_password').eq(0),
	        $signin = _this.$box.find('.lb_signin').eq(0),
	        $form = _this.$box.find('.lb_form').eq(0),
	        $alert = _this.$box.find('.lb_alert').eq(0);

	    var submitHandler = function(e) {
	        e.preventDefault();
	        // validator
	        $form.find('input,select,textarea').on('keydown', function() {
	            var self = $(this),
	                focusable, next;
	            if (e.keyCode == 13) {
	                focusable = $form.find('input,select,textarea').filter(':visible');
	                next = focusable.eq(focusable.index(this) + 1);
	                if (next.length) {
	                    next.focus();
	                } else {
	                    $signin.click();
	                }
	                return false;
	            }
	        });

	        // remove error class when blur
	        var errorRemover = function() {
	            if ($(this).val()) $(this).removeClass('lb_error');
	        };

	        $username.on('blur', errorRemover);
	        $pwd.on('blur', errorRemover);

	        if (!$.trim($username.val())) {
	            $username.addClass('lb_error').focus();
	            return;
	        }
	        if (!$.trim($pwd.val())) {
	            $pwd.addClass('lb_error').focus();
	            return;
	        }
	        if (!_this.captchaObj) {
	            return alert('验证码加载中');
	        }
	        _this.$box.find('.geetest-login').trigger('click');
	        _this.hide();
	        // 极验有时点击太快显示不出来，hack处理下
	        setTimeout(function () {
	            if ($(_this.captchaObj.dom).hasClass('gt_show')) {
	            } else {
	                $(_this.captchaObj.dom).addClass('gt_show');
	            }
	        }, 500);
	    };

	    // 有登录记录时，自动填写用户名，光标直接到密码输入框
	    if (lastLoginName) {
	        $username.val(lastLoginName);
	        setTimeout(function() {
	            $pwd.focus();
	        }, 0);
	    } else {
	        setTimeout(function() {
	            $username.focus();
	        }, 0);
	    }
	    // 登录行为
	    $signin.on('click', submitHandler);
	    $form.on('submit', submitHandler);



	    /* 交互 */
	    //点击登录，按钮disable,如果有出错消息进行清除
	    this.on('submitStart', function() {
	        $signin.prop('diabled', true).text('提交中');
	        // 隐藏错误信息
	        $alert.is(':visible') && $alert.hide();
	    });

	    // 登录结束，按钮enable
	    this.on('submitDone', function() {
	        $signin.prop('diabled', false).text('登录');
	    });

	    // 登录失败，显示错误
	    // 登录失败超过5次，提示找回密码
	    this.on('authError', function(error, times) {
	        $alert.find('span').text(error.error_message).closest('.alert').show();
	        if (times === 5) {
	            $alert.find('span').html('亲是忘记密码了么，<button class="x-btn x-btn-danger x-btn-sm x-btn-small pull-right" type="button">点我去找回</button>');
	        }
	    });

	    // 获取用户信息成功时，保存到本地
	    this.on('userinfoGotSuccess', function(data) {
	        User.setLastLoginInfo(data.username, data.uid);
	    });
	};

	loginBox.prototype.prepare = function() {
	    var _this = this;
	    var title = this.o.title || '播种网帐号登录';
	    var widtn = this.o.width || 480;
	    var classname = this.o.dialogClass  || 'mk-login-box';
	    var closeStr =  this.o.closeTpl || 'x';
	    var curtime = new Date().getTime();
	    this.$dialog = new Dialog({
	        width: widtn,
	        dialogClass: classname,
	        title:title,
	        closeTpl:closeStr,
	        maskID: 'mask_'+curtime,
	        dialogID:'dialog_'+curtime
	    }).before('show', function() {
	       _this.checkCode();
	       _this.trigger('open');
	    }).after('hide', function() {
	       this.$tokenBox && this.$tokenBox.hide();
	       this.$code && this.$code.val('');
	       $('.lb_alert').hide();
	       _this.trigger('close');
	    }).render();
	    _this.$box = $('#dialog_'+curtime);
	    _this.bind();
	};

	loginBox.prototype.init = function(option) {
	    if (window.showLoading === true) {
	        window.showLoading = false;
	    }

	    var loading = document.getElementById('g-loader');
	    if (loading) {
	        loading.style.display = 'none';
	    }

	    var _this = this;
	    // 没有trigger，自动弹出
	    if (option.trigger) {
	        $(option.trigger).on('click.loginBox', function() {
	            _this.show();
	        });
	    }
	    return this;
	};

	loginBox.prototype.hide = function() {
	    this.$dialog.hide();
	    return this;
	};

	loginBox.prototype.show = function() {
	    this.$dialog.show();
	    return this;
	};

	loginBox.prototype.geetest = function() {
	    var _this = this;
	    var $username = _this.$box.find('.lb_username').eq(0),
	        $pwd = _this.$box.find('.lb_password').eq(0),
	        $signin = _this.$box.find('.lb_signin').eq(0),
	        $form = _this.$box.find('.lb_form').eq(0),
	        $alert = _this.$box.find('.lb_alert').eq(0);
	    bbsAPI.get('misc/geetest', {token: _this.seeditLoginToken}, function (data) {
	        if(data.error_code === 0){
	            // 使用initGeetest接口
	            // 参数1：配置参数
	            // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
	            data = data.data;
	            initGeetest({
	                gt: data.gt,
	                challenge: data.challenge,
	                product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
	                offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
	            }, function (captchaObj) {
	                _this.captchaObj = captchaObj;
	                captchaObj.onReady(function () {
	                  $(captchaObj.dom).find('.gt_popup_cross').on('click', function () {
	                    _this.show()
	                  })
	                });
	                captchaObj.onSuccess(function(){
	                  _this.trigger('submitStart');
	                  var data = {
	                      username: $username.val(),
	                      password: $pwd.val()
	                  };
	                  if (_this.token) {
	                      data.token = _this.token;
	                      var validate = _this.captchaObj.getValidate();
	                      data.geetest_challenge = validate.geetest_challenge;
	                      data.geetest_validate = validate.geetest_validate;
	                      data.geetest_seccode = validate.geetest_seccode;
	                  }
	                  API.post('ucenter/login', data, function(data) {
	                      _this.trigger('submitDone', 'success');
	                      _this.trigger('authSuccess', data.data.uid);
	                      var localData = {
	                          uid: data.data.uid,
	                          username: $username.val()
	                      }
	                      _this.trigger('userinfoGotSuccess', localData);

	                      !!this.$tokenBox && this.$tokenBox.hide();
	                      // this.$code.val('');
	                  }, function(error) {
	                      if (error.error_code === 7001 || error.error_code === 7003) {
	                          _this.checkCode();
	                      }
	                      authFailNo++;
	                      _this.trigger('submitDone', 'error');
	                      _this.trigger('authError', error, authFailNo);
	                      _this.captchaObj.refresh();
	                      setTimeout(function(){
	                        _this.show();
	                      }, 500)
	                  })
	                    // _this.$box.find('.lb_alert').eq(0).hide()
	                });
	                // 弹出式需要绑定触发验证码弹出按钮
	                captchaObj.bindOn(_this.$box.find('.geetest-login').eq(0));
	                
	                // 将验证码加到id为captcha的元素里
	                captchaObj.appendTo(_this.$box.find('.login-code-check'));
	                // 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
	            });
	        }
	    }, function(data){
	        console.log(data);
	    });
	    return this;
	};

	loginBox.prototype.checkCode = function() {
	    var _this = this;
	    // 刷新验证码
	    _this.$captcha.off('click').on('click', function() {
	        $(this).attr('src', 'http://bbs.' + Config.getMainDomain() + '/restful/misc/captcha.json?token=' + _this.token + '&timestamp=' + (new Date().getTime()));
	    });

	    // 已经有token
	    if (_this.token !== '') {
	    
	        // _this.$tokenBox.show();
	        var img = buildUrl(_this.token);
	        this.$captcha.attr('src', img);
	        return;
	    }else{
	        (function(_this) {
	        setTimeout(function() {
	            // 检查是否需要验证码
	            API.put('ucenter/login', function(data) {
	                if (data.data && data.data.need_code === 1) {
	                    // 需要验证码
	                    _this.shouldValidate = true;
	                    // 显示验证码输入
	                    // _this.$tokenBox.show();

	                    // 如果已经有token
	                    if (_this.token !== '') {
	                        var img = buildUrl(_this.token);
	                        _this.$captcha.attr('src', img);
	                    } else {
	                        // 获取token
	                        API.get('http://bbs.' + Config.getMainDomain() + '/restful/misc/token.jsonp', {
	                            type: 'member_login'
	                        }, function(data) {
	                            if (data.data && data.data.token === '') {

	                            } else {
	                                _this.token = data.data.token;
	                                _this.seeditLoginToken = data.data.token;
	                                // 拼出图片地址
	                                 _this.geetest();
	                            }
	                        }, function(error) {});
	                    }
	                }
	            }, function(error) {});
	        }, 0);
	    })(_this);
	    }
	};

	function buildUrl(token) {
	    return 'http://bbs.' + Config.getMainDomain() + '/restful/misc/captcha.json?token=' + token + '&timestamp=' + (new Date().getTime());
	};

	if (window.showLoader === true) {
	    new loginBox().on('authSuccess', function() {
	        document.location.reload();
	    }).show();
	    document.getElementById('g-loader').style.display = 'none';
	    window.showLoader = false;
	}

module.exports = loginBox;

