define(function(require, exports, module) {
	var jssdk = require("common/share/jssdk");
	var lazyload = require("kit/util/asyncModule");
	var header = require('common/slogon/js/index');
	var platform;
	var share_url;
    var submit_url;
	var signedRequest = null;
	var WeiboJS, wx, appid;
	var tabbar;
    var share = {
        WXshare: function(){
            var title = this.title();
            var title_2 = this.title_2();
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: share_url, // 分享链接
                imgUrl: 'http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: title_2, // 分享标题
                desc: '昵称不仅仅是一个符号，也会有更深刻的寓意，看看你的昵称会有网红范儿吗……', // 分享描述
                link: share_url, // 分享链接
                imgUrl: 'http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

        },
        WBshare: function(){
            var title = this.title();
            var title_2 = this.title_2();
            var items = {
                shareToWeibo: {
                    title: "分享到微博",
                    //scheme: "sinaweibo://sendweibo?content=" + title + '：' + opts.share_url,
                    scheme: "sinaweibo://compose?content=" + title + '：' + share_url,
                    code: 1001
                },
                follow: {
                    title: "关注",
                    code: 10002
                }
            };
            var itemArray = [];
            for( var key in items ){
                itemArray.push( items[key] );
            };
            // 设置分享的文案
            WeiboJS.setSharingContent({
                external:{
                    title: title_2,
                    icon: "http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg",
                    desc: title
                }
            });
            // 选择菜单的时候，触发相应的菜单行为
            WeiboJS.on("menuItemSelected", {
                trigger: function(res) {
                    if (res.selected_code != "1001" && Number(res.selected_code) < 3000) {
                        WeiboJS.invokeMenuItem({ code: res.selected_code });
                    }
                }
            });
            // 设置右上角菜单
            WeiboJS.setMenuItems({
                items: itemArray,
                success: function(ret) {},
                fail: function(msg, code) {}
            });
        },
        title: function(){
            var title = [
                '天啦噜，我竟然这么有网红范儿，想想都很开心呢！',
                '我竟然有当网红的潜力……',
                '我的网红范儿这么足，真是意想不到！',
                '看看你会有网红范儿吗？我的网红范儿竟然是……',
                '测测你的昵称会有网红范儿吗？'
            ];
            return title[ Math.floor( Math.random() * title.length ) ];
        },
        title_2: function(){
            var title = [
                '你的昵称会有当网红的潜力吗？',
                '想当网红？先来看看你有一个好昵称吗',
                '不要小看你的昵称呦……',
                '你的昵称竟然蕴含这么大的秘密……',
                '测测你的昵称会有网红范儿吗？'
            ];
            return title[ Math.floor( Math.random() * title.length ) ];

        }
    }

	//美化alert start
	var Alert = function(str, callback) {
		var dom = '<div class="alert_dom mui-popup mui-popup-in" style="display: block;">\
            <div class="mui-popup-inner">\
                <p class="alert_content"></p>\
            </div>\
            <div class="mui-popup-buttons"><span class="alert_close mui-popup-button mui-popup-button-bold">确定</span></div></div>\
            <div class="alert_dom mui-popup-backdrop mui-active" style="display: block;"></div>';
		var $dom = $(dom);
		$dom.find('.alert_content').html(str);
		$('body').append($dom);
		$('.alert_close').on('touchend', function() {
			$(this).off();
			$('.alert_dom').remove();
            callback && callback();
			return false;
		});
	}
	//美化alert end

    var validate = {
        name: function(value){
            var reg = /^[0-9a-zA-Z\u4e00-\u9fa5-·_]{2,10}$/;
            if ( !reg.test(value) ) {
                this.handle( 'name' );
                return false;
            }
            return true;
        },
        telephone: function(value){
            var reg = /^1[3|4|5|7|8]\d{9}$/;
            if (!reg.test(value)) {
                this.handle( 'telephone' );
                return false;
            }
            return true;
        },
        profession: function(value){
            var reg = /^[0-9a-zA-Z\u4e00-\u9fa5-·_]{2,10}$/;
            if ( !reg.test(value) ) {
                this.handle( 'profession' );
                return false;
            }
            return true;
        },
        handle: function( item ){
            var text ={
                name: '亲，请输入正确姓名',
                telephone: '亲，请输入正确的手机号',
                profession: '亲，请输入正确职业名称'
            }
            Alert( text[ item ] );
        }
    };

	function init(opts) {
		platform = opts.platform;
		appid = opts.jssdk.appid;
		share_url = opts.share_url || '#';
        submit_url = opts.enlistsInfo.name ? opts.update_url : opts.submit_url;
		testNum = opts.num || 0;
		// 初始化 JSSDK
		jssdk.init(platform, opts.jssdk, function() {
			if (platform == 'weibo') {
				WeiboJS = jssdk.getJssdkObject();
				//share.WBshare();
				return;
			}
			if (platform == 'weixin') {
				wx = jssdk.getJssdkObject();
				//share.WXshare();
				return;
			}
		});
		// 延迟加载 tabbar
		lazyload.load("common/tabbar/js/index", function(ret) {
            ret.setData(opts.tabbar);
            ret.setActiveTab(2);
            tabbar = ret;
		});
		header.init();

		$('#st_modules_quickened_vipSignup').on('touchend', '#submit', function() {
            mui.toast("提交中...请稍后")
            var validateItem = $( '[data-validate]' ),
                validateStatus = true,
                ajaxData = {
                    id: opts.info.id,
                    uid: opts.user.uid
                };
            for( var i=0; i<validateItem.length; i++ ){
                var value = validateItem.eq( i ).val(),
                    type = validateItem.eq( i ).data( 'validate' );
                ajaxData[ type ] = value;
                if( validate[ type ] && !validate[ type ]( value ) ){
                    validateStatus = false;
                    //break;
                    return;
                }
            }
            if( !validateStatus ){
                return;
            }
            $.ajax({
                type: "post",
                url: submit_url,
                dataType:"json",
                data:ajaxData,
                success:function(msg){
                    if( msg.code != 0 ){
                        Alert( msg.message );
                        return;
                    }
                    Alert("报名成功", function(){
                        setTimeout(function(){
                            SCRM.pjax( opts.next_url );
                            // window.location.href = opts.next_url;
                        },2000);
                    });
                },
                error:function(){
                    Alert('网络错误，请刷新页面或稍后重试');
                }
            });
		})
	}

	function destroy(opts) {
		$('#st_modules_quickened_vipSignup').off();
		$('.alert_dom').remove();
		if (tabbar) {
			tabbar.destroy();
		}
		header.destroy();
	}
	var that = {
		init: init,
		destroy: destroy
	};
	return that;
});