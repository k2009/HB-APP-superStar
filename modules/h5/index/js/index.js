define(function(require, exports, module) {
	var jssdk = require("common/share/jssdk");
	require('libs/jquery/plugins/jquery.swipe.min');
    var $body = $(document.body);
    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var pindex = 0;
    var winWidth = $(window).width();
    var aniInterval;
    var swipeLock = false;
    var tabbar;

    var initSwipe=function(){
        var pics=$('#pics');
        var count=pics.find('li').length;
        pics.swipe({
            swipe:function(event,direction){
                if(swipeLock){return;}
                swipeLock=true;
                setTimeout(function(){
                    swipeLock=false;
                },300);
                if(pindex ==0 && direction=='right' || pindex>=count-1 && direction=='left'){return;}
                direction=='left'?pindex++:pindex--;
                pics.css('left',-winWidth*pindex+'px');
                $('#points').find('.point').removeClass('cur').eq(pindex).addClass('cur');
                clearInterval(aniInterval);
                initPics(true);
            }
        })
    }

    var initPics=function(onlyInterval){        
        var pics=$('#pics');
        
        var count=pics.find('li').css('width',winWidth+'px').length;
        if(!onlyInterval){
            pics.css('width',winWidth*count);
            $('#points').find('.point').eq(0).addClass('cur');
        }
        aniInterval=setInterval(function(){
            pindex++;
            if(pindex>=count){
                pindex=0;
            }
            pics.css('left',-winWidth*pindex+'px');
            $('#points').find('.point').removeClass('cur').eq(pindex).addClass('cur');
        },5000);
    }

    function init(opts) {
        initPics();
        initSwipe();
        lazyload.load("common/tabbar/js/index", function(ret){
            tabbar = ret;
            tabbar.setData(opts.tabbar);
            tabbar.setActiveTab(0);    // 设置哪个 tabbar 高亮，参数是 tabbar 的下标，0 开始
        });
    }

	function destroy(opts) {
        pindex = 0;
        clearInterval(aniInterval);
        swipeLock = false;
        if(tabbar){
            tabbar.destroy();
        }
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});