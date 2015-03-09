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

var AL = require('cloud/lib/ALCommonUtil').AL();
/*
 支付宝模块
 */

exports.route = function(app) {

    var AlipayConfig = {

        //↓↓↓↓↓↓↓↓↓↓请在这里配置您的基本信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        // 合作身份者ID，以2088开头由16位纯数字组成的字符串
        partner: "2088311757225694",

// 交易安全检验码，由数字和字母组成的32位字符串
        pubKey: "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCnxj/9qwVfgoUh/y2W89L6BkRAFljhNhgPdyPuBV64bfQNN1PjbCzkIM6qRdKBoLPXmKKMiFYnkd6rAoprih3/PrQEB/VsW8OoM8fxn67UDYuyBTqA23MML9q1+ilIZwBC2AQ2UBVOrFXfFl75p6/B5KsiNG9zpgmLCUYuLkxpLQIDAQAB",

        privKey: "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBANsE7GPr7v6S/z4RWpwGgbC4SR6ZDNQIBCfEz/ddlPoGX6Pj+czhH3apWqJNauP+oGFpFJP15KfqpizayrQt6IxKcArm5EFoZHrDapxQM9HBuBghkQvtfiq+yF52jUldkd9VPu4xXsYDG+F0ZTlyjs+97mdeJRJQGUZUD8VH5/JPAgMBAAECgYBXE7YIZB05CaiBPNURg2S8pggsKh13j1hXl2A3sPUyEqajulfupPKlct+d97mvu+R31hdgXDr0p845tyMwT7BMml2GaK9LNV2qY5C+1p0FbDMt7mni5nmaX/s0nN12dASzIZg2o+l/zvQ1eaJh+yOO1GFWasFmpelW+w8gUZUygQJBAPAx3/2GTQEnxHnL1LwQksqTaTqtXhWQq73nN80GQzlBW9gq26FasBzZxXkKb9lQwhSfQ84qACiF76qKE3gblAcCQQDpbld+zt1T5JqbufOZ1moGsz4YaLxhgxA9lRmJC5bojC3o9phgsop1bYgT9TNrIN+aN1/O8OrwomGzmgTOaG15AkEAv3UR9RTrJoObYfYugSW4zE6KL2Jnv0rNCpdWbE+Un/vQCNPIs6oE/Uo81MmT9CYiPavhsWDbNXHlYwuijzd0WwJAJ27TawGJFAX3ND1acG9vI8idwcPXpuVcFfsdADCsAobDrqoRnawrhaDGLxDp6bv46fVWwv+hwJq9xHhNPY0YiQJADoyoylvKxJTktab+NEMES8mWnNRt+GoHG9Vj32Qz3FEty8quqMJf6UajPxokIKIWKKYc5eW15/0Hmf/+WCCLNw==",
// 签约支付宝账号或卖家收款支付宝帐户
        seller_email: "wjusaappleid@126.com",

        // 支付宝服务器通知的页面 要用 http://格式的完整路径，不允许加?id:123这类自定义参数
        // 必须保证其地址能够在互联网中访问的到
        notify_url: "http://flowerso2o.avosapps.com/alipay/notify_url",

        // 当前页面跳转后的页面 要用 http://格式的完整路径，不允许加?id:123这类自定义参数
        // 域名不能写成http://localhost/create_direct_pay_by_user_jsp_utf8/return_url.jsp ，否则会导致return_url执行无效
        return_url: "http://127.0.0.1:3000/payreturn",

        // 支付宝通知验证地址
        ALIPAY_HOST: "mapi.alipay.com",
        HTTPS_VERIFY_PATH: "/gateway.do?service=notify_verify&",
        ALIPAY_PATH: "/gateway.do?",

//↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


        // 调试用，创建TXT日志路径
        log_path: "~/alipay_log_.txt",

        // 字符编码格式 目前支持 gbk 或 utf-8
        input_charset: "UTF-8",//"UTF-8"

        // 签名方式 不需修改
        sign_type: "MD5",
        md5_key: "1y203sj4yzcwrv7ssfmltr21oo3kbjyp"
    };

    var AlipayNotify = {
        verity: function (params, callback) {

//        var mysign = getMySign(params);
//        var sign = params["sign"]?params["sign"]:"";

//        console.dir("mysign : " + mysign);
//        console.dir("sign : " + sign);

//        if(mysign==sign)
//        {
//            console.dir('签名一致');
            var responseTxt = "true";
            if (params["notify_id"])  //16ff913a33b94846e56a87149b66aaf43q
            {
                //获取远程服务器ATN结果，验证是否是支付宝服务器发来的请求
                var partner = AlipayConfig.partner;
                var veryfy_path = AlipayConfig.HTTPS_VERIFY_PATH + "partner=" + partner + "&notify_id=" + params["notify_id"];

                requestUrl(AlipayConfig.ALIPAY_HOST, veryfy_path, function (responseTxt) {

//                    console.dir("URL callback  :  " + responseTxt);

                    if (responseTxt) {
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                });
            }
//        }
//        else
//        {
//            console.dir('签名不一致');
//            callback(false);
//        }

            //写日志记录（若要调试，请取消下面两行注释）
            //String sWord = "responseTxt=" + responseTxt + "\n notify_url_log:sign=" + sign + "&mysign="
            //              + mysign + "\n 返回参数：" + AlipayCore.createLinkString(params);
            //AlipayCore.logResult(sWord);


            //验证
            //responsetTxt的结果不是true，与服务器设置问题、合作身份者ID、notify_id一分钟失效有关
            //mysign与sign不等，与安全校验码、请求时的参数格式（如：带自定义参数等）、编码格式有关
        }
    };

    function getParamsString(params) {
        var sPara = [];//转换为数组利于排序 除去空值和签名参数
        if (!params) return null;
        for (var key in params) {
            if ((!params[key]) || key == "sign" || key == "sign_type") {
//            console.log('null:'+key);
                continue;
            }
            ;
            sPara.push([key, params[key]]);
        }
        sPara.sort();
        //生成签名结果
        var prestr = "";
        //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
        for (var i2 = 0; i2 < sPara.length; i2++) {
            var obj = sPara[i2];
            //console.dir(typeof obj[1]);

            //if (AV._.isString(obj[1])) obj[1].replace(" ","");

            if (i2 == sPara.length - 1) {
                prestr = prestr + obj[0] + "=" + obj[1];
            } else {

                prestr = prestr + obj[0] + "=" + obj[1] + "&";
            }

        }
        return prestr;
    }

//获取验证码
    var getSignOfMD5 = function (prestr) {

        prestr = prestr + AlipayConfig.privKey; //把拼接后的字符串再与安全校验码直接连接起来
        //body=Hello&buyer_email=13758698870&buyer_id=2088002007013600&discount=-5&extra_common_param=你好，这是测试商户的广告。&gmt_close=2008-10-22 20:49:46&gmt_create=2008-10-22 20:49:31&gmt_payment=2008-10-22 20:49:50&gmt_refund=2008-10-29 19:38:25&is_total_fee_adjust=N&notify_id=70fec0c2730b27528665af4517c27b95&notify_time=2009-08-12 11:08:32&notify_type=交易状态同步通知(trade_status_sync)&out_trade_no=3618810634349901&payment_type=1&price=10.00&quantity=1&refund_status=REFUND_SUCCESS&seller_email=chao.chenc1@alipay.com&seller_id=2088002007018916&sign=_p_w_l_h_j0b_gd_aejia7n_ko4_m%2Fu_w_jd3_nx_s_k_mxus9_hoxg_y_r_lunli_pmma29_t_q%3D%3D&sign_type=DSA&subject=iphone手机&total_fee=10.00&trade_no=2008102203208746&trade_status=TRADE_FINISHED&use_coupon=N

        var crypto = require('crypto');
        return crypto.createHash('MD5').update(prestr, "utf-8").digest("hex");
    };

    var requestUrl = function (host, path, callback) {

//    console.dir("requestUrl");

        var https = require('https');

        var options = {
            host: host,
            port: 443,
            path: path,
            method: 'GET'
        };

        var req = https.request(options, function (res) {

//        console.log("statusCode: ", res.statusCode);
//        console.log("headers: ", res.headers);

            res.on('data', function (d) {
                callback(d);
            });
        });
        req.end();

        req.on('error', function (e) {
            console.error(e);
        });
    };


    /*
     * GET home page.
     */
    app.get('/alipay/demo', function (req, res) {

//    var mysign = getMySign(params);

        //var prestr = "body=这个一个测试订单&buyer_email=15810513348&buyer_id=2088402906026313&discount=0.00&gmt_create=2014-10-26 19:00:06&gmt_payment=2014-10-26 19:00:08&is_total_fee_adjust=N&notify_id=a43d7f67f338197ed0cb45cc589c9e5f3q&notify_time=2014-10-27 19:24:48&notify_type=trade_status_sync&out_trade_no=544cd3f5e4b0978ad96672de&payment_type=1&price=0.01&quantity=1&seller_email=wjusaappleid@126.com&seller_id=2088311757225694&subject=测试订单&total_fee=0.01&trade_no=2014102618144831&trade_status=TRADE_SUCCESS&use_coupon=N";

        var params = {
            "subject": "测试订单",
            "discount": "0.00",
            "trade_status": "TRADE_CLOSED",
            "gmt_payment": "2014-10-30 17:33:30",
            "seller_email": "wjusaappleid@126.com",
            "buyer_email": "18910557310",
            "gmt_close": "2014-10-30 19:34:22",
            "use_coupon": "N",
            "quantity": "1",
            "total_fee": "0.01",
            "gmt_create": "2014-10-30 17:33:29",
            "gmt_refund": "2014-10-30 19:34:22",
            "seller_id": "2088311757225694",
            "sign": "KyrfAT3wQ1oMpmQRY+Ze+x6ukhwe7G1Mftk6BMB+FfNFOKs9N9YAABc6Z3dz2WcWQ06tjcG8Ya9wdngR2SX4gvUy4xBOApRKhboUOICX/xwua11u261z50zjJp1DuKMk3N8i3hjYbOFrTe217jsI8fo3KFs+r1nMWDbsthNNq58=",
            "notify_time": "2014-10-30 19:34:23",
            "notify_id": "8aac57712d946ca3b555b5318b9a4b196w",
            "payment_type": "1",
            "is_total_fee_adjust": "N",
            "out_trade_no": "546acdd0e4b0a56c65001c13",
            "price": "0.01",
            "body": "这个一个测试订单",
            "sign_type": "RSA",
            "trade_no": "2014103039502788",
            "buyer_id": "2088312814806881",
            "notify_type": "trade_status_sync",
            "refund_status": "REFUND_SUCCESS"
        };

        var sign = params.sign;

        var prestr = getParamsString(params);


        //verify_test(prestr.replace(/\s/g,""), sign);

        //res.end(verify_test(prestr.replace(/\s/g, ""), sign));

        //res.end("alipay-demo");
        //require("cloud/app").hello(res);

        //smsParams =

        require("cloud/app").completeOrders(params.out_trade_no, params.trade_no, params, 3, 10, function (success) {

            console.dir("完成订单 : " + success);
            if (success) {

                res.end("success");	//请不要修改或删除——
            }
            else
            {
                res.end("fail");
            }
        });

//    prestr = prestr + AlipayConfig.privKey; //把拼接后的字符串再与安全校验码直接连接起来

//    var crypto = require('crypto');
//    var verify = crypto.createVerify('RSA-SHA1').update(prestr, AlipayConfig.input_charset).verify(pubkey, sig, 'base64');
//    var mysign = crypto.createHash('MD5').update(prestr, AlipayConfig.input_charset).digest("hex");


        //res.end(prestr.replace(/\s/g,""));


//    sign = crypto.createHash('MD5').update(sign, AlipayConfig.input_charset).digest("hex");

//    var verify = crypto.createVerify('RSA-SHA1');
//    verify.update(prestr);
//    var result = verify.verity(AlipayConfig.pubkey,sign,"base64");

//    var rsa = require('./rsa.js');
//    var params = { publicKey: AlipayConfig.pubkey, privateKey: AlipayConfig.privKey, passphrase: "foobar" };
//    var keypair = rsa.createRsaKeypair(params);
//    var ciphertext = keypair.encrypt(prestr, 'utf8', 'hex');

//    res.end(AlipayConfig.pubkey);

//    var orderNOs = ['ssss','zzzz'];
//    console.dir(orderNOs instanceof Array);
//    console.dir(orderNOs);

//    AV.Object.createWithoutData("CommodityPayment", "5450d8ace4b07189da802209").fetch(function(payment){
//
////        res.end(payment);
//
////        if (!__production) console.dir(payment);
//
//        var payMethod = payment.get('payMethod');
//
//        var orderNOs = payment.get('orderNOs');
//
//        var orderIds = payment.get('orderIds');
//
////        console.dir(payment);
//
//        console.dir(orderNOs instanceof Array);
//        console.dir(orderIds instanceof Array);
//
////        console.dir(typeof (orderNOs));
////        console.dir(orderNOs);
////
////        if (payment)
////        {
//////            payment.set('payData',params);
////            payment.set('isDone',true);
////            payment.fetchWhenSave(true);
////            payment.save().then(function(payment){
////
////                console.dir(payment);
////                if (payment)
////                {
////                    console.dir("订单1");
////                }
////                res.end(payment);
////
////            },function(error){
////                console.dir(error);
////            });
////        }
//
//    },function(error){
//        console.dir(error);
//    });

//    console.dir("订单 : "+paymentId);

        //var paymentId = "5450d20ce4b07189da7fa71d";
        //AV.Object.createWithoutData("CommodityPayment", paymentId).fetch(function(payment){
        //
        //    var orderNOs = payment.get('orderNOs');
        //
        //    var orderIds = payment.get('orderIds');
        //
        //    console.dir(orderNOs);
        //    console.dir(orderNOs instanceof Array);
        //    console.dir(orderIds);
        //    console.dir(orderIds instanceof Array);
        //    res.end(true);
        //
        //},function(error){
        //    res.end(false);
        //});


    });

    app.all('/alipay/hello', function (request, response) {
        response.end("alipay-hello");
    });

    /**
     * 验证签名
     * @param {String} prestr 需要签名的字符串
     * @param {String} sign 签名结果
     * @param {String} cert_file 支付宝公钥文件路径
     * @return {Boolean} 是否通过验证
     */

    var verify_test = function (prestr, sign) {

        console.dir("verify_test");

        var publicKey = '-----BEGIN PUBLIC KEY-----\n' +
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDbBOxj6+7+kv8+EVqcBoGwuEke\n' + 'mQzUCAQnxM/3XZT6Bl+j4/nM4R92qVqiTWrj/qBhaRST9eSn6qYs2sq0LeiMSnAK\n' +
            '5uRBaGR6w2qcUDPRwbgYIZEL7X4qvshedo1JXZHfVT7uMV7GAxvhdGU5co7Pve5n\n' +
            'XiUSUBlGVA/FR+fyTwIDAQAB\n' +
            '-----END PUBLIC KEY-----';

        var privateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
            'MIICXAIBAAKBgQDbBOxj6+7+kv8+EVqcBoGwuEkemQzUCAQnxM/3XZT6Bl+j4/nM\n' +
            '4R92qVqiTWrj/qBhaRST9eSn6qYs2sq0LeiMSnAK5uRBaGR6w2qcUDPRwbgYIZEL\n' +
            '7X4qvshedo1JXZHfVT7uMV7GAxvhdGU5co7Pve5nXiUSUBlGVA/FR+fyTwIDAQAB\n' +
            'AoGAVxO2CGQdOQmogTzVEYNkvKYILCodd49YV5dgN7D1MhKmo7pX7qTypXLfnfe5\n' +
            'r7vkd9YXYFw69KfOObcjME+wTJpdhmivSzVdqmOQvtadBWwzLe5p4uZ5ml/7NJzd\n' +
            'dnQEsyGYNqPpf870NXmiYfsjjtRhVmrBZqXpVvsPIFGVMoECQQDwMd/9hk0BJ8R5\n' +
            'y9S8EJLKk2k6rV4VkKu95zfNBkM5QVvYKtuhWrAc2cV5Cm/ZUMIUn0POKgAohe+q\n' +
            'ihN4G5QHAkEA6W5Xfs7dU+Sam7nzmdZqBrM+GGi8YYMQPZUZiQuW6Iwt6PaYYLKK\n' +
            'dW2IE/UzayDfmjdfzvDq8KJhs5oEzmhteQJBAL91EfUU6yaDm2H2LoEluMxOii9i\n' +
            'Z79KzQqXVmxPlJ/70AjTyLOqBP1KPNTJk/QmIj2r4bFg2zVx5WMLoo83dFsCQCdu\n' +
            '02sBiRQF9zQ9WnBvbyPIncHD16blXBX7HQAwrAKGw66qEZ2sK4Wgxi8Q6em7+On1\n' +
            'VsL/ocCavcR4TT2NGIkCQA6MqMpbysSU5LWm/jRDBEvJlpzUbfhqBxvVY99kM9xR\n' +
            'LcvKrqjCX+lGoz8aJCCiFiimHOXltef9B5n//lggizc=\n' +
            '-----END RSA PRIVATE KEY-----';

        //var rsa = require('../node_modules/rsa-stream');
        //var process = require('process');
        //var enc = rsa.encrypt(publicKey, { encoding: 'base64' });
        //
        //process.stdin.pipe(enc).pipe(process.stdout);

        //var ursa = require('../node_modules/ursa');

        //var crypto = require('crypto');
        //console.dir(crypto.verify(privateKey,sign,"utf-8"));

        // create a pair of keys (a private key contains both keys...)
        //var keys = ursa.generatePrivateKey();
        //console.log('keys:', keys);
//
//// reconstitute the private key from a base64 encoding
//    var privPem = keys.toPrivatePem('base64');
////    console.log('privPem:', privPem);
//
//    var priv = ursa.createPrivateKey(privateKey, '', 'base64');
//
////// make a public key, to be used for encryption
////    var pubPem = keys.toPublicPem('base64');
////    console.log('pubPem:', pubPem);
//
//    var pub = ursa.createPublicKey(publicKey, 'base64');
//
////// encrypt, with the public key, then decrypt with the private
////    var data = new Buffer('hello world');
////    console.log('data:', data);
//
//    var enc = pub.encrypt(prestr);
//    console.log('enc:', enc);
//
//    var unenc = priv.decrypt(sign);
//    console.log('unenc:', unenc);


        var NodeRSA = require('../node_modules/node-rsa');
        var key = new NodeRSA(publicKey);
        var text = '_input_charset=utf-8&body=""&notify_url="http://flowerso2o.avosapps.com/alipay/pay_notify"&out_trade_no="54548c8ae4b06ba70c3d0dee"&partner="2088311757225694"&payment_type="1"&seller_id="wjusaappleid@126.com"&service="mobile.securitypay.pay"&subject="2014110118313181185072"&total_fee="0.01"';

        //加密
        var encrypted = key.encrypt(text, 'base64');
        console.log('encrypted: ', encrypted);

        console.log('sign : ' + sign);

        //解密
        //var decrypted = key.decrypt(encrypted, 'utf8');
        //console.log('decrypted: ', decrypted);

        //var encrypted = key.encrypt(prestr+AlipayConfig.privKey, 'base64');
        //console.log('decrypted: ', encrypted);

        //console.log(sign);
        //var decrypted = key.decrypt(sign, 'utf-8');
        //console.log('decrypted: ', decrypted);
        //var resule = encrypted==sign;


        //var RSATool=require('../node_modules/simple-rsa');

        //var encParam = {
        //
        //    "e" : "10001",
        //
        //    "n" : "856381005a1659cb02d13f3837ae6bb0fab86012effb3a41c8b84badce287759",
        //
        //};

        //var encryptor=RSATool.Encryptor(privateKey);

        //var pass1=encryptor(prestr);

        //var pass2=encryptor('this is a test!');


        //console.dir(pass1);
        //console.dir(pass2);

        //var translator = require("cloud/rsa-translator");
        //translator.decrypt(prestr, {
        //    'private_key': privateKey
        //}, function(err, result) {
        //
        //    console.dir(err);
        //    console.dir(result);
        //
        //    done();
        //});

//    console.dir(publicKey);
//    console.dir(privateKey);
//    console.dir(prestr);
//    console.dir(sign);

//    var crypto = require('crypto');
//
//    var verifyob = crypto.createVerify('RSA-SHA1');
//    verifyob.update(prestr, 'utf8');
//
//    var result = verifyob.verify(publicKey, sign, 'base64');
//
//    console.dir(result);
//
//    var signer = crypto.createSign('RSA-SHA1');
//    signer.update(prestr,'utf8');
//    var sign = signer.sign(privateKey, "base64");
//
//    console.dir(sign);

        //var crypto = require('crypto');
        //var fs = require('fs');
        //
        //var publicPem = fs.readFileSync('cloud/FlowerKey/rsa_public_key.pem');
        //var pubkey = publicPem.toString();
        //console.dir("pubkey : "+pubkey);
        //
        //var verify = crypto.createVerify('RSA-SHA1');
        //verify.update(prestr, 'utf8');
        //var result = verify.verify(pubkey, sign, 'base64');
        //
        //console.dir(result);

        return prestr;
    };

    /*

     {

     notify_type: 'trade_status_sync',   //通知的类型。
     notify_time: '2014-10-24 19:10:31',  //通知的发送时间。 格式为 yyyy-MM-dd HH:mm:ss。
     notify_id: '047c6b5543ec7959d69f7a89fea987013q',   //通知校验 ID。

     //签名
     sign: 'FfFaxQKgI+pQuF9aaShAciIYo2luCui0EGPjZ0vIktJN8X0IUAJKdUHf9Vxo642+oscmMmOI/6M5vLdCt20LPYahXL9e9yG4rQneLN0+GxuwSAsR555hZMEQBjzENdjTowqpxODO5asFFryYJ+2IwDXh1U3JvTVvi+DlBk9eEJY=' }


     out_trade_no: '5448f90ee4b03f69b4e4392c',   //order的id
     subject: '测试订单',   // 订单关键字(可空)。它在支付宝的交易明细中排在第一列,对于财务对账尤为重要。是请求时对应的参数,原样通知回来。
     body: '这个一个测试订单',  //订单备注
     total_fee: '0.01',     //交易金额

     TRADE_CLOSED //在指定时间段内未支付时关闭的交易;   在交易完成全额退款成功时关闭的交易。
     TRADE_SUCCESS //交易成功,且可对该交易做操作,如:多级分润、退款等。
     TRADE_FINISHED //交易成功且结束,即不可再做任何操作。
     WAIT_BUYER_PAY //交易创建,等待买家付款。
     trade_status: 'TRADE_SUCCESS', //交易状态

     sign_type: 'RSA',  // 签名方式
     discount: '0.00',
     payment_type: '1', // 支付类型

     trade_no: '2014102408608231',  //支付宝交易号

     seller_id: '2088311757225694', //卖家支付宝用户号
     seller_email: 'wjusaappleid@126.com',
     buyer_id: '2088402906026313',
     buyer_email: '15810513348',
     gmt_create: '2014-10-24 19:10:30',//交易创建时间
     gmt_payment: '2014-10-24 19:10:31',//交易付款时间
     price: '0.01', //购买单价
     quantity: '1',  //购买数量
     is_total_fee_adjust: 'N',  //是否调整总价
     use_coupon: 'N',//是否使用红包买家


     */



//付款回调通知接口
    app.all('/alipay/pay_notify?', function (req, res) {

        console.dir('alipay_pay_notify');

        if (req.method == 'GET') {
            res.end("alipay_pay_notify : GET");
            return;
        }

      //获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//

//       var params = req.query;
//      console.dir(params);
        var params = req.body;
        //console.dir("支付宝付款 : "+JSON.parse(params));

        var payment = new AL.config.CommodityPayment();
        payment.set("payMethod",AL.config.ALPayMethod.aliPay);
        payment.set("payData",params);
        payment.set("orderNO",params.body);
        payment.set('state',params.trade_status);
        payment.save();

        AlipayNotify.verity(params, function (success) {

            //console.dir("初始化 : " + success);
            if (success) {
                //请在这里加上商户的业务逻辑程序代码
//            res.end("success");
                //——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
//            var trade_status = params.trade_status;
////            console.dir(trade_status+" : "+typeof (trade_status));
//            console.dir("订单0000");
//            completePayment(params,10,function(success){

                var orderId = params.out_trade_no; //order id
                var tradeNO = params.trade_no;     //支付宝 交易号
                //var orderNO = params.body;         //orderNO
                var paymentAmount = parseInt(params.total_fee*100);   //支付金额(单位:分)

                var orderEngine = require('cloud/routes/order');

                switch (params.trade_status){
                    case "WAIT_BUYER_PAY":
                    {

                    }
                        break;
                    case "TRADE_SUCCESS":  //交易成功
                    {
                        orderEngine.completeOrders( orderId,
                                                    tradeNO,
                                                    paymentAmount,
                                                    params,
                                                    AL.config.ALPayMethod.aliPay,
                                                    10,
                                                    function (success) {

                            console.dir("完成订单 : " + success);
                            if (success)
                            {
                                res.end("success");	//请不要修改或删除——
                            }
                            else
                            {
                                res.end("fail");
                            }
                        });
                    }
                        break;
                    case "TRADE_CLOSED":   //退款成功
                    {
                        orderEngine.closeOrders(orderId,
                                                tradeNO,
                                                paymentAmount,
                                                params,
                                                AL.config.ALPayMethod.aliPay,
                                                10,
                                                function (success) {

                            console.dir("完成订单 : " + success);
                            if (success)
                            {
                                res.end("success");	//请不要修改或删除——
                            }
                            else
                            {
                                res.end("fail");
                            }
                        });
                    }
                        break;
                }



                //orderId,tradeNo,params,payMethod,tryTimes,done


//            if(trade_status=="TRADE_FINISHED"){
//                //判断该笔订单是否在商户网站中已经做过处理
//                //如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
//                //如果有做过处理，不执行商户的业务程序
//
//                //注意：
//                //该种交易状态只在两种情况下出现
//                //1、开通了普通即时到账，买家付款成功后。
//                //2、开通了高级即时到账，从该笔交易成功时间算起，过了签约时的可退款时限（如：三个月以内可退款、一年以内可退款等）后。
//
//                 console.dir("TRADE_FINISHED")
//
//            } else if (trade_status=="TRADE_SUCCESS"){
//                //判断该笔订单是否在商户网站中已经做过处理
//                //如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
//                //如果有做过处理，不执行商户的业务程序
//
//                //注意：
//                //该种交易状态只在一种情况下出现——开通了高级即时到账，买家付款成功后。
//                console.dir("TRADE_SUCCESS")
//            }

                //——请根据您的业务逻辑来编写程序（以上代码仅作参考）——


                //////////////////////////////////////////////////////////////////////////////////////////
            }
            else {
                console.dir("失败");
                res.end("fail");
            }
        });
//        res.end("success");
    });



//退款回调通知接口
    app.all('/alipay/refund_notify', function (req, res) {

        console.dir('refund_notify');

        var params = req.body;
        console.dir(params);

        res.end('success');
    });

    function getAlipayDate(date) {
        // var dateFormat = new DateFormat();
        // dateFormat.applyPattern("yyyy-MM-dd HH:mm:ss");
        //return dateFormat.format(date);
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }

    function getAlipayBatchNO(date, paymentId) {
        //return date.format("yyyyMMddHHmmssfff")+paymentId;
        //var dateFormat = new DateFormat();
        //dateFormat.applyPattern("yyyyMMddHHmmssfff");
        //return dateFormat.format(date)+paymentId;
        //SSS+paymentId
        return moment(date).format("YYYYMMDDHHmmss");
    }

    AV.Cloud.define("refund", function (req, res) {

        var paymentId = req.params.paymentId;
        var refundPrice = parseInt(req.params.refundPrice);
        var refundReason = req.params.refundReason;
        refund_fastpay_by_platform_pwd(paymentId, refundPrice, refundReason, function (suc, err) {

        });
    });



    app.get('/refund/:orderId', function (req, res) {

        //var params = req.query;
        var orderId = req.params.orderId;
        refund_fastpay_by_platform_pwd(orderId, 0.01, "TestRefund", function (url) {
            res.end(url);
        });
    });

//即时到账批量退款有密接口
    function refund_fastpay_by_platform_pwd(orderId, refundPrice, refundReason, done) {

        //var assert = require('assert');
        //assert.ok(refund_date && batch_no && batch_num && detail_data);

        console.dir("申请退款");

        if (AV._.isNull(orderId) || !AV._.isString(orderId) || AV._.isNull(refundPrice) || !AV._.isNumber(refundPrice)) {
            done(false, AL.error(777123, "参数错误"));
            return;
        }


        var date = new Date();
        //var timeStr = date.format('YYYYMMDDHHmmss');
        //console.dir(timeStr);

        //console.dir(moment(date,"yyyy-MM-dd HH:mm:ss"));

        //console.dir(getAlipayDate(date));
        //console.dir(getAlipayBatchNO(date,paymentId));

        //var detail_data = paymentId+"^"+refundPrice+"^"+(refundReason?refundReason:"无");
        //console.dir(detail_data);

        //构造要请求的参数数组
        var params = {
            //基本参数,无需改动
            "service": 'refund_fastpay_by_platform_pwd',
            "partner": "2088311757225694", //平台号
            "_input_charset": "utf-8",
            "notify_url": "http://flowerso2o.avosapps.com/alipay/refund_notify",

            // 业务参数
            "seller_user_id": "2088311757225694",  //卖家号（自营商品: 平台号==卖家号）

            "refund_date": getAlipayDate(date),
            "batch_no": getAlipayBatchNO(date, paymentId),
            "batch_num": "1",
            "detail_data": paymentId + "^" + refundPrice + "^" + (refundReason ? refundReason : "无")

        };

        /*
         "batch_num":1,
         "detail_data":"原付款支付宝交易号(trade)^退款总金额^退款理由",

         "batch_num":2,
         "detail_data":"(第一笔的)原付款支付宝交易号^退款总金额^退款理由#(第二笔的)原付款支付宝交易号^退款总金额^退款理由",
         */

        //参数字符串
        var prestr = getParamsString(params);

        console.dir("prestr = " + prestr.replace(" ", ""));

        //签名 (防止参数被篡改)
        var sign = getSignOfMD5(prestr.replace(" ", ""))
            , sign_type = "MD5";

        console.dir("MD5 = " + sign);

        //URL
        var url = "https://mapi.alipay.com/gateway.do?" + prestr + "&sign=" + sign + "&sign_type=" + sign_type;

        //console.log(url);

        done(url);
        //requestUrl(url,function(responseTxt){
        //
        //    if(responseTxt)
        //    {
        //        callback(true);
        //    }
        //    else
        //    {
        //        callback(false);
        //    }
        //});
        //
        //var html_text = alipaySubmit.buildRequestForm(parameter,"get", "确认");
        //res.send(html_text);

    }

// 即时到账交易接口
    function create_direct_pay_by_user() {

    }

//批量付款到支付宝账户有密接口
    function batch_trans_notify() {

        //构造要请求的参数数组，无需改动
        //var params = {
        //    "service" : 'batch_trans_notify',
        //    "partner" : "2088311757225694",
        //    "seller_user_id" :"2088311757225694",
        //    "notify_url":"http://flowerso2o.avosapps.com/alipay/batch_pay_notify",
        //    "refund_date":getAlipayDate(date),
        //    "batch_no":getAlipayBatchNO(date,paymentId),
        //    "batch_num":"1",
        //    "detail_data":paymentId+"^"+refundPrice+"^"+(refundReason?refundReason:"无"),
        //    "_input_charset":"utf-8"
        //};

        var sign_type = "MD5";
    }

// 网银支付
    function create_direct_pay_by_use() {

        //构造要请求的参数数组
        var params = {
            //基本参数,无需改动
            service: 'create_direct_pay_by_user',
            partner: "2088311757225694", //平台号
            _input_charset: "utf-8",
            notify_url: "http://flowerso2o.avosapps.com/alipay/direct_pay_notify",
            //"return_url":"web端成功跳转页（web端需要,页面跳转用）",
            // "error_notify _url":"web端失败跳转页",

            // 业务参数
            out_trade_no: "",    //订单号
            subject: "",         //商品名
            payment_type: "1",   //收款类型 商品购买
            defaultbank: "",     //选择银行 银行简码
            seller_id: "2088311757225694",  //卖家号（自营商品: 平台号==卖家号）
            price: "",//单价
            quantity: "",//数量
            total_fee: "",//总价
            body: "",//商品描述
            show_url: "",//商品展示网址 收银台页面上,商品展示的超链接。
            refund_date: getAlipayDate(date),
            batch_no: getAlipayBatchNO(date, paymentId),
            batch_num: "1",
            detail_data: paymentId + "^" + refundPrice + "^" + (refundReason ? refundReason : "无")

        };

        var sign_type = "MD5";
    };
};

/*
 app.get('/wechatApiDemo', function(req, res) {

 res.render('wechatApiDemo',{});
 });
 */
