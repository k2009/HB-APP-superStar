define(function(require, exports, module) {

    var $body=$(document.body);
    var pageData;
    
    var initTopText=function(){
        $('#topText').find('span').each(function(index,item){
            setTimeout(function (argument) {
              $(item).addClass('t'+(index+1));
            },index*50);
        })
    }

    var selectItem=function(e){
        var $this=$(this);
        if($this.hasClass('select')){
            $this.removeClass('select');
            if($body.find('.select[selectItem]').length==0){
                $('#done').addClass('mui-btn-disable');
            }
        }else{
            $this.addClass('select');
            $('#done').removeClass('mui-btn-disable');
        }
    }

    var done=function(e){
        if($(this).hasClass('mui-btn-disable')){
            return;
        }
        var map=[];
        $body.find('.select[selectItem]').each(function(index,item){
            map.push($(item).attr('cid'));
        });     
        $.ajax({
            url:pageData.save_url,
            data:{
                job_id:map.join(',')
            },
            method:'get',
            dataType:'json',
            success:function(json){
                if(json.code==0){
                    window.pageURL=pageData.next_url;
                }else{
                    alert('保存失败，请重试');
                }                
            }
        })
    }

    function init(opts) {
       pageData=opts;
       setTimeout(initTopText,100);
       $body.delegate('[selectItem]','tap',selectItem);
       $('#done').bind('tap',done);
    }

    function destroy(opts) {
        
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});