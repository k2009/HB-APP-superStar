define(function(require, exports, module) {
    "use strict";
    var $share = require("kit/util/plus-share"); //分享
    mui.ready(function() {

        mui('.container').on('tap','.mui-btn-block', function() {
            $share({
                msg:{
                    href : window.pageData.next_url,
                    title : '一起变红',
                    content : '想不想在人群中脱颖而出，成为坐拥百万粉丝的红人？快快加入网红城堡，众多业内大佬带你开启圆梦之旅~~',
                    thumbs : ['http://ww2.sinaimg.cn/large/0060lm7Tgw1f5tevi6q7qj303c03cjrc.jpg']
                }
            });
            return false;
        })

    })
});