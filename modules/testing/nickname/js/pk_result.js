define(function(require, exports, module) {
	var jssdk = require("common/share/jssdk");
	var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var dialogTips;
    var tabbar;
    //美化alert end
    var share = {
        WXshare: function(){
            var title = this.title();
            var title_2 = this.title_2();
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: share_url, // 分享链接
                imgUrl: 'http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: title_2, // 分享标题
                desc: '昵称不仅仅是一个符号，也会有更深刻的寓意，看看你的昵称会有网红范儿吗……', // 分享描述
                link: share_url, // 分享链接
                imgUrl: 'http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

        },
        WBshare: function(){
            var title = this.title();
            var title_2 = this.title_2();
            var items = {
                shareToWeibo: {
                    title: "分享到微博",
                    //scheme: "sinaweibo://sendweibo?content=" + title + '：' + opts.share_url,
                    scheme: "sinaweibo://compose?content=" + title + '：' + share_url,
                    code: 1001
                },
                follow: {
                    title: "关注",
                    code: 10002
                }
            };
            var itemArray = [];
            for( var key in items ){
                itemArray.push( items[key] );
            };
            // 设置分享的文案
            WeiboJS.setSharingContent({
                external:{
                    title: title_2,
                    icon: "http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg",
                    desc: title
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
        title: function(){
            var title = [
                '天啦噜，我竟然这么有网红范儿，想想都很开心呢！',
                '我竟然有当网红的潜力……',
                '我的网红范儿这么足，真是意想不到！',
                '看看你会有网红范儿吗？我的网红范儿竟然是……',
                '测测你的昵称会有网红范儿吗？'
            ];
            return title[ Math.floor( Math.random() * title.length ) ];
        },
        title_2: function(){
            var title = [
                '你的昵称会有当网红的潜力吗？',
                '想当网红？先来看看你有一个好昵称吗',
                '不要小看你的昵称呦……',
                '你的昵称竟然蕴含这么大的秘密……',
                '测测你的昵称会有网红范儿吗？'
            ];
            return title[ Math.floor( Math.random() * title.length ) ];

        }
    }
	function init(opts) {
		var platform = opts.platform;


        // 延迟加载 tabbar
        lazyload.load("common/tabbar/js/index", function(ret){
            ret.setData(opts.tabbar);
            ret.setActiveTab(2);
            tabbar = ret;
        });

        // 延迟加载微信分享的 tips
        lazyload.load("common/share/tips/js/index", function(dialog){
            dialogTips = new dialog({
                title: "请点击右上角，选择分享至好友或朋友圈，就可以让好友看到这个测试啦"
            });
        });
        header.init();
		$('#st_modules_nickname_pkresult').on('touchend', '#run_share', function(){
            dialogTips.show();
		})
	}

	function destroy(opts) {
		$('#st_modules_nickname_pkresult').off();
        dialogTips.destroy();
        if(tabbar){
            tabbar.destroy();
        };
        header.destroy();
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});