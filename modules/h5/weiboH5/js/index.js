define(function(require, exports, module) {
	var jssdk = require("common/share/jssdk");
    var lazyload = require("kit/util/asyncModule");
    var header = require('common/slogon/js/index');
	var platform;
	var share_url = window.location.href;
	var signedRequest = null;
	var WeiboJS, wx, appid;
	var tabbar;
	var runImage = {
		WXshare: function(){
			var title = this.title();

			wx.onMenuShareTimeline({
				title: title, // 分享标题
				link: share_url, // 分享链接
				imgUrl: 'http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg', // 分享图标
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
				title: "每个人都能当网红 关键是找到好方法", // 分享标题
				desc: title, // 分享描述
				link: share_url, // 分享链接
				imgUrl: 'http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg', // 分享图标
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
					title: "课后作业-测试验收",
					icon: "http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg",
					desc: runImage.title()
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
				'我在参加网红培养计划，课后作业必须你来点评！别隐藏潜质，你也被发现了！',
				'我在参加百万网红培养计划，作业你来点评！美美的星梦，你也必须有！',
				'网红收入甩小明星几条街！我在参加百万网红培养计划快来点评，带你一起燃梦',
				'我们缺一个有梦想敢拼的妹纸！百万网红计划—我在参加，你快来点评，一起燃梦！',
				'只想走捷径，那就不配红！互联网大咖助力百万网红培养计划，我在参加快来评！'
			];
			return title[ Math.floor( Math.random() * title.length ) ];
		},
		// 创建一个 iframe 来获取微博的 signed_request 信息，这是个临时方案
		createAgentIframe: function() {
			var appkey = appid;
			var iframeId = "__lightapp_agent_iframe";
			var iframe = document.createElement("iframe");
			var _loadLock = false;
			var _loadHandler = function(type) {
				if (_loadLock) {
					return;
				}
				_loadLock = true;
				runImage.iframeWin = document.getElementById(iframeId).contentWindow;
			};
			iframe.addEventListener("load", function() {
				_loadHandler("event");
				runImage.getSignedRequest();
			});
			iframe.src = "http://apps.weibo.com/liteblank.php?appkey=" + appkey;
			iframe.id = iframeId;
			iframe.style.display = "none";
			setTimeout(function() {
				_loadHandler("timeout");
			}, 300);
			document.body.appendChild(iframe);
			window.addEventListener("message", runImage.receiveMessage, false);
		},
		// 发出 postMessage 给 iframe
		getSignedRequest: function(){
			try{
			var uuid = new Date().getTime() + ("000000" + Math.floor(Math.random() * 99999)).replace(/\d+(\d{6})$/, "$1");
			var key = "getSignedRequest#@#" + uuid;
			runImage.iframeWin.postMessage(key + ":::{}", "*");
			} catch(e) {
				// alert(e);
			}
		},
		// 解析收到的 signed_request 参数，并存下来
		receiveMessage: function(evt) {
			if (/^getSignedRequest/i.test(evt.data)) {
				var data = evt.data.split(":::");
				if(data.length == 2){
					data = data[1];
				}
				try{
					data = JSON.parse(data);
					signedRequest = data.signed_request;
				}catch(e){
					signedRequest = null;
				}
			}
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


    var blockList = '<li>\
                <div class="block" style="height:${data.heightList[0]}%">\
                    <p>很符合<br>${data.result[0]}</p>\
                </div>\
            </li>\
            <li>\
                <div class="block" style="height:${data.heightList[1]}%">\
                    <p>符合<br>${data.result[1]}</p>\
                </div>\
            </li>\
            <li>\
                <div class="block" style="height:${data.heightList[2]}%">\
                    <p>一般<br>${data.result[2]}</p>\
                </div>\
            </li>\
            <li>\
                <div class="block" style="height:${data.heightList[3]}%">\
                    <p>不符合<br>${data.result[3]}</p>\
                </div>\
            </li>\
            <li>\
                <div class="block" style="height:${data.heightList[4]}%">\
                    <p>很不符合<br>${data.result[4]}</p>\
                </div>\
            </li>';



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

		if( platform === 'weibo' ){
			runImage.createAgentIframe();
		}

		if( opts.onself ){
	        var data = opts.homework,
	            total = opts.homework.total;//eval(data.result.join('+'));
	            data.heightList = [];
	        for( var i=0; i<data.result.length; i++ ){
	            //$( '#chartList .block' ).eq( i ).height( data.result[i]/total * 100 + '%' );
	            data.heightList.push( +data.result[i]/total * 100 );
	        };
	        var blockListHtml = SCRM.easyTemplate( blockList, data ).toString();
	        $( '#chartList' ).html( blockListHtml );
		};

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
            // ret.setActiveTab(0);
            // tabbar = ret;
        });

        header.init();
        //$( '#st_modules_h5_taskResult' )


        $( '#st_modules_h5_weiboH5' ).on('touchend', '#help_submit', function(){
            var val = $('[name="question"]:checked').val(),
                submit_url = opts.submit_url;
            if( !val ){
                Alert( '选项不能为空！' );
                return;
            };

            var data = { vote: val };
            if(platform == 'weibo'){
                data.shouquanid = signedRequest || "";
            }

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
                    window.location.href = msg.data.next_url;
                   // SCRM.pjax( msg.data.next_url );
                },
                error: function(){
                    Alert( '网络错误，请刷新页面或稍后重试' );
                }
            });
        }).on('click', '#imgList img', function(){
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
        dialogTips.destroy();
		platform = null;
		share_url = null;
		signedRequest = null;
		WeiboJS = null;
		wx = null;
		Alert = null;
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