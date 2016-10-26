/**
 * 异步加载子模块
 * @author Li Ming
 */
define(function(require, exports, module) {

	var modules = {};   // 缓存的异步模块
	var templates = {};
	var css = {};

	// 模块化的类
	function Module(opts) {
		this.id = getSubModuleUniqueId();
		// TODO 检查参数
		if(typeof opts == "string"){
			this.options = {
				'js': opts
			};
		} else {
			this.options = opts;
		}
		this.loadResources();
	}

	// 依次加载资源
	Module.prototype.loadResources = function() {
		// 异步载入 CSS
		var that = this;
		if(this.options.css != null && this.css == null){
			SCRM.load(this.options.css, "css", function(ret){
				// console.log("css");
				// console.log(ret);
				that.css = true;
				that.loadResources();
			}, {
				cachecss: this.options.cachecss || false
			});
			return;
		}
		// 异步载入 HTML 模板
		if(this.options.template != null && this.template == null){
			if(templates[this.options.js] == null){
				SCRM.load(this.options.template, "template", function(ret){
					// console.log("template");
					// console.log(ret);
					that.template = true;
					that.templateText = ret;
					templates[that.options.template] = ret;
					// 假设没有 JS 了
					if(that.options.js == null){
						that.options.success(ret);
					} else {
						that.loadResources();
					}
				});
			} else {
				that.options.success(templates[this.options.template]);
			}
			return;
		}
		// 异步载入 JS
		if(this.options.js != null && this.js == null){
			if(modules[this.options.js] == null){
				SCRM.load(this.options.js, "js", function(ret){
					// console.log("js");
					// console.log(ret);
					that.js = true;
					modules[that.options.js] = ret;
					// console.log("callback");
					ret.init(that.templateText, that.options.success);
					// that.options.success(ret);
				});
			} else {
				modules[this.options.js].init(that.templateText, that.options.success);
			}
			return;
		}
	};

	// 生成子模块的 ID
	function getSubModuleUniqueId(){
		return 'sub_module_' + (new Date().getTime());
	}

	function load(opts, callback) {
	}

	function destroy(opts) {
		// 逐一调用子模块的 destroy 方法
		// abc.destroy();

		// 销毁自身的事件绑定
		console.log("destroy about");
	}
	var that = {
		load: load,
		destroy: destroy
	};
	return that;
});