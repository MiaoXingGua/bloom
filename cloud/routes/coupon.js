/****************
通用函数
*****************/

var url = require('url'),
    querystring = require('querystring'),
    crypto = require('crypto'),
    events = require('events'),
    emitter = new events.EventEmitter(),
    //xml2js = require('xml2js'),
    //parse = require('xml2js').Parser(),
    //parseString = require('xml2js').parseString,
    moment = require('moment-timezone')
    ;

var User = AV.Object.extend('_User'),
    Photo = AV.Object.extend('Photo'),
    Coupon = AV.Object.extend('Coupon'),
    CouponOfUser = AV.Object.extend('CouponOfUser'),
    CommodityCart = AV.Object.extend('CommodityCart'),
    Commodity = AV.Object.extend('Commodity'),
    CommodityOrder = AV.Object.extend('CommodityOrder')
    ;

// 爱视狸代购 公众号 (获取用户数据)
//var wechatOfAshleyConfig = {
//
//    appId           : "wx099d898a32473ab9",
//    appSecret       : "3709cc4ae28e5f74d255e3032e9f4fbd",
//    token           : "WiQ0UcYhTRq7l1jS",
//    encodingAESKey  : "pDjlSmvAN3J6dSPEVaQfdARFJumTjBeZM2ATcpuhlvA",
//    URL             : "http://flowerso2o.avosapps.com/wechat/",
//    accessToken     : "",
//    accessTokenExpiresIn : null
//
//};

// 爱视狸科技 公众号 (获取用户数据)
var wechatOfAshleyConfig = {

    appId           : "wx966a571968e8cdee",
    appSecret       : "05de0873c601d0025f8042e28c250a3c",
    token           : "WIE7FIWU4FGIUBDF",
    encodingAESKey  : "AMw4bpIBYJo63lcH8elsVBUsQirPzPDigMHQi9tjRjR",
    URL             : "http://flowerso2o.avosapps.com/wechat/",
    accessToken     : "",
    accessTokenExpiresIn : null

};

// bloom 开发账号 (付款、分享)
var wechatOfBloomConfig = {

    appId           : "wx8d7deb2e14afbbd4",
    appKey          : "9vjPBQ6UA6CvuiAiGC7YdFQsfEFduDk0BqiY52khrpWMIUBxK9zebPZJPMrcnXi8BYfVIkJHjaLdP3SaZSzKpL6jyfjENLQ44PjF1KZhCGerkJdq60PcGH2EJvBhcV4x",
    appSecret       : "0ec828af675de4f1b48f07bbcf2689cc",
    partnerKey      : "04f0e3bc4ae941ea329aefe2439f217b",
    partnerId       : "1223282101",

    signtype        : 'SHA1',
    notify_url      :"http://flowerso2o.avosapps.com/wechat/pay_notify"

};



var AL = require('cloud/lib/ALCommonUtil').AL();


AV._initialize('g405gbttqiz691vvrnmeyua4c3444k6vudaiw5h8dteut3qc', 'w6nd1xgnur9yppvc5h7kdt8knit8sz1sdt8o55irx3s3uycy', '3wdbejwyy36sfa1lytoorhzaengunxuqnv04yzixn6jl1t8d');
AV.Cloud.useMasterKey();


/*
活动路由
*/
// http://flowerso2o.avosapps.com/bloom/news/coupon/kuma/
exports.route = function(app) {

    var wechatAppID = AL.config.wechatOfBloomAshleyConfig.appId;
    var wechatAppSecret = AL.config.wechatOfBloomAshleyConfig.appSecret;
    var wechatToken = AL.config.wechatOfBloomAshleyConfig.token;
    var encodinAESKey = AL.config.wechatOfBloomAshleyConfig.encodingAESKey;

    var API = require('cloud/lib/wechatAPI').API(wechatAppID, wechatAppSecret, wechatToken, app),
        oauth = API.OAuth,
        accessToken = API.AccessToken
        ;

    /*
        app接口
     */
    var addCouponOfUser = function(coupon,user,conversionCode,done){

        var couponsOfUser = new CouponOfUser();
        couponsOfUser.set('user',user);
        couponsOfUser.set('coupon',coupon);
        couponsOfUser.set('conversionCode',conversionCode);
        couponsOfUser.set('faceValue',coupon.get('faceValue'));
        couponsOfUser.set('expirationAt',coupon.get('expirationAt'));
        couponsOfUser.set('type',coupon.get('type'));
        couponsOfUser.set('state',AL.config.ALCouponState.unfinished);   //未完成
        couponsOfUser.save().then(function(couponsOfUser){
            done?done(couponsOfUser.id,null):null;
        },function(error){
            done?done(null,AL.error(error.code,"收藏优惠券失败 : "+error.message)):null;
        });
    };


    // 通用Coupon Query
    var searchCouponQuery = function (storeIds, commodityIds, types, limit, skip){

        var couponQ = new AV.Query(Coupon);
        if (AV._.isArray(storeIds) && storeIds.length>0) couponQ.containedIn('stores',storeIds);
        if (AV._.isArray(commodityIds) && commodityIds.length>0) couponQ.containedIn('commoditys',commodityIds);
        if (AV._.isArray(types) && types.length>0) couponQ.containedIn('type',types);

        if (limit>0 && limit!='NaN') couponQ.limit(limit);
        if (skip>0 && skip!='NaN') couponQ.skip(skip);

        //couponQ.exists('commoditys');
        couponQ.greaterThan('expirationAt',new Date());

        return couponQ;
    };

    var shareURL = function (couponOfUserId,oAuthState){
        //console.dir("AL.domain = "+AL.domain);
        var URL = AL.domain + "coupon/cp2c/share/"+oAuthState+"/" + couponOfUserId;
        console.log(AL.domain);
        return URL;
    };

    function createCp2cDict (couponOfUserId, userInfo, done){

        //var coupons = AV.Object.createWithoutData("Coupons",couponsId);
        //return getRandomNum(0,3);

        //console.dir(userInfo);

        // 测试
        //if (!userInfo)
        //{
        //    userInfo = {
        //        "openid":"oI6zGji3i88cexFjxvX03FSpjQ4Y",
        //        "nickname":"蹦个大青蛙",
        //        "sex":1,
        //        "language":"zh_CN",
        //        "city":"Haidian",
        //        "province":"Beijing",
        //        "country":"CN",
        //        "headimgurl":"http:\\/\\/wx.qlogo.cn\\/mmopen\\/SDX5alibYgV0h5sibm4lISXjl3tl3rLBnUsk82CQtibmV9Jns9rJEcnDqicDLmQ2ZRvpEmRmNcen5qSnuH0t1THq7OnF56A2Bgca\\/0",
        //        "privilege":[],
        //        "unionid":"oLZRBtxIR6K9s4qfOywqJhOUFNpE",
        //        "state":0
        //    };
        //}

        // 当前用户的openid

        if (!couponOfUserId)
        {
            couponOfUserId = "undefined";
        }

        var openid = userInfo.openid;

        // 查找 couponOfUser
        var couponOfUserQ = new AV.Query(CouponOfUser);
        couponOfUserQ.include('voice');
        couponOfUserQ.include('coupon');
        couponOfUserQ.equalTo('objectId',couponOfUserId);
        couponOfUserQ.first().then(function(couponOfUser){

            if (!couponOfUser)
            {
                done(null,AL.error(777112,"优惠券不存在"));
                return;
            }

            //活动发起人
            var owner = couponOfUser.get('owner');
            if (!owner)
            {
                done(null,AL.error(777113,"活动已结束"));
            }

            var openids = couponOfUser.get('openids');

            if (owner.openid == openid)
            {
                //活动发起人
                userInfo['state'] = 1;
            }
            else if (!openids || AV._.isEmpty(openids))
            {
                //没人参与过
                userInfo['state'] = 3;
            }
            else if (openids.indexOf(openid)>-1)
            {
                //参与过
                userInfo['state'] = 2;
            }
            else
            {
                //没参与过
                userInfo['state'] = 3;
            }


            var getShowPhotoFormCouponOfUser = function (couponOfUser,callback){

                return callback(null);

                if (couponOfUser.get('state')>=3)
                {
                    //已使用优惠券 查看使用的订单 是否已晒图
                    var orderQ = new AV.Query(CommodityOrder);
                    orderQ.equalTo('couponOfUserIds',couponOfUserId);
                    orderQ.first().then(function(order){

                        if (order)
                        {
                            var showPhotoToWechatMomentsQ = new AV.Query(ShowPhotoToWechatMoments);
                            showPhotoToWechatMomentsQ.equalTo('fromObject.objectId',order.id);
                            showPhotoToWechatMomentsQ.first().then(function(showPhoto){
                                if (showPhoto)
                                {
                                    callback(showPhoto.id);
                                }
                                else
                                {
                                    callback(null);
                                }

                            },function(error){
                                callback(null);
                            });
                        }
                        else
                        {
                            callback(null);
                        }

                    },function(error){
                        callback(null);
                    });
                }
                else
                {
                    callback(null);
                }
            };

            getShowPhotoFormCouponOfUser(couponOfUser,function(showPhotoId){

                //console.dir("showPhotoId : "+showPhotoId);

                var userList = couponOfUser.get('userList');

                var coupon = couponOfUser.get('coupon');

                var voice = null;

                if (couponOfUser.get('voice'))
                {
                    var voice = {
                        url : couponOfUser.get('voice').get('url'),//"http://ac-g405gbtt.qiniudn.com/AJPRc7T22J3AYK6FcUrgkO219Fg5ywpri74gF8Ew.mp3",//couponOfUser.get('voice').get('url'),
                        duration : couponOfUser.get('voice').get('duration'),
                        formatName : couponOfUser.get('voice').get('formatName'),
                        introduction: couponOfUser.get('voice').get('introduction')
                    };
                }

                var wxData = {
                    "title"     :   coupon.get('name'),
                    "desc"      :   coupon.get('introduction'),
                    "imgUrl"    :   coupon.get('coverViewURL'),
                    "appId"     :   wechatOfBloomConfig.appId, // 服务号可以填写appId
                    "link"      :   AL.domain+"coupon/cp2c/kuma/share/"+couponOfUserId
                };

                var couponDict = {
                    "id" : couponOfUser.id,
                    "coverViewURL"  : coupon.get('coverViewURL'),//图片
                    "name"          : coupon.get('name'),//活动名称
                    "introduction"  : coupon.get('introduction'),//活动介绍
                    "faceValueOfMax": coupon.get('faceValueOfMax'),//最大面值
                    "faceValue"     : couponOfUser.get('faceValue'),//当前面值
                    "state"         : couponOfUser.get('state'),
                    "begShowPhotoNumber" : couponOfUser.get('begShowPhotoNumber')
                };

                var dict = {
                    "owner"     : owner,
                    "user"      : userInfo,
                    "userList"  : userList||[],
                    "coupon"    : couponDict,
                    "wxData"    : wxData
                };

                if (showPhotoId)
                {
                    dict['showPhotoURL'] = AL.domain+"showPhotoToMoments/"+showPhotoId;
                }

                if (voice)
                {
                    dict['voice'] = voice;
                }
                //else
                //{
                //    //http://flowerso2o.avosapps.com/showPhotoToMoments/54648221e4b0a56c64c06169
                //    dict['showPhotoURL'] = "http://flowerso2o.avosapps.com/showPhotoToMoments/54648221e4b0a56c64c06169";
                //}

                done(dict,null);
            });

        },function(error){

            done(null,error);
        });
    }

    //1.1 领取优惠券(礼券id)
    app.all("/coupon/addCouponToUser", function(req, res) {

        console.dir("领取优惠券");

        var couponId = req.param("couponId");
        var userId = req.param("userId");

        if (!couponId || couponId.length==0 || !userId || userId.length==0)
        {
            AL.done(res,null,AL.error(777110,"参数错误"));
            return;
        }

        AV.Object.createWithoutData('Coupon',couponId).fetch().then(function(coupon){

            if (coupon.get('expirationAt')<=new Date())
            {
                //已过期
                //res.end(_result(null,ALERROR(777111,"优惠券已过期")));
                AL.done(res,null,AL.error(777111,"参数错误"));
                return;
            }

            var user = AV.Object.createWithoutData('_User',userId);

            var limitCount = coupon.get('limitCount');
            if (limitCount==0)
            {
                // 没有数量限制
                addCouponOfUser(coupon,user,null,function(objId,err){

                     if (err)
                     {
                         //res.error(ALERROR(777113,"收藏优惠券失败"));
                         AL.done(res,null,AL.error(err.code,"收藏优惠券失败 : "+err.message));
                     }
                     else
                     {
                         //res.success(true);
                         AL.done(res,objId,null);
                     }
                });
            }
            else
            {
                //有数量限制

                var couponOfUserQ = new AV.Query(CouponOfUser);
                couponOfUserQ.equalTo('user',user);
                couponOfUserQ.equalTo('coupon',coupon);
                couponOfUserQ.count().then(function(number){

                    console.dir("limitCount : "+limitCount);
                    console.dir("number : "+number);
                    if (number==0 || number<limitCount)
                    {
                        addCouponOfUser(coupon,user,null,function(objId,err){

                            if (err)
                            {
                                //res.error(ALERROR(777113,"收藏优惠券失败"));
                                AL.done(res,null,err);
                            }
                            else
                            {
                                //res.success(true);
                                AL.done(res,objId,null);
                            }
                        });
                    }
                    else
                    {
                        //不能再领了
                        //res.error(ALERROR(777112,"优惠券超过数量限制"));
                        AL.done(res,null,AL.error(777112,"优惠券超过数量限制"));
                    }

                },function(error){

                    AL.done(res,null,error);
                });
            }

        },function(error){
            //res.error(ALERROR(error.code, error.messages));
            AL.done(res,null,error);
        });
    });

    //1.2 领取优惠券(优惠码)
    app.all("/coupon/addCouponWithConversionCode", function(req, res) {

        console.dir("领取优惠券");

        var conversionCode = req.param("conversionCode");
        var userId = req.param("userId");

        if (!userId || userId.length==0 || !conversionCode || conversionCode.length==0)
        {
             AL.done(res,null,AL.error(777120,"参数错误"));
        }

        var couponQ = new AV.Query(Coupon);
        couponQ.equalTo("conversionCodes",conversionCode);
        couponQ.limit(1);
        couponQ.find().then(function(coupons){

            if (coupons.length==0)
            {
                AL.done(res,null,AL.error(777324,"优惠券不存在或已被领取"));
            }
            else if (coupons.length>0)
            {
                var coupon = coupons[0];
                var conversionCodeList = [];
                var conversionCodes = coupon.get('conversionCodes');
                for (var i in conversionCodes)
                {
                     if (conversionCodes[i] != conversionCode)
                     {
                         conversionCodeList.push(conversionCodes[i]);
                     }
                }
                coupon.set('conversionCodes',conversionCodeList);

                addCouponOfUser(coupon,AV.Object.createWithoutData('_User',userId),conversionCode,function(objId,error){

                    if (error)
                    {
                        //res.error(ALERROR(777113,"收藏优惠券失败"));
                        AL.done(res,null,AL.error(error.code,"收藏优惠券失败 : "+error.message));
                    }
                    else
                    {
                        //res.success(true);
                        AL.done(res,objId,null);
                    }
                });
            }

        },function(error){
            AL.done(res,null,error);
        });
    });

    var couponOfPhone = AL.object('Coupon','54d5d8c1e4b0abb8936bca0f');
    var couponOfPhoneLimitCount = 1;
    var couponOfPhoneExpirationAt = new Date("2015-02-26 00:00:00");

    //1.3.1 领取优惠券(手机号)
    // http://192.168.199.232:3000/coupon/add/phoneNumber?phoneNumber=15812345678&couponId=54d5d8c1e4b0abb8936bca0f
    app.all("/coupon/add/phoneNumber?", function(req, res) {

        if (!__production) console.dir("1.3.1 领取优惠券");

        var couponId = req.param("couponId");

        if (couponId != couponOfPhone.id)
        {
            return AL.done(res,null,AL.error(777110,"参数错误"));
        }

        var phoneNumber = req.param("phoneNumber");

        if (!phoneNumber || !phoneNumber.match(/^1[3|4|5|8][0-9]\d{8}$/g))
        {
            return AL.done(res,null,AL.error(777120,"手机号输入有误，请重新输入。"));
        }

        var userQ = new AV.Query(AL.config.User);
        userQ.equalTo('phoneNumber',phoneNumber);

        console.dir(phoneNumber);

        // 用户是否领过这个红包
        var couponOfUserQ1 = new AV.Query(AL.config.CouponOfUser);
        couponOfUserQ1.equalTo("coupon",couponOfPhone);
        couponOfUserQ1.matchesQuery('user',userQ);

        //couponOfUserQ1.count().then(function(number){
        //    console.dir(number);
        //},function(error){
        //    console.dir(error);
        //});

        // 这个号码是否领过这个红包
        var couponOfUserQ2 = new AV.Query(AL.config.CouponOfUser);
        couponOfUserQ2.equalTo("coupon",couponOfPhone);
        couponOfUserQ2.equalTo('phoneNumberOfUser',phoneNumber);

        //couponOfUserQ2.count().then(function(number){
        //    console.dir(number);
        //},function(error){
        //    console.dir(error);
        //});


        AL.countQuery(AV.Query.or(couponOfUserQ1,couponOfUserQ2),function(number,error){

            if (error) //异常
            {
                AL.done(res,0,error);
            }
            else if (number>=couponOfPhoneLimitCount) //已经领过了
            {
                if (!__production) console.log("已经领过了");
                AL.done(res,0,AL.error(777245,"已经领过了,下次再来吧"));
            }
            else   //没领过 可以领
            {
                if (!__production) console.log("没领过 可以领");

                AL.findQueryWithoutData(userQ,null,function(ids,error){

                    if (error) //异常
                    {
                        return AL.done(res,0,error);
                    }

                    var faceValue = 8300;
                    if (AL.config.phoneOfWechatNewsVIP.indexOf(phoneNumber)==-1)
                    {
                        faceValue = AL.getRandomNumberWithRange(70,100)*100;
                    }
                    else
                    {
                        faceValue = 40000;
                    }
                    console.dir(faceValue);

                    var couponOfUser = new AL.config.CouponOfUser();
                    couponOfUser.set('coupon',couponOfPhone);
                    couponOfUser.set('faceValue',faceValue);
                    couponOfUser.set('expirationAt',couponOfPhoneExpirationAt);
                    couponOfUser.set('type',AL.config.ALCouponType.bloom);
                    couponOfUser.set('state',AL.config.ALCouponState.unfinished);   //未完成
                    couponOfUser.set('phoneNumberOfUser',phoneNumber);

                    if (ids && ids.length>0) //用户存在
                    {
                        if (!__production) console.log("用户存在");
                        var user = AL.object('_User',ids[0]);
                        couponOfUser.set('user',user);
                    }
                    else   //用户不存在
                    {
                        if (!__production) console.log("用户不存在");
                    }

                    couponOfUser.save().then(function(couponsOfUser){

                        if (couponsOfUser)
                        {
                            AL.done(res,faceValue);
                        }
                        else
                        {
                            AL.done(res,0,AL.error(777435,"网络异常,请稍后重试。"));
                        }

                    },function(error){
                        AL.done(res,0,error);
                    });

                });
            }
        });

        //AL.findQueryWithoutData(userQ,null,function(ids,error){
        //
        //    if (error)
        //    {
        //        AL.done(res,false,error);
        //    }
        //    else if (ids && ids.length>0)  //用户存在
        //    {
        //        if (!__production) console.log("用户存在");
        //
        //        // 用户是否领过这个红包
        //        var user = AL.object('_User',ids[0]);
        //        var couponOfUserQ = new AV.Query(AL.config.CouponOfUser);
        //        couponOfUserQ.equalTo("coupon",couponOfPhone);
        //        couponOfUserQ.equalTo('user',user);
        //
        //        AL.countQuery(couponOfUserQ,function(number,error){
        //
        //            if (error) //异常
        //            {
        //                AL.done(res,false,error);
        //            }
        //            else if (number>=couponOfPhoneLimitCount) //已经领过了
        //            {
        //                if (!__production) console.log("已经领过了");
        //                AL.done(res,error==null,AL.error(777245,"已经领过了,下次再来吧"));
        //            }
        //            else   //没领过 可以领
        //            {
        //                if (!__production) console.log("没领过 可以领");
        //                var couponOfUser = new AL.config.CouponOfUser();
        //                couponOfUser.set('user',user);
        //                couponOfUser.set('coupon',couponOfPhone);
        //                couponOfUser.set('faceValue',AL.getRandomNumberWithRange(50,100));
        //                couponOfUser.set('expirationAt',couponOfPhoneExpirationAt);
        //                couponOfUser.set('type',AL.config.ALCouponType.bloom);
        //                couponOfUser.set('state',AL.config.ALCouponState.unfinished);   //未完成
        //                couponOfUser.save().then(function(couponsOfUser){
        //
        //                    if (couponsOfUser)
        //                    {
        //                        AL.done(res,true);
        //                    }
        //                    else
        //                    {
        //                        AL.done(res,false,AL.error(777435,"网络异常,请稍后重试。"));
        //                    }
        //                },function(error){
        //                    AL.done(res,false,error);
        //                });
        //            }
        //        });
        //
        //    }
        //    else  //用户不存在
        //    {
        //        if (!__production) console.log("用户不存在");
        //
        //        // 这个号码是否领过这个红包
        //        var couponOfUserQ = new AV.Query(AL.config.CouponOfUser);
        //        couponOfUserQ.equalTo("phoneNumberOfUser",phoneNumber);
        //
        //        AL.countQuery(couponOfUserQ,function(number,error){
        //
        //            if (error) //异常
        //            {
        //                AL.done(res,false,error);
        //            }
        //            else if (number>=couponOfPhoneLimitCount) //已经领过了
        //            {
        //                if (!__production) console.log("已经领过了");
        //                AL.done(res,error==null,AL.error(777245,"已经领过了,下次再来吧"));
        //            }
        //            else   //没领过 可以领
        //            {
        //                if (!__production) console.log("没领过 可以领");
        //                var couponOfUser = new AL.config.CouponOfUser();
        //                couponOfUser.set('phoneNumberOfUser',phoneNumber);
        //                couponOfUser.set('coupon',couponOfPhone);
        //                couponOfUser.set('faceValue',AL.getRandomNumberWithRange(50,100));
        //                couponOfUser.set('expirationAt',couponOfPhoneExpirationAt);
        //                couponOfUser.set('type',AL.config.ALCouponType.bloom);
        //                couponOfUser.set('state',AL.config.ALCouponState.unfinished);   //未完成
        //                couponOfUser.save().then(function(couponsOfUser){
        //
        //                    if (couponsOfUser)
        //                    {
        //                        AL.done(res,true);
        //                    }
        //                    else
        //                    {
        //                        AL.done(res,false,AL.error(777435,"网络异常,请稍后重试。"));
        //                    }
        //                },function(error){
        //                    AL.done(res,false,error);
        //                });
        //            }
        //        });
        //
        //    }
        //});
    });

    //1.3.2 领取优惠券(手机号)(注册时触发)
    // http://192.168.199.232:3000/coupon/get/phoneNumber?phoneNumber=15812345678&userId=54c620dfe4b068d1ee40ab15
    var getCouponOfPhoneNumber = function(userId, phoneNumber, done) {

        var couponOfUserQ = new AV.Query(AL.config.CouponOfUser);
        couponOfUserQ.equalTo("phoneNumberOfUser",phoneNumber);
        couponOfUserQ.doesNotExist("user");
        AL.findQueryWithoutData(couponOfUserQ,null,function(couponOfUserIds,error){

            if (error)   //异常
            {
                if (!__production) console.log("异常");
                if (done) done(false,error);

            }
            else if (couponOfUserIds && couponOfUserIds.length>0)  //有未领取优惠券
            {
                if (!__production) console.log("有未领取优惠券");

                var couponOfUserList = [];
                for (var i in couponOfUserIds)
                {
                    var couponOfUser = AL.object('CouponOfUser',couponOfUserIds[i]);
                    couponOfUser.set('user',AL.object('_User',userId));
                    couponOfUserList.push(couponOfUser);
                }
                AL.saveAll(couponOfUserList,function(list,error){
                    if (done) done(error==null,error);
                });
            }
            else  //没有有未领取优惠券
            {
                if (!__production) console.log("没有有未领取优惠券");
                if (done) done(true);
            }
        });
    };

    app.all("/coupon/vip/add", function(req, res){

        for (var i in AL.config.phoneOfWechatNewsVIP)
        {
            var phoneNumber = AL.config.phoneOfWechatNewsVIP[i];
            res.redirect("http://192.168.199.232:3000/coupon/add/phoneNumber?couponId=54d5d8c1e4b0abb8936bca0f&phoneNumber="+phoneNumber)
        }

    });

    app.all("/coupon/vip/get", function(req, res){

        for (var i in AL.config.phoneOfWechatNewsVIP)
        {
            var phoneNumber = AL.config.phoneOfWechatNewsVIP[i];
            var userQ = new AV.Query(AL.config.User);
            userQ.equalTo("phoneNumber",phoneNumber);
            AL.findQueryWithoutData(userQ,null,function(userIds,error){

                if (error)   //异常
                {
                    if (!__production) console.log("异常");
                    if (done) done(false,error);

                }
                else if (userIds && userIds.length>0)  //有未领取优惠券
                {
                    if (!__production) console.log("有未领取优惠券");
                    res.redirect("http://192.168.199.232:3000/coupon/get/phoneNumber?phoneNumber="+phoneNumber+"&userId="+userIds[0].id);
                }
                else  //没有有未领取优惠券
                {
                    if (!__production) console.log("没有有未领取优惠券");
                    if (done) done(true);
                }
            });
        }

    });

    app.all("/coupon/get/phoneNumber?", function(req, res){

        if (!__production) console.dir("1.3.2 领取优惠券");

        var phoneNumber = req.param("phoneNumber");
        var userId = req.param("userId");

        if (!phoneNumber || phoneNumber.length==0 || !userId || userId.length==0)
        {
            return AL.done(res,null,AL.error(777120,"参数错误"));
        }

        getCouponOfPhoneNumber(userId, phoneNumber, function(success,error){
             AL.done(res,success,error);
        });
    });

    //3 移除优惠券
    app.all("/coupon/removeCouponFromUser", function(req, res){

        var couponOfUserId = req.body.couponOfUserId;
        var userId = req.body.userId;

        if (!couponOfUserId || couponOfUserId.length==0 || !userId || userId.length==0)
        {
            AL.done(res,null,AL.error(777110,"参数错误"));
            return;
        }

        AV.Object.createWithoutData('CouponOfUser',couponOfUserId).fetch().then(function(couponOfUser){

            if (couponOfUser.get('user').id == userId)
            {
                couponOfUser.destroy().then(function(){

                    AL.done(res,true);

                },function(error){
                    AL.done(res,false,error);
                });
            }
            else
            {
                //不是本人的优惠券
                AL.done(res,false,AL.error(777111, "权限不足"));
            }

        },function(error){

            AL.done(res,false,error);
        });

    });

    //4 查询 通用(评论) 优惠
    app.all("/coupon/searchCouponOfCommon", function(request, response) {
    //AV.Cloud.define("searchCouponOfCommon", function(request, response) {

        var limit = parseInt(request.body.limit);
        var skip = parseInt(request.body.skip);

        var query = searchCouponQuery([],[],[AL.config.ALCouponType.bloom],limit,skip);
        AL.findQueryWithoutData(query, null, function(ids, error){
            AL.done(response,ids,error);
        });
    });

    //5 查询 商店 优惠
    app.all("/coupon/searchCouponOfStore", function(request, response) {
    //AV.Cloud.define("searchCouponOfStore", function(request, response) {

        var limit = parseInt(request.body.limit);
        var skip = parseInt(request.body.skip);
        var storeId = request.body.storeId;

        var query = searchCouponQuery([storeId],[],[AL.config.ALCouponType.store],limit,skip);
        AL.findQueryWithoutData(query, null, function(ids, error){
            AL.done(response,ids,error);
        });
    });

    //6 查询 商品 优惠
    app.all("/coupon/searchCouponOfCommodity", function(request, response) {
    //AV.Cloud.define("searchCouponOfCommodity", function(request, response) {

        var limit = parseInt(request.body.limit);
        var skip = parseInt(request.body.skip);
        var commodityIds = JSON.parse(request.body.commodityIds);

        var query = searchCouponQuery([], commodityIds, [AL.config.ALCouponType.commdity], limit, skip);
        AL.findQueryWithoutData(query, null, function(ids, error){
            AL.done(response,ids,error);
        });

    });

    //7 查询用户领过的优惠券
    app.all("/coupon/searchCouponOfUser", function(request, response) {
    //AV.Cloud.define("searchCouponOfUser", function(request, response) {

        console.log("查询用户领过的优惠券");

        var limit = parseInt(request.body.limit);
        var skip = parseInt(request.body.skip);
        var userId = request.body.userId;
        var types = JSON.parse(request.body.types);
        var commodityIds = JSON.parse(request.body.commodityIds);
        var useRestriction = parseInt(request.body.useRestriction);
        var states = JSON.parse(request.body.states);

        //console.dir(types);
        //console.dir(useRestriction);
        //console.dir(states);

        //查询 我的 优惠券
        var searchCouponOfUserQuery = function (commodityIds, useRestriction, userId, types, states, limit, skip){

            var couponOfUserQ = new AV.Query(CouponOfUser);

            couponOfUserQ.greaterThan('expirationAt',new Date());
            couponOfUserQ.exists('user');

            couponOfUserQ.notEqualTo("isDeleted",true);
            couponOfUserQ.lessThan('state',AL.config.ALCouponState.isUsered);

            if (limit>0 && limit!='NaN') couponOfUserQ.limit(limit);
            if (skip>0 && skip!='NaN') couponOfUserQ.skip(skip);
            if (userId && userId.length>0) couponOfUserQ.equalTo('user',AV.Object.createWithoutData('_User',userId));
            if (types && AV._.isArray(types) && types.length>0 && types.indexOf(0)==-1)
            {
                couponOfUserQ.containedIn('type',types);
            }
            if (states && AV._.isArray(states) && states.length>0 && states.indexOf(0)==-1)
            {
                couponOfUserQ.containedIn('state', states);
            }

            //console.dir(commodityIds);

            if (commodityIds.length>0 || useRestriction>0)
            {
                var couponQ = searchCouponQuery([], commodityIds, types, 0, 0);
                couponQ.lessThanOrEqualTo('useRestriction',useRestriction);
                //couponQ.equalTo('useRestriction',0);

                //var couponQ = new AV.Query(Coupon);
                //couponQ.equalTo('useRestriction',0);
                //couponQ.find().then(function(coupons){
                //    console.dir(coupons.length);
                //    console.dir(coupons[0].id)
                //});

                couponOfUserQ.matchesQuery('coupon',couponQ);
            }

            couponOfUserQ.descending('type');
            couponOfUserQ.descending('faceValue');

            return couponOfUserQ;
        };

        var query = searchCouponOfUserQuery(commodityIds,useRestriction,userId, types, states,limit,skip);
        AL.findQueryWithoutData(query, null, function(ids, error){
            AL.done(response,ids,error);
        });
    });

    app.all("/test/coupon/searchCouponOfUser", function(request, response) {

        var searchCouponOfUserQuery = function (userId, types, states, limit, skip){

            var couponOfUserQ = new AV.Query(CouponOfUser);

            couponOfUserQ.greaterThan('expirationAt',new Date());
            couponOfUserQ.exists('user');

            couponOfUserQ.notEqualTo("isDeleted",true);
            //couponOfUserQ.lessThan('state',3);

            if (limit>0 && limit!='NaN') couponOfUserQ.limit(limit);
            if (skip>0 && skip!='NaN') couponOfUserQ.skip(skip);
            if (userId && userId.length>0) couponOfUserQ.equalTo('user',AV.Object.createWithoutData('_User',userId));
            if (types && AV._.isArray(types) && types.length>0 && types.indexOf(0)==-1)
            {
                console.dir(types);
                couponOfUserQ.containedIn('type',types);
            }
            if (states && AV._.isArray(states) && states.length>0 && states.indexOf(0)==-1)
            {
                console.dir(states);
                couponOfUserQ.containedIn('state', states);
            }

            couponOfUserQ.descending('type');
            couponOfUserQ.descending ('faceValue');

            return couponOfUserQ;
        };

        var query = searchCouponOfUserQuery("5447a708e4b03f69b4dc4497",[1,2,10],[1,2],30,0);

        AL.findQueryWithoutData(query, null, function(ids, error){
            AL.done(response,ids,error);
        });

    });

    //8 获取分享优惠券链接
    app.all("/coupon/getShareCouponOfUserURL", function(request, response) {

        //console.log("getShareCouponOfUserURL");
        var couponId = request.body.couponId;
        var userInfo = JSON.parse(request.body.userInfo);
        var voiceId = request.body.voiceId;

        console.dir(userInfo);

        if (!couponId || couponId.length==0 || !userInfo || !userInfo.nickname)
        {
            AL.done(response,null,AL.error(777110,"参数错误"));
            return;
        }

        var couponOfUser = AV.Object.createWithoutData('CouponOfUser',couponId);
        couponOfUser.set('owner',userInfo);
        if (voiceId && voiceId.length>0) couponOfUser.set('voice',AV.Object.createWithoutData('Voice',voiceId));
        couponOfUser.save().then(function(couponOfUser){

            //response.success(URL);
            console.log(shareURL(couponId,1));
            AL.done(response,shareURL(couponId,1));

        },function(error){
            //response.error(ALERROR(error.code, error.messages));
            AL.done(response,null,error);
        });
    });

    // 0 demo
    app.get('/coupon/demo', function (request, response) {
        //response.end("wechat-demo");

        var couponOfUserQ = new AV.Query(CouponOfUser);
        couponOfUserQ.include('voice');
        couponOfUserQ.include('coupon');
        couponOfUserQ.equalTo('objectId',undefined);
        couponOfUserQ.first().then(function(couponOfUser){
                    console.dir(couponOfUser.id);
        },function(error){
            console.dir(error);
        });
        return;

        var  couponOfUserId = "54880ccbe4b0446fa4fdf667";
        var userInfo = {
            "openid":"oI6zGji3i88cexFjxvX03FSpjQ4Y",
            "nickname":"蹦个大青蛙",
            "sex":1,
            "language":"zh_CN",
            "city":"Haidian",
            "province":"Beijing",
            "country":"CN",
            "headimgurl":"http:\\/\\/wx.qlogo.cn\\/mmopen\\/SDX5alibYgV0h5sibm4lISXjl3tl3rLBnUsk82CQtibmV9Jns9rJEcnDqicDLmQ2ZRvpEmRmNcen5qSnuH0t1THq7OnF56A2Bgca\\/0",
            "privilege":[],
            "unionid":"oLZRBtxIR6K9s4qfOywqJhOUFNpE",
            "state":0
        };

        createCp2cDict(couponOfUserId,userInfo,function(couponDict,error){


            if (error)
            {
                console.dir(error);
                return response.redirect("/404");
            }

            //var dict = {'couponState':couponState,'list':[{'nickname':'小明','desc':'啊啊啊啊'},{'nickname':'xiaoli','desc':'222222'}]};
            //response.render("cloud/dev_views/learn/hello",{message:"hello world !"});

            //var wxData = {
            //    "appId"     :   wechatOfBloomConfig.appId, // 服务号可以填写appId
            //    "imgUrl"    :   "http://ac-g405gbtt.qiniudn.com/LlxS4BJfApnhKyrvnXciXQiq1Hl6HO7JduGK0Ozy.jpg" ,
            //    "link"      :   AL.domain+"/wechat/cp2c/coupons/1/"+couponOfUserId,
            //    "desc"      :   "块来帮我抢小熊啊！！！" ,
            //    "title"     :   "KUMAMA"
            //};
            //console.dir(couponDict.wxData);
            response.render("public/kuma/index",{dict:JSON.stringify(couponDict), domain:AL.domain});
            //response.render('public/test/index');
        });

        //console.dir(JSON.stringify({swithName:0,nickname:"我是喵星呱"}));
        //response.render("public/kuma/index",{dict:JSON.stringify({swithName:0,nickname:"我是喵星呱"})});
        //response.render("public/demo/index");
    });

    //10 点击分享优惠券的链接 众筹小熊 OAuth
    app.all('/coupon/cp2c/share/:oAuthState/:couponOfUserId?', function (request, response) {

        //console.dir("众筹小熊");

        lookShareCoupon(request,response);

        //  console.log(request.method);
        //  request.method == 'GET'
        //   request.method == 'POST'

    });

    //10 点击分享优惠券的链接 众筹小熊 OAuth
    // http://flowerso2o.avosapps.com/coupon/cp2c/share/1234567
    app.all('/coupon/cp2c/kuma/share/:couponOfUserId?', function (request, response) {

        console.log("众筹小熊");

        var refresh_token = request.query.refresh_token;

        var couponOfUserId = request.params.couponOfUserId;

        if (!couponOfUserId)
        {
            response.end("参数错误");
        }

        if (refresh_token && refresh_token.length > 0)
        {
            /*
             {
                "access_token":"OezXcEiiBSKSxW0eoylIeND688xthm5WzsYgW6Lfi9ZtvCyhRPDu3Dpc0l8qZH7u-KVVlo9JCzO3ZOvInJ_qKYAm0pdYD1hm9Vw-vR84Cpy02LXP9vOD6rcvwq4yQqKDB8b_OyNsYaPk-OzRmpu6BQ",
                 "expires_in":7200,
                "refresh_token":"OezXcEiiBSKSxW0eoylIeND688xthm5WzsYgW6Lfi9ZtvCyhRPDu3Dpc0l8qZH7uXQQ-DaEkBPriYffxj35eyqDZmEb6JbZ_70hCif_uUmpYBdDB7QINrY9WlP97Xy_RhVrVAukTci54g7V6wu8Ytg",
                "openid":"oI6zGji3i88cexFjxvX03FSpjQ4Y",
                "scope":"snsapi_userinfo"
             }
             */
            return oauth.refreshOpenId(refresh_token,function(result,error){

                oauth.getUserInfo(result,function(result,error){

                    if (error || !result)
                    {
                        oauth.getRefreshToken(AL.domain+request.url, null, response);
                    }
                    else
                    {
                        //return response.end(JSON.stringify(result).toString("utf-8"));
                        createCp2cDict(couponOfUserId, result, function(couponDict,error){

                            if (error)
                            {
                                response.end(JSON.stringify(error));
                                return response.redirect("/404");
                            }

                            response.render("public/kuma/index",{dict:couponDict,wxData:{},domain:AL.domain});

                        });
                    }
                });
            });
        }
        else
        {
            oauth.getRefreshToken(AL.domain+request.url, null, response);
        }
    });

    app.all('/wechat/demo?',function(request, response){

        //console.dir(request.host);
        //console.dir(request.url);
        console.dir(request);
        //console.dir(response);
        console.dir("host : "+request.headers.host);
        console.dir("url : "+request.url);
    });

    //app.all('/wechat/oauth/demo?',function(request, response){
    //
    //    var code = request.query.code;
    //    var wode = request.query.wode;
    //
    //    console.log("URL"+request.url);
    //
    //    if (code)
    //    {
    //        response.redirect(wode);
    //    }
    //
    //    return oauth.Authorize(AL.domain+"wechat/oauth/getUserInfo?wode=http://www.baidu.com/", null, response);
    //    //https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
    //    ////李洋
    //    //var result = {"openid":"ouCvVs9eNqsmuf8sSk0BKhHM_4Ds","access_token":"OezXcEiiBSKSxW0eoylIeOBbVoPNU5vDS1ns6p2rnXbP3z9wl1likrornPd4GKWWIlDaFfqKBjTcsCwtz7IKLjQUSNOkS3vM5efU0oxPYsw1t-h_F7_UEBoY17etGmhxuFA9hWGqtNljF_jmWGWfyA","expires_in":7200,"refresh_token":"OezXcEiiBSKSxW0eoylIeOBbVoPNU5vDS1ns6p2rnXbP3z9wl1likrornPd4GKWWnyH_C2KM6D38wJufmfbJBSOAjpI4Vc0Z8nJ5vITYND-0zuXwAxRSRmViZVmvpszzkVziA-Z-GDb2yiw6IIZ1oA","scope":"snsapi_base,snsapi_userinfo,"}
    //    //
    //    ////王欢
    //    //result = {"openid":"ouCvVs5eXLy6ZdThC2q4LWQkHPlw","access_token":"OezXcEiiBSKSxW0eoylIeOBbVoPNU5vDS1ns6p2rnXbDpblZMJgqgws9nyEL4Ewmk_bmP9_IUqRRRw13WIctFvQpqAmgu36f9SuyNXiYciCIleyvtKBZMmwGs02BIft9RFVvVnQsgvLMsi72jf36nQ","expires_in":7200,"refresh_token":"OezXcEiiBSKSxW0eoylIeOBbVoPNU5vDS1ns6p2rnXbDpblZMJgqgws9nyEL4Ewm-26xinKKBn5y_kc1DOIjx_n6Cit3qFUYjnFAe8moKrqJde7Aos-tQggjuPbWeW5lxID7ebYzGIQdd20oEKYqPg","scope":"snsapi_base,"};
    //    //
    //    //oauth.getUserInfo(result,function(result,error){
    //    //
    //    //    return AL.done(response,result,error);
    //    //
    //    //});
    //
    //});

    //var getUserInfo = function(redirectURL,scope,res){
    //
    //    var getUserInfoURL = AL.domain+"wechat/oauth/userInfo?redirect="+redirectURL+"scope="+scope;
    //    console.dir("getUserInfoURL : "+getUserInfoURL);
    //    res.redirect(getUserInfoURL);
    //};



    var lookShareCoupon = function(request,response){

        var couponOfUserId = request.params.couponOfUserId;
        var oAuthState = parseInt(request.params.oAuthState);

        if (!couponOfUserId || couponOfUserId.length == 0) {
            return response.end("couponOfUserId : "+couponOfUserId);
        }

        if (!AV._.isNumber(oAuthState) || oAuthState<=0 || oAuthState>=4)
        {
            return response.end("couponOfUserId : "+couponOfUserId);
        }

        // 授权 获取 code
        if (oAuthState==1)
        {
            //console.log(shareURL(couponOfUserId,true));
            //console.log(1);
            oauth.Authorize(shareURL(couponOfUserId,2), "snsapi_base", response);
        }
        // 使用code 获取 openid+refresh_token
        else if (oAuthState==2)
        {
            //var queryObj = querystring.parse(url.parse(request.url).query);
            //var code = queryObj.code;

            //console.log(2);
            var code = request.query.code;

            //console.dir("code : "+code);

            if (!code || code.length == 0 ) {
                oauth.Authorize(shareURL(couponOfUserId,2), "snsapi_base", response);
                //response.redirect(shareURL(couponOfUserId,1));
                return;
            }

            /*
             {
             "access_token":"OezXcEiiBSKSxW0eoylIeND688xthm5WzsYgW6Lfi9ZtvCyhRPDu3Dpc0l8qZH7u-KVVlo9JCzO3ZOvInJ_qKYAm0pdYD1hm9Vw-vR84Cpy02LXP9vOD6rcvwq4yQqKDB8b_OyNsYaPk-OzRmpu6BQ",
             "expires_in":7200,
             "refresh_token":"OezXcEiiBSKSxW0eoylIeND688xthm5WzsYgW6Lfi9ZtvCyhRPDu3Dpc0l8qZH7uXQQ-DaEkBPriYffxj35eyqDZmEb6JbZ_70hCif_uUmpYBdDB7QINrY9WlP97Xy_RhVrVAukTci54g7V6wu8Ytg",
             "openid":"oI6zGji3i88cexFjxvX03FSpjQ4Y",
             "scope":"snsapi_userinfo"
             }
             */
            oauth.getOpenId(code,function(result,error){

                var refresh_token = result.refresh_token;
                //console.dir("refresh_token : "+refresh_token);

                if (!error && refresh_token)
                {
                    var URL = shareURL(couponOfUserId,3)+"?refresh_token="+refresh_token;
                    //console.dir("URL : "+URL);

                    //URL = '\<html\>\<head\>\<meta http-equiv="Content-type" name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width"\>\</head\>\<body\>'
                    //+ '\<script language="javascript" type="text/javascript"\>'
                    //    //+  'var URL = document.getElementById("URL").innerHTML.replace(/&amp;/g,"&");'
                    //+  'window.location.href = '+'"'+URL+'";'
                    //+  '\</script\>'
                    //+  '\</body\>\</html\>';

                    //response.end(URL);
                    response.redirect(URL);
                }
                else
                {
                    response.end(error);
                }
            });
        }
        else if (oAuthState==3)
        {

            var refresh_token = request.query.refresh_token;
            var couponOfUserId = request.params.couponOfUserId;

            console.log("refresh_token3 : "+refresh_token);
            console.log("couponOfUserId3 : "+couponOfUserId);
            /*
             {
             "access_token":"OezXcEiiBSKSxW0eoylIeND688xthm5WzsYgW6Lfi9ZtvCyhRPDu3Dpc0l8qZH7u-KVVlo9JCzO3ZOvInJ_qKYAm0pdYD1hm9Vw-vR84Cpy02LXP9vOD6rcvwq4yQqKDB8b_OyNsYaPk-OzRmpu6BQ",
             "expires_in":7200,
             "refresh_token":"OezXcEiiBSKSxW0eoylIeND688xthm5WzsYgW6Lfi9ZtvCyhRPDu3Dpc0l8qZH7uXQQ-DaEkBPriYffxj35eyqDZmEb6JbZ_70hCif_uUmpYBdDB7QINrY9WlP97Xy_RhVrVAukTci54g7V6wu8Ytg",
             "openid":"oI6zGji3i88cexFjxvX03FSpjQ4Y",
             "scope":"snsapi_userinfo"
             }
             */
            oauth.refreshOpenId(refresh_token,function(result,error){

                if (error)
                {
                    response.end(error);
                    return;
                }

                oauth.getUserInfo(result,function(result,error){

                    if (error)
                    {
                        oauth.Authorize(shareURL(couponOfUserId,2), "snsapi_base", response);
                    }
                    /*
                     * 判断当前状态 返回状态值
                     */

                    console.dir(result);
                    createCp2cDict(couponOfUserId, result, function(couponDict,error){

                        if (error)
                        {
                            console.dir(error);
                            return response.redirect("/404");
                        }

                        //if (couponOfUserId == '5478244be4b0fd86ff7de93e')
                        //{
                        //    response.render("public/test/index",{dict:JSON.stringify({}),wxData:JSON.stringify({})});
                        //    return;
                        //}

                        //console.log({dict:JSON.stringify(couponDict),wxData:JSON.stringify(couponDict.wxData)});

                        response.render("public/kuma/index",{dict:couponDict,wxData:couponDict.wxData,domain:AL.domain});
                        //response.render("public/kuma/index",{dict:JSON.stringify(couponDict),wxData:JSON.stringify(couponDict.wxData)});
                    });

                });

            });

        }

    };

    // 求晒图
    app.all('/coupon/cp2c/begShowPhoto/:couponOfUserId?', function(request, response){

        var couponOfUserId = request.params.couponOfUserId;

        if (!couponOfUserId || couponOfUserId.length==0)
        {
            AL.done(response,null,AL.error(777111,"参数错误 params : "+JSON.stringify(request.params)));
        }

        var couponOfUser = AV.Object.createWithoutData('CouponOfUser',couponOfUserId);
        console.log(couponOfUserId);
        couponOfUser.increment('begShowPhotoNumber',1);
        couponOfUser.save().then(function(couponOfUser){
            AL.done(response,couponOfUser!=null,null);
        },function(error){
            AL.done(response,null,error);
        });
    });

    // 帮他筹
    app.all('/coupon/cp2c/support/?', function(request, response){


        console.dir("开始筹集");

        if (request.method == 'GET')
        {
            response.end(request.method);
            return;
        }

        var couponOfUserId = request.body.couponOfUserId;
        var userInfo = JSON.parse(request.body.userInfo);

        var unionid =  userInfo.unionid;

        var openid = userInfo.openid;

        if (!openid)
        {
            return AL.done(response,null,AL.error(777111,"参数错误"));
        }

        if (!unionid)
        {
            return oauth.getRefreshToken(AL.domain+request.url, "snsapi_userinfo", response);
        }

        var getNumber = function() {

            var  number = 0;
            switch (AL.getRandomNumberWithRange(0,12))
            {
                case 0:
                    number = -30;
                    break;
                case 1:
                    number = -20;
                    break;
                case 2:
                    number = -10;
                    break;
                case 3:
                    number = 10;
                    break;
                case 4:
                    number = 20;
                    break;
                case 5:
                    number = 30;
                    break;
                case 6:
                    number = 40;
                    break;
                case 7:
                    number = 50;
                    break;
                case 8:
                    number = 60;
                    break;
                case 9:
                    number = 70;
                    break;
                case 10:
                    number = 80;
                    break;
                case 11:
                    number = 90;
                    break;
                case 12:
                    number = 100;
                    break;
                default:
                    break;
            }
            //    switch (arc4random()%3) {
            //        case 0:
            //            number += -5;
            //            break;
            //        case 1:
            //            number += 0;
            //            break;
            //        case 2:
            //            number += 5;
            //            break;
            //        default:
            //            break;
            //    }

            return number*100;
        };

        var supportToCoupon = function(couponOfUser,userInfo,done){

            //console.dir("supportToCoupon");

            var faceValueOfMax = couponOfUser.get('coupon').get('faceValueOfMax');
            var faceValue = couponOfUser.get('faceValue');

            //console.dir("faceValueOfMax : "+faceValueOfMax);
            //console.dir("faceValue : "+faceValue);

            var diffValue = faceValueOfMax-faceValue;
            if (diffValue<=0)
            {
                 //已经达到到上限
                console.dir("已经达到到上限");
                couponOfUser.set('state',AL.config.ALCouponState.finished);
                couponOfUser.save();
                done(null,AL.error(777156,"活动已完成"));
                return;
            }

            //var price = 0;
            //do{
            //    price = (AL.getRandomNumberWithRange(-1,5)*10)+(AL.getRandomNumberWithRange(0,1)?0:5);
            //}while(price==0);
            //price = price*100;

            var price = getNumber();

            if (price>diffValue)
            {
                //达到上限
                price = diffValue;
            }

            //console.dir("price : "+price);

            var openids = couponOfUser.get('openids')?couponOfUser.get('openids'):[];
            var userList = couponOfUser.get('userList')?couponOfUser.get('userList'):[];

            userInfo["price"] = price;

            //unionids.splice(0,0,unionid);
            //userList.splice(0,0,userInfo);


            //unionids.insert(0,unionid);
            //userList.insert(0,userInfo);

            //unionids.push(unionid);
            //userList.push(userInfo);

            //将参数添加到原数组开头，并返回数组的长度
            //unionids.unshift(unionid);
            //userList.unshift(userInfo);

            openids.push(userInfo.openid);
            userList.push(userInfo);

            couponOfUser.set('openids',openids);
            couponOfUser.set('userList',userList);

            couponOfUser.set('faceValue',couponOfUser.get('faceValue')+price);

            if (price == diffValue)
            {
                couponOfUser.set('state',AL.config.ALCouponState.finished);
            }

            //console.dir(unionids);
            //console.dir(userList);

            couponOfUser.save().then(function(couponOfUser){

                done(userInfo,null);

            },function(error){

                done(null,error);
            });

        };

        var couponOfUserQ = new AV.Query(CouponOfUser);
        couponOfUserQ.include('coupon');
        couponOfUserQ.equalTo('objectId',couponOfUserId);
        couponOfUserQ.first().then(function(couponOfUser){

            if (!couponOfUser)
            {
                AL.done(response,null,AL.error(777114,"优惠券不存在"));
                return;
            }

            var openids = couponOfUser.get('openids')?couponOfUser.get('openids'):[];

            //console.dir("拥有者 : "+couponOfUser.get('owner').openid);
            //console.dir("已筹人 : "+openids);

            if (openids.indexOf(openid)>-1)
            {
                //参与过
                //console.log("参与过");
                AL.done(response,null,AL.error(777210,"你已经参与过了"));
            }
            else
            {
                //console.log("没参与过");
                //没参与过
                supportToCoupon(couponOfUser,userInfo,function(userInfo,error){
                    AL.done(response,userInfo,error);
                });
            }

        },function(error){

            AL.done(response,null,error);
        });
    });

    app.all('/coupon/getDefauleCouponVoice', function(request, response){

        var voiceIds = ["547855efe4b00bbe01a1d2de",
        "54785632e4b0aab9586d4a29",
        "54785648e4b016095dc0df51",
        "54785650e4b00bbe01a1d9e7"];
        AL.done(response,voiceIds);

    });

    AV.Cloud.afterSave("_User", function(request) {

        console.log("注册用户+优惠券");
        var user = request.object;
        var coupon = AL.object('Coupon',"54c5f5e5e4b068d1ee3c8f54");
        coupon.fetch().then(function(coupon){
            addCouponOfUser(coupon, user, "", null);
        });

        var userId = user.id;
        var phoneNumber = user.get('phoneNumber');
        getCouponOfPhoneNumber(userId,phoneNumber);
    });

    // 判断活动是否已完成
    //function checkCouponCompelteState(couponOfUser, userInfo, done){
    //
    //    if (couponOfUser.get('faceValue') >= couponOfUser.get('coupon').get('faceValueOfMax') || couponOfUser.isUserd)
    //    {
    //       //金额已满足 or 优惠券已使用
    //        checkCouponCompelteState(couponOfUser, userInfo, done);
    //    }
    //    else
    //    {
    //        // 金额不满足
    //        // 查看有没有订单使用
    //        var orderQ = new AV.Query(CommodityOrder);
    //        orderQ.equalTo('couponOfUserIds',couponOfUser.id);
    //        orderQ.find().then(function(orders){
    //
    //            if (orders && orders.length>0)
    //            {
    //                var order = orders[0];
    //                //已使用
    //                var showPhotoToWechatMomentsQ = new AV.Query(ShowPhotoToWechatMoments);
    //                showPhotoToWechatMomentsQ.equalTo('fromObject.objectId',order.id);
    //                showPhotoToWechatMomentsQ.count().then(function(number){
    //
    //                    if (number>0)
    //                    {
    //                        //发现晒图
    //                        done(ALCouponState.ALCouponStateOfShowPhoto,null); //使用了晒图了 4
    //                    }
    //                    else
    //                    {
    //                        //没有晒图
    //                        done(ALCouponState.ALCouponStateOfIsUsered,null); //使用了没有晒图 3
    //                    }
    //
    //                },function(error){
    //                    //错误
    //                    done(ALCouponState.ALCouponStateOfUndefine,error); //错误 0
    //                });
    //            }
    //            else
    //            {
    //                //未使用过(没有晒图)
    //                done(ALCouponState.ALCouponStateOfUnfinished,null);  //未完成 1
    //            }
    //
    //        },function(error){
    //            //错误
    //            done(ALCouponState.ALCouponStateOfUndefine,error); //错误 0
    //        });
    //}
    //
    //
    ////判断我是否能帮他筹
    //function checkCouponSupportState(couponOfUser, userInfo, done){
    //
    //    // 自己的活动
    //    if (couponOfUser.get('userInfo').unionid == userInfo.unionid)
    //    {
    //
    //    }
    //}
};




