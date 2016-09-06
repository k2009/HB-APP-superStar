define(function(require, exports, module) {
    var jssdk = require("common/share/jssdk");
    var platform;
    var share_url;
    var signedRequest = null;
    var WeiboJS, wx, appid;
    var staticDomain;
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
    var runShare = {
        titleIco: function(){
            var title = ['星座测试早已过时了！我正在参加网红潜力值测试，测试结果比见到宋仲基还开心，不信的话，你们也来试试呗~',
                    '我的天啊，你还星座测试呢！我正在参加网红潜力值测试，结果惊到我了，追赶时尚的你，好意思被人说out么~'];
            var ico = [];
            ico.push( 'http://' + staticDomain + '/modules/h5/survey/images/share_ico_1.jpg' );
            ico.push( 'http://' + staticDomain + '/modules/h5/survey/images/share_ico_2.jpg' );
            var random = Math.random();
            return {
                title: title[ Math.floor( random*title.length ) ],
                ico: ico[ Math.floor( random*ico.length ) ]
            }
        },
        WXshare: function(){
            var titleIco = this.titleIco();
            wx.onMenuShareTimeline({
                title: titleIco.title, // 分享标题
                link: share_url, // 分享链接
                imgUrl: titleIco.ico, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: titleIco.title, // 分享标题
                desc: titleIco.ico, // 分享描述
                link: share_url, // 分享链接
                imgUrl: 'http://tva2.sinaimg.cn/crop.0.1.794.794.180/0068YUDSgw1f56ewslbcqj30m80m7wgt.jpg', // 分享图标
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
            var titleIco = this.titleIco();
            var items = {
                shareToWeibo: {
                    title: "分享到微博",
                    scheme: "sinaweibo://compose?content=" + titleIco.title + '：' + share_url,
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
                    title: titleIco.title,
                    icon: titleIco.ico,
                    desc: titleIco.title
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
                runShare.iframeWin = document.getElementById(iframeId).contentWindow;
            };
            iframe.addEventListener("load", function() {
                _loadHandler("event");
                runShare.getSignedRequest();
            });
            iframe.src = "http://apps.weibo.com/liteblank.php?appkey=" + appkey;
            iframe.id = iframeId;
            iframe.style.display = "none";
            setTimeout(function() {
                _loadHandler("timeout");
            }, 300);
            document.body.appendChild(iframe);
            window.addEventListener("message", runShare.receiveMessage, false);
        },
        // 发出 postMessage 给 iframe
        getSignedRequest: function(){
            try{
                var uuid = new Date().getTime() + ("000000" + Math.floor(Math.random() * 99999)).replace(/\d+(\d{6})$/, "$1");
                var key = "getSignedRequest#@#" + uuid;
                runShare.iframeWin.postMessage(key + ":::{}", "*");
            } catch(e) {
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

    var questionsItem = {
        radio: function(data,index, length){
            var html = '<div class="title"><span></span><p>${data.title}</p></div>\
                        <#list data.options as list>\
                            <div class="mui-input-row mui-${data.type} mui-left">\
                                <label>\
                                    <p>${list.text}<input name="question" type="${data.type}" value="${list.id}"></p>\
                                    <#if (list.image)><img src="${list.image}"></#if>\
                                </label>\
                            </div>\
                        </#list>\
                        <a href="JavaScript:;" class="check-status">选好了</a>';
            var questionHtml = SCRM.easyTemplate( html, data ).toString();
            $( '#questionBox' ).html( questionHtml );
            this.callback( data, index, length );
        },
        checkbox: function(data, index, length){
            this.radio( data, index, length );
        },
        callback: function(data, index, length){
            var html = '<p id="scale" style="width:${data.scale}%"><span class="mui-badge mui-badge-purple">${data.now}/${data.length}<em></em></span></p>';
            var scaleData = {
                scale: ((+index+1) / (+length)) * 100,
                now: +index+1,
                length: length
            }
            var scaleHtml = SCRM.easyTemplate( html, scaleData ).toString();
            $( '#bg-line' ).html( scaleHtml );
            $('.check-status').data('index', index).data('questionid', data.id);
        }
    };
    var answerTips = {
        right: function(){
            var words = ['恭喜你，答对了~',
                        '好厉害，被你答对了！',
                        '这么棒，你知道么？',
                        '学霸我给你五个赞！',
                        '大神，请收下我的膝盖！'];
                        var random = Math.random();
            return words[ Math.floor( random*(words.length) ) ];
        },
        wrong: function(){
            var words = ['我知道其实你是很厉害的~',
                        '咦，就差一点点就对了，再接再厉呀~'];
                        var random = Math.random();
            return words[ Math.floor( random*(words.length) ) ];
        }
    };
    var format = function(num){
        return String.fromCharCode(64 + num);
    };
    var Event = {
        next_question: function(opts){
            var question_index = +$('.check-status').data('index') + 1;
            var question_data = opts.questions[ question_index ];

            if( question_index == opts.question_total ){
                SCRM.pjax(opts.next_url,'测试结果');
                return;
            }

            $('#questionBox').show();
            $('#explainBox').hide();

            questionsItem[ question_data.type ]( question_data, question_index, opts.question_total );
        },
        btn_next: function(){
            var checkedStatus = $( '#questionBox input:checked' ).length;
            if( checkedStatus ){
                $( '.check-status' ).addClass( 'check-status-ok' );
            }else{
                $( '.check-status' ).removeClass( 'check-status-ok' );
            }
        },
        submit: function(opts, self){

            var question_index = +self.data('index');
            var question_data = opts.questions[ question_index ];
            var correctStr = '',
                correct = '';
            for( var i=0; i<question_data.options.length; i++ ){
                correctStr += question_data.options[ i ].is_correct ? i.toString() : '';
                correct += question_data.options[ i ].is_correct ? format(i+1) : '';

            };

            var checkedStr = '';
            $( '#questionBox input:checked' ).each(function(){
                checkedStr += $( '#questionBox input' ).index( $(this) ).toString();
            })

            var is_correct = correctStr === checkedStr ? 1 : 0;
            question_data.is_correct = is_correct;
            question_data.result = is_correct ? answerTips.right() : answerTips.wrong();
            question_data.correct = correct;

                    // var html = '<div class="status-face-${data.is_correct}"></div>\
                    //         <h5 class="status-word">${data.result}</h5>\
                    //         <p class="explain">正确答案：${data.correct}</p>\
                    //         <p class="explain">参考解析：${data.explain}</p>\
                    //         <a href="JavaScript:;" class="next_btn" id="next_question">${data.statusWords}</a>';
                    // var explainHtml = SCRM.easyTemplate( html, question_data ).toString();
                    // $( '#explainBox' ).html( explainHtml );
                    // $('#questionBox').hide();
                    // $('#explainBox').show();
            var data = {
                paper_id: opts.paper_id,
                question_id: self.data('questionid'),
                is_correct: is_correct
            }
            $.ajax({
                type: 'post',
                url: opts.submit_url,
                data: data,
                dataType: 'json',
                success: function(msg) {
                    if( msg.code != 0 ){
                        Alert( msg.message );
                        return;
                    }
                    question_data.statusWords = msg.data.is_finished ? '查看测试结果' : '继续做题';

                    var html = '<div class="status-face-${data.is_correct}"></div>\
                            <h5 class="status-word">${data.result}</h5>\
                            <p class="explain">正确答案：${data.correct}</p>\
                            <p class="explain">参考解析：${data.explain}</p>\
                            <a href="JavaScript:;" class="next_btn" id="next_question">${data.statusWords}</a>';
                    var explainHtml = SCRM.easyTemplate( html, question_data ).toString();
                    $( '#explainBox' ).html( explainHtml );
                    $('#questionBox').hide();
                    $('#explainBox').show();

                },
                error: function(){
                    Alert( '网络错误，请刷新页面或稍后重试' );
                }
            });
        }
    }

    function init(opts) {
        staticDomain = opts._extra.domain;
        share_url = opts.share_url;
        platform = opts.platform;
        appid = opts.jssdk.appid;
        // 初始化 JSSDK
        jssdk.init(platform, opts.jssdk, function(){
            if(platform == 'weibo'){
                WeiboJS = jssdk.getJssdkObject();
                runShare.WBshare();
                return;
            }
            if(platform == 'weixin'){
                wx = jssdk.getJssdkObject();
                runShare.WXshare();
                return;
            }
        });
        if( platform === 'weibo' ){
            runShare.createAgentIframe();
        }

        var question_index = opts.question_num || 0;
        var question_data = opts.questions[ question_index ];
        questionsItem[ question_data.type ]( question_data, question_index, opts.question_total );

        $( '#st_modules_h5_survey' ).on('touchend', '.check-status-ok', function(){
            var self = $(this);
            Event.submit(opts, self);
        }).on('touchend', '#next_question', function(){
            Event.next_question( opts );
            return false;
        }).on('change', '#questionBox input', function(){
            Event.btn_next();
        });
    }
    function destroy(opts) {
        $( '#st_modules_h5_survey' ).off();
        $( '.alert_close' ).off();
        $( '.alert_dom' ).remove();
        Alert = null;
        platform = null;
        share_url = null;
        signedRequest = null;
        WeiboJS = null;
        wx = null;
        Event = null;
        questionsItem = null;
        runShare = null;
        answerTips = null;
        format = null;
        staticDomain = null;
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});