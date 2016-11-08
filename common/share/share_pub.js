define(function(require, exports, module) {
    var jssdk = require("common/share/jssdk");

    var SHARE_URL;
    var TITLE;
    var imageUrl;

    var Tools = {
        'setWeiboShareMenu': function(WeiboJS, share_title, share_url){
            var items = {
                shareToWeibo: {
                    title: "分享到微博",
                    scheme: "sinaweibo://compose?content=%23网红城堡%23" + share_title + ' ' + link_url,
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
        'setWeixinShareMenu': function(wx, share_title, share_url, img_url, share_desc){
            // alert('设置微信分享菜单');
            wx.onMenuShareTimeline({
                title: share_title, // 分享标题
                link: link_url, // 分享链接
                imgUrl: img_url, // 分享图标
                success: function () {
                },
                cancel: function () {
                }
            });
            wx.onMenuShareAppMessage({
                title: share_title, // 分享标题
                desc: desc || share_title, // 分享描述
                link: link_url, // 分享链接
                imgUrl: img_url, // 分享图标
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
        }
    };
    function init(opts) {
        var platform = opts.platform;
        var share_title = opts.title || document.title;
        var share_url = opts.share_url || location.href;
        var img_url = opts.image  || 'http://' + opts._extra.domain + '/common/share/deafult_icon.png';
        var share_desc = opts.share_desc || share_title;

        // 初始化 JSSDK
        jssdk.init(platform, opts.jssdk, function(){
            // 如果初始化失败，就什么都不做
            if(arguments.length > 0){
                return;
            }
            if(platform == 'weibo'){
                var WeiboJS = jssdk.getJssdkObject();
                Tools.setWeiboShareMenu(WeiboJS, share_title, share_url);
                return;
            }
            if(platform == 'weixin'){
                var wx = jssdk.getJssdkObject();
                wx.showOptionMenu();
                Tools.setWeixinShareMenu(wx, share_title, share_url, img_url, share_desc);
                return;
            }
        });
    }
    function destroy(opts) {
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});