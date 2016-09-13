define(function(require, exports, module) {
    require("common/util/loadMUI");
    var $body=$(document.body);
    var check;
    var lazyload = require("kit/util/asyncModule");
    var jssdk = require("common/share/jssdk");
    var wordCloud=require('modules/testing/weiboDNA/js/wordCloud');

    var TITLE='Guys，你确定真的了解我么？点开，也许你会发现不一样的我哟~';
    var SHARE_URL = "";
    var initData;
    var dueTime=3600*24*7*1000;//7days

    var Tools = {
        'setWeiboShareMenu': function(WeiboJS){
            var items = {
                shareToWeibo: {
                    title: "分享到微博",
                    scheme: "sinaweibo://compose?content=" + TITLE + '：'+ SHARE_URL,
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
                    title: "一起炫酷",
                    icon: "http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg",
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
                imgUrl: 'http://ww1.sinaimg.cn/mw690/4d6b334agw1f6wx4ltemuj20i20augm1.jpg', // 分享图标
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
                title: "一起炫酷", // 分享标题
                desc: TITLE, // 分享描述
                link: url, // 分享链接
                imgUrl: 'http://ww1.sinaimg.cn/mw690/4d6b334agw1f6wx4ltemuj20i20augm1.jpg', // 分享图标
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
            $body.on("click", "[action=invite]", Tools.showMask);
        },
        // 释放事件
        "releaseEvent": function(){
            $body.off("touchend", "[action=invite]", Tools.showMask);
        }
    };

    var render=function(data){

    }

    var showUnder=function(){
        setTimeout(function(){
            $body.find('[node=content]').css('opacity','1');
        },500);
        setTimeout(function(){
            $body.find('[node=btnBox]').css('display','');
        },1000);
    }

    var reTest=function (e) {
        var now=(new Date).getTime();
        if(now-initData.next_time*1000<dueTime){
            mui.alert('亲，你最近才测试过，短时间内微博DNA图谱是不会有太大变化的，请7天后再来测试吧','','好的');
        }else{
            location.href=initData.result_url;
        }
        
    }

    function init(opts) {
        initData=opts;
        $body.delegate('[reTest]','click',reTest);
        TITLE =([
            'Guys，你确定真的了解我么？点开，也许你会发现不一样的我哟~',
            '邀请你的好友一起参加微博DNA测试，也许你自己都会惊呆了呢~',
            '其实我还有很多八卦哟，比如...想知道么？那就进来看看吧~',
            '超前卫的智能化分析体验尽在时趣网红城堡，带你走进哈利波特的奇幻世界~',
            '好东西一定会分享给你们，特别是这么新鲜好玩的东东哟~快到碗里来吧~'
        ])[parseInt(Math.random()*5)];

        if(opts.is_share==1){
            wordCloud.draw(opts.tags,showUnder);
        }else{
            $body.find('a[action=invite]').attr('href','sinaweibo://compose?content='+TITLE+' : http://'+document.domain+opts.share_url);
            if(!parseInt(opts.weibo_user_id)){
                var url=opts.wait_url;
                check=setInterval(function(){
                    $.ajax({
                        url:url,
                        dataType:'json',
                        success:function(json){
                            var data=json.data.real_data.st_modules_testing_weiboDNAinvite;
                            if(parseInt(data.weibo_user_id)){
                                clearInterval(check);
                                $('#loadingCover').remove();
                                wordCloud.draw(data.tags,showUnder);
                                $body.find('[node=profile_img]').attr('src',data.profile_image);
                                $body.find('[node=screen_name]').attr('src',data.screen_name);
                            }
                        }
                    });
                },2000);
            }else{
                $('#loadingCover').remove();
                wordCloud.draw(opts.tags,showUnder);
            } 
        }       

        var platform = opts.platform;
        SHARE_URL = 'http://'+document.domain+ opts.share_url;

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
                Tools.setWeixinShareMenu(wx, SHARE_URL);
                return;
            }
        });

        if(platform == 'weixin'){
            Tools.bindEvent();
        }

        // 延迟加载微信分享的 tips
        lazyload.load("common/share/tips/js/index", function(Dialog){
            weixinTips = new Dialog({
                'title': '想让你的朋友也炫酷一把么？',
                'text': '点击右上角，分享给 TA 吧'
            });
        });
    }

    function destroy(opts) {
        console.log("destroy 邀请好友");
        $('#loadingCover').remove();
        Tools.hideMask();
        Tools.releaseEvent();
        Tools = null;
        wordCloud.destroy();
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});