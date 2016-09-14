define(function(require, exports, module) {
    var platform;
    var share_url;
    var WeiboJS, wx;
    var jssdk = require("common/share/jssdk");
    var lazyload = require("kit/util/asyncModule");
    var dialogTips;
    //美化alert start
    var Alert = function( str ){
        var dom = '<div class="alert_dom mui-popup mui-popup-in" style="display: block;">\
                <div class="mui-popup-inner">\
                    <p class="alert_content"></p>\
                </div>\
                <div class="mui-popup-buttons"><span class="alert_close mui-popup-button mui-popup-button-bold">确定</span></div></div>\
                <div class="alert_dom mui-popup-backdrop mui-active" style="display: block;"></div>';
        var $dom = $( dom );
        $dom.find( '.alert_content' ).html( str );
        $( 'body' ).append( $dom );
        $( '.alert_close' ).on('touchend', function(){
            $( this ).off();
            $( '.alert_dom' ).remove();
            return false;
        });
    }
    //美化alert end
    var share = {
        WXshare: function(){
            var title = this.title();

            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: share_url, // 分享链接
                imgUrl: 'http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    $( '.mui-popup-backdrop' ).remove();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    $( '.mui-popup-backdrop' ).remove();
                }
            });
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: title, // 分享描述
                link: share_url, // 分享链接
                imgUrl: 'http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    $( '.mui-popup-backdrop' ).remove();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    $( '.mui-popup-backdrop' ).remove();
                }
            });
        },
        WBshare: function(){
            var title = this.title();
            var items = {
                shareToWeibo: {
                    title: "分享到微博",
                    //scheme: "sinaweibo://sendweibo?content=" + title + '：' + share_url,
                    scheme: "sinaweibo://compose?content=" + title + '：' + share_url,
                    code: 1001
                },
                follow: {
                    title: "关注",
                    code: 10002
                }
                // ,
                // shareToWeixin: {
                //     title: "分享到微信",
                //     code: 1004
                // },
                // shareToPYQ: {
                //     title: "分享到朋友圈",
                //     code: 1005
                // }
            };
            var itemArray = [];
            for( var key in items ){
                itemArray.push( items[key] );
            }
            // 设置分享的文案
            WeiboJS.setSharingContent({
                external:{
                    title: "课后作业-测试验收",
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
                '我在参加百万网红培养计划，毫无尿点的作业必须你来点评！别隐藏潜质，你也被发现了！',
                '比扑倒汉子更让你高潮！我在参加百万网红培养计划，作业你来点评！湿湿的星梦，你也必须有！',
                '你能火的原因只有一个！我在参加百万网红培养计划快来点评，带你一起燃梦！',
                '只想裸露身体，那你就不配红！互联网大咖助力百万网红培养计划，我在参加快来点评！',
                '我们缺一个口活好手指巧的妹纸！百万网红计划——我在参加，你快来点评，一起燃梦！'
            ];
            return title[ Math.floor( Math.random()*5 ) ];
        }
    };


    function init(opts) {
        platform = opts.platform;
        share_url = window.location.origin + opts.share_url;

        // 初始化 JSSDK
        jssdk.init(platform, opts.jssdk, function(){
            if(platform == 'weibo'){
                WeiboJS = jssdk.getJssdkObject();
                share.WBshare();
                return;
            }
            if(platform == 'weixin'){
                wx = jssdk.getJssdkObject();
                share.WXshare();
                return;
            }
        });

        // 延迟加载微信分享的 tips
        lazyload.load("common/share/tips/js/index", function(dialog){
            dialogTips = new dialog({
                'title': '想要帮助好友变红，只需要动动手指就可以哦'
            });
        });

        $( '#st_modules_h5_h5SubmitSuccess' ).on('touchend', '#help', function(){
            dialogTips.show();
        });
    }
    function destroy(opts) {
        $( '#st_modules_h5_h5SubmitSuccess' ).off();
        platform = null;
        share_url = null;
        Alert = null;
        share = null;
        dialogTips.destroy();
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});