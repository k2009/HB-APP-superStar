define(function(require, exports, module) {
    require("common/util/loadMUI");
    var $body=$('body');
    var check;
    var lazyload = require("kit/util/asyncModule");
    var jssdk = require("common/share/jssdk");
    var $share = require("kit/util/plus-share/shareUI"); //分享
    var wordCloud=require('modules/testing/weiboDNA/js/wordCloud');

    var TITLE='Guys，你确定真的了解我么？点开，也许你会发现不一样的我哟~';
    var SHARE_URL = "";
    var initData;
    var dueTime=3600*24*7*1000;//7days

    var Tools = {
        // 绑定事件
        "bindEvent": function(){
            $body.unbind("tap", "a[action=invite]").on("tap", "a[action=invite]", Tools.share);
        },
        // 微信显示蒙层
        'share': function(e){
            $share({
                msg:{
                    href : plus.storage.getItem("domain")+SHARE_URL,
                    title: "一起炫酷", // 分享标题
                    content : TITLE,
                    thumbs : ['http://ww1.sinaimg.cn/mw690/4d6b334agw1f6wx4ltemuj20i20augm1.jpg']
                }
            });
        },
    };

    var render=function(data){

    }
    var showUnder=function(){
        setTimeout(function(){
            $body.find('[node=content]').css('opacity','1');
        },500);
        setTimeout(function(){
            $body.find('[node=btnBox]').css('display','');
        },1000);
    }

    var reTest=function (e) {
        var now=(new Date).getTime();
        if(now-initData.next_time*1000<dueTime){
            mui.alert('亲，你最近才测试过，短时间内微博DNA图谱是不会有太大变化的，请7天后再来测试吧','','好的');
        }else{
            location.href=initData.result_url;
        }
        
    }

    function init(opts) {
        initData=opts;
        $body.delegate('[reTest]','click',reTest);
        TITLE =([
            'Guys，你确定真的了解我么？点开，也许你会发现不一样的我哟~',
            '邀请你的好友一起参加微博DNA测试，也许你自己都会惊呆了呢~',
            '其实我还有很多八卦哟，比如...想知道么？那就进来看看吧~',
            '超前卫的智能化分析体验尽在时趣网红城堡，带你走进哈利波特的奇幻世界~',
            '好东西一定会分享给你们，特别是这么新鲜好玩的东东哟~快到碗里来吧~'
        ])[parseInt(Math.random()*5)];

        if(opts.is_share==1){
            wordCloud.draw(opts.tags,showUnder);
        }else{
            $body.find('a[action=invite]').attr('href','sinaweibo://compose?content='+TITLE+' : http://'+document.domain+opts.share_url);
            if(!parseInt(opts.weibo_user_id)){
                var url=opts.wait_url;
                check=setInterval(function(){
                    $.ajax({
                        url:url,
                        dataType:'json',
                        success:function(json){
                            var data=json.data.real_data.st_modules_testing_weiboDNAinvite;
                            if(parseInt(data.weibo_user_id)){
                                initData.next_time=data.next_time;
                                clearInterval(check);
                                $('#loadingCover').remove();
                                wordCloud.draw(data.tags,showUnder);
                                $body.find('[node=profile_img]').attr('src',data.profile_image);
                                $body.find('[node=screen_name]').attr('src',data.screen_name);
                            }
                        }
                    });
                },2000);
            }else{
                $('#loadingCover').remove();
                wordCloud.draw(opts.tags,showUnder);
            } 
        }       

        var platform = opts.platform;
        SHARE_URL = opts.share_url;


        Tools.bindEvent();

    }

    function destroy(opts) {
        console.log("destroy 邀请好友");
        $('#loadingCover').remove();
        Tools = null;
        wordCloud.destroy();
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});