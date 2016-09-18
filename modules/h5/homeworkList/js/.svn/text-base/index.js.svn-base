define(function(require, exports, module) {
    var lazyload = require("kit/util/asyncModule");
    var page_url;
    var $win = $(window);
    var $homeworkList = $( '#homeworkList' );
    var max_page = +$homeworkList.data('maxpage') || 10;
    var inRequest = false;
    var tabbar;
    //美化alert start
    var Alert = function( str ){
        var dom = '<div class="alert_dom mui-popup mui-popup-in" style="display: block;">\
                <div class="mui-popup-inner">\
                    <p class="alert_content"></p>\
                </div>\
                <div class="mui-popup-buttons"><span class="alert_close mui-popup-button mui-popup-button-bold">确定</span></div></div>\
                <div class="alert_dom mui-popup-backdrop mui-active" style="display: block;"></div>';
        var $dom = $( dom );
        $dom.find( '.alert_content' ).html( str );
        $( 'body' ).append( $dom );
        $( '.alert_close' ).on('touchend', function(){
            $( this ).off();
            $( '.alert_dom' ).remove();
            return false;
        });
    }
    //美化alert end
    var htmlRun = function( data ){
        var liList = '<#list data.homeworkList as list>\
            <li>\
                <h6><a href="${list.url}">${list.center}</a></h6>\
                <p>课程：${list.lesson}</p>\
                <p>小节：${list.part}</p>\
                <p class="bottom"><span>${list.times}</span>已有${list.num}人参与评估</p>\
            </li>\
        </#list>';
        var listHtml = SCRM.easyTemplate( liList, data ).toString();
        $( '#chartList' ).html( blockListHtml );
        return listHtml;
    };
    var request = function(){
        var on_page = +$homeworkList.data('page') || 1;
        var is_run = max_page > on_page ? true : false;
        if( !is_run ){
            $(window).off('scroll');
            return;
        }
        inRequest = true;
        console.log(10)
        $.ajax({
            type: "GET",
            url: page_url,
            dataType: "json",
            data:{
                pjax: 1,
                page: on_page+1
            },
            success: function(msg){
                if(msg.code != 0 ){
                    Alert( msg.message );
                    setTimeout(function(){
                        inRequest = false;
                    },1000);
                    return;
                }
                var html = htmlRun( msg.data.real_data.st_modules_h5_homeworkList );
                $homeworkList.data(on_page+1).append( html );
                inRequest = false;
            },
            error: function(){
                Alert('网络错误，请刷新页面或稍后重试');
                setTimeout(function(){
                    inRequest = false;
                },1000);
            }
        });
    };
    var scrollFn = function(){
        if( inRequest ){
            return;
        }
        var winHeight = +$win.height();
        var docHeight = +$(document).height();
        var scrollTop = +$win.scrollTop();
        if( scrollTop + winHeight + 10 > docHeight ){
            request()
        }
    };
	function init(opts) {
        // 延迟加载 tabbar
        lazyload.load("common/tabbar/js/index", function(ret){
            ret.setData(opts.tabbar);
            tabbar = ret;
            ret.setActiveTab(3);
        });
        if( !$homeworkList.length ){
            return;
        }
        page_url = opts.page_url;
        $win.on('scroll', scrollFn);
    }
    function destroy(opts) {
        $win.off('scroll');
		if(tabbar){
			tabbar.destroy();
		};
        $( '.alert_dom' ).remove();
        $( '.alert_close' ).off();
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});