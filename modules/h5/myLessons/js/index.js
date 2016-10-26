define(function(require, exports, module) {

	var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
	var muiObj = require("common/util/loadMUI");
    var tabbar;

	var ID = "#st_modules_h5_myLessons";
	var LOCK_MSG = '别着急，请按建议时间学习前面的课程并完成课程作业，就可以解锁这一课啦';
	// 根据有没有 MUI，决定绑定的事件是什么
	var event_type = window.mui ? 'tap' : 'tap';
	var isPopShow = false;		// 加锁，防止 mui.alert 执行两次
	var Tools = {
		"activeTab": null,
		"activeContainer": null,
		"bindEvent": function(){
			event_type = window.mui ? 'tap' : 'tap';
			console.log(event_type);
			// tab 切换
			$(ID).on(event_type, "[action=tab]", Tools.changeTab);
			// 锁定的课程
			$(ID).on(event_type, "[action=lock]", Tools.lockAlert);
			$(document).on(event_type, ".mui-popup-button", function(e){
				e.stopPropagation();
				isPopShow = false;
			});
		},
		"releaseEvent": function(){
			$(ID).off(event_type, "[action=tab]");
			$(ID).off(event_type, "[action=lock]");
			$(document).off(event_type, ".mui-popup-button");
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
		"lockAlert": function(e){
			e.stopPropagation();
			if(isPopShow == true){
				return;
			}
			if(!window.plus){
				isPopShow = true;
			}
			if(window.mui ){
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
		muiObj.init(Tools.bindEvent);
		// 延迟加载 tabbar
        lazyload.load("common/tabbar/js/index", function(ret){
        	ret.setData(opts.tabbar);
            ret.setActiveTab(4);
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