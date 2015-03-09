
/****************
 通用函数
 *****************/
var url = require('url'),
    querystring = require('querystring'),
    crypto = require('crypto'),
    events = require('events'),
    emitter = new events.EventEmitter(),
    //xml2js = require('xml2js'),
    fs = require('fs');

var AL = require('cloud/lib/ALCommonUtil').AL();

/*


 1 已关注公众号用户获取用户资料

 1.1 获取openid  (用户关注以及回复消息的时候（一般会在这类时机使用），均可以获得用户的OpenID) (click事件获取openid)
     <xml>
     <ToUserName><![CDATA[gh_b629c48b653e]]></ToUserName>
     <FromUserName><![CDATA[ollB4jv7LA3tydjviJp5V9qTU_kA]]></FromUserName>
     <CreateTime>1372307736</CreateTime>
     <MsgType><![CDATA[event]]></MsgType>
     <Event><![CDATA[subscribe]]></Event>
     <EventKey><![CDATA[]]></EventKey>
     </xml>
 1.2 获取全局token
     https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf3353c73c4e2d552&secret=f31a689fbd7233690b492549bf3cb702
 1.3 通过openid+全局token 获取 用户资料
     https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID



 2 OAuth2.0方式弹出授权页面

 2.1 用户授权页面
     https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8888888888888888&redirect_uri=http://mascot.duapp.com/oauth2.php&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect
 2.2 获取code(授权完成回调)
    redirect_uri?code=00b788e3b42043c8459a57a8d8ab5d9f&state=1
 2.3 使用code换取oauth2的授权的局部access_token (局部access_token+refresh_token+openid)
    https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx8888888888888888&secret=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&code=00b788e3b42043c8459a57a8d8ab5d9f&grant_type=authorization_code
 2.4.1 使用refresh_token获取新的access_token
 2.4.2 使用access_token得到用户信息
    https://api.weixin.qq.com/sns/userinfo?access_token=OezXcEiiBSKSxW0eoylIeAsR0GmYd1awCffdHgb4fhS_KKf2CotGj2cBNUKQQvj-G0ZWEE5-uBjBz941EOPqDQy5sS_GCs2z40dnvU99Y5AI1bw2uqN--2jXoBLIM5d6L9RImvm8Vg8cBAiLpWA8Vw&openid=oLVPpjqs9BhvzwPj5A-vTYAX3GLc



 3 OAuth2.0方式不弹出授权页面(关注会得到全部信息不关注只有openid)(view事件获取openid)

 2.1 用户授权 (scope=snsapi_base 表示不弹出授权页面，直接跳转，只获取用户openid)
    https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8888888888888888&redirect_uri=http://mascot.duapp.com/oauth2.php&response_type=code&scope=snsapi_base&state=1#wechat_redirect
 2.2 获取code(授权完成回调)
    redirect_uri?code=00b788e3b42043c8459a57a8d8ab5d9f&state=1
 2.3 使用code换取openid (关注会得到全部信息不关注只有openid)
    https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx8888888888888888&secret=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&code=00b788e3b42043c8459a57a8d8ab5d9f&grant_type=authorization_code

 //获取全局token
 https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf3353c73c4e2d552&secret=f31a689fbd7233690b492549bf3cb702


  //菜单
 https://api.weixin.qq.com/cgi-bin/menu/create?access_token=S-9vKqo_d2afuaIeXeefpexr5nLr1RuRl2MK13wNuF5COfQHk11z4jBXCT6xeyfWgcJv5iPQoaQkTmC3XvVDryOL1moMPn1im1HlSzdIN3U

 {
 "button":[
 {
 "name":"关于Bloom",
 "sub_button":[

 {
 "type":"view",
 "name":"what",
 "url":"http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202557126&idx=1&sn=07816e755319d57c0ca93aabc4d6c3d7#rd"
 },
 {
 "type":"view",
 "name":"how",
 "url":"http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202541074&idx=1&sn=146b4aeb109efbe9e8eb2181a1478e47#rd"
 },
 {
 "type":"view",
 "name":"why",
 "url":"http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202540202&idx=1&sn=119fb091fd479143b739f5b135f48bcf#rd"
 }]
 },
 {
 "type":"click",
 "name":"下载Bloom",
 "key":"BLOOM_APP"
 },
 {

 "name":"我是商家",
 "sub_button":[
 {
 "type":"view",
 "name":"如何加入",
 "url":"http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202339510&idx=1&sn=62fb92734c129e775c409aa17779ae10#rd"
 },
 {
 "type":"view",
 "name":"接单流程",
 "url":"http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202478350&idx=1&sn=cdb208f3308601386ff7ab18c28c47dc#rd"
 },
 {
 "type":"view",
 "name":"接单须知",
 "url":"http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202410229&idx=1&sn=c2b03c4fb6c9407f471e7aa62810389b#rd"
 },
 {
 "type":"view",
 "name":"停止接单",
 "url":"http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202479105&idx=1&sn=01670da58f56ed7364a4e740444d6d16#rd"
 },
 {
 "type":"view",
 "name":"我的订单",
 "url":"http://flowerso2o.avosapps.com/wechat/delivery/getMyDelivery"
 }]
 }
 ]
 }


 */

/*
 * API 模块
 *
 */
var API = function (appid, appsecret, token, app) {

    //并不是单例 这种写法只是 每次可以直接调用API()来创建API对象
    if (!(this instanceof API)) {
        return new API(appid, appsecret, token, app);
    }

    var that = this;
    this.appid = appid;
    this.appsecret = appsecret;
    this.token = token;
    this.app = app;

    this.OAuth = OAuth(that);
    this.AccessToken = AccessToken(that);
    this.Webot = Webot(that);
};


API.prototype.checkWechatSignature = function(req,res){

    console.dir("检验 微信URL");

    var queryObj = querystring.parse(url.parse(req.url).query);
    //var queryObj = request.query;

    //微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数
    var signature = queryObj.signature,
    //时间戳
        timestamp = queryObj.timestamp,
    //随机数
        nonce = queryObj.nonce;

    var sha1 = crypto.createHash('sha1'),
        sha1Str = sha1.update([this.token, timestamp, nonce].sort().join('')).digest('hex');

    var valid = sha1Str === signature;

    console.dir("sha1Str : "+sha1Str);
    console.dir("signature : "+signature);
    console.dir("valid : "+valid);

    //验证失败
    if (!valid)
    {
        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        res.end('');
        return false;
    }

    //首次验证随机码
    var echostr = queryObj.echostr;

    //首次验证消息
    if (echostr)
    {
        console.dir("首次验证 : "+echostr);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(echostr);
        return false;
    }

    return true;
};

API.prototype.wechatReceivedMessage = function(req, done){

    var post='';
    req.on('data',function(chunk){
        post+=chunk;
    });

    req.on('end',function(){
        console.dir(post);
        //post = querystring.parse(post);
        //console.dir(AL.parse.xml2json(post,function(json,error){
        //    console.dir(json);
        //}));
        //return done(post,null);

        AL.parse.xml2json(post,done);
    });
};

API.prototype.wechatSendTemplateMessage = function(tmplId, toOpenIds, params, done){

    params.template_id = tmplId;

    this.AccessToken.getToken(function(accessToken,error){

        if (accessToken && !error)
        {
            var URL = "http://api.weixin.qq.com/cgi-bin/message/template/send?access_token="+accessToken;

            for (var i in toOpenIds)
            {
                var toOpenId = toOpenIds[i];

                params.touser = toOpenId;

                console.dir(params);

                AL.httpPostRequest(URL,params,function(result,error){

                    if (error)
                    {
                        done(false,error);
                    }
                    else
                    {
                        var errcode = result.errcode;

                        var errmsg = result.errmsg;

                        if (errcode==0 && errmsg=="ok")
                        {
                            if (!__production) console.log("发送模板消息成功 : "+toOpenId);
                            done(true);
                        }
                        else
                        {
                            if (!__production) console.log("发送模板消息失败 : "+toOpenId);
                            done(false,AL.error(result.errcode,result.errmsg));
                        }
                    }
                });
            }
        }
        else
        {

        }

    });



};

/**
 *  OAuth2 认证模块(初始化)
 */
var OAuth = function (API) {

    if (!(this instanceof OAuth)) {
        return new OAuth(API);
    }

    // this 指的是当前 函数 不同地方 会产生歧义
    var that = this;
    that.API = API;
    that.appid = API.appid;
    that.appsecret = API.appsecret;
    that.app = API.app;

    //console.log("OAuth");
    //console.dir(that.app);

    that.getCode = function(redirectURL, scope, res){

        //console.dir("getCode redirectURL : "+redirectURL); //不ok

        /**
         * 获取授权页面的URL地址
         * @param {String} redirect 授权后要跳转的地址
         * @param {String} state 开发者可提供的数据
         * @param {String} scope 作用范围，值为snsapi_userinfo和snsapi_base，前者用于弹出，后者用于跳转
         */
        /*
         scope:
         snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid）
         snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且，即使在未关注的情况下，只要用户授权，也能获取其信息）
         */

        var getAuthorizeURL = function (redirect, state, scope) {
            var url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
            var info = {
                appid: that.appid,
                redirect_uri: redirect,
                response_type: 'code',
                scope: scope || 'snsapi_base',
                state: state || ''
            };

            return url + '?' + querystring.stringify(info) + '#wechat_redirect';
        };

        //res.render('wechatOAuth',{URL:URL});
        //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx099d898a32473ab9&redirect_uri=http://flowerso2o.avosapps.com/wechat/redirect_uri/123456&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect"
        var URL = getAuthorizeURL(redirectURL, "1", scope);

        //console.dir("OAuth : "+URL); //// 本地ok
        res.redirect(URL);
    };

    that.getOpenId = function(code, done){

        if (!code)
        {
            done(null,AL.error(777123,"参数错误"));
            return;
        }

        var getOpenIdURL = function (code) {
            var url = 'https://api.weixin.qq.com/sns/oauth2/access_token';
            var info = {
                appid: that.appid,
                secret:that.appsecret,
                code: code,
                grant_type: 'authorization_code'
            };

            return url + '?' + querystring.stringify(info);
        };

        //var that = this;
        var URL = getOpenIdURL(code);
        if (!__production) console.log("getOpenIdURL : "+URL);
        AL.httpGetRequest(URL, function(result,error){

            if (error)
            {
                done(result,error);
            }
            else
            {
                //网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同
                var access_token = result.access_token;

                //用户唯一标识，请注意，在未关注公众号时，用户访问公众号的网页，也会产生一个用户和公众号唯一的OpenID
                var openid = result.openid;

                //刷新access_token参数
                var refresh_token = result.refresh_token;

                if (access_token && openid && refresh_token)
                {
                    done(result,null);
                }
                else
                {
                    done(null,AL.error(result.errcode,result.errmsg));
                }
            }
        });
    };

    if (that.app)
    {
        that.app.all('/wechatAPI/OAuth/code?', function(req, res){

            //console.dir("/wechatAPI/OAuth/code");
            var scope = req.query.scope;
            var code = req.query.code;
            var redirectURL = req.query.redirectURL;

            if (code && code.length > 0)
            {
                return that.getOpenId(code,function(result,error){

                    var openid  = result.openid;
                    var access_token = result.access_token;
                    var refresh_token = result.refresh_token;

                    if (!error && refresh_token && openid)
                    {
                        var query = 'openid='+openid+'&access_token='+access_token+'&refresh_token='+refresh_token;

                        if (redirectURL.match(/\?/g))
                        {
                            redirectURL += ("&"+query);
                        }
                        else
                        {
                            redirectURL += ("?"+query);
                        }

                        res.redirect(redirectURL);
                    }
                    else
                    {
                        res.end(error);
                    }
                });
            }
            else
            {
                //1
                return that.getOpenidWithOAuth(redirectURL, scope, res);
            }
        });
    }

};


// 1.
OAuth.prototype.getUserInfoWithOpenid = function(openid, done){

     this.API.AccessToken.getToken(function(token){

         if (token)
         {
            var tokenURL = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+token+"&openid="+openid;
            AL.httpGetRequest(tokenURL,done);
         }
         else
         {
             done(null,AL.error(777345,"获取token失败"));
         }
     });

    //https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID
};


// 2.3
OAuth.prototype.getOpenidWithOAuth = function(redirectURL, isOAuth, res){

    //console.dir("redirectURL : "+redirectURL);

    //接受code的地址
    var codeRedirectURL = AL.domain+"wechatAPI/OAuth/code?"+"redirectURL="+redirectURL;

    //console.dir("codeRedirectURL : "+codeRedirectURL);
    this.getCode(codeRedirectURL,isOAuth?"snsapi_userinfo":"snsapi_base",res);
};

/*
    refresh_token --> openid
 */
OAuth.prototype.refreshOpenId = function(refresh_token, done){

    //console.log("refresh_token : "+refresh_token);

    if (!refresh_token)
    {
        done(null, AL.error(777123,"参数错误"));
        return;
    }

    var that = this;
    var refreshOpenIdURL = function (refresh_token) {
        var url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token';
        var info = {
            appid: that.appid,
            refresh_token: refresh_token,
            grant_type: 'refresh_token'
        };

        return url + '?' + querystring.stringify(info);
    };

    var URL = refreshOpenIdURL(refresh_token);
    //console.log("refreshOpenIdURL : "+URL);
    AL.httpGetRequest(URL, function(result,error){

        if (error)
        {
            done(result,error);
        }
        else
        {
            //网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同
            var access_token = result.access_token;

            //用户唯一标识，请注意，在未关注公众号时，用户访问公众号的网页，也会产生一个用户和公众号唯一的OpenID
            var openid = result.openid;

            //刷新access_token参数
            var refresh_token = result.refresh_token;

            if (access_token && openid && refresh_token)
            {
                done(result,null);
            }
            else
            {
                done(null,AL.error(result.errcode,result.errmsg));
            }
        }
    });
};


/*
 //获取用户信息

 openid --> userinfo

 var queryObj = querystring.parse(url.parse(request.url).query);

 var code = queryObj.code;
 */
OAuth.prototype.getUserInfo = function(openid_result, done){

    //console.log("openid_result : "+JSON.stringify(openid_result));

    /*
     {
         "openid":"ofpYts0J8oFlGRCa_tS3lbJrjSUA",
         "access_token":"OezXcEiiBSKSxW0eoylIeHFCs3OUpnjcUfDsE8SuAIbC-vLe3-fydzL-1FUirHUjhUmQujzNVz0mHxQ_Ho8T3ayp5kqoEXGKbHcZMoBpPZq85DREtDV0RyjbtH8uRi5YcG0hTlMv4Ub7xIpzw-q6mA",
         "expires_in":7200,
         "refresh_token":"OezXcEiiBSKSxW0eoylIeHFCs3OUpnjcUfDsE8SuAIbC-vLe3-fydzL-1FUirHUjfcrWCvwyIQMaWg-C1L__6-Mp_I8GjmaFfejRcVyzemFxog1n8dwKyWfncw3Fact0id6D4TLAbYAZUw2-RWg5pQ",
         "scope":"snsapi_base,snsapi_userinfo,"
     }
     */
    if (!openid_result)
    {
        return done(null,AL.error(777121,"参数错误"));
    }

    //var that = this;
    var getUserInfoURL = function (access_token,openid) {
        var url = 'https://api.weixin.qq.com/sns/userinfo';
        var info = {
            access_token: access_token,
            openid:openid
        };

        return url + '?' + querystring.stringify(info);
    };

    var openid = openid_result.openid;
    var access_token = openid_result.access_token;
    var scope = openid_result.scope;

    //console.dir(scope.indexOf("snsapi_userinfo"));

    //console.dir("openid : "+openid);
    //console.dir("access_token : "+access_token);
    //console.dir("scope : "+scope);

    // 用户没有授权过拿不到userinfo
    if (scope.indexOf("snsapi_userinfo")==-1)
    {
        //console.dir(scope.indexOf("snsapi_userinfo"));
        return done(openid_result,null);
    }

    if (!openid || !access_token)
    {
        return done(null,AL.error(777122,"参数错误"));
    }

    var URL = getUserInfoURL(access_token, openid);
    //console.dir("last get userinfo URL : "+URL);
    AL.httpGetRequest(URL,function(result, error){

        //console.dir("last get userinfo data : "+result);

        if (!result || error)
        {
            done(openid_result,null);
        }
        else
        {
            done(result,null);
        }
    });
};

/*
 var openid = result.openid;
 var nickname = result.nickname;
 var sex = result.sex;
 var province = result.province;
 var city = result.city;
 var country = result.country;
 var headimgurl = result.headimgurl;
 // var privilege = result.privilege;
 // var unionid = result.unionid;
 */

// AccessToken 模块
var AccessToken = function (API) {

    if (!(this instanceof AccessToken)) {
        return new AccessToken(API);
    }

    var that = this;
    that.API = API;
    that.appid = API.appid;
    that.appsecret = API.appsecret;
    that.app = API.app;
    that.store = {};

    //console.log("AccessToken");
    //console.dir(that.app);

    that.prefix = 'https://api.weixin.qq.com/cgi-bin/';
    that.mpPrefix = 'https://mp.weixin.qq.com/cgi-bin/';
    that.fileServerPrefix = 'http://file.api.weixin.qq.com/cgi-bin/';
    that.payPrefix = 'https://api.weixin.qq.com/pay/';
    that.merchantPrefix = 'https://api.weixin.qq.com/merchant/';

};

AccessToken.prototype.isValid = function () {

    console.dir("当前时间 : " + new Date().getTime());
    console.dir("过期时间 : " + this.store.expiresTime);

    return this.store.accessToken && this.store.expiresTime && AL.getTimeStamp() < this.store.expiresTime;
};

// 使用fs
//AccessToken.prototype.getToken = function (done) {
//
//    //console.log("开始读取!");
//    /*
//     this代表的是当前对象。
//     var that=this就是将当前的this对象复制一份到that变量中。
//     this对象在程序中随时会改变，而var that=this之后，that没改变之前仍然是指向当时的this，这样就不会出现找不到原来的对象。
//     */
//    var that = this;
//
//    fs.readFile('public/wechat_access_token.txt', 'utf8', function (error, tokenInfo) {
//
//        if (!error)
//        {
//            try{
//                that.store = JSON.parse(tokenInfo);
//            }
//            catch(e) {
//                console.log("重新下载0");
//                that.requestAccessToken(done);
//            }
//
//            // 有token并且token没有过期
//            if (that.store && that.isValid())
//            {
//                console.log("有token并且token没有过期");
//                done(that.store.accessToken, null);
//            }
//            else
//            {
//                // 使用appid/appsecret获取token
//                console.log("重新下载1");
//                that.requestAccessToken(done);
//            }
//        }
//        else
//        {
//            console.log("重新下载2");
//            that.requestAccessToken(done);
//        }
//    });
//};

AccessToken.prototype.getToken = function (done) {

    //console.log("开始读取!");
    /*
     this代表的是当前对象。
     var that=this就是将当前的this对象复制一份到that变量中。
     this对象在程序中随时会改变，而var that=this之后，that没改变之前仍然是指向当时的this，这样就不会出现找不到原来的对象。
     */
    var that = this;

    var accessToken = this.store.accessToken;
    var expiresTime = parseInt(this.store.expiresTime);

    // 内存中有token
    var nowTime = parseInt(AL.getTimeStamp());
    //console.dir("nowTime : "+nowTime);
    if (accessToken && expiresTime)
    {
        //没有过期
        if (expiresTime > parseInt(nowTime)) //that.isValid()
        {
            console.log("内存中有token  并且token没有过期");
            done(accessToken);
        }
        //过期
        else
        {
            console.log("内存中有token  但是token过期了");
            that.requestAccessToken(done);
        }
    }
    // 内存中没有token
    else
    {
        var accessTokenQuery = new AV.Query(AL.config.WechatAccessToken);
        accessTokenQuery.greaterThan('expiresTime',nowTime);
        accessTokenQuery.ascending('createdAt');
        accessTokenQuery.first().then(function(token){

            if (token)
            {
                console.log("内存中没有token 但是数据库中有没有过期的token");
                accessToken = token.get('accessToken');
                expiresTime = token.get('expiresTime');
                that.store = {
                    accessToken : accessToken,
                    expiresTime : expiresTime
                };
                done(accessToken);
            }
            else
            {
                console.log("内存中没有token 数据库中页没有1");
                that.requestAccessToken(done);
            }

        },function(error){
            console.log("内存中没有token 数据库中页没有2");
            that.requestAccessToken(done);
        });
    }
};

AccessToken.prototype.saveToken = function (tokenInfo, done) {

    console.log("开始写入 : "+JSON.stringify(tokenInfo));

    this.store = tokenInfo;

    var accessToken = tokenInfo.accessToken;
    var expiresTime = parseInt(tokenInfo.expiresTime);

    var wechatAccessToken = new AL.config.WechatAccessToken();
    wechatAccessToken.set('accessToken',accessToken);
    wechatAccessToken.set('expiresTime',expiresTime);
    wechatAccessToken.save().then(function(token){
        if (done) done(accessToken, null);
    },function(error){
        if (done) done(null, error);
    });
};

//AccessToken.prototype.requestAccessToken = function (done) {
//
//    var that = this;
//    var expiresTime = parseInt(new Date().getTime());
//    var URL = this.prefix + 'token?grant_type=client_credential&appid=' + this.appid + '&secret=' + this.appsecret;
//    console.dir("请求access token地址 : "+URL);
//    AL.httpGetRequest(URL,function (result,error){
//
//        if (result && !error)
//        {
//
//            var errcode = parseInt(result.errcode);
//
//            if (!errcode)
//            {
//                var access_token = result.access_token;
//                var expires_in = parseInt(result.expires_in);
//
//                //console.dir({access_token:result.access_token,expires_in:result.expires_in}.toJSONString());
//                console.log("保存时间 : "+(expiresTime+expires_in));
//                that.saveToken({accessToken:access_token,expiresTime:expiresTime+(expires_in*1000)}, function(error, tokenInfo){
//
//                    if (!error)
//                    {
//                        done(access_token, null);
//                    }
//                    else
//                    {
//                        done(null, error);
//                    }
//                });
//            }
//            else
//            {
//                var errmsg = result.errmsg;
//                done(null, AL.error(errcode,errmsg));
//            }
//        }
//        else
//        {
//            done(null, error);
//        }
//    });
//};

//AccessToken.prototype.requestAccessToken = function (done) {
//
//    var that = this;
//    var expiresTime = parseInt(new Date().getTime());
//    var URL = this.prefix + 'token?grant_type=client_credential&appid=' + this.appid + '&secret=' + this.appsecret;
//    console.dir("请求access token地址 : "+URL);
//    AL.httpGetRequest(URL,function (result,error){
//
//        if (result && !error)
//        {
//
//            var errcode = parseInt(result.errcode);
//
//            if (!errcode)
//            {
//                var access_token = result.access_token;
//                var expires_in = parseInt(result.expires_in);
//
//                //console.dir({access_token:result.access_token,expires_in:result.expires_in}.toJSONString());
//                console.log("保存时间 : "+(expiresTime+expires_in));
//                that.saveToken({accessToken:access_token,expiresTime:expiresTime+(expires_in*1000)}, function(error, tokenInfo){
//
//                    if (!error)
//                    {
//                        done(access_token, null);
//                    }
//                    else
//                    {
//                        done(null, error);
//                    }
//                });
//            }
//            else
//            {
//                var errmsg = result.errmsg;
//                done(null, AL.error(errcode,errmsg));
//            }
//        }
//        else
//        {
//            done(null, error);
//        }
//    });
//};

AccessToken.prototype.requestAccessToken = function (done) {

    var that = this;
    var expiresTime = parseInt(AL.getTimeStamp());
    var URL = this.prefix + 'token?grant_type=client_credential&appid=' + this.appid + '&secret=' + this.appsecret;
    console.dir("请求wechat access token地址 : "+URL);
    AL.httpGetRequest(URL,function (result,error){

        if (result && !error)
        {
            var errcode = parseInt(result.errcode);

            if (!errcode)
            {
                var access_token = result.access_token;
                var expires_in = parseInt(result.expires_in);

                done(access_token, null);

                that.saveToken({
                                accessToken : access_token,
                                expiresTime : expiresTime+(expires_in*1000)
                });

            }
            else
            {
                var errmsg = result.errmsg;
                done(null, AL.error(errcode,errmsg));
            }
        }
        else
        {
            done(null, error);
        }
    });
};

/**
 *
 * 公众号
 */
var Webot = function (API) {

    if (!(this instanceof Webot)) {
        return new Webot(API);
    }

    this.API = API;
    this.accessToken = API.accessToken;

    //console.log("Webot");
    //console.dir(this.API);
};


OAuth.prototype.send = function (redirect, scope, res) {

    var that = this;
    var URL = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token="+that.accessToken;
    var body =  {
        "touser":"OPENID",
        "template_id":"ngqIpbwh8bUfcSsECmogfXcV14J0tQlEpBO27izEYtY",
        "url":"http://weixin.qq.com/download",
        "topcolor":"#FF0000",
        "data":{
            "first": {
                "value":"恭喜你购买成功！",
                "color":"#173177"
            },
            "keynote1":{
                "value":"巧克力",
                "color":"#173177"
            },
            "keynote2": {
                "value":"39.8元",
                "color":"#173177"
            },
            "keynote3": {
                "value":"2014年9月16日",
                "color":"#173177"
            },
            "remark":{
                "value":"欢迎再次购买！",
                "color":"#173177"
            }
        }
    };

    // 发送模板消息
    AL.httpPostRequest(URL,body,function (result,error){

        if (result && !error)
        {

            var errcode = parseInt(result.errcode);

            if (!errcode)
            {
                var access_token = result.access_token;
                var expires_in = parseInt(result.expires_in);

                //console.dir({access_token:result.access_token,expires_in:result.expires_in}.toJSONString());
                console.log("保存时间 : "+(expiresTime+expires_in));
                that.saveToken({accessToken:access_token,expiresTime:expiresTime+(expires_in*1000)}, function(error, tokenInfo){

                    if (!error)
                    {
                        done(access_token, null);
                    }
                    else
                    {
                        done(null, error);
                    }
                });
            }
            else
            {
                var errmsg = result.errmsg;
                done(null, AL.error(errcode,errmsg));
            }
        }
        else
        {
            done(null, error);
        }
    })

};

module.exports = {
    API : API
};

