
mui.plusReady(function(){
(function(){
    console.log("开始劫持")
	var old_ajax = $.ajax;
	var error = e.error;
    $.ajax = function(e){
        var url = e.url;
		if(!e)return;
		if(!e.url)return;
    		// console.log("开始执行劫持函数")
        if(e.url.indexOf("http")<0&&e.data){
            url = e.url = plus.storage.getItem("domain")+e.url;
        }
        e.error = function(e){
        	if(e.readyState == 4){

	        	switch(e.status){
	        		case 500:
	        			mui.toast('服务器错误');
	        		break;
	        		case 503:
	        			mui.toast('服务不可用');
	        		break;
	        		case 404:
	        			mui.toast('请求地址不存在');
	        		break;
				    default: 
	        			mui.toast('服务器开小差了~请稍后重试!');
				    break; 
	        	}
	        	
        	}else{
                if(url.indexOf("file:")>=0)return;
                console.log("打印网络错误代码:\n"+JSON.stringify(e)+"打印URL\n"+url)
    			mui.toast('您的网络不稳定,请修复后重试!');
        	}
        	
        	if(error){
        		error(e);
        	}
        }
        // console.log(JSON.stringify(e))
        old_ajax(e);
    }
    console.log("劫持完毕")
})();

})