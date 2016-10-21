/**
 * Tips
 * @author Li Ming
 */
define(function(require, exports, module) {
	var lazyload = require("kit/util/asyncModule");
	// 根据有没有 MUI，决定绑定的事件是什么
	var event_type = window.mui ? 'tap' : 'click';
	// TODO 记录所有 dialog 实例，当所有实例都销毁了的时候，整个组件销毁
	var tabbarArray = [];
	var TAB_HTML = 
	'<#list data.tabs as tab>' +
	'<a href="${tab.url}" pjax="1" class="tabbar-item ${tab.isCurrent ? \'current\' : \'\' }" data-index="0">' +
		'<span class="tabbar-icon ${tab.icon}">' +
			'<#if (tab.unread == true ) >' +
				'<span class="dot"></span>' +
			'</#if>' +
		'</span>' +
		'<span class="tabbar-text">${tab.name}' +
		'</span>' +
	'</a>' +
	'</#list>';

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
		"setData": function (tabbar) {
			if(tabbar == null){return;}
			tabbarArray = [];
			for(var i = 0, count = tabbar.length; i < count; i ++){
				var tab = tabbar[i];
				var tabInfo = {
					"name" : tab.name,
					"url": tab.url,
					"isCurrent": Tabbar.current == i,
					"unread": (typeof tab.unread != "undefined" && tab.unread > 0)
				};
				switch(i) {
					case 0:
						tabInfo.icon = "icon-home";
						break;
					case 1:
						tabInfo.icon = "icon-learn";
						break;
					case 2:
						tabInfo.icon = "icon-jiasu";
						break;
					case 3:
						tabInfo.icon = "icon-money";
						break;
					case 4:
						tabInfo.icon = "icon-mine";
						break;
				}
				tabbarArray.push(tabInfo);
			}
			var html = SCRM.easyTemplate(TAB_HTML, {
				"tabs": tabbarArray
			}).toString();
			$(".tabbar").html(html);
			Tabbar.currentTab = $(".tabbar").find(".current");
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
			"cachecss": false
		});
	}

	function destroy(opts) {
		// 逐一调用子模块的 destroy 方法
		Tabbar.destroy();
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});