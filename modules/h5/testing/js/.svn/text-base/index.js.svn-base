define(function(require, exports, module) {

    var $body=$(document.body);
    var lazyload = require("kit/util/asyncModule");
    var DNA=require('modules/testing/weiboDNA/js/wordCloud');
    var mark=require('modules/h5/testing/js/mark');
    var header = require('common/slogon/js/index');
    var initData;
    var finishTip;
    var tabbar;
    

    lazyload.load("common/share/tips/js/index", function(dialog){
        finishTip = new dialog({});           
    });

    var showDialog=function(){
        finishTip.show({
            content:'<div class="title">成功学习完本节课，肯定收获不小吧！再加把劲儿，很快就学完本章了呢。</div>'
                    +'<div class="content">'
                        +'<a href="'+initData.next_url+'" class="mui-btn tc_go" id="finish">进入下一节</a>'
                        +'<br/><br/><a style="color:#007aff;" href="'+initData.prev_url+'">休息一下</a>'
                    +'</div>'
        });
    }

    

    function init(opts) {
        $('#finish').bind('click',showDialog);
        initData=opts;
        opts.dna.finished && DNA.draw(opts.dna.tags);
        opts.biz.finished && mark.draw(opts.biz.chat);

        lazyload.load("common/tabbar/js/index", function(ret){
            ret.setData(opts.tabbar);
            tabbar = ret;
            tabbar.setActiveTab(2);    // 设置哪个 tabbar 高亮，参数是 tabbar 的下标，0 开始
        });
        // 公共头部
        header.init();
    }

    function destroy(opts) {
        DNA.destroy();
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