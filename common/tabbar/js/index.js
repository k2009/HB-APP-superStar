/**
 * Tips
 * @author Li Ming
 */
define(function(require, exports, module) {
	var lazyload = require("kit/util/asyncModule");
	// 根据有没有 MUI，决定绑定的事件是什么
	var event_type = window.mui ? 'tap' : 'click';
	// TODO 记录所有 dialog 实例，当所有实例都销毁了的时候，整个组件销毁

	var Tabbar = {
		"current": 0,	// 默认第 0 个选中
		"currentTab": null,
		"show": function(html){
			if($(".tabbar").length > 0){
				return;
			}
			$('body').append(html);
			Tabbar.currentTab = $(".tabbar").find(".current");
			// console.log(Tabbar.currentTab);
			// 绑定事件
			$(".tabbar").on(event_type, "a", Tabbar.active);
		},
		"active": function(){
			var id = $(this).attr("data-index");
			Tabbar.setActiveTab(id);
		},
		"setActiveTab": function(index){
			index = parseInt(index);
			// 如果 tabbar 没变化，就啥都不做
			if(index == Tabbar.current){
				return;
			}
			Tabbar.currentTab.removeClass("current");
			Tabbar.current = index;
			Tabbar.currentTab = $(".tabbar").find(".tabbar-item").eq(index);
			Tabbar.currentTab.addClass("current");
		},
		"destroy": function(){
			// 重置变量
			Tabbar.current = 0;
			Tabbar.currentTab = null;
			// 删除样式
			// 删除事件
			$(".tabbar").off();
			// 移除 DOM
			$(".tabbar").remove();
			$(".tabbar-block").remove();
		}
	};

	function init(html, callback) {
		// 模块先加载自己依赖的 HTML 模板和 CSS
		// console.error("load tabbar");
		lazyload.load({
			"template": "common/tabbar/template/index.html",
			"css": "common/tabbar/css/index.css",
			// 回调函数，成功后返回
			"success": function(ret){
				// console.error("show tabbar");
				Tabbar.show(ret);
				// 回调
				callback(Tabbar);				
			},
			"fail": function(){
			},
			"cachecss": true
		});
	}

	function destroy(opts) {
		// 逐一调用子模块的 destroy 方法
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});