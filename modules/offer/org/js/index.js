define(function(require, exports, module) {
    var $share = require('modules/start/home/js/share');
	var jssdk = require("common/share/jssdk");
	var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var dialogTips;
    var tabbar;
    var winWidth=$(window).width();

    var initSlider=function(){
    	$('[node=slider]').each(function(index,item){
    		var $slider=$(item);
	    	var childs=$slider.find('li').length;
	    	$slider.css('width',childs*(300/200)+0.2+'rem').css('display','block');
    	});
    	
    };
    
	function init(opts) {
		initSlider();
        opts.share_url=opts.share_url || '/castle/wap/works/organize';
        $share.init(opts);

		// 延迟加载 tabbar
        lazyload.load("common/tabbar/js/index", function(ret){
            ret.setData(opts.tabbar);
            ret.setActiveTab(3);
            tabbar = ret;
        });
        // 公共头部
        header.init(); 
	}

	function destroy(opts) {
        $share.destroy();
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