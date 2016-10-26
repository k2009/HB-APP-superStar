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
        if(count<=1){return;}
        pics.swipe({
            swipe:function(event,direction){
                if(swipeLock){return;}
                swipeLock=true;
                setTimeout(function(){
                    swipeLock=false;
                },300);
                if(pindex ==0 && direction=='right' || pindex>=count-1 && direction=='left'){return;}
                direction=='left'?pindex++:pindex--;
                if(pindex<0){pindex=0;}
                if(pindex>=count-1){pindex=count-1;}
                pics.css('margin-left',-winWidth*pindex+'px');
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
            pics.css('width',winWidth*count).css('display','block');
        }
        if(count>1){
            aniInterval=setInterval(function(){
                pindex++;
                if(pindex>=count){
                    pindex=0;
                }
                pics.css('margin-left',-winWidth*pindex+'px');
                $('#points').find('.point').removeClass('cur').eq(pindex).addClass('cur');
            },5000);
        }        
    }

    function init(opts) {

        var platform = opts.platform;

        setTimeout(function(){
            initPics();
            initSwipe();
        },1000);

        // 初始化 JSSDK
        jssdk.init(platform, opts.jssdk, function(){
            // 如果初始化失败，就什么都不做
            if(arguments.length > 0){
                return;
            }
        });

        lazyload.load("common/tabbar/js/index", function(ret){
            tabbar = ret;
            tabbar.setData(opts.tabbar);
            tabbar.setActiveTab(0);    // 设置哪个 tabbar 高亮，参数是 tabbar 的下标，0 开始
        });
        header.destroy();
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