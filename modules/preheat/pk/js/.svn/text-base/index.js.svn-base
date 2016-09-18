define(function(require, exports, module) {

	var ID = "#st_modules_preheat_pk";
	var jssdk = require("common/share/jssdk");
	// var lazyload = require("kit/util/asyncModule");

	var self, standard;

	// 动画逐一展示的节点，以及回调函数
	var animatedClass = [
		{
			"selector": ".fans",
			"callback": function(sel){
				// 粉丝数低于500，占10%，高于500名粉丝的，按比例增长，网红群体的平均粉丝数为100%
				var percent = self.fans / standard.fans * 100;
				percent = Math.max(percent, 10);
				$(ID).find(sel + " .left .progress-bar").css({
					width: percent + "%"
				});
				$(ID).find(sel + " .right .progress-bar").css({
					width: "100%"
				});
			}
		},
		{
			"selector": ".weibo",
			"callback": function(sel){
				self.weibo = parseInt(self.weibo);
				standard.weibo = parseInt(standard.weibo);
				// 近7天微博频次，最低展示5%，网红城堡用户的数据为分子，分母为100。标杆网红数据与网红城堡用户算法一致。
				var percent = 0;
				if(self.weibo > 0 && self.weibo <= 5){
					percent = 5;
				} else if(self.weibo > 5) {
					percent = self.weibo / 100 * 100;
				}
				$(ID).find(sel + " .left .progress-bar").css({
					width: percent + "%"
				});
				$(ID).find(sel + " .right .progress-bar").css({
					width: (standard.weibo / 100 * 100) + "%"
				});
			}
		},
		{
			"selector": ".interactive",
			"callback": function(sel){
				self.interactive = parseInt(self.interactive);
				standard.interactive = parseInt(standard.interactive);
				var percent = self.interactive / standard.interactive * 100;
				if(percent > 0){
					percent = Math.max(percent, 10);
				}
				$(ID).find(sel + " .left .progress-bar").css({
					width: percent + "%"
				});
				$(ID).find(sel + " .right .progress-bar").css({
					width: "100%"
				});
			}
		},
		{
			"selector": ".biz",
			"callback": function(){}
		},
		{
			"selector": ".button",
			"callback": function(){}
		}
	];

	function rand(){
		return Math.floor(Math.random() * 90) + 10;
	}

	function animate(){

		var item = animatedClass.shift();
		console.log(item);
		// animateLock = true;
		
		$(ID).find(item.selector).show().addClass('animated fadeInUp');
		setTimeout(function(){
			// $(ID).find(item.selector + " .left .progress-bar").css({
			// 	width: rand() + "%"
			// });
			// $(ID).find(item.selector + " .right .progress-bar").css({
			// 	width: rand() + "%"
			// });
			item.callback && item.callback(item.selector);
		}, 1000);

		if(animatedClass.length > 0){
			setTimeout(animate, 1000);
		}
	}

	function init(opts) {

		var platform = opts.platform;
		self = opts.self;
		standard = opts.standard;

		animate();
	}

	function destroy(opts) {
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});