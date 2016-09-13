define("kit/util/asyncModule", [], function(require, exports, module) {
	function Module(opts) {
		if (this.id = getSubModuleUniqueId(), "string" == typeof opts) this.options = {
			js: opts
		};
		else this.options = opts;
		this.loadResources()
	}

	function getSubModuleUniqueId() {
		return "sub_module_" + (new Date).getTime()
	}

	function load(opts, callback) {
		var info;
		if ("string" == typeof opts) info = {
			js: opts,
			success: callback
		};
		else info = opts;
		new Module(info)
	}

	function destroy(opts) {
		console.log("destroy about")
	}
	var modules = {},
		templates = {};
	Module.prototype.loadResources = function() {
		var that = this;
		if (null != this.options.css && null == this.css) return void SCRM.load(this.options.css, "css", function(ret) {
			that.css = true, that.loadResources()
		}, {
			cachecss: this.options.cachecss || false
		});
		if (null != this.options.template && null == this.template) {
			if (null == templates[this.options.js]) SCRM.load(this.options.template, "template", function(ret) {
				if (that.template = true, that.templateText = ret, templates[that.options.template] = ret, null == that.options.js) that.options.success(ret);
				else that.loadResources()
			});
			else that.options.success(templates[this.options.template]);
			return
		}
		if (null != this.options.js && null == this.js) {
			if (null == modules[this.options.js]) SCRM.load(this.options.js, "js", function(ret) {
				that.js = true, modules[that.options.js] = ret, ret.init(that.templateText, that.options.success)
			});
			else modules[this.options.js].init(that.templateText, that.options.success);
			return
		}
	};
	var that = {
		load: load,
		destroy: destroy
	};
	return that
});