define(function(require, exports, module) {

	var jssdk = require("common/share/jssdk");
	var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
	var mark = require('modules/h5/testing/js/mark');
	var tabbar;

	function showCharts(data){
		if(data == null){
			return;
		}
		var result = [];
		for (var i = 0, count = data.length; i < count; i++) {
			var item = data[i];
			result.push({
				x: item.x.substr(4),
				y: item.y
			});
		}
		mark.draw(data);
	}

	function init(opts) {

		var platform = opts.platform;

		// 延迟加载 tabbar
        lazyload.load("common/tabbar/js/index", function(ret){
        	ret.setData(opts.tabbar);
            ret.setActiveTab(0);
            tabbar = ret;
        });

		// 初始化 JSSDK
		jssdk.init(platform, opts.jssdk, function(){
			// 如果初始化失败，就什么都不做
			if(arguments.length > 0){
				return;
			}
		});
		// 如果完成的课程数大于 0
		if(opts.my_score.finished > 0){
			showCharts(opts.my_score.chat);
		}

		// 公共头部
        header.init();
		// $.getScript("http://172.17.72.151:8080/target/target-script-min.js#anonymous");
	}

	function destroy(opts) {
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