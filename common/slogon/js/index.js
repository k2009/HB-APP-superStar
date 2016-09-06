/*
	封装好的公共头
	@author L.Ming
 */
define(function(require, exports, module) {
	var lazyload = require("kit/util/asyncModule");
	// 根据有没有 MUI，决定绑定的事件是什么
	var event_type = window.mui ? 'tap' : 'click';

	function showHeader(html){
		if($(".wanghong-standard-header").length == 0){
			$("body").prepend(html);
		}
	}

	function init(callback){
		// 模块先加载自己依赖的 HTML 模板和 CSS
		lazyload.load({
			"template": "common/slogon/template/index.html",
			"css": "common/slogon/css/index.css",
			// 回调函数，成功后返回
			"success": function(ret){
				showHeader(ret);
				callback && callback();
			},
			"fail": function(){
			}
		});
	}

	function destroy(){
		if($(".wanghong-standard-header").length > 0){
			$(".wanghong-standard-header").remove();
		}
	}

	exports.init = init;
	exports.destroy = destroy;
});