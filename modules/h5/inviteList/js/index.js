define(function(require, exports, module) {

    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var tabbar;
    
    function init(opts) {
        // 延迟加载 tabbar
        lazyload.load("common/tabbar/js/index", function(ret){
            ret.setData(opts.tabbar);
            ret.setActiveTab(0);
            tabbar = ret;
        });
        // 公共头部
        header.init();
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