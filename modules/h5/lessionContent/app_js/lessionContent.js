define(function(require, exports, module) {
    var $share = require('modules/h5/lessionContent/js/share');
    var $body = $(document.body);
    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var initData;
    var finishTip;

    // 王硕，你先别改这个了
    var showDialog=function(){
        console.log(JSON.stringify(initData))
        $('.container').append(['<div id="div1">',
        '   <div class="mask"></div>',
        '   <div class="share-tip">',
        '       <div class="share-block" node="content">',
        '<div class="title">' + (initData.next_lesson_url == null ? '恭喜你成功学习完此课程！请继续关注我们后续的课程。': '成功学习完本节课，肯定收获不小吧！再加把劲儿，很快就学完本章了呢。') + '</div>'
                    +'<div class="content">'
                        // 如果有下一节，就输出下一节按钮
                        + (initData.next_lesson_status == 'ok'
                            ? '<a href="' + initData.next_lesson_url + '" pjax="1" class="mui-btn tc_go" id="finish">进入下一课</a>'
                            :'<a href="javascript:;" action="stop" data="'+initData.next_lesson_status+'" class="mui-btn tc_go" id="finish">进入下一课</a>'
                            )
                            +'<br/><br/>'
                        +'<a style="color:#007aff;" class="back-webview">休息一下</a>'
                    +'</div>',
        '       </div>',
        '           <span class="mui-icon mui-icon-closeempty"></span>',
        '   </div>',
        '</div>',
        '<link rel="stylesheet" type="text/css" href="../common/share/tips/css/index.css">'].join(""))
    }

    var stop=function(){
        var status=$(this).attr('data');
        $("#div1").remove();
        mui.alert(initData.next_lesson_status_info,'','我知道了');
    }

    function init(opts) {
        $("#div1").remove();
        $body.delegate('[action=stop]','tap',stop);
        $body.on('tap',".mui-icon-closeempty" ,function(){
            $("#div1").remove();
        }).on('tap',".back-webview",function(){
            pageID = "st_modules_h5_lessionContent";
            plus.webview.close( pageID,"auto")
        })
        $('#finish').bind('tap',showDialog);
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
        $body.undelegate('[action=stop]','tap',stop);
        $body.unbind();
        $('#finish').unbind();
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