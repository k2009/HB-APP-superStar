define(function(require, exports, module) {

	var jssdk = require("common/share/jssdk");
	var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var tabbar;

	var NODE_ID = '#st_modules_h5_inviteFriend';

	var TITLE = '想不想在人群中脱颖而出，成为坐拥百万粉丝的红人？快快加入网红城堡，众多业内大佬带你开启圆梦之旅~~';
	var SHARE_URL = "";

	var weixinTips;	// 保存微信分享实例

	var Tools = {
		'setWeiboShareMenu': function(WeiboJS){
			var items = {
				shareToWeibo: {
					title: "分享到微博",
					scheme: "sinaweibo://compose?content=" + TITLE + '：' + SHARE_URL,
					code: 1001
				}/*,
				follow: {
					title: "关注",
					code: 10002
				},
				shareToWeixin: {
					title: "分享到微信",
					code: 1004
				},
				shareToPYQ: {
					title: "分享到朋友圈",
					code: 1005
				}*/
			};
			var itemArray = [];
			for( var key in items ){
				itemArray.push( items[key] );
			}
			// 设置分享的文案
			WeiboJS.setSharingContent({
				external:{
					title: "一起变红",
					icon: "http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg",
					desc: TITLE
				}
			});
			// 选择菜单的时候，触发相应的菜单行为
			WeiboJS.on("menuItemSelected", {
				trigger: function(res) {
					if (res.selected_code != "1001" && Number(res.selected_code) < 3000) {
						WeiboJS.invokeMenuItem({ code: res.selected_code });
					}
				}
			});
			// 设置右上角菜单
			WeiboJS.setMenuItems({
				items: itemArray,
				success: function(ret) {},
				fail: function(msg, code) {}
			});
		},
		'setWeixinShareMenu': function(wx, url){
			// alert('设置微信分享菜单');
			wx.onMenuShareTimeline({
				title: TITLE, // 分享标题
				link: url, // 分享链接
				imgUrl: 'http://ww2.sinaimg.cn/large/0060lm7Tgw1f5tevi6q7qj303c03cjrc.jpg', // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
					// $( '.mui-popup-backdrop' ).remove();
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
					// $( '.mui-popup-backdrop' ).remove();
				}
			});
			wx.onMenuShareAppMessage({
				title: "一起变红", // 分享标题
				desc: TITLE, // 分享描述
				link: url, // 分享链接
				imgUrl: 'http://ww2.sinaimg.cn/large/0060lm7Tgw1f5tevi6q7qj303c03cjrc.jpg', // 分享图标
				type: '', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function () {
					// 用户确认分享后执行的回调函数
					// $( '.mui-popup-backdrop' ).remove();
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
					// $( '.mui-popup-backdrop' ).remove();
				}
			});
		},
		// 微信显示蒙层
		'showMask': function(e){
			e.preventDefault();
			if(weixinTips != null){
				weixinTips.show();
			}
		},
		// 微信隐藏蒙层
		'hideMask': function(){
			if(weixinTips != null){
				weixinTips.hide();
			}
		},
		// 绑定事件
		"bindEvent": function(){
			$(NODE_ID).on("click", "[action=invite]", Tools.showMask);
		},
		// 释放事件
		"releaseEvent": function(){
			$(NODE_ID).off("touchend", "[action=invite]", Tools.showMask);
		}
	};

	function init(opts) {
		// body...
		console.log("邀请好友 init");
		var platform = opts.platform;
		SHARE_URL = opts.next_url;

		// 初始化 JSSDK
		jssdk.init(platform, opts.jssdk, function(){
			// 如果初始化失败，就什么都不做
			if(arguments.length > 0){
				return;
			}
			if(platform == 'weibo'){
				var WeiboJS = jssdk.getJssdkObject();
				Tools.setWeiboShareMenu(WeiboJS);
				return;
			}
			if(platform == 'weixin'){
				var wx = jssdk.getJssdkObject();
				wx.showOptionMenu();
				Tools.setWeixinShareMenu(wx, opts.next_url);
				return;
			}
		});

		if(platform == 'weixin'){
			Tools.bindEvent();
		}

		// 延迟加载微信分享的 tips
		lazyload.load("common/share/tips/js/index", function(Dialog){
            weixinTips = new Dialog({
            	'title': '想要好友加入网红城堡？还不快快告诉她！',
            	'text': '点击右上角，分享给 TA 吧'
            });
        });

        // 延迟加载 tabbar
        lazyload.load("common/tabbar/js/index", function(ret){
        	ret.setData(opts.tabbar);
            ret.setActiveTab(3);
            tabbar = ret;
        });
        // 公共头部
        header.init();
	}

	function destroy(opts) {
		Tools.hideMask();
		Tools.releaseEvent();
		Tools = null;
		if(tabbar){
            tabbar.destroy();
        }
        header.destroy();
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});