
define(function(require, exports, module) {
    
    require("common/util/loadMUI");
    var $body=$(document.body);
    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');

    var graphBorderColor='#f6ca6b';
    var graphCompleteColor='#fbbd06';

    var leftDaysHelp=function (argument) {
        var str='距离毕业天数：\r\n指当前阶段需要学习所有章节课程的建议天数-已完成课程的建议天数';
        if(mui){
            mui.alert(str,'帮助','我知道了');
        }else{
            alert(str,'帮助');
        }
    }

    var forbidden=function () {
        mui.alert('别着急，请按建议时间学习前面的课程并完成课程作业，就可以解锁这一课啦','提示');
    }

    var empty=function(){
        mui.alert('该章课程即将开启，敬请期待','提示');
    }

    var drawChapter=function (rate) {
        var $node=$('#chapter').find('canvas');
        var ctx=$node[0].getContext('2d');
        var r=$node.attr('width')/2;

        var end=-Math.PI/2+Math.PI*2*(100-rate)/100;

        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.fillStyle=ctx.strokeStyle='#ffffff';
        ctx.lineWidth=0;
        ctx.arc(r,r,r,0,Math.PI*2);
        ctx.fill();
        ctx.font="36px Verdana";     
        ctx.fillStyle=ctx.strokeStyle='#555';       
        ctx.fillText(rate+'%',r-45,r-8);
        ctx.font="24px Verdana";  
        ctx.fillStyle=ctx.strokeStyle='#AAA';
        ctx.fillText('已完成课程',r-60,r+25);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth=20;
        ctx.strokeStyle=graphCompleteColor;
        ctx.arc(r,r,r-10,0,Math.PI*2);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth=30;
        ctx.strokeStyle='white';
        ctx.arc(r,r,r-10,-Math.PI/2,end);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth=2;
        ctx.strokeStyle='#ccc';
        ctx.arc(r,r,r-10,-Math.PI/2,end);
        ctx.stroke();
    }

    // var drawChapter=function (rate) {
    //     var $node=$('#chapter').find('canvas');
    //     var ctx=$node[0].getContext('2d');
    //     var r=$node.attr('width')/2;

    //     var nrate=0.01;

    //     var drawWhiteCenter=function(argument) {
    //         ctx.globalCompositeOperation = 'source-over';
    //         ctx.beginPath();
    //         ctx.fillStyle=ctx.strokeStyle='#ffffff';
    //         ctx.lineWidth=0;
    //         ctx.arc(r,r,r-48,0,Math.PI*2);
    //         ctx.fill();
    //         ctx.stroke();
    //     }

    //     var key=setInterval(function (argument) {
    //         nrate++;
    //         ctx.lineWidth=32;
    //         var start=-Math.PI/2+Math.PI*2*(nrate-1)/100;
    //         var end=-Math.PI/2+Math.PI*2*(nrate+1)/100
    //         //ctx.clearRect(0,0,r*2,r*2);
    //         ctx.beginPath();
    //         ctx.globalCompositeOperation = 'source-atop';
    //         ctx.fillStyle=ctx.strokeStyle=graphCompleteColor;
    //         ctx.lineWidth=32;
    //         ctx.arc(r,r,r-16,start,end);
    //         ctx.stroke();

    //         drawWhiteCenter();            
    //         ctx.beginPath();
    //         ctx.globalCompositeOperation = 'source-over';
    //         ctx.fillStyle=ctx.strokeStyle=graphCompleteColor;

    //         ctx.font="36px Verdana";            
    //         ctx.fillText(parseInt(Math.min(rate,nrate))+'%',r-40,r+8);
    //         ctx.stroke();

    //         if(nrate>rate){
    //             clearInterval(key);
    //             return;
    //         }
    //     },10);

    //     ctx.beginPath();
    //     ctx.fillStyle=ctx.strokeStyle=graphBorderColor;
    //     ctx.lineWidth=2;
    //     ctx.arc(r,r,r-17,-Math.PI/2,Math.PI*2);
    //     ctx.stroke();
    // }

    var initPercent=function(){
        $('[node=percent]').each(function(index,item){
            var $this=$(this);
            var percent=parseInt($this.attr('percent'));
            var $bar=$this.find('[node=percentRateBar]');

            var width=$(window).width()-50;
            var right=((100-98*percent/100)-1)*width/100+48;
            // var tipLeft=width*(0.98*percent/100+0.01)-20;
            // if(tipLeft<0){tipLeft=0;}
            // if(tipLeft>width-50){
            //     tipLeft=width-50;
            // }
            setTimeout(function (argument) {
                $bar.css('right',right+'px');
                $this.find('[node=percentTip]').html(percent+'%');
            },100)
        })
    }

    var scrollTo=function(){
    }

    function init(opts) {
        if(opts.is_start){    
            var rate=Math.min(parseInt(opts.percent),100);   
            var wh=120/100/(640/320)*1; 
            $('#schedule').css('display','block')
                .find('canvas').attr('width',240)
                                .attr('height',240)
                                .css({
                                    width:120,
                                    height:120
                                })
            setTimeout(function (argument) {
                drawChapter(rate);
            },100)
        }else{
            $('#notStart').css('display','block');
        }

        if(opts.lessons){
            initPercent();
        }
        $body.delegate('[action=leftDaysHelp]','tap',leftDaysHelp);
        $body.delegate('[action=forbidden]','tap',forbidden);
        $body.delegate('[action=empty]','tap',empty);
        lazyload.load("common/tabbar/js/index", function(tabbar){
            tabbar.setData(opts.tabbar);
            tabbar.setActiveTab(1);    // 设置哪个 tabbar 高亮，参数是 tabbar 的下标，0 开始
        });

        setTimeout(scrollTo,300);

        // 公共头部
        header.init();
    }

    function destroy(opts) {
        $body.undelegate('[action=leftDaysHelp]','tap');
        $body.undelegate('[action=forbidden]','tap');
        $('.mui-popup,.mui-popup-backdrop').remove();
        header.destroy(); 
    }

    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});