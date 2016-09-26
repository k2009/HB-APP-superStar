define(function(require, exports, module) {
	"use strict";
	var $oauth = require("kit/util/plus-oauth"); //第三方登录模块
	var number = 0;
	var appVersion;
    plus.runtime.getProperty(plus.runtime.appid,function(inf){
        appVersion=inf.version;
        if(callback)callback(sys.appVersion);
    });
	function getTest(type){
		plus.nativeUI.prompt((type==1?"请输入端口号":"请输入host地址"), function(e) {
			if(e.index == 0){
				var domain = 'http://30681.biz.dev.social-touch.com';
				if(type==1){
					domain = 'http://'+e.value+'.biz.dev.social-touch.com';
				}else{
					domain = 'http://'+e.value;
				}
				plus.storage.setItem('domain',domain);
				alert("更改完成,即将进入测试模式!");
				alert(domain)
				plus.runtime.restart();
			}
		}, (type==1?"测试端口修改":"测试host地址修改"), "", ["OK", "Cancel"]);
	}
	mui.plusReady(function() {

		//更换头像
		mui("body").on("tap", "img.border-1px", function(e) {
			if (number < 20) {
				number++;
				return;
			}
			if (mui.os.plus) {
				var a = [{
					title: "更改测试端口号"
				}, {
					title: "直接更改host"
				}];
				plus.nativeUI.actionSheet({
					title: ("测试端口修改"+appVersion),
					cancel: "取消",
					buttons: a
				}, function(b) {
					switch (b.index) {
						case 0:
							break;
						case 1:
							getTest(1)
							break;
						case 2:
							getTest(2)
							break;
						default:
							break
					}
				})
			}

		});
		mui("body").on("tap", "a.mui-btn", function() {
			plus.storage.clear();
			$oauth({
				type: "logout",
				success: function(e) {
					console.log(JSON.stringify(e));
					alert('退出成功!');
					plus.runtime.restart();
				}
			})
		})
	});



})