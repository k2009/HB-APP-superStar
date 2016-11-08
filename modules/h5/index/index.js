// app 首页加载逻辑 by xiaok
// 2016年07月06日16:31:22

define(function(require, exports, module) {
	"use strict";
	var $storage = require("kit/util/plus-storage"); //本地存储模块
	var $fn = require("modules/h5/index/js/index.js"); //fn
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false  //关闭back按键监听
		}
	})
	var tmp = require("modules/h5/index/template/index.html"); //模板载入
	var $get = require("kit/util/construction"); //数据处理
	+ function() {
	    var cfg = {
	        id:'st_modules_h5_home',
	        tmp:tmp,
	        fn:$fn,
	        url:plus.storage.getItem('domain')+'/castle/wap/user/index?pjax=1',
	        data:{
		        'st_modules_h5_home': {
					lesson_status: 1,
					fans_count: "...",
					level: "加载中",
					score: '...',
					next_url: "/castle/wap/course/course-list",
					urls: {
						lession: "/castle/wap/course/course-list",
						location: "/castle/wap/user/lable",
						dna: "/castle/wap/stats/sign",
						my: "/castle/wap/user/show",
						together: "/castle/wap/user/together",
						growthInfo: "/castle/wap/user/growth-info",
					},
					platform: null,
					jssdk: {
						appid: "963804171",
						noncestr: "cf53e62c81",
						timestamp: 1468480316,
						url: plus.storage.getItem('domain')+"/castle/wap/user/index?pjax=1",
						signature: "62f5fb703128d57987ba9c36ae489ee9f1c353cc"
					},
					user: {
						uid: "...",
						screen_name: "加载中",
						profile_image: "http://tva4.sinaimg.cn/crop.0.1.631.631.1024/6f4dd669jw1en23w6skilj20hs0hntb0.jpg"
					}
		        }
			}
	    }

	    $get(cfg,function(){
	        console.log('本页面处理完成!')
	    });

	}()



	+ function($) { // index主体逻辑
		$.init();
		// $upDate.init();
		$.plusReady(function() {

			// $('body').on('tap', 'footer a', function() {
			// 	if (this.getAttribute('href') == 'html/setting.html') {
			// 		mui.openWindow({
			// 			id: 'memberCenter',
			// 			url: '../memberCenter/memberCenter.html'
			// 		});
			// 	}
			// })
		})
	}(mui)

})