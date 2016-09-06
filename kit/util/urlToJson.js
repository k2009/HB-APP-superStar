// app json转url,url转json by xiaok
// 2016年07月19日15:42:54

define(function(require, exports, module) {
    "use strict";

    

    function urlToJson(url){
        var arr = url.split('?');
        url = arr.shift();
        arr = arr.join('?').split('&');
        var json={};
        for (var i = 0; i < arr.length; i++) {
            +function(txt){
                var a = txt.split('=');
                var key = a.shift();
                if(key){
                    json[key]=a.join('=');
                }
                
            }(arr[i])
        }

        return {
            url:url,
            data:json
        };
    }

    function jsonToUrl(url,data){
        var json = urlToJson(url);
        var btn = true;
        url = json.url;
        +function(){
            var d = json.data;
            for(var attr in data){
                d[attr] = data[attr]
            }
            data = d;
        }()
        // data = $.extend(json.data,data);

        for(var attr in data){
            if(btn){
                url+='?';
                btn = false;
            }else{
                url+='&';
            }
            url+=(attr+'='+data[attr])
        }
        return url;
    }

    var sys = function(url,data){
        if(!data){
            return urlToJson(url);
        }else{
            return jsonToUrl(url,data);
        }
    }
    return sys;

// jsonToUrl('http://30681.biz.dev.social-touch.com/castle/wap/course/course-section-details?course_id=11&lesson_id=16',{abc:3,bcd:5,lesson_id:99})

})