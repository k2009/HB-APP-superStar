define(function(require, exports, module) {
	"use strict";
    var $storage = require("kit/util/plus-storage");        //本地存储模块
    var $urlToJson = require("kit/util/urlToJson");         //数组转json

	var sys = {
		getLocalPath: function(path) {
			sys.route = $storage('route');
			var a = sys.route;
			var data;
			path = path.replace('http://91hong.com.cn','')
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
		jumpToWebView:function(url,title){
	        if(url.substr(0, 4).indexOf("http")<0){
	        	return;
	        }
			var pageData = {
				id: "webview:"+url,
				url: url,
				styles: {
					top: '45px',
					bottom: 0,
					bounce: 'vertical',
					background:'transparent'
				},
				title: title

			}
			var view_data = {
				id: url,
				url: '_www/modules/webView.html',
				show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true
					aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
				},
				// styles: {
				//     top: "0px",
				//     bottom: '56px', //新页面底部位置
				// },
				extras: {
					pageData: pageData
				}
			};
			mui.openWindow(view_data);
		},
		urlJump: function(url, title) {
			if(!url)return;
			var pjaxURL = url;
			url = decodeURIComponent(url);
			var d = $urlToJson(url);
			var data = sys.getLocalPath(d.url);
			if (!data) {
				sys.jumpToWebView(url,title);
				return;
			}
			if(!data.module_data){
				data.module_data = {};
			}
	        if( (pjaxURL.indexOf("http")<0)||(pjaxURL[0]=='/')  ){
				data.module_data.pageURL = plus.storage.getItem("domain") + pjaxURL;
				d.url = plus.storage.getItem("domain") + d.url
	        }else{
	        	data.module_data.pageURL = pjaxURL;
	        }
			var pageData = {
				id: data.module_id,
				url: '_www/modules/index_content.html',
				extras: {
					ajax_data: d.data,
					ajax_url: d.url,
					pageData: data.module_data
				},
				styles: {
					top: '45px',
					bottom: 0,
					bounce: 'vertical',
					background:'transparent'
				},
				title: data.title || title

			}
			var view_data = {
				id: data.module_id,
				url: '_www/modules/index.html',
				show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true
					aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
				},
				// styles: {
				//     top: "0px",
				//     bottom: '56px', //新页面底部位置
				// },
				extras: {
					pageData: pageData
				}
			};

			//数据重载来规避多页面打开的事儿

			var index_route = JSON.parse(plus.storage.getItem("index_route"));
			for (var i = 0; i < index_route.length; i++) {
				if(index_route[i] == data.module_id){
					var ws = plus.webview.getWebviewById('index_box.html');
					if(ws){
						ws.show();
						console.log('fire:'+data.module_id)
						mui.fire(ws, 'viewShow', {
							pageID: data.module_id
						}); //数据重载方法,可多页面调用
					}
				}
			}
			var other_this_view = plus.webview.getWebviewById(data.module_id.replace('st_modules_', ''));
			if (other_this_view && (!$.isEmptyObject(d.data))) {
				mui.fire(other_this_view, 'viewReload', {
					ajax_data: d.data
				}); //数据重载方法,可多页面调用
			}
			mui.openWindow(view_data);
		},
	}
	if(window.SCRM){
		window.SCRM.pjax = sys.urlJump;	
	}
    
	return sys.urlJump;
});