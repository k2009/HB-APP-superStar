define(function(require, exports, module) {

	var platform = page_data.default_data.modules[0].data.platform;
	var wx = null;
	var serverIds = [];
	var WeiboJS;	// 保存 WeiboJSSDK 的句柄

	var runImage = {
		uploadIndex : 0,
		WXchooseImage: function(that){
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function (res) {
					var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					var img = $( '<img />' ).attr( 'src', localIds ).addClass( 'waitUp' );
					that.html( img ).append( '<span class="imgRemove close-icon"></span>' ).css('background','#fff');
					var length = $( '.chooseImage .imgRemove' ).length;
					if( length === 3 ){
						$( '#nextStep' ).removeClass( 'none' );
					}
				}
			});
		},
		WXuploadImage: function(){
			var localId = $( '.waitUp' ).eq( runImage.uploadIndex++ ).attr('src');
			// 递归上传图片
			wx.uploadImage({
				localId: localId, // 需要上传的图片的本地ID，由WXchooseImage接口获得
				isShowProgressTips: 0, // 默认为1，显示进度提示
				success: function (res) {
					var serverId = res.serverId; // 返回图片的服务器端ID
					serverIds.push(serverId);
					if(serverIds.length < 3){
						runImage.WXuploadImage();
						return;
					}
					runImage.uploadIndex = 0;
					var data = {
						// image_type: 'weixin',
						image_data: serverIds
					};
					$.ajax({
						type: 'post',
						url: page_data.default_data.modules[0].data.submit_url,
						data: data,
						dataType: 'json',
						success: function(msg) {
							if( msg.code != 0 ){
								if( msg.code == 502 ){
									window.pageURL = msg.url;
									return;
								}
								alert( msg.message );
								return;
							}
							window.pageURL = page_data.default_data.modules[0].data.next_url;
						},
						error: function(){
							$( '#nextStep' ).removeClass( 'none' ).text( '下一步' );
							alert('网络错误，请刷新页面或稍后重试');
						}
					});
				}
			});
		},
		WBchooseImage: function( that ){
			if(WeiboJS == null){
				alert('weibo jssdk not ready, please wait');
			}
			WeiboJS.pickImage({
				source: "choose" || "camera",
				count: 1,
				// filter: false,
				// crop: false,
				// return_ids: false,
				success: function(ret) {
					var img = $( '<img />' ).attr( 'src', 'data:image/jpeg;base64,' + ret.base64 ).addClass( 'waitUp' );
					that.html( img ).append( '<span class="imgRemove close-icon"></span>' );
					var length = $( '.chooseImage .imgRemove' ).length;
					if( length === 3 ){
						$( '#nextStep' ).removeClass( 'none' );
					}
				},
				fail: function(msg, code) {
					// 取消或者失败的处理
				}
			});
		},
		WBuploadImage: function(){
			var base64s = [];
			for( var i=0; i<3; i++ ){
				var base64 = ($( '.waitUp' ).eq( i ).attr('src'));//substr.( 23 );
				base64s.push( base64 );
			}
			$.ajax({
				type: 'post',
				url: page_data.default_data.modules[0].data.submit_url,
				data: {image_data: base64s},
				dataType: 'json',
				success: function(msg) {
					if( msg.code != 0 ){
						if( msg.code == 502 ){
							window.pageURL = msg.url;
							return;
						}
						alert( msg.message );
						return;
					}
					$( '#nextStep' ).removeClass( 'none' ).text( '下一步' );
					window.pageURL = page_data.default_data.modules[0].data.next_url;
				},
				error: function(){
					$( '#nextStep' ).removeClass( 'none' ).text( '下一步' );
					alert('网络错误，请刷新页面或稍后重试');
				}
			});

		}
	};
	var platform = page_data.default_data.modules[0].data.platform;
	function init(opts) {
		if( platform === 'weixin' ){
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
					wx.ready(function(){
						//定位status
					});
					wx.error(function(res){
						// wx.chooseImage = function(){};
						// wx.uploadImage = function(){};
					});
					wx.config(info);
			});
		} else if( platform === 'weibo' ){
			seajs.use('http://js.t.sinajs.cn/open/thirdpart/static/jsbridge-sdk/public/weibo_mobile_sdk_min.js?version=20160615',function(ret){
				var data = page_data.default_data.modules[0].data.jssdk;
				var info = {
					'appkey' : data.appid,
					'debug': false,
					'timestamp': data.timestamp,
					'noncestr': data.noncestr,
					'signature': data.signature,
					'scope': [
						'pickImage'
					]
				};
				ret.ready(function(api) {
					api.checkAvailability({
						api_list: info.scope,
						success: function(ret) {
							WeiboJS = api;
						},
						fail: function(msg, code) {}
					});
				});
				ret.error(function(message) {
					// alert("微博 JSBridge 错误：" + message);
				});
				ret.config(info);
			});
		}

		$('#st_modules_signup_uploadPhoto').on('touchend', '.chooseImage', function(){
			var length = $( this ).find( 'img' ).length;
			if( !length ){
				if( platform === 'weixin' ){
					// alert('weixin');
					runImage.WXchooseImage( $(this) );
				}else if( platform === 'weibo' ){
					runImage.WBchooseImage( $(this) );
				}
			}
		}).on('touchend', '#nextStep', function(e){
			if( $(this).hasClass( 'none' ) ){
				return;
			}
			$( this ).addClass( 'none' ).text( '正在上传，请稍后……' );
			if( platform === 'weixin' ){
				// alert('weixin');
				runImage.WXuploadImage();
			}else if( platform === 'weibo' ){
				runImage.WBuploadImage();
			}
		}).on('touchend', '.imgRemove', function(){
			$( this ).parent().attr( 'style', '' ).html( '' );
			var length = $( '.chooseImage .imgRemove' ).length;
			if( length < 3 ){
				$( '#nextStep' ).addClass( 'none' );
			}
			if (e.stopPropagation){
				e.stopPropagation();
			}else {
				e.cancelBubble = true;
			}
		});
	}
	function destroy(opts) {
		runImage = null;
		$('#st_modules_signup_submit').off();
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});