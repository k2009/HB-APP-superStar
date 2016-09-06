define(function(require, exports, module) {
    var jssdk = require("common/share/jssdk");
    var lazyload = require("kit/util/asyncModule");
    var platform, tabbar;
    var share_url;
    var dialogTips;
    var blockList = '<li>\
                <div class="block" style="height:${data.heightList[0]}%">\
                    <p>很符合<br>${data.result[0]}</p>\
                </div>\
            </li>\
            <li>\
                <div class="block" style="height:${data.heightList[1]}%">\
                    <p>符合<br>${data.result[1]}</p>\
                </div>\
            </li>\
            <li>\
                <div class="block" style="height:${data.heightList[2]}%">\
                    <p>一般<br>${data.result[2]}</p>\
                </div>\
            </li>\
            <li>\
                <div class="block" style="height:${data.heightList[3]}%">\
                    <p>不符合<br>${data.result[3]}</p>\
                </div>\
            </li>\
            <li>\
                <div class="block" style="height:${data.heightList[4]}%">\
                    <p>很不符合<br>${data.result[4]}</p>\
                </div>\
            </li>';
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
                imgUrl: 'http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: title, // 分享描述
                link: share_url, // 分享链接
                imgUrl: 'http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg', // 分享图标
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
                    title: "课后作业-测试验收",
                    icon: "http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg",
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
                '我在参加网红培养计划，课后作业必须你来点评！别隐藏潜质，你也被发现了！',
                '我在参加百万网红培养计划，作业你来点评！美美的星梦，你也必须有！',
                '加入网红，甩宝强几条街！我在参加百万网红培养计划快来点评，带你一起燃梦',
                '我们缺一个有梦想敢拼的妹纸！百万网红计划—我在参加，你快来点评，一起燃梦！',
                '只想走捷径，那就不配红！互联网大咖助力百万网红培养计划，我在参加快来评！'
            ];
            return title[ Math.floor( Math.random() * title.length ) ];
        }
    }

    function init(opts) {
        platform = opts.platform;
        share_url = window.location.origin + opts.share_url;

        var data = opts,
            total = eval(data.result.join('+'));
            data.heightList = [];
        for( var i=0; i<data.result.length; i++ ){
            //$( '#chartList .block' ).eq( i ).height( data.result[i]/total * 100 + '%' );
            data.heightList.push( data.result[i]/total * 100 );
        }
        var blockListHtml = SCRM.easyTemplate( blockList, data ).toString();
            //$( '#chartList' )[0].innerHTML = blockListHtml;
            $( '#chartList' ).html( blockListHtml );

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
            ret.setActiveTab(1);
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
        platform = null;
        share_url = null;
        blockList = null;
        Alert = null;
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