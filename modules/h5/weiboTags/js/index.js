define(function(require, exports, module) {

	var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var tabbar;
    var loadMUI = require("common/util/loadMUI");

	var MAX_SELECT = 2;

	var hasChanged = false;
	var canEdit = true;
	var params = null;

	var Tools = {
		// 绑定事件
		"bindEvent": function(){
			$("#st_modules_h5_weiboTags").on("tap", "[action=tag]", Tools.tagSelect);
			$("#st_modules_h5_weiboTags").on("tap", "[action=submit]", Tools.submit);
		},
		// 释放事件
		"releaseEvent": function(){
			$("#st_modules_h5_weiboTags").off("tap", "[action=tag]", Tools.tagSelect);
			$("#st_modules_h5_weiboTags").off("tap", "[action=submit]", Tools.submit);
		},
		'isEditable': function(){
			var result = true;
			if(!canEdit && params.add_time != 0){
				result = false;
				var timestamp = params.add_time * 1000;
				var lastTime = new Date(timestamp);
				var nextTime = new Date(timestamp + 30 * 24 * 60 * 60 * 1000);
				mui.toast('亲，您于' + (lastTime.getMonth() + 1) + '月' + lastTime.getDate()
						+ '日已经修改过定位，' + (nextTime.getMonth() + 1) + '月' + nextTime.getDate() + '日之后再来吧');
			}
			return result;
		},
		"tags": [],
		// 选择标签
		"tagSelect": function(){
			if(!Tools.isEditable()){
				return;
			}
			var tag = $(this);
			var tagId = tag.attr("data-id");
			var pos = jQuery.inArray(tagId, Tools.tags);
			// 如果选择的，已经在列表里，就移除它
			if(pos != -1){
				Tools.tags.splice(pos, 1);
				$(this).removeClass("selected");

				// 如果一个都没选中，就禁用提交按钮
				if(Tools.tags.length == 0){
					hasChanged = false;
					Tools.activeSubmit(false);
				} else {
					hasChanged = true;
					// 激活保存按钮
					Tools.activeSubmit(true);
				}
			} else {
				if(Tools.tags.length >= MAX_SELECT){
					mui.toast('最多可以选择 ' + MAX_SELECT + ' 个定位');
				} else {
					Tools.tags.push(tagId);
					$(this).addClass("selected");
					hasChanged = true;
					// 激活保存按钮
					Tools.activeSubmit(true);
				}
			}
		},
		// 激活保存按钮
		"activeSubmit": function(status){
			if(status == true){
				$("#st_modules_h5_weiboTags").find("[action=submit]").removeClass("mui-btn-disable");
			} else {
				$("#st_modules_h5_weiboTags").find("[action=submit]").addClass("mui-btn-disable");
			}
		},
		// 提交数据
		"submit": function(){
			if(!Tools.isEditable()){
				return;
			}
			if(hasChanged == false){
				mui.toast('您没改变过自己的定位');
				return;
			}
			// 检查用户选择的情况，不能为空，不能超过两个
			if(Tools.tags.length == 0){
				mui.toast('您还没选择自己的定位，最少一个');
			} else if(Tools.tags.length > MAX_SELECT) {
				mui.toast('最多可以选择 ' + MAX_SELECT + ' 个定位');
			} else {
				var url = $(this).attr("href");
				var next_url = $(this).attr("next_url");
				$.ajax({
					method: "POST",
					url: url,
					data: { id: Tools.tags.join(",") },
					dataType: "json"
				}).done(function( msg ) {
					if(typeof msg == "undefined" || typeof msg.code == "undefined"){
						mui.toast('系统繁忙，保存失败');
						return;
					}
					switch(msg.code) {
						case 0:
							mui.toast('保存成功');
							hasChanged = false;
							Tools.activeSubmit(false);
							Tools.releaseEvent();
							SCRM.pjax(next_url);
							break;
						default:
							mui.toast('保存失败：' + msg.message);
							break;
					}
				});
			}
		},
		// 初始化获取当前选中的tags
		"getCurrentTags": function(tags){
			Tools.tags = [];
			if(tags == null || tags.length == 0){
				return;
			}
			for (var i = 0, count = tags.length; i < count; i++) {
				var tag = tags[i];
				if(tag.selected == true){
					Tools.tags.push(tag.id);
				}
			}
			// 如果 PHP 吐的数据选中的超过了两个，修正一下
			if(Tools.tags.length > MAX_SELECT){
				Tools.tags.splice(MAX_SELECT);
				// TODO 样式修正
			}
		}
	};

	function init(opts) {

		params = opts;
		
		loadMUI.init(function(){});

		canEdit = (opts.can_edit == true);

		// 取得当前选中的定位
		Tools.getCurrentTags(opts.tags);
		// 如果允许编辑，就绑定事件
		// if(opts.can_edit == true){
			Tools.bindEvent();
		// }
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
		console.log("destroy 微博定位");
		Tools.releaseEvent();
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