define(function(require, exports, module) {
    var wxSdk = require('');
	var wx = null;
	var validate = {
		user_name:function(value){
			var user_name = $.trim( value ),
				//reg = /^([\u4e00-\u9fa5]){2,5}$/;
				reg = /^[0-9a-zA-Z\u4e00-\u9fa5_·-]{1,30}$/;
			if (!reg.test(user_name)) {
				this.handle( 'user_name' );
				return false;
			}
			return true;
		},
		phone:function( value ){
			var phone= $.trim( value ),
				reg = /^1[3|4|5|7|8]\d{9}$/;
			if (!reg.test(phone)) {
				this.handle( 'phone' );
				return false;
			}
			return true;
		},
		weibo_nick_name: function( value ){
			var weibo_nick_name =  $.trim( value )
				reg = /^[0-9a-zA-Z\u4e00-\u9fa5_-]{1,30}$/;
			if (!reg.test(value)) {
				this.handle( 'weibo_nick_name' );
				return false;
			}
			return true;
		},
		handle: function( item ){
			var text ={
				user_name: '亲，请输入正确姓名',
				phone: '亲，请输入正确的手机号',
				weibo_nick_name: '亲，请输入正确昵称'
			}
			setTimeout( function(){ alert( text[ item ] )}, 0 );
			//$( '[data-validate=' + item + ']' ).show();
		}
	};

	var platform = page_data.default_data.modules[0].data.platform;
    function init(opts) {
    	if( platform === 'weixin' ){
			$.getScript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js',function(response,status){
				wx.config(page_data.default_data.modules[0].data.jssdk);
			});
			seajs.use('http://res.wx.qq.com/open/js/jweixin-1.0.0.js',function(weixinSDK){
				wx = weixinSDK;
				var info = {
					debug: false,
					jsApiList: ["chooseImage", "uploadImage"]
				};
				for(var key in page_data.default_data.modules[0].data.jssdk){
					if(key != "url"){
						info[key] = page_data.default_data.modules[0].data.jssdk[key];
					}
				}
				try{
					// alert("提交给微信的信息：" + JSON.stringify(info));
					wx.ready(function(){
						//定位status
					});
					wx.error(function(res){
						// wx.chooseImage = function(){};
						// wx.uploadImage = function(){};
					});
					wx.config(info);
				}catch(e){
					// alert(e);
				}
			});
    	}else if( platform === 'weibo' ){
			$.getScript('http://tjs.sjs.sinajs.cn/open/thirdpart/js/jsapi/mobile.js',function(response,status){
				//wx.config(page_data.default_data.modules[0].data.jssdk);
			});
    	}
		$( '#st_modules_signup_submit' ).on('touchend', '#submit', function(){
			var validateItem = $( '[data-validate]' ),
				validateStatus = true,
				ajaxData = {};
			for( var i=0; i<validateItem.length; i++ ){
				var value = validateItem.eq( i ).val(),
					type = validateItem.eq( i ).data( 'validate' );
				ajaxData[ type ] = value;
				if( validate[ type ] && !validate[ type ]( value ) ){
					validateStatus = false;
//					break;
					return;
				}
			}
			if( !validateStatus ){
				return;
			}
			$.ajax({
				type: "post",
				url: page_data.default_data.modules[0].data.submit_url,
				dataType:"json",
				data:ajaxData,
				success:function(msg){
					if( msg.code != 0 ){
						if( msg.code == 502 ){
							window.location.href = msg.url;
							return;
						}
						alert( msg.message );
						return;
					}
					window.location.href = page_data.default_data.modules[0].data.next_url;
				},
				error:function(){
					alert('网络错误，请刷新页面或稍后重试')
				}
			});
		});
    }
    function destroy(opts) {
		$( '#st_modules_signup_submit' ).off();
		validate = null;
		//$( '#jwweixin' ).remove();
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});