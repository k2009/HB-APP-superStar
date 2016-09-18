define(function(require, exports, module) {
    var pageData=page_data.real_data.st_modules_h5_DNAResult;

    var active=pageData.fantastic.content;
    var total=(function (argument) {
        var total=0;
        for(var i in active){
            if(i=='total'){
                continue;
            }
            active[i]=Math.max(active[i],1);
            total+=active[i];
        }
        return total;
    })();

    var contentData={
        pic:(active.pic*100/total),
        text:(active.default*100/total)        
    }
    contentData.video=100-contentData.pic-contentData.text;

    var color={
        pic:'#ffa0f4',
        text:'#2b9dec',
        video:'white'
    }

    var text={
        pic:'图片',
        text:'文字',
        video:'视频'
    }

    var defaultActiveData=pageData.active.content || [20,50,30,70,10,60,15,8];

    var percentToRad=function (percent) {
        return (Math.PI/180)*(360*percent/100)
    }

    var drawStage2=function (argument) {
        var $rcBox=$('#rcBox');
        var ctx=$('#stage2Canvas')[0].getContext('2d');
        var cstart=0,cend=0;
        var w=$rcBox.width(),h=$rcBox.height();
        var centerX=w/2,centerY=h/2;
        var r=w/2;
        
        for(var i in contentData){
            cend+=contentData[i];
            ctx.fillStyle = ctx.strokeStyle = color[i];
            ctx.beginPath();
            ctx.moveTo(centerX,centerY);
            ctx.arc(centerX,centerY,r,cstart-Math.PI/2,percentToRad(cend)-Math.PI/2,false);            
            ctx.fill();
            ctx.stroke();
            cstart+=percentToRad(contentData[i]);

            var $title=$('<span class="rcTitle">'+text[i]+'</span>');
            var titleRad=percentToRad(cend*0.8);
            if(titleRad>2.1 && titleRad<4){
                if(titleRad<3.14){
                    titleRad=2.0;
                }else{
                    titleRad=4;
                }
            }
            $rcBox.append($title);
            $title.css({
                left:centerX+Math.sin(titleRad)*(r+20)-10,
                top:centerY-Math.cos(titleRad)*(r+20)-5,
                color:color[i]
            })
        }

    }


    var drawStage3=function (argument) {
        var $rcBox3=$('#rcBox3');
        var pps=[];
        var $canvas=$rcBox3.find('canvas');
        var ctx=$('#stage3Canvas')[0].getContext('2d');
        var w=$canvas.width(),h=$canvas.height();
        var data=active.data||defaultActiveData;

        var step=w/data.length;
        var cleft=3;
        
        ctx.fillStyle = ctx.strokeStyle = 'white';
        ctx.lineWidth=2;
        ctx.beginPath();

        ctx.moveTo(2,2);
        
        ctx.lineTo(2,h);
        ctx.lineTo(w,h);
        ctx.stroke();
        ctx.fillStyle = ctx.strokeStyle = '#d761bb';

        ctx.lineWidth=0;
        ctx.moveTo(3,3);
        ctx.beginPath();
        for(var i in data){
            var p=data[i];
            if(i==0){
                ctx.moveTo(cleft,h-p);
            }else{
                ctx.lineTo(cleft+step,h-p);                
            }
            if(p>data[i-1] || p>data[i+1]){
                pps.push({
                    l:cleft+step,
                    t:h-p
                })
            }
            cleft+=step;            
        }
        ctx.lineTo(w-2,h-2);
        ctx.lineTo(2,h-2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = ctx.strokeStyle = '#fff701';

        ctx.lineWidth=0;
        for(var i=0,len=pps.length;i<len;i++){
            ctx.beginPath();
            ctx.moveTo(pps[i].l,pps[i].t);
            ctx.arc(pps[i].l,pps[i].t,4,0,2*Math.PI,false);
            ctx.stroke();
            ctx.fill();
        }
    }

    function init(opts) {
        drawStage2();
        drawStage3();
    }

    function destroy(opts) {
        
    }
    var that = {
        init: init,
        destroy: destroy
    };

    return that;
});