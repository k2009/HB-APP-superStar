define(function(require){

	var pw,ph;
    var wordSize=28;
    var gaps=[];

    var inPlat=[];

    var getColor=function(){
        return [
            parseInt(50+Math.random()*180).toString(16),
            parseInt(50+Math.random()*180).toString(16),
            parseInt(50+Math.random()*180).toString(16)
        ].join('');
    }

    var throwOne=function(text,size,l,t){
        var span=document.createElement('span');
        span.innerHTML=text;
        span.className='platItem';
        span.style.fontSize=size+'px';
        span.style.left=l+'px';
        span.style.t=t+'px';
        span.style.color='#'+getColor();
        span.style.opacity=0;
        span.style.lineHeight=size+1+'px';
        $('#platform').append(span);
        setTimeout(function(){
            span.style.opacity=1;
        },Math.random()*1000);
        return {
            w:$(span).width(),
            h:$(span).height(),
            node:span
        }
    }

    var checkConflict=function(l,t,w,h){
        if(l+w>pw-15 || t+h>ph){return false;}
        for(var i=0,len=inPlat.length;i<len;i++){
            var item=inPlat[i];
            if(l+w>=item.l && l<=item.l+item.w){
                if(t<=item.t+item.h && t+h>=item.t){
                    return false;
                }
            }
        }
        return true;
    }

    var findGap=function(platItem){
        var rw=platItem.w,rh=platItem.h;
        var result;
        for(var i=0,len=gaps.length;i<len;i++){
            var gap=gaps[i];
            var result=checkConflict(gap.l,gap.t,rw,rh);
            if(result){
                return {
                    l:gap.l,
                    t:gap.t,
                    w:rw,
                    h:rh
                }
            }else{

            }
        }     
    }

    var reSortGaps=function(){
        for(var row=15;row<pw-80;row+=5){
            for(var col=15;col<ph-15;col+=5){
                gaps.push({
                    l:row,
                    t:col
                })
            }
        }

        for(var i=0;i<gaps.length;i++){
            var pos=parseInt(Math.random()*gaps.length);
            var temp=gaps[pos];
            gaps[pos]=gaps[i];
            gaps[i]=temp;
        }
    }

    var initPlatform=function(data){
        rdata=data;
        $plat=$('#platform');        

        var w=pw=$plat.width(),h=ph=$plat.height();

        var l=Math.random()*w,t=Math.random()*h;

        reSortGaps();

        for(var i =0,len=rdata.length;i<len;i++){
            var next=rdata.shift();
            var size=throwOne(next.name,next.weight,0,0);
            var newpos=findGap(size);
            if(!newpos){
                $(size.node).remove();
                continue;
            }
            inPlat.push(newpos);
            size.node.style.left=newpos.l+'px';
            size.node.style.top=newpos.t+'px';
        }
    }

    return {
    	draw:initPlatform
    }
})