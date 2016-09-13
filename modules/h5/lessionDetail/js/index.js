define(function(require, exports, module) {
    require("common/util/loadMUI");
    var $body=$(document.body);
    var lazyload = require("kit/util/asyncModule");

    var initDifficulty=function (argument) {
        $('[difficulty]').each(function (index,item) {
            var diff=$(this).attr('difficulty');
            var str='';
            for(var i=0;i<5;i++){
                str+='<span class="diffStar '+(i<=diff?'':'empty')+'"></span>';
            }
            $(this).html('困难系数：'+str);
        })
    }

    var initPercent=function () {
        var percent=$('#percent').attr('percent');        
        percent=parseInt(percent);
        if(percent<=0){return;}
        $('#percent').css('display','');
        var right=(100-90*percent/100)-5;
        var style=document.createElement('style');
        style.innerHTML='.percentRate:after{right:'+right+'%;}';
        setTimeout(function (argument) {
            document.body.appendChild(style);
        },100)
    }

    // var slide=function(e) {
    //     var $this=$(e.target);
    //     var state=$this.attr('state');
    //     var display=(state=='block')?'none':'block';
    //     $this.attr('state',state=='block'?'none':'block');
    //     $this.parent().find('[node=item]').css('display',display);
    // }

    function init(opts) {
        //$tap(window,slide);
        initDifficulty();
        //initPercent();
         lazyload.load("common/tabbar/js/index", function(tabbar){
            ret.setData(opts.tabbar);
            tabbar.setActiveTab(1);    // 设置哪个 tabbar 高亮，参数是 tabbar 的下标，0 开始
        });
    }

    function destroy(opts) {
        
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});