define(function(require, exports, module) {
    require("common/util/loadMUI");
	var jssdk = require("common/share/jssdk");
    var $body=$(document.body);
    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
    var queryToJson=require('kit/extra/queryToJson');
    var channel;
    var tabbar;
    var ajaxlock=false;

    var switchCurrent=function(e){
        var $this=$(this);
        $('#box').find('td').removeClass('cur');
        $this.parent('td').addClass('cur');
    };

    var submit=function(){
        if($('#submit').hasClass('mui-btn-disabled')){
            return;
        }
        var inputs=$('#form').find('input');
        for(var i =0,len=inputs.length;i<len;i++){
            if(!inputs[i].value){
                mui.alert('请输入'+inputs[i].getAttribute('placeholder'),'');
                return;
            }
        }
        var data=queryToJson($('#form').serialize());
        data.channel=$('#box').find('td.cur').attr('channel');
        $('#submit').addClass('mui-btn-disabled').innerHTML='提交中...';
        $.ajax({
            url:'/castle/wap/joins/ajaxsaveinfo',
            data:data,
            dataType:'json',
            success:function(json){                
                if(json.code != 0){
                    $('#submit').removeClass('mui-btn-disabled').innerHTML='提交';
                    return mui.alert(json.message,'提示');
                }
                showNotice('success',function(){
                    window.pageURL=json.data.goToUrl;
                });
            },
            error: function(err){
                $('#submit').removeClass('mui-btn-disabled').innerHTML='提交';
                if(typeof err != "undefined" && typeof err.status != "undefined" && err.status == 0){
                    showNotice('fail');
                } else {
                    mui.alert('系统错误，请稍后重试','提示');
                }
            }
        });
    };

    var showNotice=function(state,callback){
        $('#submitNotice').css('display','block').addClass(state);
        setTimeout(function(){
            $('#submitNotice').css('display','none').removeClass(state);
            typeof callback == 'function' && callback();
        },1500);       
    }

    var filterInput=function(e){
        var $this=$(this);
        var target=$this[0];
        var val=$this.val();
        if(/^\s+/.test(val)){
            $this.val(val.replace(/^\s+/,''));
            if (target.setSelectionRange) {
                target.focus();
                target.setSelectionRange(0,0);
            } else if (target.createTextRange) {
                var range = target.createTextRange();
                target.collapse(true);
                target.moveEnd('character', 0);
                target.moveStart('character', 0);
                target.select();
            }
        }
    }
    
    function init(opts) {
        channel = window.pageURL.replace(/^.*\?(.*)$/,'$1').replace(/^.*channel=(\d+).*$/,'$1');
        channel = channel || 1;
        $('#box').find('td.cooperate.c'+channel).addClass('cur');
        $body.delegate('a[index]','tap',switchCurrent);
        $body.find('input').bind('input propertychange',filterInput);
        lazyload.load("common/tabbar/js/index", function(tabbar){
            tabbar.setData(opts.tabbar);
            tabbar.setActiveTab(0);    // 设置哪个 tabbar 高亮，参数是 tabbar 的下标，0 开始
        });
        $('#submit').bind('tap',submit);
    }

	function destroy(opts) {
        channel = 1;
        $body.undelegate('a[index]','tap');
        $('#submit').unbind('tap',submit);
        if(tabbar){
            tabbar.destroy();
        }
        $('#submitNotice').remove();
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});