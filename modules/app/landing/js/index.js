define(function(require, exports, module) {

	// $(document).on("tap", "[action=ios]", function(){
	// 	console.log('ios');
	// 	alert('上架申请中，请稍后');
	// });
	// $(document).on("tap", "[action=android]", function(){
	// 	console.log('android');
	// 	alert('上架申请中，请稍后');
	// });
	var ID = '#st_modules_app_landing';
	var timer;
	var delay = 4000;
	var domtree = [];
	var index = 0;

	function swipeLeft(){
		// 左滑特效
		var first = $(ID).find(".slider").eq(0);
		var second = $(ID).find(".slider").eq(1);
		first.addClass("go-left");
		second.addClass("go-left");

		// 底部的小白点位置改变
		$(ID).find(".dot").eq(index).removeClass("current");
		index ++;
		index %= 3;
		$(ID).find(".dot").eq(index).addClass("current");
		// 动画结束后，DOM 节点重置
		var domChangeTimer = setTimeout(function(){
			domTreeChange();
			var newContent = domtree.join("");
			$(ID).find(".slider-container").html(newContent);
			timer = setTimeout(swipeLeft, delay);
			clearTimeout(domChangeTimer);
		}, 400);
	}

	function domTreeChange(){
		var first = domtree.shift();
		domtree.push(first);
	}

	return {
		init: function () {
			// if(/(android|iphone)/i.test(navigator.userAgent)){
			// 	return;
			// }
			var tree = $(ID).find(".slider");
			$.each(tree, function(key, value){
				domtree.push(value.outerHTML);
			});
			// console.dir(domtree);
			timer = setTimeout(swipeLeft, delay);
		},
		destroy: function () {
			clearTimeout(timer);
			index = 0;
			domtree = [];
			timer = null;
		}
	};
});