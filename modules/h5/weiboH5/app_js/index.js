define(function(require, exports, module) {
    "use strict";
    var $share = require("kit/util/plus-share/shareUI"); //分享
    mui.ready(function() {
        var runImage = {
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
        $("body").on('tap', '#run_share', function(){
            $share({
                msg:{
                    href : window.pageData.next_url,
                    title : runImage.title_2(),
                    content : (runImage.title()+window.pageURL),
                    thumbs : ['http://tva1.sinaimg.cn/crop.22.48.463.463.180/0068YUDSjw8f7nd3fwmj0j30e80e8weu.jpg']
                }
            });
            return false;
        })

    })
});