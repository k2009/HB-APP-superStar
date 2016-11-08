define(function(require, exports, module) {
    var $body=$(document.body);
    var lazyload = require("kit/util/asyncModule");
    var jssdk = require("common/share/jssdk");

    var SHARE_URL = "";
    var TITLE;
    var imageUrl="http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg";

    var Tools = {
        'setWeiboShareMenu': function(WeiboJS,opts){
            var items = {
                shareToWeibo: {
                    title: "分享到微博",
                    scheme: "sinaweibo://compose?content=%23网红城堡%23" + TITLE + ' ' + SHARE_URL,
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
                    title: TITLE,
                    icon: imageUrl,
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
                imgUrl: imageUrl, // 分享图标
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
                title: TITLE, // 分享标题
                desc: TITLE, // 分享描述
                link: url, // 分享链接
                imgUrl: imageUrl, // 分享图标
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
            $body.on("tap", "[action=invite]", Tools.showMask);
        },
        // 释放事件
        "releaseEvent": function(){
            $body.off("touchend", "[action=invite]", Tools.hideMask);
        }
    };
    function init(opts) {
        var platform = opts.platform;
        TITLE = opts.title;
        imageUrl=opts.image;
        SHARE_URL = window.pageURL;

        // 初始化 JSSDK
        jssdk.init(platform, opts.jssdk, function(){
            // 如果初始化失败，就什么都不做
            if(arguments.length > 0){
                return;
            }
            if(platform == 'weibo'){
                var WeiboJS = jssdk.getJssdkObject();
                Tools.setWeiboShareMenu(WeiboJS,opts);
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
                'title': TITLE,
                'text': '点击右上角，分享给 TA 吧'
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