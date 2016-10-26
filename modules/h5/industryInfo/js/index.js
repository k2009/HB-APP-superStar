define(function(require, exports, module) {
    require('libs/jquery/plugins/jquery.swipe.min');
    var $body=$(document.body);
    var asyncModule = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var pindex=0;
    var winWidth=$(window).width();
    var winHeight=$(window).height();
    var aniInterval;
    var swipeLock=false;
    var loadLock=false;
    var nextUrl;
    var $template=SCRM.easyTemplate;
    var tabbar;

    var template='<#et list data>'
                    +'<#list data as info>'
                        +'<li class="mui-table-view-cell">'
                            +'<a href="${info.url}">'
                                +'<div class="sponser">'
                                   +' <img src="${info.image}" alt="" class="headpic">'

                                   +' <div class="sponserInfo">'
                                        +'<span class="sponserName">${info.title}</span>'
                                        +'<br>'
                                        +'<span class="sponserDate">${info.ctime}</span>'
                                    +'</div>'
                                +'</div> '             
                            +'</a>'            
                        +'</li>'
                   +' </#list>';


    var initSwipe=function(){
        var pics=$('#pics');
        var count=pics.find('li').length;
        if(count<=1){return;}
        pics.swipe({
            swipe:function(event,direction){
                if(swipeLock){return;}
                swipeLock=true;
                setTimeout(function(){
                    swipeLock=false;
                },300);
                if(pindex==0 && direction=='right' || pindex>=count-1 && direction=='left'){return;}
                direction=='left'?pindex++:pindex--;
                if(pindex<0){pindex=0;}
                if(pindex>=count-1){pindex=count-1;}
                pics.css('margin-left',-winWidth*pindex+'px');
                $('#points').find('.point').removeClass('cur').eq(pindex).addClass('cur');
                clearInterval(aniInterval);
                initPics(true);
            }
        })
    }

    var initPics=function(onlyInterval){        
        var pics=$('#pics');
        
        var count=pics.find('li').css('width',winWidth+'px').length;
        
        if(!onlyInterval){
            pics.css('width',winWidth*count).css('display','block');
        }

        if(count>1){
            aniInterval=setInterval(function(){
                pindex++;
                if(pindex>=count){
                    pindex=0;
                }
                pics.css('margin-left',-winWidth*pindex+'px');
                $('#points').find('.point').removeClass('cur').eq(pindex).addClass('cur');
            },5000);
        }        
    }

    var lazyload=function(){   
        if(loadLock){return;}     
        var bh=$body.height();
        var st=document.body.scrollTop+winHeight;
        if(bh-st<50){
           loadLock=true;
           $.ajax({
                url:nextUrl,
                dataType:"json",
                success:function(json){
                    loadLock=false;
                    var data=json.data.real_data.st_modules_h5_industryInfo;   
                    if(data.newslist.list.length==0){
                        loadLock=true;
                        var html='<div class="notice">没有更多了...</div>'
                    }else{
                        var html=$template(template,data.newslist.list).toString();
                        nextUrl=data.interface_url;
                    }
                    $('#listBox').append(html);
                    
                }
           }) 
        }
    }

    function init(opts) {
        setTimeout(function(){
            initPics();
            initSwipe();
        },500);
        $(window).bind('scroll',lazyload);
        nextUrl=opts.interface_url;

        // 延迟加载 tabbar
        asyncModule.load("common/tabbar/js/index", function(ret){
            ret.setData(opts.tabbar);
            ret.setActiveTab(1);
            tabbar = ret;
        });
        // 公共头部
        header.init(); 
    }

    function destroy(opts) {
        if(tabbar){
            tabbar.destroy();
        }
        header.destroy();
    }

    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});