define(function(require, exports, module) {

    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var $shareUI = require("kit/util/plus-share/shareUI"); //分享
    var tabbar;

    var setDescribe=function(str){
        var firstTwo=str.slice(0,2);
        var last=str.slice(2);
        $('#describe').html('<font color="#1a1a1a">'+firstTwo+'</font>'+last).css('display','');
    }

    function init(opts) {
        // body...
	    // 延迟加载 tabbar
       // opts.desc && setDescribe(opts.desc);
       console.log(JSON.stringify(opts))
        window.addEventListener('share',function(e){
            var TITLE='想不想在人群中脱颖而出，成为坐拥百万粉丝的红人？快快加入网红城堡，众多业内大佬带你开启圆梦之旅~~';
            $shareUI({
                msg:{
                    href : window.pageURL,
                    title : opts.title,
                    content : TITLE,
                    thumbs : [(opts.image||'http://ww3.sinaimg.cn/mw690/a0bb4f55gw1f95gezp2p9j203c03c0sk.jpg')]
                }
            });
        });
    }

    function destroy(opts) {
        if(tabbar){
            tabbar.destroy();
        }
        header.destroy(); 
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});