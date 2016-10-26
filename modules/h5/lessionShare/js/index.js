define(function(require, exports, module) {
    var $share=require('modules/h5/lessionContent/js/share');
    var $body=$(document.body);
    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var initData;
    var finishTip; 

    var ID = "#st_modules_h5_lessionShare";

    lazyload.load("common/share/tips/js/index", function(dialog){
        finishTip = new dialog({});           
    });

    var showDialog=function(){
        finishTip.show({
            content:'<div class="topLogo title">想学习更多的网红养成课程，请加入网红城堡。<br>网红城堡，科学变红，优雅赚钱，你还在等什么，赶快加入我们吧！</div>'
                    +'<div class="content">'                        
                        +'<a style="color:#007aff;" href="'+initData.castle_url+'">网红城堡是什么？</a>'
                        +'<br/><br/><a href="'+initData.join_url+'" class="mui-btn tc_go" id="finish">立即加入</a>'
                    +'</div>'
        });
	};

    // 展开收起导师区域
    function folder(){
        $(ID).find(".tutor-intro").toggleClass("tutor-show");
        $(ID).find(".tutor-folder").toggleClass("tutor-on");
    }

    function bindEvent(){
        $(ID).on('tap','.tutor-folder', folder);
    }

    function releaseEvent(){
        $(ID).off('tap','.tutor-folder', folder);
    }

    function init(opts) {
        $('#finish').bind('tap',showDialog);
        
        initData=opts;
        $share.init(opts);
	bindEvent();
        lazyload.load("common/tabbar/js/index", function(tabbar){
            tabbar.setData(opts.tabbar);
            tabbar.setActiveTab(1);    // 设置哪个 tabbar 高亮，参数是 tabbar 的下标，0 开始
        });
        // 公共头部
        header.init();          
    }

    function destroy(opts) {
        $share.destroy();
        header.destroy(); 
        releaseEvent();
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