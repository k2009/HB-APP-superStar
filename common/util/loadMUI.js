/*
	封装好的统一加载 mui 的方法
	@example
	方法一：
	var loadMUI = require("common/util/loadMUI");
	loadMUI.init(function(){
		alert('mui 加载成功');
	});
	方法二：
	require("common/util/loadMUI");
	用的时候检查一下 mui 对象是不是存在
 */
define(function(require, exports, module) {

	var domain = null;
	var isLoaded = typeof window.mui != 'undefined';
	if(typeof CONFIG != "undefined" && typeof CONFIG.domain != "undefined"){
		domain = CONFIG.domain;
		loadMUI();
	}
	function loadMUI(callback){
		if(isLoaded) {	// 如果已经加载成功
			callback && callback();
			return;
		}
		// 异步加载 mui.js
		$.ajax({
			url: "http://" + domain + "/libs/mui/js/mui.min.js",
			dataType: "script",
			cache: true,
			success: function(){
				isLoaded = true;
				callback && callback();
			}
		});
	}

	function init(callback){
		if(isLoaded){
			callback && callback();
		} else {
			loadMUI(callback);
		}
	}

	function destroy(){
		// 不需要销毁
	}
	exports.init = init;
	exports.destroy = destroy;
});