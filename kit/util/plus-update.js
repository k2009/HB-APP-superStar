// app 应用更新 by xiaok
// 2016年07月06日16:31:17

define(function(require, exports, module){
    "use strict";
	var $storage = require("kit/util/plus-storage");		//本地存储模块
	var sys = {
		silent:true,								// 是否静默检查
		init : function(){
			console.log("开始检测版本更新")
			sys.getAppVersion(function(v){
				sys.checkUpdate(function(json){			//fn_hasUpDate
					console.log("检测完成")
					console.log(JSON.stringify(json))
                    sys.alert("有新版本"+json.version);
                    sys.downWgt(json.full_url);  // 下载升级包	//暂时先这样
				},function(){						//fn_noUpDate
                    sys.alert("无新版本可更新！");
				},function(e){						//fn_err
		            sys.alert("检测更新失败！"+e.status);
				});
			});
		},
		waiting :function(msg){
			console.log(msg);
			sys.silent||plus.nativeUI.showWaiting(msg);
		},
		alert : function(msg,fn){
			console.log(msg);
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
    		var checkUrl = plus.storage.getItem("domain")+"/castle/app/v1/api/check-version";
    		var appID = plus.runtime.appid;
    		var channel_id;
		    sys.waiting("检测更新...");

    		if(appID == "com.91hong.wanghong"){
    			channel_id=(mui.os.ios?16:20)
    		}else{
    			channel_id=(mui.os.ios?1:2)
    		}
		    $.ajax({
		    	type:"get",
                url:checkUrl,
                data: {
                	channel_id:channel_id,
                	version:sys.appVersion
                },
                error:function(e) {
			    	fn_err(e);
			    },
			    success:function(e){
			    	if(e.code == 0){
			            plus.nativeUI.closeWaiting();
		            	var config = e.data;
		                var newVer= config.version;
		                if(newVer!=sys.appVersion){
		                	fn_hasUpDate(config);
		                }else{
		                	fn_noUpDate();
		                }	
			    	}
			    },
                dataType: 'json', //服务器返回json格式数据
                timeout: 10000, //超时时间设置为10秒；
		    });
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
		    	sys.waiting("安装成功!");
		        plus.nativeUI.closeWaiting();
//		        alert('应用资源更新完成!退出后重新打开即可使用最新版本啦');
//		        setTimeout(function(){
//		        	plus.runtime.restart();
//		        },3000)
		    },function(e){
		        sys.alert("安装wgt文件失败["+e.code+"]："+e.message);
		    });

		}

	};
	// sys.init();
	return sys;
})














































