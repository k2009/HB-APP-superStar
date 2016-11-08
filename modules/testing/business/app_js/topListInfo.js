define(function(require, exports, module) {
    var jssdk = require("common/share/jssdk");
    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var platform;
    var share_url;
    var signedRequest = null;
    var WeiboJS, wx, appid;
    var staticDomain;
    var runShare = {
        titleIco: function(){
            var title = ['如何在微博里更好地赚钱?测测这个,结果也许会惊讶掉你的下巴！',
                '想做电商网红?不了解这个怎么能行，,测一测,也许瞬间就会找到人生方向！',
                '如何正确的做电商网红？是时候该测测你的微博电商属性了！',
                '想在微博里月入上万？那就来测测你现在的属性吧！',
                '做网红也是一门学问，尤其是电商网红，测测你现在符合电商网红么？'];
            var ico = [];
            ico.push( 'http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg' );
            var random = Math.random();
            return {
                title: title[ Math.floor( random*title.length ) ],
                ico: ico[ Math.floor( random*ico.length ) ]
            }
        },
        WXshare: function(){
            var titleIco = this.titleIco();
            wx.onMenuShareTimeline({
                title: titleIco.title, // 分享标题
                link: share_url, // 分享链接
                imgUrl: titleIco.ico, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: titleIco.title, // 分享标题
                desc: titleIco.title, // 分享描述
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
            var titleIco = this.titleIco();
            var items = {
                shareToWeibo: {
                    title: "分享到微博",
                    scheme: "sinaweibo://compose?content=" + titleIco.title + '：' + share_url,
                    code: 1001
                }
            };
            var itemArray = [];
            for( var key in items ){
                itemArray.push( items[key] );
            }
            // 设置分享的文案
            WeiboJS.setSharingContent({
                external:{
                    title: titleIco.title,
                    icon: titleIco.ico,
                    desc: titleIco.title
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
        // 创建一个 iframe 来获取微博的 signed_request 信息，这是个临时方案
        createAgentIframe: function() {
            var appkey = appid;
            var iframeId = "__lightapp_agent_iframe";
            var iframe = document.createElement("iframe");
            var _loadLock = false;
            var _loadHandler = function(type) {
                if (_loadLock) {
                    return;
                }
                _loadLock = true;
                runShare.iframeWin = document.getElementById(iframeId).contentWindow;
            };
            iframe.addEventListener("load", function() {
                _loadHandler("event");
                runShare.getSignedRequest();
            });
            iframe.src = "http://apps.weibo.com/liteblank.php?appkey=" + appkey;
            iframe.id = iframeId;
            iframe.style.display = "none";
            setTimeout(function() {
                _loadHandler("timeout");
            }, 300);
            document.body.appendChild(iframe);
            window.addEventListener("message", runShare.receiveMessage, false);
        },
        // 发出 postMessage 给 iframe
        getSignedRequest: function(){
            try{
                var uuid = new Date().getTime() + ("000000" + Math.floor(Math.random() * 99999)).replace(/\d+(\d{6})$/, "$1");
                var key = "getSignedRequest#@#" + uuid;
                runShare.iframeWin.postMessage(key + ":::{}", "*");
            } catch(e) {
            }
        },
        // 解析收到的 signed_request 参数，并存下来
        receiveMessage: function(evt) {
            if (/^getSignedRequest/i.test(evt.data)) {
                var data = evt.data.split(":::");
                if(data.length == 2){
                    data = data[1];
                }
                try{
                    data = JSON.parse(data);
                    signedRequest = data.signed_request;
                }catch(e){
                    signedRequest = null;
                }
            }
        }
    };
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

    function init(opts) {
        share_url = opts.share_url;
        platform = opts.platform;
        appid = opts.jssdk.appid;
        staticDomain = opts._extra.domain;

        seajs.use( 'libs/echarts/3.1.10/echarts.min.js',function(weixinSDK){
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('detail-echarts'));
            // 指定图表的配置项和数据
            var option = {};
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption( opts.top_webreds );
        });
        var eventPageXstart = 0;
        $( '#st_modules_h5_businessTopListInfo' ).on('touchstart', '.content-box', function(e){
            var touch = e.touches[0];
            eventPageXstart = touch.clientX;
        }).on('touchend', '.content-box', function(e){

            var touch = e.changedTouches[0],
                eventPageXend = touch.clientX,
                distance = eventPageXend - eventPageXstart;
            if( distance > 70 ){
                if( !opts.prev_url ){
                    Alert( '已经是第一个网红了！' );
                    return;
                }
                SCRM.pjax( opts.prev_url );
            }else if( distance < -70 ){
                if( !opts.next_url ){
                    Alert( '已经是最后一个网红了！' );
                    return;
                }
                SCRM.pjax( opts.next_url );
            }
        });
        var ua = navigator.userAgent.toLowerCase(); 
        if (!/iphone|ipad|ipod/.test(ua)) {
            $( '.content-box' ).on('touchmove', function(e){
                e.preventDefault();
            });
        };
    }
    function destroy(opts) {
        $( '#st_modules_h5_businessTopListInfo' ).off();
        $( '.alert_dom' ).remove();
        $( '.alert_close' ).off().remove();
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});