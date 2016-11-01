var app_route = [
    {
        "path": "/castle/wap/course/course-section-details",
        "data": {
            "default_data": {
                "modules": [
                    {
                        "id": "st_modules_h5_lessionContent",
                        "title": "课程详情",
                        "loading_show": true,
                        "data": {
                            "name": "标题加载中...",
                            "content": "加载中...",
                            "next_url": "下一步的URL",
                            "is_test": 0,
                            "platform": null,
                            "user": {
                                "uid": "0",
                                "screen_name": "加载中",
                                "profile_image": "http://tva4.sinaimg.cn/crop.0.1.631.631.1024/6f4dd669jw1en23w6skilj20hs0hntb0.jpg"
                            },
                            "jssdk": {
                                "appId": "必填，公众号的唯一标识",
                                "timestamp": "必填，生成签名的时间戳",
                                "nonceStr": "必填，生成签名的随机串",
                                "signature": "必填，签名，见附录1"
                            },
                            "submit_url": "上传照片/文字的接口url"
                        },
                        "template": [
                            "modules/h5/lessionContent/template/index.html"
                        ],
                        "css": [
                            "modules/h5/lessionContent/css/index.css"
                        ],
                        "script": "modules/h5/lessionContent/js/index.js",
                        "app_script": "modules/h5/lessionContent/app_js/lessionContent.js"
                    }
                ]
            }
        }
    }
]