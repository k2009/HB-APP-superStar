// app 本地存储模块 by xiaok
// 2016年07月06日18:40:24

define(function(require, exports, module){
    "use strict";
    var storage = function(k,v){
    	// var s = pluplus.storage.storage;
        var code = 0;

    	if(typeof k == "object"){						//如果第一参数直接就是对象,直接将对象表层解耦储存(若为数组,key为number)

    		for(var attr in k){
    			storage(attr,k[attr]);
    		}

    	}else if(v === undefined){						//第二参数undefined时,读取key,并尝试转json
    		
    		return function(data){
    			// console.log('读取数据'+data)
                if(data){
                    try {
                        return JSON.parse(data);
                    } catch (e) {
                        return data;
                    }
                }
                return data;
    		}(plus.storage.getItem(k));

    	}else if( v === null ){							//第二参数是null时,删除key

    		plus.storage.removeItem(k);

    	}else if(typeof v == "object"){					//第二参数为对象时,转字符串并存储
           +function(){
                var txt = JSON.stringify(v);
                var old_txt = plus.storage.getItem(k);
                if(txt != old_txt){
                    plus.storage.setItem(k,JSON.stringify(v));
                    code = 1;
                }else{
                    code = 0;
                }
           }()

           return code;

    	}else{											//存储value
    		if(typeof v == "number"){

	    		v = v.toString();
	    	}
    		plus.storage.setItem(k,v);

    	}

    }

    return storage;

})