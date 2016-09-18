define(function(require, exports, module) {
    "use strict";
    var $image = require("kit/util/plus-image"); //本地存储模块


    mui.plusReady(function() {

        mui('body').on('tap', '#chooseImageBox', function() {
            var a = [{
                title: "拍照"
            }, {
                title: "从手机相册选择"
            }];
            plus.nativeUI.actionSheet({
                title: "添加图片",
                cancel: "取消",
                buttons: a
            }, function(b) {
                switch (b.index) {
                    case 0:
                        break;
                    case 1:
                        + function() {
                            var path = "_doc/APPcompressImage/img_" + new Date().getTime() + ".jpg"
                            $image.getCameraImage(function(e) {
                                $image.compressImage({
                                    imgPath: path,
                                    success: function() {
                                        $image.getPath(path, function(p) {
                                            addImage(p);
                                        })
                                    }
                                })
                            }, path);

                        }()
                        break;
                    case 2:
                        $image.getGalleryImg(function(files) {
                            // console.log("获取图片信息成功")
                            $image.compressImages(files, addImage)
                        }, (9 - $('#imageList img').length));
                        break;
                    default:
                        break
                }
            })
        })

    })



    function addImage(files) {
        var listLength;

        function fn_push(path) {

            var localIds = path,
                $li = $('<li><i class="img-container"><span class="cnt"><span class="mui-icon mui-icon-trash imgRemove"></span></span></i></li>'),
                img = $('<img />').attr('src', localIds);
            $li.find('.cnt').append(img);
            $('#chooseImageBox').before($li);
        }

        if (typeof files != "string") {
            for (var i in files) {
                $image.img2Base64(files[i], function(e) {
                        fn_push(e);
                    })
                    // fn_push(files[i])
            }
        } else {
            $image.img2Base64(files, function(e) {
                fn_push(e);
            })
        }
        listLength = $('#imageList img').length;
        if (listLength >= 9) {
            $('#chooseImageBox').hide();
        }
    }

});