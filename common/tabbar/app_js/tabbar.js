
define(function(require, exports, module) {
"use strict";
	var $urlToJson = require("kit/util/urlToJson"); //数组转json

	alert('开始tabbar!!!')
	var sys = {
		a_click: function(event) {
			var url = this.getAttribute('href');
			var d = $urlToJson(url);
			var data = sys.getLocalPath(d.url);
			if (!data) {
				return;
			}

			console.log(JSON.stringify(data));
			console.log($(this).text());
			var pageData = {
				id: data.module_id,
				url: '_www/modules/index_content.html',
				extras: {
					ajax_data: d.data,
					ajax_url: plus.storage.getItem("domain") + d.url,
					pageData: data.module_data
				},
				styles: {
					top: '45px',
					bottom: 0,
					bounce: 'vertical'
				},
				title: data.title || $(this).html()

			}
			var view_data = {
				id: data.module_id,
				url: '_www/modules/index.html',
				show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true
					aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
				},
				extras: {
					pageData: pageData
				}
			};

			//数据重载来规避多页面打开的事儿
			if (data.module_id == "st_modules_h5_home") {
				mui.openWindow({
					id: 'index.html',
					url: '_www/modules/h5/index/index.html',
					show: {
						autoShow: true, //页面loaded事件发生后自动显示，默认为true
						aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
					}
				});
				return;
			}
			var other_this_view = plus.webview.getWebviewById(data.module_id.replace('st_modules_', ''));
			if (other_this_view && (!$.isEmptyObject(d.data))) {
				mui.fire(other_this_view, 'viewReload', {
					ajax_data: d.data
				}); //数据重载方法,可多页面调用
			}
			mui.openWindow(view_data);
			return false;
		},
		getLocalPath: function(path) {
			var a = sys.route;
			var data;
			for (var i = 0; i < a.length; i++) {
				if ($.trim(a[i].path) == $.trim(path)) {
					data = a[i].data.default_data.modules[0];
					return {
						path: data.template[0].replace('template/index.html', '') + data.id.replace('st_modules_h5_', '') + '.html',
						module_id: data.id,
						title: data.title,
						module_data: data
					};
				}
			}
			return null;
		},
		listener: function() {
			window.addEventListener('viewReload', function(e) {
				$(window).scrollTop(0);
				$('#' + sys.id).html('<div class="fakeloader"><div class="fl spinner1"><div class="double-bounce1"></div><div class="double-bounce2"></div></div><div class="text">数据加载中...</div></div>');
				sys.ajax_data = e.detail.ajax_data;
				sys.storage_init();
			});
		},
		init: function() {

			mui.plusReady(function() {
				sys.listener();
				mui('body').on('tap', 'a', sys.a_click)
				return sys;
			})
		}
	}


	sys.init();
    return sys;
});