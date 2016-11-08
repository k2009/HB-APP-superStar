// app 第三方登录 by xiaok
// 2016年07月06日16:31:27
// 使用方法: 调用句柄,传入json,id控制登录模式,success,error控制相应事件回调
// success 返回格式 : {"uid":"186324234137","expires_in":2633262,"access_token":"2.008nS4CCnpUszD8232852574SgTrED"}

// 用户取消登录时 err返回格式 : {"code":-100,"message":"-100:  ","innerCode":-1}


define(function(require, exports, module){
    "use strict";

	var sys = function (config) {
		var opt = {
			type:"login",				//默认login(登录),可选logout(注销)
			id:"sinaweibo",				//{"id":"qq","description":"QQ"}{"id":"sinaweibo","description":"新浪微博"}{"id":"weixin","description":"微信"}
			success:function(){},
			error:function(){}
		}
		opt = mui.extend(opt,config);
		plus.oauth.getServices(function(services) {
			var auths = services;
			// 登录操作
			function authLogin() {
				var s = null;
				for(var attr in auths){
					if(auths[attr].id == opt.id){
						s = auths[attr];
						break;
					}
				}
				console.log(JSON.stringify(s))
				if(opt.type == 'logout'){
                    console.log("检测为登出模式");
					s.logout(opt.success,opt.error)
					console.log(JSON.stringify(s.logout))
					return
				}
				if (!s.authResult) {
                    console.log('未检测到已有登录信息');
					s.login(function(e) {
						opt.success(e.target.authResult);
					}, function(e) {
						opt.error(e);
					});
				} else {
                    console.log('检测到已有登录信息');
					opt.success(s.authResult);
				}
			}
			authLogin();
		}, function(e) {
			// alert("获取分享服务列表失败：" + e.message + " - " + e.code);
		});
	}

	return sys;
})
