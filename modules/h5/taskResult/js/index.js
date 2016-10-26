define(function(require, exports, module) {
    var jssdk = require("common/share/jssdk");
    var lazyload = require("kit/util/asyncModule");
    var platform, tabbar;
    var share_url;
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
                desc: title, // 分享描述
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
                '拿出你追求完美的精神来帮我点评网红培养课后作业！别隐藏潜质，你是最棒的！',
                '作为我的网红梦想导师，课后作业怎能缺少你的点评！快来，点评小能手！',
                '年轻怎能没有梦想！我在参加百万网红培养计划，作业点评，非你莫属！',
                '互联网大咖助力百万网红培养计划，我在参加快来点评！你就是下一个最牛网红星探！',
                '才华横溢但又默默无闻的你，网红培养课后作业点评，非你莫属！'
            ];
            return title[ Math.floor( Math.random() * title.length ) ];
        },
        title_2: function(){
            var title = [
                '追求完美的你怎会错过这场点评！',
                '神助般的建议，我特别需要你！',
                '点燃梦想的圣火，非你莫属！',
                '你的网红星探潜质被我发现啦，快来！',
                '不想抛头露面，也可以做网红幕后操盘手！'
            ];
            return title[ Math.floor( Math.random() * title.length ) ];

        }
    }
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

        // 延迟加载 tabbar
        lazyload.load("common/tabbar/js/index", function(ret){
            ret.setData(opts.tabbar);
            ret.setActiveTab(2);
            tabbar = ret;
        });

        // 延迟加载微信分享的 tips
        lazyload.load("common/share/tips/js/index", function(dialog){
            dialogTips = new dialog({
                title: '好了，现在招呼你的朋友帮你提提意见!'
            });
        });

        $( '#st_modules_h5_taskResult' ).on('touchend', '#run_share', function(){
            dialogTips.show();
        });
    };

    function destroy(opts) {
        $( '#st_modules_h5_taskResult' ).off();
        $( '.alert_close' ).off();
        $( '.alert_dom' ).remove();
        if(dialogTips)dialogTips.destroy();
        if(tabbar){
            tabbar.destroy();
        }
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});