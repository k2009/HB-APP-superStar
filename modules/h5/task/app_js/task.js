define(function(require, exports, module) {
    var $share = require("kit/util/plus-share");
    var lazyload = require("kit/util/asyncModule");
    var dialogTips;
    var platform;
    var wx = null;
    var serverIds = [];
    var WeiboJS; // 保存 WeiboJSSDK 的句柄
    var submit_url;
    //美化alert start
    var Alert;
    //美化alert end
    var runImage = {
        uploadIndex: 0,
        title: function() {
            var title = [
                '我在参加百万网红培养计划，毫无尿点的作业必须你来点评！别隐藏潜质，你也被发现了！',
                '比扑倒汉子更让你高潮！我在参加百万网红培养计划，作业你来点评！湿湿的星梦，你也必须有！',
                '你能火的原因只有一个！我在参加百万网红培养计划快来点评，带你一起燃梦！',
                '只想裸露身体，那你就不配红！互联网大咖助力百万网红培养计划，我在参加快来点评！',
                '我们缺一个口活好手指巧的妹纸！百万网红计划——我在参加，你快来点评，一起燃梦！'
            ];
            return title[Math.floor(Math.random() * 5)];
        }
    };

    var Event = {}

    function init(opts) {
        Alert = function(str) {
            var dom = '<div class="alert_dom mui-popup mui-popup-in" style="display: block;">\
                <div class="mui-popup-inner">\
                    <p class="alert_content"></p>\
                </div>\
                <div class="mui-popup-buttons"><span class="alert_close mui-popup-button mui-popup-button-bold">确定</span></div></div>\
                <div class="alert_dom mui-popup-backdrop mui-active" style="display: block;"></div>';
            var $dom = $(dom);
            $dom.find('.alert_content').html(str);
            $('body').append($dom);
            $('.alert_close').on('tap', function() {
                $(this).off();
                $('.alert_dom').remove();
                return false;
            });
        }
        platform = opts.platform;
        submit_url = opts.submit_url

        // 延迟加载微信分享的 tips
        lazyload.load("common/share/tips/js/index", function(dialog) {
            dialogTips = new dialog({
                title: '好了，现在招呼你的朋友帮你提提意见!'
            });
        });

        $('#st_modules_h5_task').on('tap', '#chooseImage', function() {
            var length = $('#imageList .img-container').length;
            if (length < 9) {

            }
        }).on('tap', '#submit', function() {

            // if($(this).text()=="问问朋友的意见"){
            // $share();
            // return;
            // }
            if ($(this).hasClass('ing')) {
                return;
            } else if (!$.trim($('#contentWords').val()) && !$('#imageList .img-container').length) {
                Alert('内容不能为空！');
                return;
            } else if (!$.trim($('#question').val())) {
                Alert('问题不能为空！');
                return;
            }
            $(this).addClass('ing').text('处理中，请稍后……');

            var base64s = [],
                img = $('#imageList img');
            console.log('开始处理图片')
            console.log(img.length)
            for (var i = 0; i < img.length; i++) {
                var base64 = (img.eq(i).attr('src')); //substr.( 23 );
                base64s.push(base64);
            }
            console.log(JSON.stringify(base64s));
            $.ajax({
                type: 'post',
                url: submit_url,
                data: {
                    image_data: base64s,
                    share_word: $('#contentWords').val(),
                    question: $('#question').val()
                },
                dataType: 'json',
                success: function(msg) {
                    if (msg.code != 0) {
                        Alert(msg.message);
                        return;
                    }
                    $('#submit').removeClass('ing').text('问问朋友的意见');
                    // runImage.WBshare(msg.data);//这块有问题
                    // window.location.href = msg.data.next_url;

                    $share({
                        msg: {
                            href: plus.storage.getItem("domain") + msg.data.share_url,
                            title: runImage.title(),
                            desc: runImage.title(),
                            content: runImage.title(),
                            imgUrl: 'http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg', // 分享图标
                            thumbs: ['http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg']
                        },
                        success: function(e) {
                            window.APP_construction.urlJump(msg.data.next_url)
                        },
                        error: function(e) {
                            window.APP_construction.urlJump(msg.data.next_url)
                            console.log(JSON.stringify(e))
                        }
                    });
                    //window.location.href = opts.next_url;
                },
                error: function() {
                    $('#submit').removeClass('ing').text('问问朋友的意见');
                    Alert('网络错误，请刷新页面或稍后重试');
                }
            });

        }).on('tap', '.imgRemove', function() {
            var index = $('.imgRemove').index(this);
            $('#imageList li').eq(index).remove();
            $('#chooseImageBox').show();
        }).on('tap', '#imageList img', function() {
            var thisSrc = $(this).attr('src'),
                url = thisSrc,
                $img = $('#imageList img'),
                images = [];
            for (var i = 0; i < $img.length; i++) {
                images.push($img.eq(i).attr('src'));
            }
            if (platform === 'weixin') {
                var data = {
                    current: thisSrc,
                    urls: images
                }
                runImage.WXpreviewImage(data);
            } else if (platform === 'weibo') {
                var data = {
                    url: thisSrc,
                    urls: images
                }
                runImage.WBopenImage(data);
            }
        });
    }

    function destroy(opts) {
        $('#st_modules_h5_task').off();
        $('.alert_close').off();
        $('.alert_dom').remove();
        console.log(dialogTips)
        if (dialogTips) dialogTips.destroy();
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});