define(function(require, exports, module) {
    var jssdk = require("common/share/jssdk");
    var lazyload = require("kit/util/asyncModule");
    var $share = require("kit/util/plus-share/shareUI"); //分享
    var dialogTips;
    var chartTips;
    var platform;
    var share_url;
    var signedRequest = null;
    var WeiboJS, wx, appid;
    var staticDomain;
    var request;

    var runShare = {
        titleIco: function(){
            var title = ['如何在微博里更好地赚钱?测测这个,结果也许会惊讶掉你的下巴！',
                '想做电商网红?不了解这个怎么能行，,测一测,也许瞬间就会找到人生方向！',
                '如何正确的做电商网红？是时候该测测你的微博电商属性了！',
                '想在微博里月入上万？那就来测测你现在的属性吧！',
                '做网红也是一门学问，尤其是电商网红，测测你现在符合电商网红么？'];
            var ico = [];
            ico.push( 'http://' + staticDomain + '/modules/testing/business/images/ico_share.png' );
            var random = Math.random();
            return {
                title: title[ Math.floor( random*title.length ) ],
                ico: ico[ Math.floor( random*title.length ) ]
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

    var Tips = function( str ){
        var dom = '<div id="tips_dom">\
            <div class="mask"></div>\
            <div class="share-tip">\
            <div class="share-block chartTips">\
            <div id="testData"></div>\
            </div><span class="tips_colse mui-icon mui-icon-closeempty"></span>\
            </div>\
            </div>';
        var $dom = $( dom );
        $( 'body' ).append( $dom );
        $( '.tips_colse' ).on('touchend', function(){
            $( this ).off();
            $( '#tips_dom' ).remove();
            return false;
        });
    }

    var scoreTpl = {
        normal: '<div class="bg-line">\
        <span class="status_1" style="left:${data.left}%"><strong>30</strong><em>正常界限</em></span>\
        <span class="status_2" style="left:${data.right}%"><strong>160</strong><em>正常界限</em></span>\
        <p id="scale" class="score-slow" style="width:${data.that_scale}%">\
            <span class="mui-badge mui-badge-purple score-slow"><strong>${data.score}</strong><em></em><img src="${data.profile_image}"></span>\
        </p>\
        </div>',
        low: '<div class="bg-line">\
        <span class="status_1" style="left:${data.left}%"><strong>30</strong><em>正常界限</em></span>\
        <p id="scale" class="score-slow" style="width:${data.that_scale}%">\
            <span class="mui-badge mui-badge-purple score-slow"><strong>${data.score}</strong><em></em><img src="${data.profile_image}"></span>\
        </p>\
        </div>'
    };


    var score = function(opts){
        var data = {};
        var full = opts.max_score > 190 ? opts.max_score : 190;
        data.left = 30 / full * 100;
        data.right = 160 / full * 100;
        data.that_scale = opts.score / full * 100;
        data.profile_image = opts.profile_image;
        data.score = opts.score
        if( data.that_scale >= data.left ){
            var scoreHtml = SCRM.easyTemplate( scoreTpl.normal, data ).toString();
        }else{
            data.left = 30 / 38 * 100;
            data.that_scale = opts.score / 38 * 100;
            var scoreHtml = SCRM.easyTemplate( scoreTpl.low, data ).toString();
        }
        $( '#score-box' ).html( scoreHtml );
    }



    var testDataChart = function(X,Y){
        var option = {
            title: {
                text: '测试记录',
                subtext: '只展示最近7天结果'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: X
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    type:'line',
                    data: Y,
                    markLine: {
                        data: [
                            {
                            name: '正常界限',
                            yAxis: 160
                            },
                            {
                            name: '正常界限',
                            yAxis: 30
                            }
                        ]
                    }
                }
            ]
        };

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('testData'));
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption( option );
    };

    var waitHandle = function(ajaxUrl){
        $( '.mui-popup-backdrop, #orange-box' ).show();
        var startDate = mui.now();
        setTimeout(function(){
            $( '#orange-box' ).find('p').html('正在分析你发表过的微博内容...');
        },3000);
        request = setInterval(function(){
            console.log((plus.storage.getItem("domain")+'/castle/wap/share/biz-result' + '?islook=1&pjax=1'))
            $.ajax({
                type: 'get',
                url: (plus.storage.getItem("domain")+'/castle/wap/share/biz-result' + '?islook=1&pjax=1'),
                dataType: 'json',
                success: function(msg) {
                    console.log("轮询数据接收成功");
                    console.log(JSON.stringify(msg));
                    if( msg.code != 0 ){
                        //alert( msg.message );
                        return;
                    }

                    if( msg.data.real_data.st_modules_h5_businessResult.weibo_user_id ){
                        clearInterval(request );

                        $('.orange-box, .mui-popup-backdrop').remove();
                        SCRM.pjax( '/castle/wap/share/biz-result' );

                    }else{

                        var time = mui.now()-startDate;
                        console.log(time)
                        if(time > 300000){
                            mui.toast( '您的数据太多了,正在紧张运算中,过段时间再来吧!' );
                        }
                    }


                },
                error: function(e){
                    console.log(JSON.stringify(e))
                    mui.toast( '网络错误，请刷新页面或稍后重试' );
                }
            });
        },5000);
    };

    function init(opts) {
        clearInterval(request );
        staticDomain = opts._extra.domain;
        share_url = opts.share_url;
        platform = opts.platform;
        appid = opts.jssdk.appid;
        if( !opts.weibo_user_id ){
            waitHandle(opts.query_url);
            return;
        }

        score( opts );//得分轴

        // 延迟加载微信分享的 tips
        lazyload.load("common/share/tips/js/index", function(dialog){
            dialogTips = new dialog({
                title: '好了，现在招呼你的朋友帮你提提意见!'
            });
        });

        seajs.use('http://' + opts._extra.domain + '/libs/echarts/3.1.10/echarts.min.js',function(weixinSDK){
            if( !opts.score ){
                return;
            };
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('detail-echarts'));
            // 指定图表的配置项和数据
            var option = {};
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption( opts.detail );
        });

        $( '#st_modules_h5_businessResult' ).on('touchend', '#openTestData', function(){
            Tips();
            testDataChart( opts.chart.x, opts.chart.y );
        }).on('touchend', '#shareTips', function(){
            // 分享接口
            $share({
                msg:{
                    href : share_url,
                    title : runShare.titleIco().title,
                    content : runShare.titleIco().title,
                    thumbs : [runShare.titleIco().ico]
                }
            });
        }).on('touchend', '#retry', function(){
            if( opts.next_test_time > +((new Date()).getTime().toString().substr(0,10)) ){
                Alert( '亲，你最近才测试过，短时间内微博电商属性变化不大，建议24小时后再来测试！' );
                return;
            }
            
            SCRM.pjax( opts.retry_url );
        });
    }
    function destroy(opts) {
        $('.orange-box, .mui-popup-backdrop').remove();
        $( '#st_modules_h5_businessResult' ).off();
        $( '.alert_dom' ).remove();
        $( '.alert_close' ).off().remove();
        // Alert = null;
        // waitHandle = null;
        // platform = null;
        // share_url = null;
        // signedRequest = null;
        // WeiboJS = null;
        // wx = null;
        // runShare = null;
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});