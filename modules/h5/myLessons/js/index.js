define(function(require, exports, module) {

	var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var tabbar;
	require("common/util/loadMUI");

	var ID = "#st_modules_h5_myLessons";
	var LOCK_MSG = '别着急，请按建议时间学习前面的课程并完成课程作业，就可以解锁这一课啦';
	// 根据有没有 MUI，决定绑定的事件是什么
	var event_type = window.mui ? 'tap' : 'click';
	var Tools = {
		"activeTab": null,
		"activeContainer": null,
		"bindEvent": function(){
			// tab 切换
			$(ID).on(event_type, "[action=tab]", Tools.changeTab);
			// 锁定的课程
			$(ID).on(event_type, "[action=lock]", Tools.lockAlert);
		},
		"releaseEvent": function(){
			$(ID).off(event_type, "[action=tab]");
			$(ID).off(event_type, "[action=lock]");
		},
		"changeTab": function(){
			Tools.activeTab.removeClass("mui-active");
			$(this).addClass("mui-active");
			Tools.activeTab = $(this);

			var data = $(this).attr("action-data");
			Tools.activeContainer.hide();
			$(ID).find("." + data).show();
			Tools.activeContainer = $(ID).find("." + data);
		},
		"lockAlert": function(){
			if(window.mui){
				mui.alert(LOCK_MSG);
			} else {
				alert(LOCK_MSG);
			}
		}
	};

	function init(opts) {
		// 取得初始化信息
		Tools.activeTab = $(ID).find("a.mui-active");
		Tools.activeContainer = $(ID).find(".studying");
		// 绑定事件
		Tools.bindEvent();
		// 延迟加载 tabbar
        lazyload.load("common/tabbar/js/index", function(ret){
            ret.setActiveTab(0);
            tabbar = ret;
        });
        // 公共头部
        header.init();
	}

	function destroy(opts) {
		Tools.releaseEvent();
		Tools.activeTab = null;
		Tools.activeContainer = null;
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