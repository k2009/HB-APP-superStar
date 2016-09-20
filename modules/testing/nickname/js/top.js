define(function(require, exports, module) {

    var $body=$(document.body);
    var $window=$(window);
    var wordCloud=require('modules/testing/weiboDNA/js/wordCloud');
    var divideWindowSize=380;
    var header = require('common/slogon/js/index');
    var structColors=[
        '#2ec7c9','#b7a3df','#5ab1ef','#ffb981','#d97a81'
    ]
    var structText=[
        '中文结构','中文+英文结构','英文+中文结构','英文结构','英文-英文结构'
    ]

    var initStruct=function(opts){
        var percents=opts.percents || [
            52,15,7.5,6.6,2.6
        ]        
        var $canvas=$('#structCanvasBox').find('canvas');
        var ww=$window.width();
        var w=ww*0.5;
        var lineHeight=w/7;
        $('#structCanvasBox').css('height',w);
        $canvas.attr('width',w*2).attr('height',w*2)
                .css({
                    width:w,
                    height:w,
                    left:ww>divideWindowSize?w*0.34:w*0.12,
                    right:w*0.2
                });

        $canvas.each(function(index,item){
            var step=0;
            var drawer;
            var ctx=$(item)[0].getContext('2d');
            var text=structText[index];
            var percent=percents[index];
            var r=w-index*lineHeight-lineHeight;
            setTimeout(function(){
                var span=document.createElement('span');
                span.style.left=ww>divideWindowSize?'47%':'35%';
                span.className='structText';
                span.style.top=lineHeight/2*index+lineHeight/4+'px';
                span.style.lineHeight=lineHeight/2+2+'px';
                var iconW=Math.max(lineHeight,32);
                span.innerHTML='<span class="arcIcon" style="height:'+iconW/2
                                                                    +'px;width:'+iconW/2
                                                                    +'px;margin-left:'+iconW/4
                                                                    +'px;margin-right:-'+iconW/4
                                                                    +'px;border-left-color:'+structColors[index]+'"></span>'
                        +percent+'%的网红使用'+text;
                $('#structCanvasBox').append(span);
                setTimeout(function(){
                    span.style.width='250px';
                },50);
                drawer=setInterval(function(){
                    
                    step+=1;
                    ctx.clearRect(0,0,w*2,w*2);
                    ctx.beginPath();
                    ctx.strokeStyle=structColors[index];
                    ctx.lineWidth=lineHeight;
                    ctx.arc(
                        w,
                        w,
                        r,
                        -Math.PI/2+(100-step)/100*Math.PI*2,
                        -Math.PI/2
                        );
                    ctx.stroke();
                    if(step>=percent){
                        clearInterval(drawer);                        
                    }
                },12);
            },200*(index));            
        });

        // ctx.beginPath();
        // ctx.strokeStyle='#fbbd06';
        // ctx.arc(
        //     w,
        //     w,
        //     w*0.8,
        //     -Math.PI,
        //     (Math.PI*score/100)-Math.PI
        //     );
        // ctx.stroke();
    }

    var initKey=function(opts){
        var keys=opts.keys;
        //[{"name":"及","weight":30},{"name":"的","weight":29},{"name":"迫","weight":28},{"name":"害","weight":27},{"name":"无","weight":26},{"name":"饿","weight":25},{"name":"哦","weight":24},{"name":"就","weight":23},{"name":"去","weight":22},{"name":"哦","weight":21},{"name":"违","weight":20},{"name":"法","weight":19},{"name":"群","weight":18},{"name":"殴","weight":17},{"name":"违","weight":16},{"name":"法","weight":15},{"name":"噢","weight":14},{"name":"去","weight":13},{"name":"我","weight":12},{"name":"没","weight":11}]       
        var ww=$window.width();
        $('#keyCanvasBox').css('height',$('#keyCanvasBox').width()*0.5);
        wordCloud.draw(keys,null,{
            node:'#keyCanvasBox',
            colorBase:['00b5bd','f66f17','ffcc00'],
            maxWordCount:42,
            maxFontSize:28,
            minFontSize:12
        });
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
    

    function init(opts) {
        initStruct(opts);
        setTimeout(function(){
            initKey(opts);
        },1000);

        // 公共头部
        header.init();
    }

    function destroy(opts) {
        
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});