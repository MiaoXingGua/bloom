
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
    Coupons = AV.Object.extend('Coupons')
    ;

// 微信支付模块
//var wechatConfig = {
//
//    appId: "wx8d7deb2e14afbbd4",
//    appKey: "9vjPBQ6UA6CvuiAiGC7YdFQsfEFduDk0BqiY52khrpWMIUBxK9zebPZJPMrcnXi8BYfVIkJHjaLdP3SaZSzKpL6jyfjENLQ44PjF1KZhCGerkJdq60PcGH2EJvBhcV4x",
//    appSecret: "0ec828af675de4f1b48f07bbcf2689cc",
//    partnerKey: "04f0e3bc4ae941ea329aefe2439f217b",
//    partnerId: "1223282101",
//    signtype: 'SHA1',
//    notify_url:"http://dev.flowerso2o.avosapps.com/wechat/pay_notify"
//};

// bloom 开发账号 (付款、分享)
var wechatOfBloomConfig = {

    appId           : "wx8d7deb2e14afbbd4",
    appKey          : "9vjPBQ6UA6CvuiAiGC7YdFQsfEFduDk0BqiY52khrpWMIUBxK9zebPZJPMrcnXi8BYfVIkJHjaLdP3SaZSzKpL6jyfjENLQ44PjF1KZhCGerkJdq60PcGH2EJvBhcV4x",
    appSecret       : "0ec828af675de4f1b48f07bbcf2689cc",
    partnerKey      : "04f0e3bc4ae941ea329aefe2439f217b",
    partnerId       : "1223282101",

    signtype        : 'SHA1',
    notify_url      : "http://flowerso2o.avosapps.com/wechat/pay_notify"

};

var verityNotifyWithWechat = function(params,done){
    done(true);
};

var WechatPayment = AV.Object.extend('WechatPayment');

var AL = require('cloud/lib/ALCommonUtil').AL();

exports.route = function(app) {

    app.all('/wechatPay/hello', function (req, res) {

        require('cloud/routes/order');

        res.end("wechatPay-hello");
    });

    //付款回调通知接口
    app.all('/wechatPay/pay_notify?', function (req, res) {

        console.dir('微信付款');

        if (req.method == 'GET') {
            res.end("wechat_pay_notify : GET");
            return;
        }

        //获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//

        //var params = req.query;
        ////console.dir(params);
        //if (params) {
        //    console.dir(params);
        //    console.log("111");
        //}
        //params = null;
        //params = req.body;
        //if (params) {
        //    console.dir(params);
        //    console.log("222");
        //}
        ////console.dir(params);
        //params = null;
        //params = req.params;
        //if (params) {
        //    console.dir(params);
        //    console.log("333");
        //}
        //params = null;
        //params = req.param();
        //if (params) {
        //    console.dir(params);
        //    console.log("444");
        //}
        ////console.dir(params);
        //
        //var out_trade_no = req.param(out_trade_no);
        //console.log("out_trade_no : "+out_trade_no);

        req.setEncoding('utf-8');

        //console.log(req.route.method);

        var params = req.query;


        //console.dir("微信付款 : "+JSON.parse(params));
        var payment = new AL.config.CommodityPayment();
        payment.set("payMethod",AL.config.ALPayMethod.wechatPay);
        payment.set("payData",params);
        payment.save();


        //console.log(params);
        if (params) {

            verityNotifyWithWechat(params, function (success) {

                if (success) {
                    var orderId = params.out_trade_no; //order id
                    var tradeNO = params.transaction_id;     //第三方交易号
                    var paymentAmount = parseInt(params.total_fee);   //支付金额(单位:分)

                    //orderId,tradeNo,params,payMethod,tryTimes,done
                    require('cloud/routes/order').completeOrders(orderId, tradeNO, paymentAmount, params, AL.config.ALPayMethod.wechatPay, 10, function (success) {

                        console.dir("完成订单 : " + success);
                        if (success) {

                            res.end("success");	//请不要修改或删除——
                        }
                        else {
                            res.end("fail");
                        }
                    });
                }
                else {
                    res.end("fail");
                }
            });
        }
        else {
            res.end("fail");
        }
    });
};