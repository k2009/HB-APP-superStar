define(function(require, exports, module) {
    //require("common/util/loadMUI");
    var $share = require('modules/h5/lessionContent/js/share');
    var $body = $(document.body);
    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var initData;
    var finishTip;

    lazyload.load("common/share/tips/js/index", function(dialog){
        finishTip = new dialog({});           
    });

    // 王硕，你先别改这个了
    var showDialog=function(){
        if(initData.next_lesson_status == 0){
            finishTip.show({
                content:'<div class="title">' + (initData.next_lesson_url == null ? '恭喜你成功学习完此课程！请继续关注我们后续的课程。': '成功学习完本节课，肯定收获不小吧！再加把劲儿，很快就学完本章了呢。') + '</div>'
                        +'<div class="content">'
                            // 如果有下一节，就输出下一节按钮
                            + '<a href="' + initData.next_lesson_url + '" pjax="1" class="mui-btn tc_go" id="finish">进入下一课</a>'
                                +'<br/><br/>'
                            +'<a style="color:#007aff;" href="' + initData.prev_url + '" pjax="1">休息一下</a>'
                        +'</div>'
            });
        }else{
            finishTip.show({
                content:'<div class="title">' + initData.next_lesson_status_info +'</div><div class="content">'
                            // 如果有下一节，就输出下一节按钮
                         //   + '<a href="' + initData.next_lesson_url + '" pjax="1" class="mui-btn tc_go" id="finish">进入下一课</a>'
                               // +'<br/><br/>'
                                +'<a style="color:#007aff;" href="' + initData.prev_url + '" pjax="1">我知道了</a>'
                        +'</div>'
            });
            //mui.alert(initData.next_lesson_status_info,'','我知道了'); 
        }        
    }

    function init(opts) {
        $('#finish').bind('click',showDialog);
        initData=opts;
        $share.init(opts);

        // 公共头部
        header.init();          
        lazyload.load("common/tabbar/js/index", function(dialog){
            dialog.setData(opts.tabbar);
            dialog.setActiveTab(1);
        });       
    }

    function destroy(opts) {
        $share.destroy();
        header.destroy();
        if(finishTip){
            finishTip.hide();
        }
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});