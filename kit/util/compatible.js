var DEBUG_MODE = null;
var useIDBCache = null;
var pageInfo = {
		id: null
	}
	// 页面管理器，用于初始化页面，和后续加载模块
var pageManager = {
	// 初始化
	'init': function() {
		// 如果页面没有配置信息，就什么都不执行
		if (typeof page_data == "undefined") {
			return;
		}
		//如果支持IDB，实现Promise

		if (!window.indexedDB) {
			useIDBCache = false;
		} else {
			useIDBCache = true;
			IDBPromise = IDBTask($.Deferred());
		}

		// 配置 sea.js
		seajs.config({
			base: location.protocol + "//" + DOMAIN + "/" + SEAJS_SUB_PATH
		});
		pageManager.loadModules(page_data);
	},
	'getUniqueId': function() {
		return "page_" + (new Date().getTime());
	},
	// 加载指定的模块
	loadModule: function(item) {
		// console.log("Loading module " + item.id);
		// console.log(item);
		cacheModules[item.id] = {
			data: item,
			status: {
				"template": null,
				"css": null,
				"script": {}
			}
		};
		var status = cacheModules[item.id].status;
		/* 异步加载模板，加载 CSS，加载 JS */
		// 异步加载 CSS
		if (item.css != null && item.css.length > 0) {
			status.css = pageManager.loadFactory(item.css, pageManager.loadCSS, function(ret) {
				// 每个 CSS 加载成功，都检查一下 CSS 加载的状态
				status.css.loaded++;
				status.css.complete = (status.css.loaded == status.css.count);
				pageManager.checkModuleStatus(status, item.id);
			});
		} else { // 如果没有 css，直接置为 true
			status.css = {
				complete: true
			};
		}
		// 异步加载 HTML 模板
		if (item.template != null && item.template.length > 0) {
			status.template = pageManager.loadFactory(item.template, pageManager.loadTemplate, function(ret) {
				status.template.loaded++;
				status.template.complete = (status.template.loaded == status.template.count);
				status.template.html = ret;
				// 使用模板引擎进行数据替换
				try {
					var result = easyTemplate('<#macro userlist data>' + ret, item.data).toString();
				} catch (e) {
					// console.log(e);
					// TODO 统计 PHP 接口数据返回异常的情况
					result = '数据异常：' + e;
				}
				status.template.html = result;
				// 等待 CSS 加载完成后，执行 HTML 写入
				pageManager.checkModuleStatus(status, item.id);
			});
		} else { // 如果没有 html，直接置为 true
			status.template = {
				complete: true
			};
		}
		// 异步加载 JS
		if (item.script != null && typeof item.script == "string" && item.script.length > 0) {
			if (DEBUG_MODE) {
				item.script = item.script + (item.script.indexOf("?") == -1 ? "?" : "&") + "r=" + Math.random();
			}
			seajs.use(item.script, function(ret) {
				// 缓存模块句柄，方便后面调用 destroy 方法
				cacheModules[item.id]["module"] = ret;
				// 如果 HTML 渲染成功且 CSS 加载成功，就直接执行 js 初始化，否则进入等待
				if (status.css != null && status.css.complete && status.template != null && status.template.complete) {
					ret.init(item.data);
				} else {
					status.script.complete = true;
					pageManager.checkModuleStatus(status, item.id);
				}
			});
		}
	},
	// 检查 Module 的加载状态，并执行相应的动作
	checkModuleStatus: function(status, item_id) {
		// console.log("正在检查 " + item_id);
		// console.log(JSON.stringify(status));
		// if(status.template != null && status.template.complete){
		// 	// 模板加载完成，如果，CSS 加载完成，就可以写入 HTML
		// 	// console.log(item_id + " HTML 加载完成，可以开始初始化并绑定事件");
		// 	if(status.script != null && status.script.complete){
		// 		cacheModules[item_id]["module"].init(cacheModules[item_id]["data"]);
		// 	}
		// }
		if (status.css != null && status.css.complete) {
			// CSS 加载完成，可以写入 HTML;
			if (status.template != null && status.template.complete) {
				// console.log(item_id + " CSS 加载完成，可以写入 DOM 节点");
				$("#" + item_id).html(status.template.html);
				if (status.script != null && status.script.complete) {
					// console.log(item_id + " CSS 加载完成，可以开始初始化并绑定事件");
					if (cacheModules[item_id]["module"] && typeof cacheModules[item_id]["module"].init === 'function') {
						cacheModules[item_id]["module"].init(cacheModules[item_id]["data"].data);
					}
				}
			}
		}
	},
	// 模块加载工厂，根据不同类型文件，唤起不同的加载器
	loadFactory: function(list, func, callback) {
		if (list == null && list.length == 0) {
			return null;
		}
		// 遍历加载所有的模块
		for (var i = 0, count = list.length; i < count; i++) {
			var url = list[i];
			var ext = url.match(/(\.[a-z0-9]+)(\?\w+=\d+)?$/);
			if (ext.length > 1) {
				ext = ext[1];
			} else {
				console.log("file extions get fail");
			}
			// 取得资源绝对路径
			url = pageManager.getFullPath(url);
			// console.log(url + " : " + typeof ext);
			switch (ext) {
				case ".html":
					pageManager.loadTemplate(url, callback);
					break;
				case ".css":
					pageManager.loadCSS(url, callback);
					break;
				case ".js":
					pageManager.loadJS(url, callback);
					break;
			}
		}
		var status = {
			"loaded": 0,
			"count": list.length,
			"complete": false
		};
		return status;
	},
	// 取得资源的绝对路径
	getFullPath: function(path) {
		// 如果是全路径，直接返回
		if (/^https?:\/\//.test(path)) {
			return path;
		}
		var url = location.protocol + "//" + CONFIG.domain + "/" + path;
		// TODO 加版本号
		return url;
	},
	// URL 加随机数
	'urlRandomParam': function() {

	},
	// 加载模板
	loadTemplate: function(path, callback) {
		var URL = path.replace(/[\/:\.]/g, '_').split('?');
		var tempPath = URL[0],
			version = (URL[1] || '').replace(/^.*=(.*)$/, '$1');
		var IDBInstance;

		var loadFromServer = function(type) {
			$.ajax({
				url: path,
				dataType: 'html',
				cache: !DEBUG_MODE,
				success: function() {
					callback(html);
					useIDBCache && type && updateIDB(html, type);
					// console.log('从服务器获取:'+path);
				}
			})
		};

		var updateIDB = function(template, type) {
			if (!useIDBCache) {
				return;
			}
			var operation = IDBInstance.transaction('TEMPLATE_CACHE', 'readwrite').objectStore('TEMPLATE_CACHE');
			var data = {
				tempPath: tempPath,
				ver: version,
				html: template
			};
			type == 'add' ? operation.add(data) : operation.put(data);
		};

		//为方便本地调试，不带version时一律从服务器请求
		if (useIDBCache && version) {
			//如果可以从IDB中获取tempPath并且其版本号与请求的一致，则读取其内容，否则从服务器请求并更新
			IDBPromise.then(function(instance) {
				IDBInstance = instance;

				var ostore = instance.transaction('TEMPLATE_CACHE', 'readwrite').objectStore('TEMPLATE_CACHE');
				var getCache = ostore.get(tempPath);

				getCache.onsuccess = function(e) {
					var result = e.target.result;
					if (result) {
						var localeVersion = result.ver;
						if (localeVersion == version) {
							callback(result.html);
							// console.log('从indexedDB载入：'+path);
						} else {
							loadFromServer('put');
						}
					} else {
						loadFromServer('add');
					}
				};

				getCache.onerror = (function(argument) {
					loadFromServer('add');
				});
			});
		} else {
			loadFromServer();
		}
	},
	// 加载 CSS
	loadCSS: function(path, callback, cache) {
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');

		// 检查当前的 CSS 是否存在，如果存在就不加载了
		var links = document.getElementsByTagName('link');
		if (links.length > 0) {
			for (var i = 0, count = links.length; i < count; i++) {
				var item = links[i];
				var url = item.href;
				// 如果这个 css 已经加载了
				if (url == path) {
					callback();
					callback = null;
					return;
				}
			}
		}

		if (DEBUG_MODE) {
			path = path + (path.indexOf("?") == -1 ? "?" : "&") + "r=" + Math.random();
		}

		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = path;
		if (cache != true) {
			link.setAttribute("page_id", pageInfo.id || "");
		}
		// console.log(path);

		// 监听资源加载
		if (link.addEventListener) {
			link.addEventListener('load', function() {
				// output("addEventListener 监听 load 事件【有效】");
				if (typeof callback == "function") {
					callback();
					callback = null;
				}
			}, false);
		} else {
			link.onload = function() {
				// output('onload 【有效】');
				if (typeof callback == "function") {
					callback();
					callback = null;
				}
			};
		}
		// #3
		link.onreadystatechange = function() {
			var state = link.readyState;
			if (state === 'loaded' || state === 'complete') {
				link.onreadystatechange = null;
				// output("onreadystatechange 监听加载【有效】");
				if (typeof callback == "function") {
					callback();
					callback = null;
				}
			}
		};

		head.appendChild(link);

		function output(str) {
			// console.log(str);
		}
	},
	// 加载 JS
	loadJS: function(path, callback) {
		$.ajax({
			url: path,
			dataType: "script",
			cache: !DEBUG_MODE,
			success: callback
		});
	},
	// 根据数组加载所有模块
	'loadModules': function(page_info) {
		pageInfo.id = pageManager.getUniqueId();
		// console.log(pageInfo);
		if (typeof page_info.default_data == "undefined") {
			return;
		}
		// TODO 数据合并
		var modules = page_info.default_data.modules,
			real_data = page_info.real_data;
		for (var i = 0; i < modules.length; i++) {
			page_info.default_data.modules[i].data = $.extend(true, modules[i].data, real_data[modules[i].id]);
		}
		var lists = page_info.default_data.modules;
		for (i = 0, count = lists.length; i < count; i++) {
			var item = lists[i];
			// 追加一些额外的配置信息，方便模板渲染，当前只有 domain
			item.data._extra = {
				domain: DOMAIN
			};
			// console.log(item);
			pageManager.loadModule(item);
		}
	},
	'loadModulesInfoFromAJAX': function(url) {
		// TODO 检查前面的页面，是否有没保存的东西
		if (pjaxManager.hasContentUnsave() && window.confirm(MSG.UNSAVE) == false) {
			return;
		}
		// 旧页面的销毁和页面加载状态
		pageManager.destroyOldPage();
		// TODO 如果跳转的页面和当前页面 URL 相同，做特殊处理
		// window.SCRM.pjaxCallback = function(ret){
		// 	// console.log("pjax 回调");
		// 	// console.dir(ret);
		// 	$('.container').html(ret.container);

		// 	pageManager.loadModules(ret.page_data);
		// };
		/* URL 处理，加上 pjax= 1 参数，开始 */
		// 如果 url 没有 ?，就加上 ?pjax=1
		if (url.indexOf("?") == -1) {
			url += "?pjax=1";
		}
		// 如果 ? 在 url 的结尾，就加上 pjax = 1
		else if (/\?$/.test(url)) {
			url += "pjax=1";
		}
		// 如果 url 中含有 pjax 参数，就替换成 1
		else if (/[?&]pjax=\d/.test(url)) {
			url = url.replace(/([?&]pjax)=\d/g, "$1=1");
		} else {
			url += "&pjax=1";
		}
		/* URL 处理，加上 pjax= 1 参数，结束 */
		console.log("load page info from: " + url);
		// $.ajax({
		// 	url: url,
		// 	dataType: "jsonp",
		// 	jsonp: "pjaxCallbackFunctionName",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
		// 	jsonpCallback:"SCRM.pjaxCallback"
		// });

		$.ajax({
			url: url,
			cache: false,
			dataType: 'json',
			success: function(ret) {
				// console.log("pjax 回调");
				// console.dir(ret);
				$('.container').html(ret.data.container);

				pageManager.loadModules(ret.data);
			}
		});
	},
	// 销毁旧的页面
	'destroyOldPage': function() {

		// 移除 CSS
		// console.log('移除CSS');
		if ($('[page_id=' + pageInfo.id + ']').length > 0) {
			$('[page_id=' + pageInfo.id + ']').remove();
		}

		for (var key in cacheModules) {
			var item = cacheModules[key];
			// JS 模块销毁
			// console.log('模块销毁');
			// console.log(item.module);
			if (item && item.module && typeof item.module.destroy == 'function') {
				item.module.destroy();
			}
		}
		// 清空所有缓存的 modules
		cacheModules = {};
		$(".container").html('<div class="loading">加载中……</div>');
	}
};
// 对各个模块暴露的方法
window.SCRM = {
	/**
	 * @param  {String} uniqueid 必选，是否有内容未保存
	 * @param  {Boolean} status 必选，是否有内容未保存
	 * @param  {String} msg 可选，提示文案
	 * @return {Boolean} 设置是否成功
	 */
	'unsave': function(uniqueid, status, msg) {
		if (uniqueid == null || status == null) {
			return false;
		}
		pageStatus.unsave[uniqueid] = !!status;
		if (typeof msg == "string") {
			MSG.UNSAVE = msg;
		}
		if (pageStatus.unsave[uniqueid]) {
			window.onbeforeunload = function() {
				return MSG.UNSAVE;
			};
		} else {
			// TODO 检查所有模块都保存了以后，就将 onbeforeunload 事件清除
			window.onbeforeunload = null;
		}
		return true;
	},
	/**
	 * pjax 跳转的方法
	 * @param  {String} url   必选，pjax 跳转的 URL
	 * @param  {String} title 可选，标题
	 * @param  {Object} opts  可选，选项
	 */
	'pjax': function(url, title, opts) {
		historyManager.pushState({
			'title': title,
			'url': url
		});

		if (!pjaxManager.hasContentUnsave() || (pjaxManager.hasContentUnsave() && window.confirm(MSG.UNSAVE))) {
			// 重置所有未保存的状态
			pageStatus.unsave = {};
			window.onbeforeunload = null;
			if (historyManager.isPushStateEnabled) {
				pageManager.loadModulesInfoFromAJAX(url);
			}
			// 开始 pjax 跳转处理
			pjaxManager.jump(title, url);
		}
	},
	// 加载资源
	'load': function(url, type, callback, opts) {
		// TODO type 类型检查
		//
		if (type == "template" || type == "css") {
			url = pageManager.getFullPath(url);
		}
		var cache = false;
		if (opts && opts.cachecss) {
			cache = opts.cachecss;
		}
		switch (type) {
			case "template":
				pageManager.loadTemplate(url, callback);
				break;
			case "css":
				pageManager.loadCSS(url, callback, cache);
				break;
			case "js":
				seajs.use(url, callback);
				break;
		}
	},
	// 暴露 easyTemplate
	// 'easyTemplate': easyTemplate
};