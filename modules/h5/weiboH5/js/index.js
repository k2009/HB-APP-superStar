define(function(require, exports, module) {
	var jssdk = require("common/share/jssdk");
    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
	var platform;
	var share_url = window.pageURL;
	var signedRequest = null;
	var WeiboJS, wx, appid;
	var tabbar;
    var dialogTips;
	var runImage = {
		WXshare: function(){
			var title = this.title();
            var title_2 = this.title_2();

			wx.onMenuShareTimeline({
				title: title, // 分享标题
				link: share_url, // 分享链接
				imgUrl: 'http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg', // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
					$( '.mui-popup-backdrop' ).remove();
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
					$( '.mui-popup-backdrop' ).remove();
				}
			});
			wx.onMenuShareAppMessage({
				title: title_2, // 分享标题
				desc: title, // 分享描述
				link: share_url, // 分享链接
				imgUrl: 'http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg', // 分享图标
				type: '', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function () {
					// 用户确认分享后执行的回调函数
					$( '.mui-popup-backdrop' ).remove();
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
					$( '.mui-popup-backdrop' ).remove();
				}
			});
		},
        WXpreviewImage: function( param ){
            wx.previewImage( param );
            // {
            //     current: '', // 当前显示图片的http链接
            //     urls: [] // 需要预览的图片http链接列表
            // }
        },
		WBshare: function(){
			var title = this.title();
            var title_2 = this.title_2();
			var items = {
				shareToWeibo: {
					title: "分享到微博",
					scheme: "sinaweibo://compose?content=" + title + '：' + share_url,
					code: 1001
				}
			};
			var itemArray = [];
			for( var key in items ){
				itemArray.push( items[key] );
			}
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
                '拿出你追求完美的精神来帮我点评网红培养课后作业！别隐藏潜质，你是最棒的！',
                '作为我的网红梦想导师，课后作业怎能缺少你的点评！快来，点评小能手！',
                '年轻怎能没有梦想！我在参加百万网红培养计划，作业点评，非你莫属！',
                '互联网大咖助力百万网红培养计划，我在参加快来点评！你就是下一个最牛网红星探！',
                '才华横溢但又默默无闻的你，网红培养课后作业点评，非你莫属！'
            ];
            return title[ Math.floor( Math.random() * title.length ) ];
        },
        title_2: function(){
            var title = [
                '追求完美的你怎会错过这场点评！',
                '神助般的建议，我特别需要你！',
                '点燃梦想的圣火，非你莫属！',
                '你的网红星探潜质被我发现啦，快来！',
                '不想抛头露面，也可以做网红幕后操盘手！'
            ];
            return title[ Math.floor( Math.random() * title.length ) ];
        }
	};

    //美化alert start
    var Alert = function( str ){
        var dom = '<div class="alert_dom mui-popup mui-popup-in" style="display: block;">\
                <div class="mui-popup-inner">\
                    <p class="alert_content"></p>\
                </div>\
                <div class="mui-popup-buttons"><span class="alert_close mui-popup-button mui-popup-button-bold">确定</span></div></div>\
                <div class="alert_dom mui-popup-backdrop mui-active" style="display: block;"></div>';
        var $dom = $( dom );
        $dom.find( '.alert_content' ).html( str );
        $( 'body' ).append( $dom );
        $( '.alert_close' ).on('touchend', function(){
            $( this ).off();
            $( '.alert_dom' ).remove();
            return false;
        });
    }
    //美化alert end

    //时间转化start
    var dateFormat = function( num, format ) {
        var format = format ? format : 'YYYY-MM-DD hh:mm:ss';
        var t = new Date(num * 1000);
        var tf = function(i) {
            return (i < 10 ? '0' : '') + i
        };
        return format.replace(/YYYY|yy|MM|DD|hh|mm|ss/g, function(a) {
            switch (a) {
                case 'yy':
                    return t.getFullYear().toString().substring(2);
                    break;
                case 'YYYY':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'DD':
                    return tf(t.getDate());
                    break;
                case 'hh':
                    return tf(t.getHours());
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        })
    };
    //时间转化end
	function init(opts) {
		platform = opts.platform;
		appid = opts.jssdk.appid;
		// 初始化 JSSDK
		jssdk.init(platform, opts.jssdk, function(){
			if(platform == 'weibo'){
				WeiboJS = jssdk.getJssdkObject();
				runImage.WBshare();
				return;
			}
			if(platform == 'weixin'){
				wx = jssdk.getJssdkObject();
				runImage.WXshare();
				return;
			}
		});
		
        var time = dateFormat( opts.time, 'yy-MM-DD hh:mm');
        $( '#time' ).html( time );
        //Alert( JSON.stringify( opts ) );

        // 延迟加载微信分享的 tips
        lazyload.load("common/share/tips/js/index", function(dialog){
            dialogTips = new dialog({
                title: '好了，现在招呼你的朋友帮你提提意见!'
            });
        });

        // 延迟加载 tabbar
        lazyload.load("common/tabbar/js/index", function(ret){
            ret.setData(opts.tabbar);
            ret.setActiveTab(1);
            tabbar = ret;
            // if( opts.next_url ){
            // 	$( '.tabbar a' ).attr({
            // 		'href': opts.next_url,
            // 		'pjax': ""
            // 	})
            // }
        });

        header.init();
        //$( '#st_modules_h5_taskResult' )


        $( '#st_modules_h5_weiboH5' ).on('touchend', '#help_submit', function(){
            var val = $('[name="question"]:checked').val(),
                submit_url = opts.submit_url;
            if( !val ){
                Alert( '选项不能为空！' );
                return;
            }

            var data = { vote: val };
            // if(platform == 'weibo'){
            //     data.shouquanid = signedRequest || "";
            // }

            $.ajax({
                type: 'get',
                url: submit_url,
                data: data,
                dataType: 'json',
                success: function(msg) {
                    if( msg.code != 0 ){
                        Alert( msg.message );
                        return;
                    }
                    window.pageURL = msg.data.next_url;
                   // SCRM.pjax( msg.data.next_url );
                },
                error: function(){
                    Alert( '网络错误，请刷新页面或稍后重试' );
                }
            });
        }).on('touchend', '[choose]', function(){
            var submit_url = opts.submit_url,
                $this = $(this),
                choose = $this.attr('choose'),
                num = +$this.html()+1,
                data = { vote: choose };
            // if(platform == 'weibo'){
            //     data.shouquanid = signedRequest || "";
            // }
            $.ajax({
                type: 'get',
                url: submit_url,
                data: data,
                dataType: 'json',
                success: function(msg) {
                    if( msg.code != 0 ){
                        Alert( msg.message );
                        return;
                    }
                    $this.addClass( 'done' ).html( num );
                    $('[choose]').removeAttr('choose');
                    window.pageURL = msg.data.next_url;
                    //SCRM.pjax( msg.data.next_url );
                },
                error: function(){
                    Alert( '网络错误，请刷新页面或稍后重试' );
                }
            });
        }).on('tap', '#imgList img', function(){
            var thisSrc = $( this ).data( 'bigimg' ),
                url = thisSrc,
                $img = $('#imgList img'),
                images = [];
            for( var i=0; i<$img.length; i++ ){
                images.push( $img.eq(i).data( 'bigimg' ) );
            }
            if( platform === 'weixin' ){
                var data = {
                    current: thisSrc,
                    urls: images
                }
                runImage.WXpreviewImage( data );
            }else if( platform === 'weibo' ){
                var data = {
                    url: thisSrc,
                    urls: images
                }
                runImage.WBopenImage( data );
            }
        }).on('touchend', '#run_share', function(){
            dialogTips.show();
        });
    }
    function destroy(opts) {
        $( '#st_modules_h5_weiboH5' ).off();
        $( '.alert_dom' ).remove();
        $( '.alert_close' ).off();
        $( '.lightBox' ).off().remove();
        if(dialogTips){
            dialogTips.destroy();
        }
		if(tabbar){
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