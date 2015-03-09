require("cloud/app.js");
moment = require('moment-timezone');

//var ALParse = require('cloud/ALParse.js');
//var ALCCP = require("cloud/ALCCP.js");


AV._initialize('g405gbttqiz691vvrnmeyua4c3444k6vudaiw5h8dteut3qc', 'w6nd1xgnur9yppvc5h7kdt8knit8sz1sdt8o55irx3s3uycy', '3wdbejwyy36sfa1lytoorhzaengunxuqnv04yzixn6jl1t8d');

AV.Cloud.useMasterKey();

var AL = require('cloud/lib/ALCommonUtil').AL();



//console.dir(AL.getDateFormat(moment(new Date()).add(-2,'days').tz('Asia/Shanghai').toDate()));

var arr = [1,2,3,4,5];
console.dir(arr.indexOf(-1));

var openIds = ["ofpYts0J8oFlGRCa_tS3lbJrjSUA"];
//console.dir(openIds.indexOf("")!=-1);

function html_decode(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&gt;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
}
console.dir(html_decode("Happy&nbsp;Valentine&#39;s&nbsp;Day."));

//var phoneNumber = "15812345678";
//var faceValue = 83;
//if (AL.config.phoneOfWechatNewsVIP.indexOf(phoneNumber)==-1)
//{
//    console.log(111);
//    faceValue = AL.getRandomNumberWithRange(70,100)*100;
//}
//else
//{
//    console.log(222);
//    faceValue = 400;
//}
//console.dir(faceValue);


//字符串比较大小
//console.log("20150206172013323969576927">"2015020617201332396957692");
//var content = "20150206172013323969576927";
//
//if (content.match(/^(2015[0-9]{22})$/g))
//{
//    var orderQ = new AV.Query(AL.config.CommodityOrder);
//    orderQ.equalTo('orderNO',content);
//    orderQ.include("delivery");
//    orderQ.first().then(function (order) {
//        if (order)
//        {
//            console.dir("发现order");
//
//            if (order.toJSON().delivery)
//            {
//                console.dir("发现delivery");
//                var delivery = order.get("delivery");
//
//                var deliveryCode = delivery.get("deliveryCode");
//                if (deliveryCode)
//                {
//                    console.dir("发现deliveryCode : "+deliveryCode);
//
//                }
//                else
//                {
//                    console.dir(3333);
//                }
//            }
//            else
//            {
//                console.dir(22222);
//            }
//        }
//
//    }, function (error) {
//
//       console.dir(1111);
//
//    });
//}
//else
//{
//    console.log(9999);
//}


//var date = new Date();
//date.setHours(date.getHours()-1);
//
//var date1 = moment(new Date()).add('hours',1).toDate();
//var date2 = moment(new Date()).add('hours',2).toDate();
////console.dir(date>new Date());
//console.dir(""+date2.getFullYear()+date2.getMonth()+date2.getDate());
//console.dir(AV._.isEmpty(new Date()));
//console.dir(AL.getDateFormat(new Date(),"YYYYMMDD"));

//var params = {"seller_id":"2088311757225694","seller_email":"wjusaappleid@126.com","gmt_close":"2014-10-30 19:34:22","sign":"KyrfAT3wQ1oMpmQRY+Ze+x6ukhwe7G1Mftk6BMB+FfNFOKs9N9YAABc6Z3dz2WcWQ06tjcG8Ya9wdngR2SX4gvUy4xBOApRKhboUOICX/xwua11u261z50zjJp1DuKMk3N8i3hjYbOFrTe217jsI8fo3KFs+r1nMWDbsthNNq58=","trade_no":"2014103039502788","use_coupon":"N","notify_type":"trade_status_sync","buyer_id":"2088312814806881","refund_status":"REFUND_SUCCESS","sign_type":"RSA","payment_type":"1","buyer_email":"18910557310","total_fee":"0.01","out_trade_no":"545205e0e4b07189da90f450","notify_id":"8aac57712d946ca3b555b5318b9a4b196w","gmt_payment":"2014-10-30 17:33:30","is_total_fee_adjust":"N","trade_status":"TRADE_CLOSED","gmt_refund":"2014-10-30 19:34:22","gmt_create":"2014-10-30 17:33:29","quantity":"1","discount":"0.00","notify_time":"2014-10-30 19:34:23","body":"这个一个测试订单","price":"0.01","subject":"测试订单"};
//
//var payment = new AL.config.CommodityPayment();
//payment.set("payMethod",AL.config.ALPayMethod.aliPay);
//payment.set("payData",params);
//payment.save();

//console.dir(AL.MD5("000000").toUpperCase());

//var orderId = "000054c60e98e4b068d1ee3ed024";
//if (orderId.length>24)
//    orderId = orderId = orderId.substring(orderId.length-24, orderId.length);
//console.dir(orderId);
//var params = {
//    customEvaluate:"有新的花艺师申请" +"\r\n"
//    +"昵称 : "+"蹦个大青蛙" +"\r\n"
//    +"联系方式 : "+"1111111"
//};
//AL.sendSMS(["15810513348"],'customEvaluate',params);

//AL.sendSMS(["15810513348"], "customEvaluate", {customEvaluate:"111\r\n222\r\n333"});

//console.dir("15810513348".match(/^1[3|4|5|8][0-9]\d{8}$/g));

//console.dir(parseInt(AL.getTimeStamp()/1000));
//console.dir(AL.guid());
//console.dir(arr.remove(2));

//console.dir("已被抢单111".toString('utf-8'));

/*
    测试微信模板消息
 */

//   console.dir(new Date("2015-2-14 00:00:00"));

//AL.sendSMS([15810513348],"deliveryStart",{orderNO:"1234567",deliveryCode:"000000",deliveryTime:"90"},function(){
//});
//AL.sendSMS();
//AL.httpPostRequest();

//54be26d1e4b0644caafe1dcd

//var URL = "http://api.weixin.qq.com/cgi-bin/message/template/send?access_token=rxyLiZ2noFdcyxixUuac_bYyPSkdJU3a8RfCbEixz_3xDFILujDAR4FVl6P1052I1dfWIAKnt3iePEuXlc5G1ZpMOBQFl1GDj3wyoI_AgTE";
//var body = { "touser": "ofpYts0J8oFlGRCa_tS3lbJrjSUA",
//    "template_id": "vsmxcksbfU_xdTnVavmhRQTtDLSgdD1ErPZAt0rhYes",
//    "topcolor": "#FF0000",
//    "url": "http://www.baidu.com",
//    "data":{
//        "productType": { "value": "您好，您已购买成功。", "color": "#173177" },
//        "name": { "value": "微信数据容灾服务", "color": "#173177" },
//        "number": { "value": "1分", "color": "#173177" },
//        "expDate": { "value": "2014-09-12", "color": "#173177" },
//        "remark": { "value": "请非工作日派送。", "color": "#173177" }
//    }
//};
//
//AL.httpPostRequest(URL,body,function(result,error){
//
//    if (error)
//    {
//        done(false,error);
//    }
//    else
//    {
//        var errcode = result.errcode;
//
//        var errmsg = result.errmsg;
//
//        if (errcode==0 && errmsg=="ok")
//        {
//            done(true);
//        }
//        else
//        {
//            done(false,AL.error(result.errcode,result.errmsg));
//        }
//    }
//});

//var wechat = require('cloud/routes/wechatDelivery');
//var orderQ = new AV.Query(AL.config.CommodityOrder);
//orderQ.equalTo('objectId', "54ca0db5e4b06b90a807266b");
//orderQ.find().then(function(orders){
//    console.dir("tz时间 :" + AL.getDateFormat(orders[0].get('deliveryFromDate')) +"  "+__production);
//    //wechat.wechatSendOrderInfoToFlowerStore(orders[0]);
//});

//
//

var xml = '<xml><ToUserName><![CDATA[gh_bb6803184839]]></ToUserName>'+
    '<FromUserName><![CDATA[ofpYts0J8oFlGRCa_tS3lbJrjSUA]]></FromUserName>'+
    '<CreateTime>1421641800</CreateTime>'+
    '<MsgType><![CDATA[text]]></MsgType>'+
    '<Content><![CDATA[1]]></Content>'+
    '<MsgId>6105905037828683768</MsgId>'+
    '</xml>';

var json = { xml:
                {   ToUserName: 'gh_bb6803184839', //开发者微信号
                    FromUserName: 'ofpYts0J8oFlGRCa_tS3lbJrjSUA', //发送方帐号（一个OpenID）
                    CreateTime: '1421644837', //消息创建时间 （整型）
                    MsgType: 'text',  //消息类型 text image voice video location link
                    Content: '透笼',   //内容
                    MsgId: '6105918081644362920' //消息id，64位整型
                }
            };

//console.dir(xml);

//AL.parse.xml2json(xml,function(json,error){
//    console.dir(json);
//});

//var AL = require('cloud/lib/ALCommonUtil').AL();
//
//var wechatAppID = AL.config.wechatOfBloomAshleyConfig.appId;
//var wechatAppSecret = AL.config.wechatOfBloomAshleyConfig.appSecret;
//var wechatToken = AL.config.wechatOfBloomAshleyConfig.token;
//var encodinAESKey = AL.config.wechatOfBloomAshleyConfig.encodingAESKey;
//
//var API = require('cloud/lib/wechatAPI').API(wechatAppID, wechatAppSecret, wechatToken),
//    oauth = API.OAuth,
//    accessToken = API.AccessToken
//    ;
//
//AL.parse.xml2json(xml,function(json,error){
//    console.dir(json);
//});

//API.wechatReceivedMessage(req,function(json,error){
//    console.dir(json);
//    res.end('');
//
//
//});

//var array = ['a1','2b','ccc'];
////var timeStr = moment().format('YYYYMMDDHHmmss');
//
//AV.Cloud.define("isProduction", function(request, response) {
//    response.success(__production);
//});
//
//AV.Cloud.define("hello", function(request, response) {
//
////    if (!__production) console.log(ALParse.json2xml({"Request":{"name":"小明","type":"猴子"}},null));
////    if (!__production) console.log(des.strEnc("1111","2222"));
////    if (!__production) console.log(des.strDec(des.strEnc("1111","2222"),"2222"));
////    "我是大西瓜 as SKDFWI 私たち".toLocaleLowerCase();
//
//
////    var grabFlower = AV.Object.createWithoutData("GrabFlower", "54464afce4b0b47ee08b48a9");
////    grabFlower.fetch().then(function(grabFlower){
////
////        console.dir(grabFlower.get("remainNumber"));
////
////        grabFlower.increment("remainNumber",-5);
////
////        console.dir(grabFlower.get("remainNumber"));
////
////        grabFlower.set("remainNumber",grabFlower.get("remainNumber")-6);
////
////        console.dir(grabFlower.get("remainNumber"));
////
////        response.success(grabFlower.get("remainNumber"));
////
////    },function(error){
////        response.error(error);
////    });
//
//    //md5
////    var crypto = require('crypto');
////    var content = '123456'
////    var md5 = crypto.createHash('md5');
////    md5.update(content);
////    var d = md5.digest('hex').toUpperCase();
////    response.success(d);
//
////    var out_trade_no = decode('out_trade_no', "UTF-8");
//    console.dir("hello");
//    response.success("hello");
//});

//if (__production)
//{

    //CommodityOfGift
    //AV.Cloud.afterUpdate("CommodityOfOrder", function(request) {
    //
    //    var commodityOfOrder = request.object;
    //    if (commodityOfOrder.get('state')==2)
    //    {
    //
    //    }
    //});



    AV.Cloud.afterUpdate("CounponOfUser", function(request) {

        var counponOfUser = request.object;
        console.dir(counponOfUser);
        if (counponOfUser.get('coupon').get('faceValueOfMax')<counponOfUser.get('faceValue'))
        {
            counponOfUser.set('faceValue',counponOfUser.get('coupon').get('faceValueOfMax'));
            counponOfUser.save();
        }
    });

    AV.Cloud.afterSave("ShowPhotoComment", function(request) {

        var showPhotoComment = request.object;

        var user = showPhotoComment.get('user');
        var showPhoto = showPhotoComment.get('showPhoto');

        user.increment('numberOfCommentShowPhotos',1);
        showPhoto.increment('numberOfComments',1);

        AV.Object.saveAll([user,showPhoto]);

    });

    AV.Cloud.afterUpdate("ShowPhotoComment", function(request) {

        var showPhotoComment = request.object;
        if (showPhotoComment.get('isDeleted'))
        {
            var user = showPhotoComment.get('user');
            var showPhoto = showPhotoComment.get('showPhoto');

            user.increment('numberOfCommentShowPhotos',-1);
            showPhoto.increment('numberOfComments',-1);

            AV.Object.saveAll([user,showPhoto]);
        }
    });
    //
    //AV.Cloud.afterSave("ShowPhotoRelation", function(request) {
    //
    //    var showPhotoRelation = request.object;
    //
    //    var user = showPhotoRelation.get('user');
    //    var showPhoto = showPhotoRelation.get('showPhoto');
    //
    //    var type = showPhotoRelation.get('type');
    //
    //    if (showPhotoRelation.get('type') == ALShowPhotoRelationType.favicon)
    //    {
    //        user.increment('numberOfFaviconShowPhotos',1);
    //        showPhoto.increment('numberOfFavicons',1);
    //
    //        AV.Object.saveAll([user,showPhoto]);
    //    }
    //});
    //
    //AV.Cloud.afterUpdate("ShowPhotoRelation", function(request) {
    //
    //    var showPhotoRelation = request.object;
    //
    //    if (showPhotoRelation.get('isDeleted') && showPhotoRelation.get('type') == ALShowPhotoRelationType.favicon)
    //    {
    //        var user = showPhotoRelation.get('user');
    //        var showPhoto = showPhotoRelation.get('showPhoto');
    //
    //        user.increment('numberOfFaviconShowPhotos',-1);
    //        showPhoto.increment('numberOfFavicons',-1);
    //
    //        AV.Object.saveAll([user,showPhoto]);
    //    }
    //});
//}



/**
 * for 循环异步请求传参测试
 */
AV.Cloud.define("demo", function(request, response){

    var Test = AV.Object.extend('Test');

    var testIds = ["546b3131e4b0a56c65067b72","546b306fe4b0600a5adc3472","546b3018e4b0a56c65065e59"];
    for (var i=0;i<3;++i)
    {
        var num = i;
        AV.Object.createWithoutData('Test',testIds[i]).fetch().then(function(test){

            // 这里的回调函数是异步请求返回后才走的(iOS会copy回调函数 js则是公用一个回调函数)
            // 这里用的是i的指针 for循环在不断改变i指向的位置 结果:i指向的位置是一样的都是3
            //test.set('number',i);
            //test.save();

            var num2 = i;
            console.log("i : "+i);
            console.log("num : "+num);

            //这样都是2
            test.set('number',num);
            test.save();
        });
    }
});

AV.Cloud.define("currentDate", function(req, res) {

    res.success(new Date().getTime());
});

AV.Cloud.define("checkOrderOfOverTime", function(req, res) {

    checkOrderOfOverTime(10,function(suc){
      if (suc)
      {
          console.log("清除过期订单 : 成功");
          res.success(true);
      }
      else
      {
          console.log("清除过期订单 : 失败");
          res.error(false);
      }
    });
});


//checkOrderOfOverTime(10);
//0 0 5,11,14,17 ? * *
function checkOrderOfOverTime(tryTimes,done){

    console.dir("checkOrderOfOverTime"+new Date());

    if (tryTimes<=0)
    {
        done(false,AL.error(777211,"请求次数超过限制"));
        return;
    }

    var currentDate = moment(new Date()).add('hours',1).toDate();

    var orderQ = new AV.Query(AL.config.CommodityOrder);
    orderQ.limit(1000);
    orderQ.equalTo('state',AL.config.ALCommodityOrderState.waitingForPay);
    orderQ.equalTo('payMethod',0);
    orderQ.lessThan('deliveryFromDate',currentDate);
    orderQ.find().then(function(orders){

        if (AV._.isArray(orders) && orders.length>0)
        {
            for (var i in orders)
            {
                orders[i].set('state',-1);
            }
            AV.Object.saveAll(orders).then(function(){

                if (orders.length==1000)
                {
                    checkOrderOfOverTime(tryTimes);
                }

                done(true);

            },function(error){
                checkOrderOfOverTime(--tryTimes);
            });
        }

    },function(error){
        checkOrderOfOverTime(--tryTimes);
    });
}


















































/****************
通用AVObject
*****************/
var User = AV.Object.extend('_User');
var Installation = AV.Object.extend('_Installation');

var UserRelation = AV.Object.extend('UserRelation');

var Follow = AV.Object.extend('Follow');
var Friend = AV.Object.extend('Friend');
var Message = AV.Object.extend('Message');
var Schedule = AV.Object.extend('Schedule');

var Photo = AV.Object.extend('Photo');
var Comment = AV.Object.extend('Comment');
var Content = AV.Object.extend('Content');
var Brand = AV.Object.extend('Brand');
var Temperature = AV.Object.extend('Temperature');
var WeatherType = AV.Object.extend('WeatherType');

var Notification = AV.Object.extend('_Notification');

var GiftCount = AV.Object.extend('GiftCount');
var GiftWorth = AV.Object.extend('GiftWorth');
var GiftRecorder = AV.Object.extend('GiftRecorder');
var Gift = AV.Object.extend('Gift');

var Group = AV.Object.extend('Group');
var GroupRelation = AV.Object.extend('GroupRelation');

var MessageOfChat = AV.Object.extend('MessageOfChat');
var MessageOfBBS = AV.Object.extend('MessageOfBBS');

var ExceptionPaymentConfirmation = AV.Object.extend('ExceptionPaymentConfirmation');
var PaymentConfirmation = AV.Object.extend('PaymentConfirmation');

var AirQualityIndex = AV.Object.extend('AirQualityIndex');

var PM25AppKey = "siv7h7ydxAEBoQw5Z3Lj";

//var ALUserRelationTypeOfFollow = 1;
//var ALUserRelationStateOfBan = -1;
//
//var ALGroupRelationTypeOfEnterGroup = 1;
//var ALGroupRelationTypeOfLeaveGroup = 2;
//var ALGroupRelationTypeOfFavicon = 3;

var UINT8_MAX = 255;
var UINT16_MAX = 65535;  //0~65535

var exchangeRate = 0.7;

var AL = require('cloud/lib/ALCommonUtil').AL();

// 手机注册
//AV.Cloud.define("signUpByPhoneNumber", function(request, response){
//
//    var guid = newGuid();
//    var username = guid.toUpperCase();
//    var password = guid.toLowerCase();
//    var phoneNumber = request.params.phoneNumber;
//
//    var user = new AV.User();
//    user.set('username',username);
//    user.set('password',password);
//    user.setMobilePhoneNumber(phoneNumber);
//    user.signUp(null, {
//        success: function(user) {
//
//            response.success();
//        },
//        error: function(user, error) {
//
//            response.error(ALERROR(error.code,error.message));
//        }
//    });
//});
//
//// 重发验证码
//AV.Cloud.define("resetPasswordForPhone", function(request, response){
//
////    var user = request.user;
//    var phoneNumber = request.params.phoneNumber;
//    var password = request.params.password;
//
//    if (phoneNumber && password)
//    {
//        var userQ = new AV.Query(User);
//        userQ.equalTo('phoneNumber',phoneNumber);
//        userQ.limit(1);
//        userQ.find().then(function(results) {
//
//            if (results.length>0)
//            {
//                var user = results[0];
//                user.set('phonePwd',password);
//                user.save().then(function(user){
//
//                    response.success();
//
//                },function(error){
//
//                    response.error(ALERROR(error.code,error.message));
//                });
//            }
//            else
//            {
//                response.error(ALERROR(777452,"该手机号还没有注册"));
//            }
//
//        },function(error){
//
//            response.error(ALERROR(error.code,error.message));
//
//        });
//    }
//    else
//    {
//        response.error(ALERROR(777123,"参数错误"));
//    }
//
//});



if (typeof ALAccessTokenType == "undefined"){

    var ALAccessTokenType = {
        ALAccessTokenTypeOfUndefined : 0,
        ALAccessTokenTypeOfSinaWeiBo : 1,
        ALAccessTokenTypeOfTencentWeiBo : 2,
        ALAccessTokenTypeOfQQ : 3,
        ALAccessTokenTypeOfWeChat : 4,
        ALAccessTokenTypeOfRenren : 5,
        ALAccessTokenTypeOfFacebook : 6,
        ALAccessTokenTypeOfTwitter : 7
    };
}


AV.Cloud.define("updateLocation", function(request, response){
    var lat = request.params.latitude;
    var lon = request.params.longitude;
    var place = request.params.place;
    var date = new Date();
    var user = request.user;

    if (!user)
    {
        response.error(ALERROR(111,"参数错误"));
        return;
    }
    var point = new AV.GeoPoint({latitude: lat, longitude: lon});
    user.set('location',point);
    user.set('place',place);
    user.set('lastUpdateLocationDate',date);
    user.save().then(function(object) {

        response.success();

    }, function(error) {

        response.error(error);
    });

});








/*
* 增加AuthKey
*
*
*
*/
AV.Cloud.define("addAuthKey", function(request, response){

    var uid = request.params.uid;
    var type = parseInt(request.params.type);

    searchUserWithAuthData(uid,type,function(user,error){

        if (user && !error)
        {

            response.error(ALERROR("777176","该账号已被绑定"));
        }
        else if (!error)
        {
            addAuthKey(request.user,uid,type,function(user,error){

                if (user && !error)
                {
                    response.success();
                }
                else
                {
                    response.error(error);
                }
            });
        }
        else
        {
            response.error(error);
        }
    });
});

function searchUserWithAuthData(uid,type,done){

    if (!uid || !type)
    {
        done(false,{'code':777123,'message':"参数错误"});
        return;
    }

    var userQ = new AV.Query(User);
    switch(type)
    {
        case ALAccessTokenType.ALAccessTokenTypeOfSinaWeiBo:
            userQ.equalTo('authKey.sinaWeibo.uid',uid);
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfTencentWeiBo:
            userQ.equalTo('authKey.tencentWeibo.uid',uid);
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfQQ:
            userQ.equalTo('authKey.qq.uid',uid);
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfWeChat:
            userQ.equalTo('authKey.wechat.uid',uid);
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfRenren:
            userQ.equalTo('authKey.renren.uid',uid);
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfFacebook:
            userQ.equalTo('authKey.facebook.uid',uid);
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfTwitter:
            userQ.equalTo('authKey.twitter.uid',uid);
            break;
        default:
            done(false,{'code':777123,'message':"参数错误"});
            return;
    }

    userQ.first({
        success: function(obj) {
            done(obj,null);
        },
        error: function(error) {
            done(null,error);
        }
    });
}


function addAuthKey(user,uid,type,done)
{
    if (!user || !uid || !type)
    {
        done(false,{'code':777123,'message':"参数错误"});
        return;
    }

    user.fetch({
        success: function(user) {
            var authKey = user.get('authKey');
            addUidToAuthKey(authKey,uid,type);
            user.set('authKey',authKey);
            user.fetchWhenSave(true);
            user.save().then(function(object) {

                done(object,null);

            }, function(error) {

                done(null,error);
            });
        },
        error: function(user, error) {
            done(null,error);
        }
    });
}

/*
* 移除AuthKey
*
*
*
*/
AV.Cloud.define("removeAuthKey", function(request, response){
    var type = request.params.type;
    var user = request.user;

    removeAuthKey(user,type,function(user,error){
        if (user && !error)
        {
            response.success();
        }
        else
        {
            response.error(error);
        }
    });
});

function removeAuthKey(user,type,done)
{
    if (!user || !type)
    {
        done(false,{'code':777123,'message':"参数错误"});
        return;
    }

    user.fetch({
        success: function(user) {
            if (!__production) console.dir(user);
            var authKey = user.get('authKey');
            removeUidToAuthKey(authKey,type);
            user.set('authKey',authKey);
            if (!__production) console.dir(user);
            user.fetchWhenSave(true);
            user.save().then(function(object) {

                done(object,null);

            }, function(error) {

                done(null,error);
            });
        },
        error: function(user, error) {
            done(null,error);
        }
    });
}

function removeUidToAuthKey(authKey,type){

    if (!__production) console.dir(authKey);
    switch(type)
    {
        case ALAccessTokenType.ALAccessTokenTypeOfSinaWeiBo:
            delete authKey['sinaWeibo'];
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfTencentWeiBo:
            delete authKey['tencentWeibo'];
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfQQ:
            delete authKey['qq'];
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfWeChat:
            delete authKey['wechat'];
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfRenren:
            delete authKey['renren'];
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfFacebook:
            delete authKey['facebook'];
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfTwitter:
            delete authKey['twitter'];
            break;
        default:
            break;
    }
}

//
//AV.Cloud.afterSave("ReportLog", function(request) {
//    var reportLog = request.object;
//    if (reportLog)
//    {
//        reportLog.increment('reportCount',1);
//        reportLog.save();
//    }
//});

/*
* 获取AuthKey
*
*
*
*/
AV.Cloud.define("getUserInfoWithAuthKey", function(request, response){


    var uid = request.params.uid;
    var type = parseInt(request.params.type);
    var nickname = request.params.nickname;
    var headViewURL = request.params.headViewURL;
    var gender = parseInt(request.params.gender);

    searchUserWithAuthData(uid,type,function(user,error){

        if (user)
        {
            var password;
            if (user.get('userKey'))
            {
                password = des.strDec(user.get('userKey'),user.id);
            }
            else
            {
                password = user.get('username').toLowerCase();

            }

            response.success({'username':user.get('username'),'password':password});
        }
        else if (!error)
        {
            signUpWithAuthData(uid,type,nickname,headViewURL,gender,function(user,error){

                if (user && !error)
                {
                    response.success({'username':user.get('username'),'password':user.get('username').toLowerCase()});
                }
                else
                {
                    response.error(error);
                }
            });
        }
        else
        {
            response.error(error);
        }
    });
});

function addUidToAuthKey(authKey,uid,type){
    switch(type)
    {
        case ALAccessTokenType.ALAccessTokenTypeOfSinaWeiBo:
            authKey['sinaWeibo'] = {'uid':uid};
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfTencentWeiBo:
            authKey['tencentWeibo'] = {'uid':uid};
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfQQ:
            authKey['qq'] = {'uid':uid};
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfWeChat:
            authKey['wechat'] = {'uid':uid};
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfRenren:
            authKey['renren'] = {'uid':uid};
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfFacebook:
            authKey['facebook'] = {'uid':uid};
            break;
        case ALAccessTokenType.ALAccessTokenTypeOfTwitter:
            authKey['twitter'] = {'uid':uid};
            break;
        default:
            break;
    }
}

/*
*   重置密码
*/
AV.Cloud.define("resetPassword", function(request, response){

    var user = request.user;
    var oldPwd = request.params.oldPwd;
    var newPwd = request.params.newPwd;

    checkOldPassword(user,oldPwd,function(success,error){

           if (success && !error)
           {
               user.set('password',newPwd);
               user.set('userKey',des.strEnc(newPwd,user.id));
               user.save().then(function(user) {

                   response.success();

               }, function(error) {

                   response.error(error);
               });
           }
           else
           {
               response.error(error);
           }
    });
});

function checkOldPassword(user,oldPwd,done){
    if (!user || !oldPwd)
    {
        done(false,{'code':777123,'message':"参数错误"});
        return;
    }

    user.fetch({
        success: function(user) {

            var userKey = user.get('userKey');

            if (strEnc(oldPwd,user.id) == userKey)
            {
                done(true,null);
            }
            else
            {
                done(false,{'code':22,'message':"原密码错误"});
            }
        },
        error: function(user, error) {
            done(false,error);
        }
    });
}



function signUp(done)
{
    var guid = "0973BE2E8AAE";
    var user = new User();
//    user.set('username',guid.toUpperCase());
//    user.set('password',guid.toLowerCase());
////    user.set('userKey',guid.toLowerCase());
    if (!__production) console.dir(user);
    user.signUp(null, {
        success: function(user) {
            user.set('userKey',des.strEnc(guid.toLowerCase(),user.id));
            user.save().then(function(object) {

                done(user,null);

            }, function(error) {

                if(!__production) console.log(error.message);
                done(null,error);

            });

        },
        error: function(user, error) {

            if (!__production) console.dir({ code: 22, message: 'Cannot sign up user with an empty name.' });
            if (!__production) console.log(error.message);
            done(null,error);
//            done(null,{ code: 22, message: 'Cannot sign up user with an empty name.' });
        }
    });
}

function signUpWithAuthData(uid,type,nickname,headViewURL,gender,done){

    if (!uid || !type)
    {
        done(false,ALEEROR(777123,"参数错误"));
        return;
    }

    var guid = AL.guid();

    var user = new User();
    user.set('username',guid.toUpperCase());
    user.set('password',guid.toLowerCase());

    var authKey = {};
    addUidToAuthKey(authKey,uid,type);
    user.set('authKey',authKey);

    if (nickname) user.set('nickname',nickname);
    if (headViewURL) user.set('headViewURL',headViewURL);
    user.set('gender',gender);
    user.fetchWhenSave(true);
    user.signUp(null, {
        success: function(user) {

            done(user,null);
        },
        error: function(user, error) {

            done(null,error);
        }
    });
}


AV.Cloud.define("updateUnreadState", function(request, response){

    var userId = request.params.userId;
    var user = AV.Object.createWithoutData('_User',userId);
    updateUnreadState(user,function(){
        response.success();
    });
});

//AV.Cloud.beforeSave("_User", function(request, response) {
//
//    addMajorAndMinor(request.object,function(user,error){
//
//        if (!error)
//        {
//            response.success();
//        }
//        else
//        {
//           response.error(error);
//        }
//    });
//});


AV.Cloud.define("savePassword", function(request, response){

    var userId = request.user.id;
    var user = AV.Object.createWithoutData('_User',userId);
    var password = request.params.password;
//    user.set('userKey',des.strEnc(password,userId));
    user.save().then(function(object) {

        response.success();

    }, function(error) {

        response.error(error);
    });
});




//AV.Cloud.afterSave("_User", function(request) {
//
//    if (!__production) console.log("user save后");
//    if (!__production) console.dir(request.object);
//
//});

function addMajorAndMinor(user,done)
{
//    if (!__production) console.log("添加major和minor");
    var userQ = new AV.Query(User);
    var major = AL.getRandomNumberWithRange(1,UINT16_MAX-1);
    var minor = AL.getRandomNumberWithRange(1,UINT16_MAX-1);
//    if (!__production) console.log(major);
//    if (!__production) console.log(minor);
    userQ.equalTo('major',major);
    userQ.equalTo('minor',minor);
    userQ.first({
        success: function(obj) {
            if (obj)
            {
                //已经有人使用
                if (!__production) console.log("已经有人使用");
                addMajorAndMinor(user,done);
            }
            else
            {
//                if (!__production) console.log("没有人使用");
                user.set('major',major);
                user.set('minor',minor);

                done(user,null);
            }
        },
        error: function(error) {
            //查询失败
//            if (!__production) console.log("查询失败");
//            if (!__production) console.log("Error: " + error.code + " " + error.message);
            done(null,error);
        }
    });
}



//     /*
//     *
//     * {
//      administrators =     (
//      5404433ce4b0b77b57476dbf
//      );
//
//      createdAt = "2014-09-02T11:25:09.322Z";
//      createdUser = "<User, _User, 54059462e4b0b77b574983ba, localData:{\n}, estimatedData:{\n}, relationData:{\n}>";
//      declared = "\U5475\U5475";
//      distance = "\U8fdc\U6d0b\U5c71\U6c34";
//      groupId = "";
//      groupType = 3;
//      isDeleted = 0;
//      isVisible = 1;
//      location = "<AVGeoPoint: 0xfe52f0>";
//      name = "\U7fa41";
//      objectId = 5405a915e4b0b77b5749b307;
//      permission = 0;
//      type = 2;
//      updatedAt = "2014-09-03T07:28:03.226Z";
//      }
//
//      {
//
//      className = Group;
//
//      createdAt =     {
//      "__type" = Date;
//      iso = "2014-09-02T19:25:09.322Z";
//      };
//      createdUser =     {
//      "__type" = Pointer;
//      age = 0;
//      className = "_User";
//      credits = 0;
//      experience = 0;
//      fetchWhenSave = 0;
//      gender = 0;
//      introductionOfVoiceOfDuration = 0;
//      isNew = 0;
//      major = 0;
//      minor = 0;
//      mobilePhoneVerified = 0;
//      objectId = 54059462e4b0b77b574983ba;
//      sexualOrientation = 0;
//      state = 0;
//      };
//      declared = "\U5475\U5475";
//      distance = 0;
//      fetchWhenSave = 0;
//      groupId = "";
//      groupType = 3;
//      isDeleted = 0;
//      isVisible = 1;
//      location =     {
//      "__type" = GeoPoint;
//      latitude = "11.10999965667725";
//      longitude = "22.21999931335449";
//      };
//      name = "\U7fa41";
//      objectId = 5405a915e4b0b77b5749b307;
//      permission = 0;
//      type = 2;
//      updatedAt =     {
//      "__type" = Date;
//      iso = "2014-09-03T15:28:03.226Z";
//      };
//      }
//     *
//     * */
//
///*
//

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
///****************
//通用函数
//*****************/
////xml
//var parseString = require('xml2js').parseString;
//
////json
//var parse = require('xml2js').Parser();
//
////时间
//var moment = require('moment');
//
////字符串————>时间
//function toDate(dateStr,formateStr,addHours){
//    if (!formateStr) formateStr = "YYYY-MM-DD HH:mm:ss";
//    if (!addHours) addHours = 8;
//    return moment(dateStr, formateStr).add('hours',addHours).toDate();
//}
//
////核对支付凭证 --> 更新订单状态 --> 生成配送单
////充值完成
//AV.Cloud.define("handleCompletedPaymentConfirmation", function(request, response){
//
//    var paymentConfirmationId = request.params.paymentConfirmationId;
////    var paymentConfirmation = AV.Object.createWithoutData('PaymentConfirmation',paymentConfirmationId);
//    var completedPaymentConfirmation = request.params.completedPaymentConfirmation;
//
//    //检验充值记录是否合法
//    checkCompletedPaymentConfirmation(paymentConfirmationId,completedPaymentConfirmation,10,function (success,error){
//
//        if (success && !error)
//        {
//            response.success();
//        }
//        else
//        {
//            response.error(error);
//        }
//
//    });
//
//});
//
////检验充值记录是否合法
//function checkCompletedPaymentConfirmation(paymentConfirmationId,completedDict,tryTimes,done){
//
//    if (!__production) console.dir("检验充值记录是否合法");
//
//    if (tryTimes<=0)
//    {
//        done(false,ALERROR(777210,"请求次数超过限制"));
//        return;
//    }
//
//    var pc = new AV.Object.createWithoutData('PaymentConfirmation',paymentConfirmationId);
//    pc.first().then(function(pc){
//
//        if (pc)
//        {
//            var payMethod = parseInt(pc.get('payMethod'));
//            if (payMethod == 1) //贝宝
//            {
//                checkPayPal(pc,completedDict,done);
//            }
//            else if (payMethod == 2)//支付宝
//            {
//
//            }
//            else if (payMethod == 3)//微信
//            {
//
//            }
//        }
//        else
//        {
//            done(false,ALERROR(777631,"交易不存在"));
//        }
//
//    },function(error){
//
//        done(false,ALERROR(error.code,error.message));
//        checkCompletedPaymentConfirmation(paymentConfirmationId,completedPaymentConfirmation,done);
//    });
//
//
//}
//
//function checkPayPal(paymentConfirmation,completedDict,done){
//
//    //检查交易环境
//    if (completedDict.client.environment == "mock")//测试
//    {
//
//        /*
//
//        成功
//            Confirmation: {
//         client =     {
//         environment = mock;
//         "paypal_sdk_version" = "2.3.2";
//         platform = iOS;
//         "product_name" = "PayPal iOS SDK";
//         };
//         response =     {
//         "create_time" = "2014-10-24T02:24:43Z";
//         id = "PAY-8UD377151U972354RKOQ3DTQ";
//         intent = sale;
//         state = approved;
//         };
//         "response_type" = payment;
//         }
//
//        *
//        */
//
////        if (!paymentConfirmation.get('user') || !paymentConfirmation.get('price') || !paymentConfirmation.get('commodityOrder'))
////        {
////            if (!__production) console.log("订单内容有误");
////            done(false,ALERROR(777210,"订单内容有误"));
////            return;
////        }
//
//        //检查交易是否已经关闭
//        if (paymentConfirmation.get('isComplelted'))
//        {
//            if (!__production) console.log("交易已经关闭");
//            done(false,ALERROR(777210,"交易已经关闭"));
//            return;
//        }
//
//        if (!completedDict.response.id)
//        {
//            if (!__production) console.log("支付失败");
//            done(false,ALERROR(777214,"支付失败"));
//            return;
//        }
//
//        //检查交易id是否被使用过
//        var pcQ = new AV.Query(PaymentConfirmation);
//        pcQ.equal('ID',completedDict.response.id);
//        pcQ.count().then(function(count){
//
//            if (count>0)
//            {
//                if (!__production) console.log("交易id被重复使用");
//                done(false,ALERROR(777210,"交易id被重复使用"));
//                return;
//            }
//
//            patchPaymentConfirmation(paymentConfirmation,completedDict,10,done);
//
//        },function(error){
//
//
//        });
//    }
//    else
//    {
//        if (!__production) console.log("交易环境有误");
////        done(false,{'code':777211,'message':"交易环境有误"});
//        done(false,ALERROR(777210,"交易环境有误"));
//    }
//}
//
////更新充值记录
//function patchPaymentConfirmation(paymentConfirmations,completedPaymentConfirmation,tryTimes,done){
//
//    if (tryTimes<=0)
//    {
////        done(false,{'code':777211,'message':"请求次数超过限制"});
//        done(false,ALERROR(777210,"请求次数超过限制"));
//        return;
//    }
//
//    if (!__production) console.dir("更新充值记录");
//
//    var ID = completedPaymentConfirmation.response.id;
//    var create_time = completedPaymentConfirmation.response.create_time;
//    var environment = completedPaymentConfirmation.client.environment;
////    create_time = '2014-08-27T04:48:51Z';
////    var createTime = moment(create_time, 'YYYY-MM-DDTHH:mm:ss').add('hours',8).toDate();
//    var createTime = new Date(create_time);
////    var createTime = toDate(create_time,'YYYY-MM-DDTHH:mm:ss',0);  //不加Z 是中国时间
////    var createTime2 = toDate(create_time,'YYYY-MM-DDTHH:mm:ss',8);
//
//    if (!__production) console.dir(create_time);
//    if (!__production) console.dir(createTime);
//
//    for (var i in paymentConfirmations)
//    {
//        var paymentConfirmation = paymentConfirmations[i];
//        if (ID) paymentConfirmation.set('ID',ID);
//        if (createTime) paymentConfirmation.set('createTime',createTime);
//        if (environment) paymentConfirmation.set('environment',environment);
//        if (completedPaymentConfirmation) paymentConfirmation.set('completedPaymentConfirmation',completedPaymentConfirmation);
//    }
//
//    //更新充值记录
//    AV.Object.saveAll(paymentConfirmations, function(list, error) {
//        if (list) {
//            incrementCredits(list,tryTimes,done);
//        } else {
//            if (!__production) console.dir(error);
//            patchPaymentConfirmation(paymentConfirmations,completedPaymentConfirmation,--tryTimes,done);
//        }
//    });
//
////    paymentConfirmation.fetchWhenSave(true);
////    paymentConfirmation.set('what',"what");
////    if (!__production) console.dir(paymentConfirmation);
////    paymentConfirmation.save().then(function(object) {
////
////        //更新充值记录成功
//////        if (!__production) console.dir(object);
////        if (!__production) console.dir("更新充值记录成功");
////        //增加积分
////        incrementCredits(object,tryTimes,done);
//////        done(true,null);
////
////    }, function(error) {
////
////        //更新充值记录失败
////        if (!__production) console.dir(error);
////        patchPaymentConfirmation(paymentConfirmation,completedPaymentConfirmation,--tryTimes,done);
////
////    });
//}
//
////增加积分
//function incrementCredits(paymentConfirmations,tryTimes,done){
//
//    if (tryTimes<=0)
//    {
////        done(false,{'code':777211,'message':"请求次数超过限制"});
//        done(false,ALERROR(777210,"请求次数超过限制"));
//        return;
//    }
//
//    var totalCredits = 0;
//    for (var i in paymentConfirmations)
//    {
//        var paymentConfirmation = paymentConfirmations[i];
////        paymentConfirmation.get('credits');
////        paymentConfirmation.get('number');
//        totalCredits += paymentConfirmation.get('credits')*paymentConfirmation.get('number');
//    }
//
//    if (!__production) console.dir("增加积分");
//    var user = paymentConfirmation.get('user');
//    user.increment('credits',totalCredits);
//    user.save().then(function(object) {
//
//        //积分增加成功
//        closePaymentConfirmation(paymentConfirmations,tryTimes,done);
////        done(true,null);
//
//    }, function(error) {
//
//        //积分增加失败
//        incrementCredits(paymentConfirmations,--tryTimes,done);
//    });
//
//}
//
////关闭充值记录
//function closePaymentConfirmation(paymentConfirmations,tryTimes,done){
//
//    if (tryTimes<=0)
//    {
////        done(false,{'code':777211,'message':"请求次数超过限制"});
//        done(false,ALERROR(777210,"请求次数超过限制"));
//        return;
//    }
//
//    if (!__production) console.dir("关闭充值记录");
//
//    for (var i in paymentConfirmations)
//    {
//        var paymentConfirmation = paymentConfirmations[i];
//        paymentConfirmation.set('isCompleted',true);
//    }
//
//    //更新充值记录
//    AV.Object.saveAll(paymentConfirmations, function(list, error) {
//        if (list) {
//            //关闭充值记录成功
//            done(true,null);
//        } else {
//            if (!__production) console.dir(error);
//            //关闭充值记录失败
//            closePaymentConfirmation(paymentConfirmation,--tryTimes,done);
//        }
//    });
//
////    paymentConfirmation.set('isCompleted',true);
////    paymentConfirmation.save().then(function(object) {
////
////        //关闭充值记录成功
////        done(true,null);
////
////    }, function(error) {
////
////        //关闭充值记录失败
////        closePaymentConfirmation(paymentConfirmation,--tryTimes,done);
////    });
//}
//
//function ALERROR(_code,_message){
//    return JSON.stringify({code:_code,message:_message});
//}
//
//
////就收充值异常报告
//AV.Cloud.define("handleExceptionPaymentConfirmation", function(request, response){
//
//    var PCs = request.params.exceptionPaymentConfirmations;
//
//    var ePCs = [];
//    for (var i in PCs)
//    {
//        var PC = PCs[i];
//        var paymentConfirmationIds = PC.paymentConfirmationIds;
//        var completedConfirmation = PC.completedConfirmation;
//        var payTotalPrice = parseInt(PC.payTotalPrice);
//        var payTotalCredits = parseInt(PC.payTotalCredits);
//        var errorMsg = PC.error.error;
//        var errorCode = parseInt(PC.error.code);
//
////        if (!__production) console.dir(paymentConfirmation.objectId);
////        if (!__production) console.dir(completedConfirmation);
////        if (!__production) console.dir(errorMsg);
////        if (!__production) console.dir(errorCode);
//
//        var exceptionPaymentConfirmation = new ExceptionPaymentConfirmation();
//        if (paymentConfirmationIds) exceptionPaymentConfirmation.set('paymentConfirmations',paymentConfirmationIds);
//        if (completedConfirmation) exceptionPaymentConfirmation.set('completedConfirmation',completedConfirmation);
//        if (errorMsg) exceptionPaymentConfirmation.set('errorMsg',errorMsg);
//        if (errorCode) exceptionPaymentConfirmation.set('errorCode',errorCode);
//        if (payTotalPrice) exceptionPaymentConfirmation.set('payTotalPrice',payTotalPrice);
//        if (payTotalCredits) exceptionPaymentConfirmation.set('payTotalCredits',payTotalCredits);
//        ePCs.push(exceptionPaymentConfirmation);
//    }
//
//    AV.Object.saveAll(ePCs,function (success,error){
//
//        if (success && !error)
//        {
//            response.success();
//        }
//        else
//        {
//            response.error(error);
//        }
//    });
//});
//
//
//AV.Cloud.define("sendGift", function(request, response){
//
//    var toUser = AV.Object.createWithoutData('_User',request.params.userId);
//    var fromUser = request.user;
//    var gift = AV.Object.createWithoutData('Gift',request.params.giftId);
//    var number = request.params.number;
//    var messageOfText = request.params.messageOfText;
//
////    var message = request.params.message;
//
//    checkWhetherCreditsIsEnough(fromUser,gift,number,function (totalPrice,error){
//
//        if (error)//金钱不足
//        {
//            response.error(error);
//        }
//        else  //金钱足够
//        {
////            if (!__production) console.dir("金钱足够");
//            //付款
//            payment(fromUser,toUser,totalPrice,10,function (success,error){
//
//                //付款成功
//                if (success)
//                {
////                    if (!__production) console.dir("付款成功");
//                    //送礼
//                    sendGift1(fromUser,toUser,gift,number,messageOfText,10,function (){
//
//                        //送礼成功
//                        if (success)
//                        {
////                            if (!__production) console.dir("送礼成功");
//                            response.success();
//                        }
//                        //送礼失败
//                        else
//                        {
//                            //付款成功+送礼失败(回滚付快)
//                            payment(fromUser,toUser,-1*totalPrice,10,function (success,error){
//
//                                //回滚成功
//                                if (success)
//                                {
//                                    response.error(error);
//                                }
//                                //回滚失败
//                                else
//                                {
//                                    //付款成功+送礼失败+回滚付款失败
//                                    //一个异常记录
//                                    response.error(error);
//                                }
//                            });
//                        }
//                    });
//                }
//                //付款失败
//                else
//                {
//                    response.error(error);
//                }
//            });
//        }
//    });
//});
//
//
////检查金钱是否足够
//function checkWhetherCreditsIsEnough(user,gift,number,done){
//
//    user.fetch({
//        success: function(user) {
//
//            var credits = user.get('credits');
//            if (!__production) console.log(credits);
//
//            gift.fetch({
//                success: function(gift) {
//
//                    var price = gift.get('currentPrice');
//                    if (!__production) console.log(price);
//
//                    if (price*number <= credits)
//                    {
//                         done(price*number,null);
//                    }
//                    else
//                    {
//                        done(0,{'code':723,'message':"金币不足请充值"});
//                    }
//                },
//                error: function(user, error) {
//                    done(0,error);
//                }
//            });
//        },
//        error: function(user, error) {
//            done(0,error);
//        }
//    });
//}
//
////付款
//function payment(fromUser,toUser,price,tryTimes,done){
//
//    if (tryTimes<=0)
//    {
//        done(false,ALERROR(777211,"请求次数超过限制"));
//        return;
//    }
//
//    toUser.increment('credits',1*price*exchangeRate);
//
//    fromUser.increment('credits',-1*price);
//
//    AV.Object.saveAll([fromUser,toUser], function(list1, error) {
//        if (!error)
//        {
//            //扣钱成功
//            done(true,null);
//        }
//        else
//        {
//            //扣钱失败
//            payment(fromUser,toUser,price,--tryTimes,done);
//        }
//    });
//}
//
//
//
//
//
////送礼
//function sendGift1(fromUser,toUser,gift,number,messageOfText,tryTimes,done){
//
//    if (tryTimes<=0)
//    {
//        done(false,ALERROR(777211,"请求次数超过限制"));
//        return;
//    }
//
//    if (typeof(number) != 'number')
//    {
//        number = parseInt(number);
//    }
////    if (!__production) console.log(typeof(parseInt(number)));
////    return;
//
//    if (number<=0)
//    {
//        done(false,ALERROR(777211,"礼物数量错误"));
//        return;
//    }
//
//    var giftRecorder = new GiftRecorder();
//    giftRecorder.set('gift',gift);
//    giftRecorder.set('fromUser',fromUser);
//    giftRecorder.set('toUser',toUser);
//    giftRecorder.set('number',number);
//    giftRecorder.set('totalWorth',gift.get('originalPrice')*number);
//
////    if (!__production) console.dir(giftRecorder.get('gift').objectId);
////    if (!__production) console.dir(giftRecorder.get('fromUser').objectId);
////    if (!__production) console.dir(giftRecorder.get('toUser').objectId);
////    if (!__production) console.dir(giftRecorder.get('number'));
////    if (!__production) console.dir(giftRecorder.get('totalWorth'));
//
//    if (!__production) console.log("送礼");
//    giftRecorder.save().then(function(object) {
//
//        sendGift2(fromUser,toUser,object,number,messageOfText,tryTimes,done);
//
//    }, function(error) {
//
//        //送礼失败
//        if (!__production) console.log("送礼失败");
//        if (!__production) console.dir(error);
//        sendGift1(fromUser,toUser,gift,number,--tryTimes,done);
//
//    });
//}
//
//function sendGift2(fromUser,toUser,giftRecorder,number,messageOfText,tryTimes,done){
//
//    var mob = new MessageOfBBS();
//    mob.set('fromUser',fromUser);
//    mob.set('toUser',toUser);
//    if (messageOfText) mob.set('text',messageOfText);
//    mob.set('giftRecorder',giftRecorder);
//    mob.set('isReaded',false);
//    mob.set('isDeleted',false);
//    mob.save().then(function(object) {
//
//        //送礼成功
//        if (!__production) console.log("送礼成功");
//        afterSaveGiftRecorder(giftRecorder);
//
//        done(true,null);
//
//    }, function(error) {
//
//        //送礼失败
//        if (!__production) console.log("送礼失败");
//        if (!__production) console.dir(error);
//        sendGift2(fromUser,toUser,giftRecorder,number,--tryTimes,done);
//
//    });
//
//}
//
////送礼后 统计工作
////AV.Cloud.afterSave("GiftRecorder", function(request) {
////
////    var giftRecorder = request.object;
////    afterSaveGiftRecorder(giftRecorder);
////
////});
//
//function afterSaveGiftRecorder(giftRecorder){
//
////    if (!__production) console.dir(giftRecorder);
//    var gift = AV.Object.createWithoutData('Gift',giftRecorder.get('gift').id);
//    var fromUser = AV.Object.createWithoutData('_User',giftRecorder.get('fromUser').id);
//    var toUser = AV.Object.createWithoutData('_User',giftRecorder.get('toUser').id);
//    var number = giftRecorder.get('number');
//    var totalWorth = giftRecorder.get('totalWorth');
//
//    if (!__production) console.log("afterSaveGiftRecorder");
//
//    incrementGiftCount(gift,toUser,number,10,null);
//    incrementGiftWorth(fromUser,toUser,totalWorth,10,null);
//
//}
//
//function incrementGiftCount(gift,toUser,number,tryTimes,done)
//{
//    if (!__production) console.log("增加礼物数");
//    if (tryTimes<=0)
//    {
//        done(false,ALERROR(777211,"请求次数超过限制"));
//        return;
//    }
//
////    if (!__production) console.log(gift.id);
////    if (!__production) console.log(toUser.id);
////    if (!__production) console.dir(typeof(number));
//    var giftCountQ = new AV.Query(GiftCount);
//    giftCountQ.equalTo('gift',gift);
//    giftCountQ.equalTo('toUser',toUser);
//    giftCountQ.first({
//        success: function(giftCount) {
//
//            if (giftCount)
//            {
//                //已经存在
//                if (!__production) console.log("增加礼物数-已经存在:"+giftCount.id+"    count:"+giftCount.get('number'));
//                if (!__production) console.log(number);
//                giftCount.increment('number',number);
//                giftCount.save().then(function(object) {
//
//                    if (!__production) console.log("增加礼物数成功");
////                    if (done) done(true,null);
//
//                }, function(error) {
//
//                    if (!__production) console.log("222");
//                    if (!__production) console.log("Error: " + error.code + " " + error.message);
//                    incrementGiftCount(gift,toUser,number,--tryTimes,done);
//
//                });
//            }
//            else
//            {
//                //不存在
//                if (!__production) console.log("增加礼物数-不存在");
//                var newGiftCount = new GiftCount();
//                newGiftCount.set('gift',AV.Object.createWithoutData('Gift',gift.id));
//                newGiftCount.set('toUser',AV.Object.createWithoutData('_User',toUser.id));
//                newGiftCount.set('number',number);
//
//                newGiftCount.save().then(function(object) {
//
////                    done();
//                    if (!__production) console.log("增加礼物数成功");
//
//                }, function(error) {
//
//                    if (!__production) console.log("Error: " + error.code + " " + error.message);
//                    incrementGiftCount(gift,toUser,number,--tryTimes,done);
//
//                });
//            }
//        },
//        error: function(error) {
//            //查询失败
////            alert("Error: " + error.code + " " + error.message);
//            if (!__production) console.log("Error: " + error.code + " " + error.message);
//            incrementGiftCount(gift,toUser,number,--tryTimes,done);
//
//        }
//    });
//}
//
//function incrementGiftWorth(fromUser,toUser,totalWorth,tryTimes,done)
//{
//    if (!__production) console.log("增加礼物价值");
//    if (tryTimes<=0)
//    {
//        done(false,ALERROR(777211,"请求次数超过限制"));
//        return;
//    }
//
////    if (!__production) console.log("fromUser"+"toUser");
////    if (!__production) console.dir(fromUser);//53f46fd2e4b02507909ffdb9
////    if (!__production) console.dir(toUser);//53f46c8ae4b02507909ff4f7
//
//    var giftWorthQ = new AV.Query(GiftWorth);
//    giftWorthQ.equalTo('fromUser', fromUser);
//    giftWorthQ.equalTo('toUser',toUser);
//    giftWorthQ.first({
//        success: function(giftWorth) {
//
////            if (!__production) console.dir("giftWorth.id : "+giftWorth.id);
//
//            if (giftWorth)
//            {
//                //已经存在
//                if (!__production) console.log("增加礼物价值-已经存在:"+giftWorth.id+"    totalWorth:"+giftWorth.get('totalWorth'));
//                giftWorth.increment('totalWorth',totalWorth);
//                giftWorth.save().then(function(object) {
//
//                    if (!__production) console.log("增加礼物价值成功");
////                    if (done) done(true,null);
//
//                }, function(error) {
//
//                    if (!__production) console.log("Error: " + error.code + " " + error.message);
//                    incrementGiftWorth(fromUser,toUser,totalWorth,--tryTimes,done);
//
//                });
//            }
//            else
//            {
//                //不存在
//                if (!__production) console.log("增加礼物价值-不存在");
//                var giftWorth = new GiftWorth();
//                giftWorth.set('fromUser',fromUser);
//                giftWorth.set('toUser',toUser);
//                giftWorth.set('totalWorth',totalWorth);
//
//                giftWorth.save().then(function(object) {
//
//                    if (!__production) console.log("增加礼物价值成功");
////                    done();
//
//                }, function(error) {
//
//                    if (!__production) console.log("Error: " + error.code + " " + error.message);
//                    incrementGiftWorth(fromUser,toUser,totalWorth,--tryTimes,done);
//
//                });
//            }
//        },
//        error: function(error) {
//
//            if (!__production) console.log("Error: " + error.code + " " + error.message);
//            incrementGiftWorth(fromUser,toUser,totalWorth,--tryTimes,done);
//
//        }
//    });
//}
//
//
//
//function ALEEROR(_code,_message){
//    return JSON.stringify({code:_code,message:_message});
//}

//function checkUserRelation(user,type,tryTimes,done)
//{
//    if (tryTimes<=0)
//    {
//        done(false,"次数超过限制");
//    }
//
//    var user = AV.Object.createWithoutData("_User",user.id);
//
//    var friendsQ = new AV.Query(UserRelation);
//    friendsQ.equalTo('fromUser',user);
//    friendsQ.equalTo('type',type);
//    friendsQ.count({
//        success: function(numberOfFriends) {
//
//            user.set('numberOfFriends',numberOfFriends);
//
//            var followQ = new AV.Query(UserRelation);
//            followQ.equalTo('toUser',user);
//            followQ.equalTo('type',type);
//            followQ.count({
//                success: function(numberOfFollows) {
//
//                    user.set('numberOfFollows',numberOfFollows);
//                    var bilateralFollowQ = new AV.Query(UserRelation);
//                    bilateralFollowQ.equalTo('fromUser',user);
//                    bilateralFollowQ.equalTo('type',type);
//                    bilateralFollowQ.equalTo('isBilateral',true);
//                    bilateralFollowQ.count({
//                        success: function(numberOfBilaterals) {
//
//                            user.set('numberOfBilaterals',numberOfBilaterals);
//
//                            user.save().then(function(user) {
//
//                                done(true,null);
//
//
//
//                            },function(error){
//
//                                checkUserRelation(user,type,--tryTimes,done);
//
//                            });
//                        },
//                        error: function(error) {
//                            checkUserRelation(user,type,--tryTimes,done);
//                        }
//                    });
//                },
//                error: function(error) {
//                    checkUserRelation(user,type,--tryTimes,done);
//                }
//            });
//        },
//        error: function(error) {
//            checkUserRelation(user,type,--tryTimes,done);
//        }
//    });
//
//}

//获取 抢花记录
function getGrabFlowerRecord(user, grabFlower, done) {

    var grabFlowerRecordQ = new AV.Query(GrabFlowerRecord);
    grabFlowerRecordQ.equal('user', user);
    grabFlowerRecordQ.equal('grabFlower', grabFlower);
    grabFlowerRecordQ.limit(1);
    grabFlowerRecordQ.find().then(function (grabFlowerRecords) {

        if (grabFlowerRecords.length > 0) {
            //抢过
            var grabFlowerRecord = grabFlowerRecords[0];
            done(grabFlowerRecord, null);
        }
        else {
            //没抢过
            done(null, null);
        }

    }, function (error) {

        done(null, AL.error(error.code, error.message));
    });

}

//剩余数
function getGrabFlowerRemainNumber(grabFlower, done) {

    var tempGrabFlower = false;
    for (var i in grabFlowerCache) {
        if (grabFlowerCache[i].id == grabFlower.id) {
            tempGrabFlower = grabFlowerCache[i];
        }
    }

    if (tempGrabFlower) {
        done(tempGrabFlower.get('remainNumber'), null);
    }
    else {
        AV.Object.createWithoutData("GrabFlower", grabFlower.id).fetch().then(
            function (grabFlower) {

                grabFlowerCache.push(grabFlower);
                done(grabFlower.get('remainNumber'), null);

            }, function (error) {

                done(0, AL.error(error.code, error.message));

            });
    }
}

// 抢鲜花
function startGrabFlower(grabFlower, user, randomNum) {

    if (grabFlower.get("remainNumber")) {
        //来晚了
        return;
    }

    if (grabFlower.get("remainNumber") < randomNum) {
        randomNum = grabFlower.get("remainNumber");
    }

    grabFlower.increment("remainNumber", -1 * randomNum);

    //生成 抢花记录

    //save grabFlower


}



var code ; //在全局 定义验证码
function createCode(){
    code = new Array();
    var codeLength = 4;//验证码的长度
    var checkCode = document.getElementById("checkCode");
    checkCode.value = "";

    var selectChar = new Array(2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');

    for(var i=0;i<codeLength;i++) {
        var charIndex = Math.floor(Math.random()*32);
        code +=selectChar[charIndex];
    }
    if(code.length != codeLength){
        createCode();
    }
    checkCode.value = code;
}

function validate () {
    var inputCode = document.getElementById("input1").value.toUpperCase();

    if(inputCode.length <=0) {
        jQuery("#show").html("请输入验证码");
        return false;
    }
    else if(inputCode != code ){
        jQuery("#show").html("验证码输入错误");
        createCode();
        return false;
    }else {
        jQuery("#show").html("验证码输入正确");
        return true;
    }
}




















