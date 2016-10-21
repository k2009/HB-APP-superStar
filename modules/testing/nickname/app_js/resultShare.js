define(function(require, exports, module) {
    var $body=$(document.body);

    var $share = require("kit/util/plus-share/shareUI"); //分享
    var lazyload = require("kit/util/asyncModule");
    var jssdk = require("common/share/jssdk");
    var wordCloud=require('modules/testing/weiboDNA/js/wordCloud');

    var TITLE='想不想在人群中脱颖而出，成为坐拥百万粉丝的红人？快快加入网红城堡，众多业内大佬带你开启圆梦之旅~~';
    var TITLE_2;
    var SHARE_URL = "";
    function init(opts) {
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

        SHARE_URL = plus.storage.getItem("domain")+ opts.share_url;
        function fn1(){
            $share({
                msg:{
                    href : SHARE_URL,
                    title : TITLE,
                    content : TITLE_2,
                    thumbs : ['http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg']
                }
            });
        }
        $body.unbind('tap', "[action=share]").on("tap", "[action=share]", fn1);
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