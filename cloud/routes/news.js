
/*
 活动路由
 */

var AL = require('cloud/lib/ALCommonUtil').AL();

var wechatAppID = AL.config.wechatOfBloomAshleyConfig.appId;
var wechatAppSecret = AL.config.wechatOfBloomAshleyConfig.appSecret;
var wechatToken = AL.config.wechatOfBloomAshleyConfig.token;
var encodinAESKey = AL.config.wechatOfBloomAshleyConfig.encodingAESKey;

// http://flowerso2o.avosapps.com/bloom/news/coupon/kuma/
exports.route = function(app) {

    // 众筹小熊活动介绍页 app
    //http://192.168.199.232:3000/news/coupon/54d5d8c1e4b0abb8936bca0f
    app.get('/news/coupon/:couponId?', function(req, res){

        console.dir(req.host+req.url);

        var couponId = req.param("couponId");

        if (!couponId){
             return AL.done(req,false,AL.error(777110,"参数错误"));
        }

        var wxData = null;

        switch (couponId){

            // 情人节抢红包活动
            case '54d5d8c1e4b0abb8936bca0f':{

                /*
                //情人节_icon
                    http://ac-g405gbtt.clouddn.com/fiv8TXVICA614r6rUALfxzGhyIGelB48MHkqQbqv.jpg
                //情人节_加载
                    http://ac-g405gbtt.clouddn.com/Nnf3jRwBkJs6NnE3XekFcEOdPwFATvRn2Q7jPjv2.png
                //情人节_分享
                    http://ac-g405gbtt.clouddn.com/H0a4QqvPUcCAvLS0WTbfmqWuOSEIitI2cjmhmc16.png
                //情人节_背景2
                    http://ac-g405gbtt.clouddn.com/ORnj9eP7GUNNquCKrkej4DfPLNd7TaJfxP2wIMq4.png
                //情人节_背景1
                    http://ac-g405gbtt.clouddn.com/SCPAkbb5588rRPsB7M2nBmrjaqSCl6slyPRq8mQs.png
                //情人节_按钮
                    http://ac-g405gbtt.clouddn.com/j25vb4TXMR4sE8E6jKBeNNiK4GYi2WlSVUi3zzIY.png
                * */

             //wxData = {
             //                "appId"    :   wechatAppID, // 服务号可以填写appId
             //                "imgUrl"   :   'http://ac-g405gbtt.clouddn.com/fiv8TXVICA614r6rUALfxzGhyIGelB48MHkqQbqv.jpg',
             //                "link"     :   req.host+req.url,
             //                "title"    :   "Bloom幸福键",
             //                "desc"     :   "让爱的时光不再匆匆，让爱的人不在错过!"
             //
             //};

                var jsapi_ticket = "r0UKw1dW94VcYFKqlpJo1vUNi5X-Sz16uUkmjjeojLYwXG__N9FCiJRMEeEtFBDHBVnzs_KUkSGW2goLEFY1k8KBLDOlXLNmh-74xKrVMRA";
                wxData = {
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: wechatAppID, // 必填，公众号的唯一标识
                    timestamp: AL.getTimeStamp(), // 必填，生成签名的时间戳
                    nonceStr: '83hrfsufgw3bf823', // 必填，生成签名的随机串
                    signature: '',// 必填，签名，见附录1
                    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                }

            } break;

        }


        if (wxData)
        {
            return res.render("cloud/views/"+couponId,{title:"【Bloom】把全世界最美的花放进口袋",wxData:wxData,couponId:couponId});
        }
        else
        {

        }

    });

    app.get('/news/couponOfUser/:couponOfUserId?', function(req, res){

        var couponOfUserId = req.param("couponOfUserId");

        res.render("public/kuma/app/index",{couponOfUserId:couponOfUserId});
    });

    //app.get('/news/coupon/:couponId/:userId?', function(req, res){
    //
    //    var couponId = req.params.couponId;
    //    var userId = req.params.userId;
    //
    //    res.render("public/kuma/app/index",{couponId:couponId,userId:userId});
    //});

};

