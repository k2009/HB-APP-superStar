define(function(require, exports, module) {
    "use strict";


    var $tmp = require("kit/util/plus-share/share.html");

    seajs.use('kit/util/plus-share/share.css');



    var reg = /https?\:\/\//i;
    var sys = {
        init:function(){
            sys.htmlInit();
            sys.getShares();
            return sys.share;
        },
        htmlInit:function(){
            var $box = sys.$box = $($tmp);
            sys.hide();
            $('body').append($box);

            sys.event();
        },
        getShares:function(){
            var shares = sys.shares = {};
            mui.plusReady(function() {
                plus.share.getServices(function(s) {
                    if (s && s.length > 0) {
                        for (var i = 0; i < s.length; i++) {
                            var t = s[i];
                            shares[t.id] = t;
                        }
                    }
                }, function() {
                    console.log("获取分享服务列表失败");
                });
            });
        },
        show:function(){
            sys.$box.removeClass('plus-share-hide');
        },
        hide:function(){
            sys.$box.addClass('plus-share-hide');
        },
        event:function(){
            var $box = sys.$box;

            $box.
                unbind().
                on('tap', '.plus-share-box',sys.fn.fn_click).
                on('tap','.plus-bottom-bar',sys.hide)

        },
        destroy:function(){

            sys.$box&&sys.$box.remove();

        },

        shareMessage:function(share, ex, msg, success, error) {
            if (!ex && (!reg.test(msg.content))) {
                console.log('检测到是微博分享,增加url')
                msg.content += msg.href;
            }
            mui.toast("分享到\"" + share.description + "\"中...请稍后");

            msg.extra = {
                scene: ex
            }
            if (~share.id.indexOf('weibo')) {
                // msg.content += "；";          //微博单独加链接
            }
            share.send(msg, function() {
                success(msg);
                sys.hide();
                mui.toast("分享到\"" + share.description + "\"成功！ ");
            }, function(e) {
                error(msg);
                mui.toast("分享到\"" + share.description + "\"失败 ");
                console.log(JSON.stringify(e))
            });
        },
        fn:{
            fn_click:function(e){
                var share_id = $(this).data('id');
                var share_ex = $(this).data('ex');
                var cfg = sys.shareConfig;

                var share = sys.shares[share_id];
                if (share) {
                    if (share.authenticated) {
                        sys.shareMessage(share, share_ex,cfg.msg,cfg.success,cfg.error);
                    } else {
                        share.authorize(function() {
                            sys.shareMessage(share, share_ex,cfg.msg,cfg.success,cfg.error);
                        }, function(e) {
                            console.log("认证授权失败：" + e.code + " - " + e.message);
                        });
                    }
                } else {
                    mui.toast("无法获取分享服务,参数配置错误")
                }
            }
        },
        share:function(config){
            $(document).find('input,textarea').each(function(){
                this.blur();
            });
            if(!$('.plus-bottom-share').length){
                sys.htmlInit();
            }
            sys.shareConfig = config;

            sys.show();
        }
    }


    return sys.init();


})