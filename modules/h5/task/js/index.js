define(function(require, exports, module) {
    var jssdk = require("common/share/jssdk");
    var lazyload = require("kit/util/asyncModule");
    var dialogTips;
    var platform;
    var wx = null;
    var serverIds = [];
    var WeiboJS;    // 保存 WeiboJSSDK 的句柄
    var submit_url;
    var tabbar;

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

    var runImage = {
        uploadIndex : 0,
        WXchooseImage: function(){
            wx.chooseImage({
                count: 9, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var chooseLength = res.localIds.length;
                    var listLength = $( '#imageList img' ).length;
                    var $box = $( '<div />' );
                    var num = (9-listLength) >= chooseLength ? chooseLength : 9-listLength;
                    if( listLength + num >= 9 ){
                        $( '#chooseImageBox' ).hide();
                    }
                    if( num === 0 ){
                        return;
                    }
                    for( var i=0; i<num; i++ ){
                        var localIds = res.localIds[i],
                            li = $( '<li><i class="img-container"><span class="cnt"><span class="mui-icon mui-icon-trash imgRemove"></span></span></i></li>' ),
                            img = $( '<img />' ).attr( 'src', localIds );
                        li.find( '.cnt' ).append( img );
                        $box.append( li );
                    }
                    $( '#chooseImageBox' ).before( $box.html() );
                }
            });
        },
        WXuploadImage: function(){

            if( $( '#imageList img' ).length ){
                var size = $( '#imageList img' ).length;

                var localId = $( '#imageList img' ).eq( runImage.uploadIndex++ ).attr('src');
                // 递归上传图片
                wx.uploadImage({
                    localId: localId, // 需要上传的图片的本地ID，由WXchooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID
                        serverIds.push(serverId);
                        if(runImage.uploadIndex < size){
                            runImage.WXuploadImage();
                            return;
                        };
                        runImage.uploadIndex = 0;
                        var data = {
                            image_data: serverIds,
                            share_word: $( '#contentWords' ).val(),
                            question: $( '#question' ).val()
                        };
                        runImage.WXsubmit( data );
                    }
                });
            }else{
                var data = {
                    image_data: [],
                    share_word: $( '#contentWords' ).val(),
                    question: $( '#question' ).val()
                };
                runImage.WXsubmit( data );

            }
        },
        WXsubmit: function(data){
            $.ajax({
                type: 'post',
                url: submit_url,
                data: data,
                dataType: 'json',
                success: function(msg) {
                    if( msg.code != 0 ){
                        Alert( msg.message );
                        $( '#submit' ).removeClass( 'ing' ).text( '问问朋友的意见' );
                        return;
                    }
                    $( '#submit' ).text( '提交成功' );
                    //window.location.href = opts.next_url;
                    serverIds = [];
                    runImage.WXshare( msg.data );
                },
                error: function(){
                    serverIds = [];
                    $( '#submit' ).removeClass( 'ing' ).text( '问问朋友的意见' );
                    Alert('网络错误，请刷新页面或稍后重试');
                }
            });
        },
        WXshare: function( data ){
            var title = this.title();

            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: window.location.origin + data.share_url, // 分享链接
                imgUrl: 'http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    //window.location.href = data.next_url;
                    SCRM.pjax( window.location.origin + data.next_url, '课后作业-测试验收' );
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    //window.location.href = data.next_url;
                    SCRM.pjax( data.next_url, '课后作业-测试验收' );
                }
            });

            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: title, // 分享描述
                link: window.location.origin + data.share_url, // 分享链接
                imgUrl: 'http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    //window.location.href = data.next_url;
                    SCRM.pjax( data.next_url, '课后作业-测试验收' );
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    $( '.mui-popup-backdrop' ).remove();
                    //window.location.href = data.next_url;
                    SCRM.pjax( data.next_url, '课后作业-测试验收' );
                }
            });
            dialogTips.show();
        },
        WXpreviewImage: function( param ){
            wx.previewImage( param );
            // {
            //     current: '', // 当前显示图片的http链接
            //     urls: [] // 需要预览的图片http链接列表
            // }
        },
        WBchooseImage: function( that ){
            if(WeiboJS == null){
                Alert('weibo jssdk not ready, please wait');
            }
            WeiboJS.pickImage({
                source: "choose" || "camera",
                count: 1,
                // filter: false,
                // crop: false,
                // return_ids: false,
                success: function(ret) {
                    var length = $( '#imageList img' ).length;
                    if( length >=9 ){
                        return;
                    }else if( length >=8 ){
                        $( '#chooseImageBox' ).hide();
                    }
                    var li = $( '<li><i class="img-container"><span class="cnt"><span class="mui-icon mui-icon-trash imgRemove"></span></span></i></li>' ),
                        //img = $( '<img />' ).attr( 'src', ret.resource_ids[0]);//'data:image/jpeg;base64,' + ret.base64 );
                        img = $( '<img />' ).attr( 'src', 'data:image/jpeg;base64,' + ret.base64 );
                    li.find( '.cnt' ).append( img );
                    $( '#chooseImageBox' ).before( li );
                },
                fail: function(msg, code) {
                    // 取消或者失败的处理
                }
            });
        },
        WBuploadImage: function(){
            var base64s = [],
                img = $( '#imageList img' );
            for( var i=0; i<img.length; i++ ){
                var base64 = ( img.eq( i ).attr('src') );//substr.( 23 );
                base64s.push( base64 );
            }
            $.ajax({
                type: 'post',
                url: submit_url,
                data: {
                    image_data: base64s,
                    share_word: $( '#contentWords' ).val(),
                    question: $( '#question' ).val()
                },
                dataType: 'json',
                success: function(msg) {
                    if( msg.code != 0 ){
                        Alert( msg.message );
                        return;
                    }
                    $( '#submit' ).removeClass( 'ing' ).text( '问问朋友的意见' );
                    runImage.WBshare( msg.data );
                    //window.location.href = opts.next_url;
                },
                error: function(){
                    $( '#submit' ).removeClass( 'ing' ).text( '问问朋友的意见' );
                    Alert('网络错误，请刷新页面或稍后重试');
                }
            });

        },
        WBshare: function( data ){
            var title = this.title();
            // Alert(title + '：' + window.location.origin + data.share_url)
            var items = {
                shareToWeibo: {
                    title: "分享到微博",
                    //scheme: "sinaweibo://sendweibo?content=" + title + '：' + window.location.origin + data.share_url,
                    scheme: "sinaweibo://compose?content=" + title + '：' + window.location.origin + data.share_url,
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
            dialogTips.show();
            setTimeout(function(){
                    window.location.href = data.next_url;
            }, 5000 );
        },
        WBopenImage: function( param ){
            //WeiboJS.openImage( param );
            // {
            //     url:"",
            //     urls:[]
            // }
        },
        title: function(){
            var title = [
				'我在参加网红培养计划，课后作业必须你来点评！别隐藏潜质，你也被发现了！',
				'我在参加百万网红培养计划，作业你来点评！美美的星梦，你也必须有！',
				'梦想的道路需要指引！我在参加百万网红培养计划快来点评，带你一起燃梦！',
				'我们缺一个有梦想敢拼的妹纸！百万网红计划—我在参加，你快来点评，一起燃梦！',
				'只想走捷径，那就不配红！互联网大咖助力百万网红培养计划，我在参加快来评！'
            ];
            return title[ Math.floor( Math.random() * title.length ) ];
        }
    };

    var Event = {
    }

    function init(opts) {
        platform = opts.platform;
        submit_url = opts.submit_url
        // 初始化 JSSDK
        jssdk.init(platform, opts.jssdk, function(){
            if(platform == 'weibo'){
                WeiboJS = jssdk.getJssdkObject();
                //share.WBshare();
                return;
            }
            if(platform == 'weixin'){
                wx = jssdk.getJssdkObject();
                //share.WXshare();
                return;
            }
        });

        // 延迟加载 tabbar
        lazyload.load("common/tabbar/js/index", function(ret){
            ret.setActiveTab(1);
            tabbar = ret;
        });

        // 延迟加载微信分享的 tips
        lazyload.load("common/share/tips/js/index", function(dialog){
            dialogTips = new dialog({
                title: '好了，现在招呼你的朋友帮你提提意见!'
            });
        });

        $('#st_modules_h5_task').on('touchend', '#chooseImage', function(){
            var length = $( '#imageList .img-container' ).length;
            if( length < 9 ){
                if( platform === 'weixin' ){
                    runImage.WXchooseImage();
                }else if( platform === 'weibo' ){
                    runImage.WBchooseImage();
                }
            }
        }).on('touchend', '#submit', function(){
            if( $(this).hasClass( 'ing' ) ){
                return;
            }else if( !$.trim($( '#contentWords' ).val()) && !$('#imageList .img-container').length ){
                Alert('内容不能为空！');
                return;
            }else if( !$.trim( $( '#question' ).val() ) ){
                Alert( '问题不能为空！' );
                return;
            }
            $( this ).addClass( 'ing' ).text( '处理中，请稍后……' );
            if( platform === 'weixin' ){
                runImage.WXuploadImage();
            }else if( platform === 'weibo' ){
                runImage.WBuploadImage();
            }
        }).on('touchend', '.imgRemove', function(){
            var index = $( '.imgRemove' ).index( this );
            $( '#imageList li' ).eq( index ).remove();
            $( '#chooseImageBox' ).show();
        }).on('touchend', '#imageList img', function(){
            var thisSrc = $( this ).attr( 'src' ),
                url = thisSrc,
                $img = $('#imageList img'),
                images = [];
            for( var i=0; i<$img.length; i++ ){
                images.push( $img.eq(i).attr('src') );
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
        });
    }
    function destroy(opts) {
        $('#st_modules_h5_task').off();
        $( '.alert_close' ).off();
        $( '.alert_dom' ).remove();
        Alert = null;
        runImage = null;
        platform = null;
        serverIds = null;
        dialogTips.destroy();
        if(tabbar){
            tabbar.destroy();
        }
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});