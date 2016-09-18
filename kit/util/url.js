//操作url的query部分 wangshuo
define(function(require,exports,module){
	var parseURL=require('kit/extra/parseURL');
	var queryToJson=require('kit/extra/queryToJson');
	var jsonToQuery=require('kit/extra/jsonToQuery');
	var that={};
	that.set=function(surl,k,v){
		var url=surl;
		var result=parseURL(url);
		var obj=queryToJson(result.query);
		if(typeof k=='string'){
			obj[k]=v;
		}else if(typeof k=='object'){
			for(var i in k){
				obj[i]=k[i];
			}
		}		
		return url.replace(/^([^\?]+)\??.*$/,'$1')+'?'+jsonToQuery(obj);
	}

	that.get=function(surl,k){
		var result=parseURL(surl);
		//兼容IE9 历史记录
		if(/hmParam\![^\!]+\!/.test(result.hash)){
			var url=result.hash.replace(/hmURL\!([^\!]+)\!/,'$1');
			var params=result.hash.replace(/^.*hmParam\!([^\!]+)\!.*$/,'$1');
			result.query=params;
		}		
		var obj=queryToJson(result.query);
		return k?obj[k]:obj;
	}

	that.del=function(surl,k){
		var url=surl;
		var result=parseURL(url).query;
		var obj=queryToJson(result);
		delete obj[k];
		return url.replace(/^([^\?]+)\??.*$/,'$1')+'?'+jsonToQuery(obj);
	}
	return that;
})