define(function(require, exports, module) {
    "use strict";

    var $tmp = require("kit/util/easyTemplate");            //模板处理方法载入
    var $storage = require("kit/util/plus-storage");        //本地存储模块
    var $pjax = require("kit/util/plus-pjax");              //数组转json

    var type_debug = false;                                  //debug开关
    window.weixinTips = null;                               //兼容性代码
    window.$tmp = $tmp;                                     //兼容性代码

    var sys = {
        cacheTime:300000,
        init:function(config,callback){
            plus.runtime.getProperty(plus.runtime.appid,function(inf){
                sys.version = inf.version;
            });
            
            var cfg = {
                'static_path': '../../../',
                "time": new Date().getTime(),
                // "domain": "static.91hong.com.cn",
                "domain":function(){
                    if(plus.storage.getItem("domain") == 'http://91hong.com.cn'){
                        return "static.91hong.com.cn"
                    }else{
                        return "wh1.code4js.com"
                    }
                    
                }(),
                "version": 100
            };
            var fn1 = {
                init:function(){},
                destroy:function(){}
            }

            if(!window.CONFIG){                 //初始config常量补全
                window.CONFIG = cfg;
            }else{
                window.CONFIG = $.extend(cfg,window.CONFIG);
            }


            sys.ajax_url = config.url;
            sys.id = config.id;
            sys.loading = config.loading_show;
            sys.elastic = config.elastic;
            window.page_data = {
                real_data:{

                }
            };
            sys.default_data = config.data;
            sys.tmp = config.tmp;
            sys.ajax_data = config.ajax_data;
            sys.fn_index = config.fn||fn1;
            sys.cache = config.cache;
            sys.cacheTime = config.cacheTime||sys.cacheTime;

            mui.plusReady(function(){
                sys.storage_init();
                sys.listener();
                mui('body').on('tap', 'a', sys.event.a_click);
                window.APP_construction = sys;
                return sys;
            })
        },
        event:{
            a_click:function(event) {
                var url = this.getAttribute('href');
                var title = $(this).text();
                console.log('title:'+title)
                console.log('html:'+$(this).html())
                if($(this).find('p,h1,h2,h3,span').length>0){
                    +function($obj){
                        var text;
                        for (var i = 0; i < $obj.length; i++) {
                            text = $obj.eq(i).text();
                            if(text.length>=3){
                                title=text;
                                console.log('title:'+text);
                                return
                            }
                        }
                    }($(this).find('p,h1,h2,h3,span'))
                }
                console.log("pjax-url:"+url);
                title = title.split(">").join('');
                $pjax(url,title);
            }
        },
        listener:function(){
            window.addEventListener('viewReload',function(e){
                $(window).scrollTop(0);
                $('#'+sys.id).html('<div class="fakeloader"><div class="fl spinner1"><div class="double-bounce1"></div><div class="double-bounce2"></div></div><div class="text">数据加载中...</div></div>');
                if(e.detail.ajax_data)sys.ajax_data = e.detail.ajax_data;
                sys.storage_init();
            });
        },
        storage_init:function(){
            var id_data = $storage(sys.id);
            var memoryData;
            var btn = true;
            if(!$.isEmptyObject(sys.ajax_data)){
                memoryData = sys.memory(sys.ajax_data);
                if(memoryData){
                    id_data = memoryData.data;
                    if((mui.now() - memoryData.cacheTime) < sys.cacheTime){
                        btn = false;
                    }
                }
            }
            if(id_data){
                sys.default_data[sys.id] = $.extend(true,sys.default_data[sys.id],id_data);
            }
            +function(){
                if(sys.default_data[sys.id].pretreatment === false){
                    btn = true;
                    return;
                }
                try{
                    sys.initSomeThing(sys.id,sys.default_data[sys.id]);
                }catch(e){
                    if(type_debug){
                        console.log('模板引入发生错误'+sys.id+JSON.stringify(e)+"line:161");
                        console.log(sys.id+JSON.stringify(sys.default_data[sys.id]));
                    }
                }
            }()

            if(sys.loading){
                $(".mui-content").css('position','relative')
                
                if ($('#pageLoading').length) {
                    $('#pageLoading').css('margin-top',0)
                } else {

                    $('body').prepend('<div id="pageLoading" class="mui-content" style="position: relative;height: 50px;overflow: hidden;transition:all .4s;-webkit-transition: all .4s; "><div class="mui-block mui-visibility"><div class="mui-pull"><div class="mui-pull-loading mui-icon mui-spinner" style="transition: -webkit-transform 0.3s ease-in; transform: rotate(180deg); animation: spinner-spin 1s step-end infinite;"></div><div class="mui-pull-caption">数据更新...</div></div></div></div>')
                }
            }

            if(btn){

                sys.ajax_reload();

            }else{

                sys.closeLoading();
            }

        },
        closeLoading:function (msg){
            var loading = document.getElementById('pageLoading');
            if(loading){
                setTimeout(function(){
                    loading.style.marginTop = '-50px'
                },100);       //loding必须延迟执行,不然会显示不出动画效果
                loading.querySelector('.mui-pull-caption').innerHTML = (msg||'加载成功!');
            }
        },
        memory:function(json,value){        //临时寄存器(妈的感觉这块逻辑写的特别别扭)
            var data,cont;
            cont = 50;
            data = $storage(sys.id);
            function setMemory(){
                var d,i;

                if(!data){
                    data = [];
                }else if(data.constructor !== Array){
                    data = [];
                }else{
                    d = getMemory('all')
                    i = d.index;
                }

                if(i){
                    data.splice(i, 1)
                }

				console.log(JSON.stringify(data));
                json.cacheTime = mui.now();
                json.data = value;
                data.unshift(json);
                if(data.length>=cont){
                    data.splice( cont, (data.length-cont) )
                }

                $storage(sys.id,data);
            }

            function getMemory(type){
                var i,btn,attr;
                if((!data)||typeof data != 'object'){
                    return;
                }
                for (i = 0; i < data.length; i++) {
                    btn = true;
                    for (attr in json){
                        if(json[attr] != data[i][attr]){
                            btn = false;
                            continue;
                        }
                    }
                    if(btn){
                        if(type == 'all'){
                            return {'index':i,'data':data[i]};
                        }
                        return data[i];
                    }
                }
                return {};
            }

            if(value){
                setMemory();
            }else{
                return getMemory();
            }
        },
        ajax_reload:function (callback){
            $.ajax({
                url:sys.ajax_url,
                data: $.extend({pjax:1},sys.ajax_data),
                dataType: 'json', //服务器返回json格式数据
                type: 'get', //HTTP请求类型
                timeout: 10000, //超时时间设置为10秒；
                success: function(data) {
                    console.log(JSON.stringify(data))
                    if(data.code == 0){ //有bug
                        var d = data.data.real_data[sys.id];
                        var code = null;
                        d = mui.extend(sys.default_data[sys.id],d);
                        delete d.jssdk;
                        delete d._extra;
                        if($.isEmptyObject(sys.ajax_data)){
                            code = $storage(sys.id,d);
                        }else{
                            sys.memory(sys.ajax_data,d);
                            code = 1;
                        }
                        if(code == 1){
                            +function(){
                                try{
                                    if(sys.fn_index.destroy)sys.fn_index.destroy(d);
                                }catch(e){
                                    if(type_debug){
                                        console.log('js销毁发生错误'+JSON.stringify(e)+"line:218");
                                        console.log(JSON.stringify(sys.default_data[sys.id]));
                                    }
                                }
                            }()
                            +function(){
                                try{
                                    sys.initSomeThing(sys.id,sys.default_data[sys.id] );
                                }catch(e){
                                    if(type_debug){
                                        console.log('模板引入发生错误'+JSON.stringify(e)+"line:228");
                                        console.log(JSON.stringify(sys.default_data[sys.id]));
                                    }
                                }
                            }()
                        }
                        if(callback)callback();
                        sys.closeLoading()
                    }else{
                        console.log(sys.ajax_url)
                        console.log(JSON.stringify(sys.ajax_data))
                        mui.toast(data.message||data.msg)
                    }
                },
                error: function(e) {
                    sys.closeLoading('网络错误'+"line:283")
                    if((e.statusText != "timeout")&&type_debug){
                        console.log('请求错误,下面打印错误代码'+"line:283")
                        console.log(sys.ajax_url)
                        console.log(JSON.stringify($.extend({pjax:1},sys.ajax_data)))
                        console.log(JSON.stringify(e));
                    }
                }
            });
        },
        initSomeThing:function (id,data){
            var $loding = $('.fakeloader');
            if(!data){
                if(type_debug)console.log('数据传入出错,跳出执行区'+"line:253");
                return;
            }
            // console.log(id)
            window.page_data.real_data[id] = data;
            window.pageData = data;
            data._extra = window.CONFIG;

            var jssdk = {
                "appId": "必填，公众号的唯一标识",
                "timestamp": "必填，生成签名的时间戳",
                "nonceStr": "必填，生成签名的随机串",
                "signature": "必填，签名，见附录1"
            }
            data.jssdk = jssdk;
            if(type_debug){
                console.log(JSON.stringify(data))
                console.log($tmp(sys.tmp,data))
            }
            document.getElementById(id).innerHTML = $tmp(sys.tmp,data);

            //不这么改就得加班了 之后再改吧
            $('body').find('a').each(function(){
                if($(this).html() == '返回'){
                    $(this).remove();
                }
                if($(this).html() == '重新测试'){
                    $(this).remove();
                }
            })
            //不这么改就得加班了


            $loding.addClass('hide');
            setTimeout(function(){
                $loding.remove();
            },400)
            // $('.mui-bar').remove();
            $('.container').css('top', '0');
            sys.fn_index.init(data);
        }
    }

    return sys.init;
});
