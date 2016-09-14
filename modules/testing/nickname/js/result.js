define(function(require, exports, module) {
    require("common/util/loadMUI");
    var lazyload = require("kit/util/asyncModule");
    var $share=require('modules/testing/nickname/js/resultShare');
    var $body=$(document.body);
    var $window=$(window);
    var pageData;

    var initRandomText=function(){
        var t=['取名字不容易，可以去看看顶级网红是如何取名字的'
                ,'来，跟着我念：我想当网红，我要努力，我要加油'
                ,'这个名字还需要再努力一下下呦'
                ,'再想想还有没有更好的名字呢，可以看看网红是怎么取名字的'
                ,'名字还不错，但还有进步的空间呦'];
        var i=parseInt(Math.random()*t.length);
        $('#randomText').html(t[i]);
    }
    
    var initTopText=function(){
        $('#topText').find('span').each(function(index,item){
            setTimeout(function (argument) {
              $(item).addClass('t'+(index+1));
            },index*50);
        })
    }

    var initCanvas=function(opts){
        var score=opts.score||60;
        var $canvas=$('#canvasBox').find('canvas');
        var w=$window.width()*0.8;
        $canvas.attr('width',w*2).attr('height',w)
                .css({
                    width:w,
                    height:w*0.5
                });
        var ctx=$canvas[0].getContext('2d');

        ctx.beginPath();
        ctx.strokeStyle='#bfbfbf';
        ctx.lineWidth=32;
        ctx.arc(
            w,
            w,
            w*0.8,
            -Math.PI,
            Math.PI
            );
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle='#fbbd06';
        ctx.arc(
            w,
            w,
            w*0.8,
            -Math.PI,
            (Math.PI*score/100)-Math.PI
            );
        ctx.stroke();

        $('#canvasBox').find('span').html('<font class="scoreNumber">'+score+'</font>分')
    }

    var initStar=function(opts){
        var structScore=opts.structScore||3;
        var keyScore=opts.keyScore||4;
        for(var i=0;i<5;i++){
            $('#structScore').append('<span class="diffStar '+(i<structScore?'':'empty')+'"></span>')
        }
        for(var i=0;i<5;i++){
            $('#keyScore').append('<span class="diffStar '+(i<keyScore?'':'empty')+'"></span>')
        }
    }
    
    var retest=function(){
        var url=$(this).attr('ohref');
        if(pageData.num>=3){
            mui.alert('亲,每天只能免费测3次呦，请明天再来吧','提示','我知道了');
        }else{
            location.href=url;
        }
    }

    function init(opts) {
        lazyload.load("common/tabbar/js/index", function(dialog){
            dialog.setData(opts.tabbar);
            dialog.setActiveTab(2);
        });   
        pageData=opts;
        initRandomText();
        initTopText();
        initCanvas(opts);
        initStar(opts);
        $share.init(opts);
        $body.delegate('[action=retest]','click',retest);
    }

    function destroy(opts) {
        $share.destroy();
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});