define(function(require, exports, module) {

	$(document).on("click", "[action=ios]", function(){
		console.log('ios');
		alert('上架申请中，请稍后');
	});
	$(document).on("click", "[action=android]", function(){
		console.log('android');
		alert('上架申请中，请稍后');
	});

	return {
		init: function () {
		},
		destroy: function () {
		}
	};
});