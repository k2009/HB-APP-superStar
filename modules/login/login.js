// 用于登录页面的逻辑处理
define(function(require, exports, module){
    "use strict";

	var $storage = require("kit/util/plus-storage");		//本地存储模块
	var $oauth = require("kit/util/plus-oauth");			//第三方登录模块
	var $upDate = require("kit/util/plus-update"); //应用更新模块
	var $netChange = require("kit/util/plus-netChange"); //网络监测模块

	var host_domain='http://30681.biz.dev.social-touch.com';
	var loginURL = "/castle/app/v1/user/wblogin"


    var sys = {
    	init:function($){
			$.plusReady(function(){
				var oauth = $storage('oauth_weibo');
				sys.app_update();
				host_domain = plus.storage.getItem("domain")||host_domain;
				if(oauth){
                    // if(oauth.outTime<new Date().getTime()){
                    //     console.log('执行后补微博登录!')
	                   // // sys.fn_oauth();
                    // }
                    console.log(JSON.stringify(oauth))
					$.ajax({
						url:(host_domain+loginURL),
						type:"get",
						data:oauth,
						dataType:"json",
						success:function(d){
							console.log("打印登录接口数据")
							console.log(JSON.stringify(d))
							if(d.code == 0){
								$storage('st_modules_h5_home',d.data);
								sys.fn_next();
							}else{
								mui.toast(d.msg)
							}
						},
						error:function(e){
							console.log('请求失败');
							console.log(JSON.stringify(e));
							$('.fakeloader')[0].remove();
						}
					});
					// sys.fn_next();
				}else{
					$('.fakeloader')[0].remove();
				}
				sys.event();
				//测试代码,用于获得权限
				var $sq = require('kit/util/deBug-setCookie');
				// $sq('http://30681.biz.dev.social-touch.com');
				if( !plus.storage.getItem("domain") )plus.storage.setItem('domain',host_domain)

				$.ajax({
					url:host_domain+'/castle/wap/route/list',
					type:"get",
					dataType:"json",
					success:function(d){
						plus.storage.setItem('route',JSON.stringify(d));
					}
				})
			})
    	},
    	app_update:function(){

			$netChange.NetChange(fn_upDate());

			function fn_upDate() {
				// if ($netChange.getNetType() == 1) {
					var lastUpDate = $storage('lastUpDate');
					// if (!lastUpDate || ($.now() - lastUpDate >= 86400000)) { //如果上次检查更新时间大于24小时,开始更新检查
						$storage('lastUpDate', mui.now());
						$upDate.silent = true;
						$upDate.init();
					// }
				// }
				return fn_upDate;
			}
    	},
    	event:function(){
			mui('body').on('tap','#weibo_login',function(){
				sys.fn_oauth(true);
			});
    	},
    	fn_oauth:function(btn){												//处理微博登录逻辑

			$oauth({
				success:function(data){
					console.log('登录成功!!!'+JSON.stringify(data));
                    data.outTime = new Date().getTime()+data.expires_in;
					$storage('oauth_weibo',data);
					if(btn){
						console.log('尝试登录服务')
						$.ajax({
							url:(host_domain+loginURL),
							type:"get",
							data:data,
							dataType:"json",
							success:function(d){
								console.log("打印登录接口数据")
								console.log(JSON.stringify(d))
								if(d.code == 0){
									$storage('st_modules_h5_home',d.data);
									sys.fn_next();
								}else{
									mui.toast(d.msg);
								}
							},
							error:function(e){
								console.log('请求失败')
								console.log(JSON.stringify(e))
							}
						});
					}
				},
				error:function(data){
					if(data)console.log('err'+JSON.stringify(data));
					mui.toast('微博登录失败');
				}
			});
    	},
    	ajax_login:function(){
    	},
    	fn_next:function(){
    		mui.openWindow({
			   id:'index.html',
			   url:'../h5/index/index.html',
				styles:{
					top:"0px",
				  bottom:'56px',//新页面底部位置
				},
			});
    		mui.openWindow({
			   	id:'tabbar',
			   	url:'../tabbar.html',
			    styles:{
			      bottom:'0px',//新页面底部位置
			      height:'56px',//新页面高度，默认为100%
			    },
			    show:{
			      autoShow:true,//页面loaded事件发生后自动显示，默认为true
			      // aniShow:,//页面显示动画，默认为”slide-in-right“；
			    },

			});
    	}
    }

    sys.init(mui);

})
