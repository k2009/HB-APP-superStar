define(function(require, exports, module) {
    "use strict";

    var sys = {
        getCameraImage: function(callback, fileName) {
            var c = plus.camera.getCamera();
            c.captureImage(function(e) {
                plus.io.resolveLocalFileSystemURL(e, function(entry) {
                    var s = entry.fullPath + "?version=" + new Date().getTime();
                    callback(s)
                }, function(e) {
                    console.log("读取拍照文件错误：" + e.message);
                });
            }, function(s) {
                console.log("error" + s);
            }, {
                filename: fileName || "_doc/head.jpg"
            })
        },
        compressImages: function(paths, callback) {
            var i = 0;
            var arr = [];

            function fn1() { //递归函数,懒得起名
                var path = "_doc/APPcompressImage/img_" + new Date().getTime() + ".jpg";
                // console.log(paths[i])
                // console.log(path)
                sys.compressImage({
                    imgPath: paths[i],
                    savePath: path,
                    success: function() {
                        sys.getPath(path, function(p) {
                            arr.push(p);
                            if (++i < paths.length) {
                                fn1();
                            } else {
                                callback(arr);
                            }
                        })
                    }
                })
            }
            fn1();

        },
        getPath: function(path, callback) {

            plus.io.resolveLocalFileSystemURL(path, function(entry) {
                // 可通过entry对象操作test.html文件 
                callback(entry.fullPath)
            }, function(e) {
                console.log("Resolve file URL failed: " + e.message);
            });
        },
        compressImage: function(opt) {
            // var opt = {
            //     imgPath:"", 
            //     savePath:"", 
            //     success:function(){

            //     }
            // }
            plus.zip.compressImage({
                    src: opt.imgPath,
                    dst: opt.savePath || opt.imgPath,
                    overwrite: true,
                    width: "800px",
                    format: "jpg"
                },
                function() {
                    if (opt.success) opt.success();
                },
                function(error) {
                    console.log("Compress error!" + JSON.stringify(error));
                }
            );
        },
        getGalleryImg: function(callback, maxNum) {
            plus.gallery.pick(function(e) {
                callback(e.files)
            }, function(e) {
                console.log("取消选择图片");
            }, {
                filter: "image",
                multiple: true,
                maximum: maxNum || 9
            });
        },
        img2Base64: function(path, callback) {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var img = new Image;
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL('image/jpeg', 50);
                callback.call(this, dataURL);
                // Clean up 
                canvas = null;
            };
            img.src = path;
        }
    }

    return sys;

})