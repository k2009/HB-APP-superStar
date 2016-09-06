define(function(require, exports, module) {
    "use strict";
	var $oauth = require("kit/util/plus-oauth");			//第三方登录模块

    mui.plusReady(function() {

	    //更换头像
	    mui("body").on("tap", "img.border-1px", function(e) {
	        if(mui.os.plus){
	            var a = [{
	                title: "拍照"
	            }, {
	                title: "从手机相册选择"
	            }];
	            plus.nativeUI.actionSheet({
	                title: "修改头像",
	                cancel: "取消",
	                buttons: a
	            }, function(b) {
	                switch (b.index) {
	                    case 0:
	                        break;
	                    case 1:
	                        getImage();
	                        break;
	                    case 2:
	                        galleryImg();
	                        break;
	                    default:
	                        break
	                }
	            })
	        }

	    });
	    mui("body").on("tap","a.mui-btn",function(){
	    	plus.storage.clear();
	    	$oauth({
	    		type:"logout",
	    		success:function(e){
                    console.log(JSON.stringify(e));
	    			alert('退出成功!');
	    			plus.runtime.restart();
	    		}
	    	})
	    })
	    function getImage() {
	        var c = plus.camera.getCamera();
	        c.captureImage(function(e) {
	            plus.io.resolveLocalFileSystemURL(e, function(entry) {
	                var s = entry.toLocalURL() + "?version=" + new Date().getTime();
	                console.log(s);
	                document.getElementById("head-img").src = s;
	                document.getElementById("head-img1").src = s;
	                //变更大图预览的src
	                //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
	                document.querySelector("img.border-1px").src = s + "?version=" + new Date().getTime();;;
	            }, function(e) {
	                console.log("读取拍照文件错误：" + e.message);
	            });
	        }, function(s) {
	            console.log("error" + s);
	        }, {
	            filename: "_doc/head.jpg"
	        })
	    }

	    function galleryImg() {
	        plus.gallery.pick(function(a) {
	            plus.io.resolveLocalFileSystemURL(a, function(entry) {
	                plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
	                    root.getFile("head.jpg", {}, function(file) {
	                        //文件已存在
	                        file.remove(function() {
	                            console.log("file remove success");
	                            entry.copyTo(root, 'head.jpg', function(e) {
	                                    var e = e.fullPath + "?version=" + new Date().getTime();
	                                    document.getElementById("head-img").src = e;
	                                    document.getElementById("head-img1").src = e;
	                                    //变更大图预览的src
	                                    //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
	                                    document.querySelector("img.border-1px").src = e + "?version=" + new Date().getTime();;
	                                },
	                                function(e) {
	                                    console.log('copy image fail:' + e.message);
	                                });
	                        }, function() {
	                            console.log("delete image fail:" + e.message);
	                        });
	                    }, function() {
	                        //文件不存在
	                        entry.copyTo(root, 'head.jpg', function(e) {
	                                var path = e.fullPath + "?version=" + new Date().getTime();
	                                document.getElementById("head-img").src = path;
	                                document.getElementById("head-img1").src = path;
	                                //变更大图预览的src
	                                //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
	                                document.querySelector("img.border-1px").src.src = path;
	                            },
	                            function(e) {
	                                console.log('copy image fail:' + e.message);
	                            });
	                    });
	                }, function(e) {
	                    console.log("get _www folder fail");
	                })
	            }, function(e) {
	                console.log("读取拍照文件错误：" + e.message);
	            });
	        }, function(a) {}, {
	            filter: "image"
	        })
	    };

    });



})
