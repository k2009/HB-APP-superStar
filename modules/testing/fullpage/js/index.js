define(function(require, exports, module) {

	var jssdk = require("common/share/jssdk");
	var lazyload = require("kit/util/asyncModule");
	var hammer = require("libs/hammerjs/hammer.min");


	var index = 0;
	var $pages;
	var count;
	function swipeUp(){
		if(index + 1 >= count){
			// 翻到底了
			return;
		}
		index++;
		showPage("up");
		if(index + 1 == count){
			$(".arrow-container").hide();
		}
	}

	function swipeDown(){
		if(index <= 0){
			// 翻到顶了
			return;
		}
		index--;
		showPage("down");
		$(".arrow-container").show();
	}

	function showPage(direction){
		if($pages == null){
			$pages = $(".fullpage").find("article");
			count = $pages.length;
		}
		if(direction == "up"){
			if(index < count){
				$(".fullpage").removeClass("put-section-" + (index - 1)).addClass("put-section-" + index);
			}
		} else if (direction == "down") {
			if(index >= 0){
				$(".fullpage").removeClass("put-section-" + (index + 1)).addClass("put-section-" + index);
			}
		}

	}

	function init(opts) {
		// body...
		console.log("example init");
		var platform = opts.platform;


		// 延迟加载微信分享的 tips
        // lazyload.load("common/tabbar/js/index", function(ret){
        //     ret.setActiveTab(0);
        // });

		// 初始化 JSSDK
		jssdk.init(platform, opts.jssdk, function(){
			// 如果初始化失败，就什么都不做
			if(arguments.length > 0){
				return;
			}
		});

		var hammertime = new Hammer($(".fullpage")[0], {});
		hammertime.on('swipe', function(ev) {
			switch(ev.direction) {
				case Hammer.DIRECTION_UP:
					swipeUp();
					break;
				case Hammer.DIRECTION_DOWN:
					swipeDown();
					break;
			}
		});
		hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

	}

	function destroy(opts) {
		console.log("destroy example");
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});