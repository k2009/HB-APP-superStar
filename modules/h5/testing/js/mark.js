define(function(require){
	var $markform;
	var $outer;
	var $canvas;
	var w,h;
	var stepX,stepY;
	var maxY=0;
	var rdata;

	var markerTipNode=document.createElement('span');
		markerTipNode.className='markerTip';

	var fixNumber=function(rn){
		var n=parseInt(rn, 10);
		var level=parseInt((n.toString().length-1)/3);
		return (n/Math.pow(10,level*3)).toString().replace(/\.(\d).*$/,'.$1') + (['','K','M','B'])[level];
	}

	var initXY=function(){
		var ctx=$canvas[0].getContext('2d');
		ctx.beginPath();
		ctx.strokeStyle='#faf4eb';
		ctx.lineWidth=1;
		stepX=w/rdata.x.length;
		for(var i=0,len=rdata.x.length;i<len;i++){
			var span=document.createElement('span');
			span.className='markXPicker';
			span.innerHTML=rdata.x[i];
			span.style.left=i*stepX+'px';
			$outer.append(span);
			maxY=Math.max(rdata.y[i],maxY);
			ctx.moveTo(i*stepX,0);
			ctx.lineTo(i*stepX,h);
			ctx.stroke();
		}
		var f=maxY.toString().split('').length-1;
		maxY=parseInt(maxY/Math.pow(10,f)+1)*Math.pow(10,f);
		
		stepY=(h-20)/4;
		for(var i=0;i<4;i++){
			var span=document.createElement('span');
			span.className='markYPicker';
			span.innerHTML=(maxY/4)*(i+1);
			span.style.bottom=(i+1)*stepY-9+'px';
			$outer.append(span);
			ctx.moveTo(0,(i+1)*stepY-4);
			ctx.lineTo(w,(i+1)*stepY-4);
			ctx.stroke();
		}
	}

	var drawLine=function(){
		var ratioY=maxY/100;
		var ctx=$canvas[0].getContext('2d');
		ctx.beginPath();
		ctx.strokeStyle='#f9784b';
		ctx.lineWidth=1;		
		for(var i =0,len=rdata.x.length;i<len;i++){
			if(i==0){
				ctx.moveTo(0,h-rdata.y[0]/ratioY);
			}
			(function(k){
				var x=stepX*k,y=h-rdata.y[k]/ratioY;
				setTimeout(function(){					
					ctx.lineTo(x,y);
					ctx.stroke();
				},k*60)
				setTimeout(function(){
					var span=document.createElement('span');
					span.className='marker';
					span.setAttribute('markerTip',rdata.y[k]);
					span.style.cssText='left:'+(x-5)+'px;top:'+(y-5)+'px;';
					$outer.append(span);
					if(k==rdata.x.length-1){
						markerTip.call(span);
					}
				},500+k*60);
			})(i)			
		}		
	}

	var markerTip=function(e){		
		e && e.preventDefault();
		markerTipNode.innerHTML=fixNumber($(this).attr('markerTip'));
		$(this).append(markerTipNode);
	}

	var init=function(data){
		rdata=data;
		$markform=$('#markform');
		$outer=$markform.find('[node=outer]');
		$canvas=$markform.find('[node=canvas]');
		w=$outer.width(),h=$outer.height();
		$canvas.attr('width',$outer.width()).attr('height',120);
		initXY();
		drawLine();
		$outer.on('tap','[markerTip]',markerTip);
	}

	return {
		draw:init
	}

})