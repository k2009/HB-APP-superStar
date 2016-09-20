/**
 * Tips
 * @author Li Ming
 */
define(function(require, exports, module) {
	var lazyload = require("kit/util/asyncModule");
	// 根据有没有 MUI，决定绑定的事件是什么
	var event_type = window.mui ? 'tap' : 'click';
	// TODO 记录所有 dialog 实例，当所有实例都销毁了的时候，整个组件销毁
	var TITLE = '好了，现在招呼你的朋友帮你提提意见';//'想要帮助好友变红，只需要动动手指就可以哦';
	var TEXT = '点击右上角，分享给朋友或者分享到朋友圈吧';
	var platform = "weixin";
	if(/weibo/i.test(navigator.userAgent)){
		platform = "weibo";
	}

	var dialogs = [];

	function Tips(opts){
		this.dialog_id = "dialog_" + (new Date().getTime());
		dialogs.push(this);
		if(opts != null){
			TITLE = opts.title || TITLE;
			TEXT = opts.text || TEXT;
		}
	}

	Tips.prototype.show = function(opts) {
		var opts=opts||{};
		var html = SCRM.easyTemplate('<#macro userlist data>' +  this.template, {
			id:  this.dialog_id,
			title: TITLE,
			text: typeof opts.text=='string' && opts.text || TEXT
		}).toString();

		$('body').append(html);
		var $this=$('#' + this.dialog_id)
		$this.on(event_type, '.mui-icon-closeempty',function(e){
			$this.off().remove();
			//e.stopPropagation();
			return false;//阻止移动端事件穿透
		});
		if(opts.content){
			$this.find('[node=content]').html(opts.content);
		}
	};
	Tips.prototype.hide = function() {
		console.log("dialog destroy");
		var did=this.dialog_id;
		setTimeout(function(){
			$('#' + did).off().remove();
		},50);
	};
	Tips.prototype.destroy = Tips.prototype.hide;

	Tips.prototype.getNode=function(){
		return $('#' + this.dialog_id);
	}

	function init(html, callback) {
		// 模块先加载自己依赖的 HTML 模板和 CSS
		lazyload.load({
			"template": "common/share/tips/template/index.html",
			"css": "common/share/tips/css/index.css",
			// 回调函数，成功后返回
			"success": function(ret){
				Tips.prototype.template = ret;
				// var dialog = new Tips();
				callback(Tips);
			},
			"fail": function(){
			}
		});
	}

	function destroy(opts) {
		// 逐一调用子模块的 destroy 方法
		for (var i = 0, count = dialogs.length; i < count; i++) {
			dialogs[i].hide();
		}
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});