define(function(require, exports, module) {

    var jssdk = require("common/share/jssdk");
    
    function init(opts) {
        var platform = opts.platform;
        // 初始化 JSSDK
        jssdk.init(platform, opts.jssdk, function(){
            // 如果初始化失败，就什么都不做
            if(arguments.length > 0){
                return;
            }
        });
    }

    function destroy(opts) {
        console.log("destroy example");
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});