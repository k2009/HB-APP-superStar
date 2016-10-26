define(function(require, exports, module) {
    var $body=$(document.body);
    var lazyload = require("kit/util/asyncModule");
    var jssdk = require("common/share/jssdk");
    var wordCloud=require('modules/testing/weiboDNA/js/wordCloud');

    var TITLE='想不想在人群中脱颖而出，成为坐拥百万粉丝的红人？快快加入网红城堡，众多业内大佬带你开启圆梦之旅~~';
    var TITLE_2;
    var SHARE_URL = "";

    var Tools = {
        'setWeiboShareMenu': function(WeiboJS,opts){
            var items = {
                shareToWeibo: {
                    title: "分享到微博",
                    scheme: "sinaweibo://compose?content=" + TITLE + ' ' + SHARE_URL,
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
                    title: opts.dialog_title,
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
        'setWeixinShareMenu': function(wx, url,opts){
            // alert('设置微信分享菜单');
            wx.onMenuShareTimeline({
                title: TITLE, // 分享标题
                link: url, // 分享链接
                imgUrl: 'http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg', // 分享图标
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
                title: TITLE_2, // 分享标题
                desc: '昵称不仅仅是一个符号，也会有更深刻的寓意，看看你的昵称会有网红范儿吗……', // 分享描述
                link: url, // 分享链接
                imgUrl: 'http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg', // 分享图标
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
            $body.on("tap", "[action=share]", Tools.showMask);
        },
        // 释放事件
        "releaseEvent": function(){
            $body.off("touchend", "[action=share]", Tools.showMask);
        }
    };
    function init(opts) {
        var platform = opts.platform;
        TITLE =opts.dialog_describe || ([
            '天啦噜，我竟然这么有网红范儿，想想都很开心呢！',
            '我竟然有当网红的潜力……',
            '我的网红范儿这么足，真是意想不到！',
            '看看你会有网红范儿吗？我的网红范儿竟然是……',
            '测测你的昵称会有网红范儿吗？'
        ])[parseInt(Math.random()*5)];

        TITLE_2 =opts.dialog_describe || ([
            '你的昵称会有当网红的潜力吗？',
            '想当网红？先来看看你有一个好昵称吗',
            '不要小看你的昵称呦……',
            '你的昵称竟然蕴含这么大的秘密……',
            '测测你的昵称会有网红范儿吗？'
        ])[parseInt(Math.random()*5)];

        SHARE_URL = 'http://'+document.domain+ opts.share_url;
        if(platform == 'weibo'){
            $('[action=share]').attr('href','sinaweibo://compose?content='+TITLE+' '+SHARE_URL);
        }
        // 初始化 JSSDK
        jssdk.init(platform, opts.jssdk, function(){
            // 如果初始化失败，就什么都不做
            if(arguments.length > 0){
                return;
            }
            if(platform == 'weibo'){
                var WeiboJS = jssdk.getJssdkObject();
                Tools.setWeiboShareMenu(WeiboJS,opts);
                $('[action=share]').attr('href','sinaweibo://compose?content='+TITLE_2+' '+SHARE_URL);
                return;
            }
            if(platform == 'weixin'){
                var wx = jssdk.getJssdkObject();
                wx.showOptionMenu();
                Tools.setWeixinShareMenu(wx, SHARE_URL, opts);
                return;
            }
        });

        if(platform == 'weixin'){
            Tools.bindEvent(opts);
        }

        // 延迟加载微信分享的 tips
        lazyload.load("common/share/tips/js/index", function(Dialog){
            weixinTips = new Dialog({
                'title': '请点击右上角，选择分享至好友或朋友圈，就可以让好友看到这个测试啦',
                'text': ' '
            });
        });
    }
    function destroy(opts) {
        platform = null;
        share_url = null;
        signedRequest = null;
        WeiboJS = null;
        wx = null;
        runShare = null;
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});