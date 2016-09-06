define(function(require, exports, module) {

	var ID = '#st_modules_preheat_analyzing';
	var jssdk = require("common/share/jssdk");
	var hammer = require("libs/hammerjs/hammer.min");

	// var lazyload = require("kit/util/asyncModule");
	// 根据有没有 MUI，决定绑定的事件是什么
	var event_type = window.mui ? 'tap' : 'click';
	var timer = null;
	var percent = 0;
	var swiperIndex = 0, swiperCount = 0, swiperData = [];
	var loopDelay = 3000, loopTimer;
	var loopUrl = null;
	var maxTry = 30, tryTimes = 0;

	var SWPIE_HTML =
	'<ul>' +
		'<#list data.wanghong as wanghong>' +
		'<#if ( wanghong.showIndex == 0 ) >' +
		'<li class="card prev">' +
		'</#if>' +
		'<#if ( wanghong.showIndex == 2 ) >' +
		'<li class="card next">' +
		'</#if>' +
		'<#if ( wanghong.showIndex == 1 ) >' +
		'<li class="card zoom">' +
		'</#if>' +
			'<div class="title">${wanghong.screen_name}</div>' +
			'<div class="profile-image"><img src="${wanghong.profile_image}"></div>' +
			'<div class="opacity-bg"></div>' +
			'<div class="desc">' +
				'<div class="half">粉丝：${wanghong.fans}</div>' +
				'<div class="half">月销：${wanghong.sale}</div>' +
				'<div class="desc-text">${wanghong.desc}</div>' +
			'</div>' +
		'</li>' +
		'</#list>' +
	'</ul>' +
	'<ul class="dots">' +
		'<#list data.dots as dot>' +
		'<li class="dot${ dot.order == data.current ? " current" : "" }"></li>' +
		'</#list>' +
	'</ul>';

	var funcs = {
		'initEvent': function(){
			// 蒙层的关闭事件
			$(ID).on(event_type, ".mui-icon-close", funcs.closePop);
			// 开始轮询
			funcs.loopEvent();
			// 初始化 swiper
			funcs.initSwiper();
		},
		// 关闭蒙层
		'closePop': function(){
			$(ID).find(".pop-tips").remove();
			// 关闭的同时，开启进度条的自动播放
			timer = setTimeout(funcs.autoProgress, 100);
		},
		// 进度条自动往前走
		'autoProgress': function(){
			// 百分比不能超过 100%
			percent = percent >= 99 ? 100 : percent + 1;
			$(ID).find(".progress-bar").css({
				width: percent + "%"
 			});
 			$(ID).find(".percent").html( percent + "%");
 			if(percent < 90){
				timer = setTimeout(funcs.autoProgress, 50);
			} else {
				clearTimeout(timer);
			}
		},
		// 轮询分析结果，如果 code = 0 表示分析成功，否则就是失败
		'loopEvent': function(){
			// 如果超过 30 次，就放弃了
			if(tryTimes >= maxTry){
				funcs.showTimeoutPop();
				return;
			}
			// 3 秒轮询一次，如果成功，直接进度到 100%
			tryTimes++;
			console.log("尝试 " + tryTimes + " 次");
			$.ajax({
				method: "GET",
				url: loopUrl,
				dataType: "json"
			})
			.done(function( msg ) {
				// console.log(msg);
				// code=0 表示分析结束
				if(msg && msg.code == 0){
					// console.log("分析结束");
					percent = 99;
					funcs.autoProgress();
					var showTimer = setTimeout(function(){
						$(ID).find(".progress").hide();
						$(ID).find(".buttons").show();
						$(ID).find(".buttons a").attr("href", msg.data);
						clearTimeout(showTimer);
						showTimer = null;
					}, 400);
				} else {
					if(percent >= 90 && percent <= 98){
						funcs.autoProgress();
					}
					loopTimer = setTimeout(funcs.loopEvent, loopDelay);
				}
			})
			.fail(function( msg ) {
				if(percent >= 90 && percent <= 98){
					funcs.autoProgress();
				}
				loopTimer = setTimeout(funcs.loopEvent, loopDelay);
			});
		},
		// 轮询分析结果，如果 code = 0 表示分析成功，否则就是失败
		'loopStop': function(){
			clearTimeout(loopTimer);
		},
		// 初始化 swiper
		'initSwiper': function(){
			var hammertime = new Hammer($(".swiper")[0], {});
			hammertime.on('swipe', function(ev) {
				switch(ev.direction) {
					case Hammer.DIRECTION_LEFT:
						funcs.swipeLeft();
						break;
					case Hammer.DIRECTION_RIGHT:
						funcs.swipeRight();
						break;
				}
			});
			hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
		},
		// 销毁 swiper
		'destroySwiper': function(){
			swiperIndex = 0;
			swiperCount = 0;
			swiperData = [];
			// TODO 销毁滑动事件
		},
		'swipeLeft': function(){
			// console.log('left');
			swiperIndex++;
			if(swiperIndex >= swiperCount){
				swiperIndex = 0;
			}
			funcs.showSwiper('left');
		},
		'swipeRight': function(){
			// console.log('right');
			swiperIndex--;
			if(swiperIndex < 0){
				swiperIndex = swiperCount - 1;
			}
			funcs.showSwiper('right');
		},
		'showSwiper': function(direction){
			// console.log("显示第 " + swiperIndex + " 个");
			// 根据切换的方向
			switch(direction) {
				case 'left':
					$(ID).find('.prev').hide();
					$(ID).find('.zoom').removeClass("zoom").addClass("prev");
					$(ID).find('.next').removeClass("next").addClass("zoom");
					break;
				case 'right':
					$(ID).find('.next').hide();
					$(ID).find('.zoom').removeClass("zoom").addClass("next");
					$(ID).find('.prev').removeClass("prev").addClass("zoom");
					break;
			}
			var swipers = [];
			switch(swiperIndex){
				case 0:
					swipers = [swiperData[swiperData.length - 1], swiperData[0], swiperData[1]];
					break;
				case 7:
					swipers = [swiperData[swiperData.length - 2], swiperData[swiperData.length - 1], swiperData[0]];
					break;
				default:
					swipers = [swiperData[swiperIndex - 1], swiperData[swiperIndex], swiperData[swiperIndex + 1]];
					break;
			}
			for(var i = 0, count = swipers.length; i < count; i ++){
				swipers[i].showIndex = i;
			}
			var html = SCRM.easyTemplate(SWPIE_HTML, {
				wanghong: swipers,
				dots: swiperData,
				current: swiperIndex
			}).toString();
			var timer = setTimeout(function(){
				$(ID).find(".swiper").html(html);
				clearTimeout(timer);
			}, 400);
		},
		// 隐藏微信微博的菜单
		'hideMenu': function(platform){
			var sdkObject = jssdk.getJssdkObject();
			if(platform == "weibo"){
				var items = {
					shareToWeibo: {
						title: "刷新",
						scheme: document.URL,
						code: 2003
					}
				};
				var itemArray = [];
				for( var key in items ){
					itemArray.push( items[key] );
				}
				// 设置右上角菜单
				sdkObject.setMenuItems({
					items: itemArray,
					success: function(ret) {},
					fail: function(msg, code) {}
				});
			} else if(platform == "weixin"){
				sdkObject.hideOptionMenu();
			}
		},
		'showTimeoutPop': function(){
			$(ID).find(".pop-tips").remove();
			$(ID).find(".pop-timeout").show();
		}
	};

	function init(opts) {

		var platform = opts.platform;

		// 初始化 JSSDK
		jssdk.init(platform, opts.jssdk, function(){
			funcs.hideMenu(platform);
		});

		swiperData = opts.wanghong;
		swiperCount = swiperData.length;
		for(var i = 0; i < swiperCount; i ++){
			swiperData[i].order = i;			
		}

		loopUrl = opts.query_url;

		funcs.initEvent();

	}

	function destroy(opts) {
		timer = null;
		percent = 0;
		$(ID).off(event_type, ".mui-icon-close");
		funcs.loopStop();
		funcs.destroySwiper();
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});