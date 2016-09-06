define(function(require, exports, module) {
    "use strict";

    //分享操作
    var shares = {};

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

    var ids = [{
            id: "weixin",
            ex: "WXSceneSession"
        }, {
            id: "weixin",
            ex: "WXSceneTimeline"
        }, {
            id: "sinaweibo"
        }, {
            id: "qq"
        }],
        bts = [{
            title: "发送给微信好友"
        }, {
            title: "分享到微信朋友圈"
        }, {
            title: "分享到新浪微博"
        }, {
            title: "分享到QQ"
        }];

    function shareMessage(share, ex,msg,success,error) {

        msg.extra = {
            scene: ex
        }
        if (~share.id.indexOf('weibo')) {
            // msg.content += "；";          //微博单独加链接
        }
        share.send(msg, function() {
            success(msg);
            console.log("分享到\"" + share.description + "\"成功！ ");
        }, function(e) {
            error(msg);
            console.log("分享到\"" + share.description + "\"失败: " + e.code + " - " + e.message);
        });
    }

    //执行分享
    function share(config) {

        var cfg = {
            msg:{
                href : "http://douban.com",
                title : "这是一段示例文案",
                content : "测试看看这个到底能不能用",
                thumbs : ["_www/images/logo.png"]
            },
            success:function(){

            },
            error:function(){

            }
        }
        if(!config){
            config = cfg;
        }else{
            config = $.extend(true,cfg,config);
        }
        console.log(JSON.stringify(config))
        plus.nativeUI.actionSheet({
            cancel: "取消",
            buttons: bts
        }, function(e) {
            var i = e.index;
            if (i > 0) {
                var s_id = ids[i - 1].id;
                var share = shares[s_id];
                if (share) {
                    if (share.authenticated) {
                        shareMessage(share, ids[i - 1].ex,config.msg,config.success,config.error);
                    } else {
                        share.authorize(function() {
                            shareMessage(share, ids[i - 1].ex,config.msg,config.success,config.error);
                        }, function(e) {
                            console.log("认证授权失败：" + e.code + " - " + e.message);
                        });
                    }
                } else {
                    mui.toast("无法获取分享服务,参数配置错误")
                }
            }
        });
    }


    return share;

})