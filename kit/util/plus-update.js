// app 应用更新 by xiaok
// 2016年07月06日16:31:17

define(function(require, exports, module){
    "use strict";
	var $netChange=require("kit/util/plus-netChange");		//网络监测模块
	var $storage = require("kit/util/plus-storage");		//本地存储模块
	var sys = {
		silent:true,								// 是否静默检查
		init : function(){
			sys.getAppVersion(function(v){
				sys.checkUpdate(function(json){			//fn_hasUpDate
                    sys.alert("有新版本"+json.version);
                    sys.downWgt(json.wgtUrl);  // 下载升级包
				},function(){						//fn_noUpDate
                    sys.alert("无新版本可更新！");
				},function(errorCode){						//fn_err
		            sys.alert("检测更新失败！"+errorCode);
				});
			});
		},
		waiting :function(msg){
			// console.log(msg);
			sys.silent||plus.nativeUI.showWaiting(msg);
		},
		alert : function(msg,fn){
			// console.log(msg);
			sys.silent||plus.nativeUI.alert(msg);
			fn&&fn();
		},
		ready : function(callback) {				//检测native是否初始化完成
			
			if (window.plus) {
				setTimeout(function() { //解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
					
					callback();
				}, 0);
			} else {
				document.addEventListener("plusready", function() {
					
					callback();
				}, false);
			}
			return this;
		},
		getAppVersion : function(callback){				// 获取当前应用的版本号
			sys.ready(function(){
			    plus.runtime.getProperty(plus.runtime.appid,function(inf){
			        sys.appVersion=inf.version;
			        if(callback)callback(sys.appVersion);
			    });
			});
		},
		checkUpdate : function(fn_hasUpDate,fn_noUpDate,fn_err){						// 检测更新
			var checkUrl="http://xiaok.org/socialtouch/version.json";
		    sys.waiting("检测更新...");
		    var xhr=new XMLHttpRequest();
		    xhr.onreadystatechange=function(){
		        switch(xhr.readyState){
		            case 4:
		            plus.nativeUI.closeWaiting();
		            if(xhr.status==200){
		            	var config = JSON.parse(xhr.responseText);
		            	console.log(xhr.responseText);
		                var newVer= config.version;
		                if(newVer!=sys.appVersion){
		                	fn_hasUpDate(config);
		                }else{
		                	fn_noUpDate();
		                }
		            }else{
		            	fn_err(xhr.status);
		            }
		            break;
		            default:
		            break;
		        }
		    }
		    xhr.open('GET',checkUrl);
		    xhr.send();
		},
		downWgt:function(wgtUrl){
		    sys.waiting("下载wgt文件...");
		    plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
		        if ( status == 200 ) { 
		            sys.installWgt(d.filename); // 安装wgt包
		        } else {
		            sys.alert("下载wgt失败！");
		        }
		        plus.nativeUI.closeWaiting();
		    }).start();
		},
		installWgt:function(path){
		    sys.waiting("安装wgt文件...");
		    plus.runtime.install(path,{},function(){
		        plus.nativeUI.closeWaiting();
		        sys.alert("应用资源更新完成！",function(){
		            plus.runtime.restart();
		        });
		    },function(e){
		        sys.alert("安装wgt文件失败["+e.code+"]："+e.message);
		    });

		}

	};
	// sys.init();
	return sys;
})














































