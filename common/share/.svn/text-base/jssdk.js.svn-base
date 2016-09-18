/*
	封装好的微信和微博 jssdk 初始化方法 Li Ming
 */
define(function(require, exports, module) {

	var isInit = false;	// jssdk 是否初始化过
	var wx = null;	// 微信 jssdk 的句柄
	var WeiboJS = null;	// 微博 jssdk 的句柄
	var currentPlatform = null;

	function init(platform, jssdkInfo, callback){
		currentPlatform = platform;
		if(isInit === true){
			// console.log('已经初始化过');
			callback && callback();
			return;
		}
		if( platform === 'weixin' ){
			seajs.use('http://res.wx.qq.com/open/js/jweixin-1.0.0.js',function(weixinSDK){
				wx = weixinSDK;
				var info = {
					debug: false,
					jsApiList: [
						'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareWeibo',
						'onMenuShareQZone',
						'startRecord',
						'stopRecord',
						'onVoiceRecordEnd',
						'playVoice',
						'pauseVoice',
						'stopVoice',
						'onVoicePlayEnd',
						'uploadVoice',
						'downloadVoice',
						'chooseImage',
						'previewImage',
						'uploadImage',
						'downloadImage',
						'translateVoice',
						'getNetworkType',
						'openLocation',
						'getLocation',
						'hideOptionMenu',
						'showOptionMenu',
						'hideMenuItems',
						'showMenuItems',
						'hideAllNonBaseMenuItem',
						'showAllNonBaseMenuItem',
						'closeWindow',
						'scanQRCode',
						'chooseWXPay',
						'openProductSpecificView',
						'addCard',
						'chooseCard',
						'openCard'
					]
				};
				for(var key in jssdkInfo){
					if(key != "url"){
						info[key] = jssdkInfo[key];
					}
				}
				wx.ready(function(){
					isInit = true;
					callback && callback();
				});
				wx.error(function(res){
					callback && callback(res);
				});
				wx.config(info);
			});
		} else if( platform === 'weibo' ){
			seajs.use('http://js.t.sinajs.cn/open/thirdpart/static/jsbridge-sdk/public/weibo_mobile_sdk_min.js?version=20160615',function(ret){
				var data = jssdkInfo;
				var info = {
					'appkey' : data.appid,
					'debug': false,
					'timestamp': data.timestamp,
					'noncestr': data.noncestr,
					'signature': data.signature,
					'scope': [
						'pickImage',
						'setSharingContent',
						'openMenu',
						'setMenuItems',
						'menuItemSelected',
						'invokeMenuItem',
						'getNetworkType',
						'networkTypeChanged',
						'getBrowserInfo',
						'checkAvailability',
						'setBrowserTitle',
						'openImage',
						'scanQRCode',
						'getLocation',
						'pickContact'
					]
				};
				ret.ready(function(api) {
					api.checkAvailability({
						api_list: info.scope,
						success: function(ret) {
							WeiboJS = api;
							isInit = true;
							callback && callback();
						},
						fail: function(msg, code) {
						}
					});
				});
				ret.error(function(message) {
					// 	alert("微博 JSBridge 错误：" + message + "\n\n" + JSON.stringify(info));
				});
				ret.config(info);
			});
		}
	}

	function getJssdkObject(){
		if(currentPlatform === 'weibo'){
			return WeiboJS;
		}
		if(currentPlatform === 'weixin'){
			return wx;
		}
	}

	function setWeiboMenu(){

	}

	function setWeixinMenu(){

	}

	function destroy(){

	}
	exports.init = init;
	exports.getJssdkObject = getJssdkObject;
	exports.setWeiboMenu = setWeiboMenu;
	exports.setWeixinMenu = setWeixinMenu;
	exports.destroy = destroy;
});