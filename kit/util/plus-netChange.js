// app 监测网络变化 by xiaok
// 2016年07月06日16:31:08

define(function(require, exports, module){
    "use strict";
	var sys = {
		getNetType:function(){					//返回当前的网络状态
			var nt = plus.networkinfo.getCurrentType();
			var type = 0;
			switch ( nt ) {
				case plus.networkinfo.CONNECTION_ETHERNET:
				case plus.networkinfo.CONNECTION_WIFI:
				type = 1; //wifi
				break; 
				case plus.networkinfo.CONNECTION_CELL2G:
				type = 2; //蜂窝2G
				break; 
				case plus.networkinfo.CONNECTION_CELL3G:
				type = 3; //蜂窝3G
				break; 
				case plus.networkinfo.CONNECTION_CELL4G:
				type = 4; //蜂窝4G
				break; 
				default:
				type = 0; //无网络
				break;
			}
			return type;
		},
		NetChange:function(callback){			//对网络状态进行实时检测(必须等plus加载完毕后执行);
			document.addEventListener( "netchange", callback, false );  
		}
	};
	return sys;
})