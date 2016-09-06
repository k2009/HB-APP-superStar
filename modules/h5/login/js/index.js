define(function(require, exports, module) {

    require("common/util/loadMUI");
    var jssdk = require("common/share/jssdk");
    // 根据有没有 MUI，决定绑定的事件是什么
    var event_type = (typeof window.mui != "undefined") ? 'tap' : 'click';

    var Tools = {
        "bindEvent": function(){
            $("#st_modules_h5_login").on(event_type, "[action=wbregist]", Tools.wbRegist);
        },
        "releaseEvent": function(){
            $("#st_modules_h5_login").off(event_type, "[action=wbregist]");
        },
        // 点击微博界面的使用当前账号登录按钮，发一个 ajax 请求
        "wbRegist": function(){
            var url = $(this).attr("href");
            var next_url = $(this).attr("next_url");
            $.ajax({
                method: "POST",
                url: url,
                dataType: "json"
            }).done(function( msg ) {
                if(typeof msg == "undefined" || typeof msg.code == "undefined"){
                    mui.toast('系统繁忙，保存失败');
                    return;
                }
                switch(msg.code) {
                    case 0:
                        try{
                        mui.toast('保存成功');
                        window.location.href = next_url;
                        }catch(e){}
                        break;
                    default:
                        mui.toast('保存失败：' + msg.message);
                        break;
                }
            });
        }
    };

    function init(opts) {
        var platform = opts.platform;
        // 初始化 JSSDK
        jssdk.init(platform, opts.jssdk, function(){
            // 如果初始化失败，就什么都不做
            if(arguments.length > 0){
                return;
            }
        });

        Tools.bindEvent();
    }

    function destroy(opts) {
        Tools.releaseEvent();
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});