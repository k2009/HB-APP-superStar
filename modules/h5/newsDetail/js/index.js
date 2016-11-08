define(function(require, exports, module) {
    var share=require('modules/h5/newsDetail/js/share');
    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var tabbar;

    var setDescribe=function(str){
        var firstTwo=str.slice(0,2);
        var last=str.slice(2);
        $('#describe').html('<font color="#1a1a1a">'+firstTwo+'</font>'+last).css('display','');
    };

    function init(opts) {
        // body...
	    // 延迟加载 tabbar
       // opts.desc && setDescribe(opts.desc);
        lazyload.load("common/tabbar/js/index", function(ret){
            ret.setData(opts.tabbar);
            ret.setActiveTab(0);
            tabbar = ret;
        });
        // 公共头部
        header.init(); 
        share.init(opts);
    }

    function destroy(opts) {
        if(tabbar){
            tabbar.destroy();
        }
        header.destroy(); 
        share.destroy();
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});