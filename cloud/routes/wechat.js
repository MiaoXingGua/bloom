

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

var AL = require('cloud/lib/ALCommonUtil').AL();

var wechatAppID = AL.config.wechatOfBloomAshleyConfig.appId;
var wechatAppSecret = AL.config.wechatOfBloomAshleyConfig.appSecret;
var wechatToken = AL.config.wechatOfBloomAshleyConfig.token;
var encodinAESKey = AL.config.wechatOfBloomAshleyConfig.encodingAESKey;

exports.route = function(app) {

    var API = require('cloud/lib/wechatAPI').API(wechatAppID, wechatAppSecret, wechatToken, app),
        oauth = API.OAuth,
        accessToken = API.AccessToken
        ;

    require('cloud/routes/wechatDelivery').route(app);

    //var middlewares = require('express-middlewares-js');
    //app.use('/weixin', middlewares.xmlBodyParser({
    //    type: 'text/xml'
    //}));
    //var connect = require('connect');
    //var wechat = require('cloud/lib/wechat-robot/wechat');
    //var wechatConfig = {
    //    token: wechatToken,
    //    appid: wechatAppID,
    //    encodingAESKey: encodingAESKey
    //};
    //app.use(connect.query()); // Or app.use(express.query());
    //app.use('/wechat/robot?', wechat(wechatConfig, function (req, res, next) {
    //    // 微信输入信息都在req.weixin上
    //    var message = req.weixin;
    //    if (message.FromUserName === 'diaosi') {
    //        // 回复屌丝(普通回复)
    //        res.reply('hehe');
    //    } else if (message.FromUserName === 'text') {
    //        //你也可以这样回复text类型的信息
    //        res.reply({
    //            content: 'text object',
    //            type: 'text'
    //        });
    //    } else if (message.FromUserName === 'hehe') {
    //        // 回复一段音乐
    //        res.reply({
    //            type: "music",
    //            content: {
    //                title: "来段音乐吧",
    //                description: "一无所有",
    //                musicUrl: "http://mp3.com/xx.mp3",
    //                hqMusicUrl: "http://mp3.com/xx.mp3",
    //                thumbMediaId: "thisThumbMediaId"
    //            }
    //        });
    //    } else {
    //        // 回复高富帅(图文回复)
    //        res.reply([
    //            {
    //                title: '你来我家接我吧',
    //                description: '这是女神与高富帅之间的对话',
    //                picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
    //                url: 'http://nodeapi.cloudfoundry.com/'
    //            }
    //        ]);
    //    }
    //}));


    //var middlewares = require('express-middlewares-js');
    //app.use('/weixin', middlewares.xmlBodyParser({
    //    type: 'text/xml'
    //}));
    //
    //var Wechat = require('cloud/lib/wechat-robot/wechat');
    //var opt = {
    //    token: wechatToken,
    //    url: '/wechat/robot?'
    //};
    //var wechat = new Wechat(opt);
    ////响应get请求
    //app.get('/wechat/robot?', wechat.verifyRequest.bind(wechat));
    ////处理post请求
    //app.post('/wechat/robot?', wechat.handleRequest.bind(wechat));
    ////接收消息
    //wechat.on('text', function(session) {
    //    session.replyTextMsg('Hello World');
    //});
    //wechat.on('image', function(session) {
    //    session.replyNewsMsg([{
    //        Title: '新鲜事',
    //        Description: '点击查看今天的新鲜事',
    //        PicUrl: 'http://..',
    //        Url: 'http://..'
    //    }]);
    //});
    //wechat.on('voice', function(session) {
    //    session.replyMsg({
    //        Title: 'This is Music',
    //        MsgType: 'music',
    //        Description: 'Listen to this music and guess ths singer',
    //        MusicUrl: 'http://..',
    //        HQMusicUrl: 'http://..',
    //        ThumbMediaId: '..'
    //    });
    //});


    var wechatMsg = { xml:
        {   ToUserName: 'gh_bb6803184839', //开发者微信号
            FromUserName: 'ofpYts0J8oFlGRCa_tS3lbJrjSUA', //发送方帐号（一个OpenID）
            CreateTime: '1421644837', //消息创建时间 （整型）
            MsgType: 'text',  //消息类型 text image voice video location link
            Content: '透笼',   //内容
            MsgId: '6105918081644362920' //消息id，64位整型

        }
    };


    //var wechatXML = "";

    //获取userInfo
    /*
     :isAuth
     0 直接获取 (没有关注，只能拿到)
     1 用户授权获取
     */
    app.all('wechat/demo/oauth/:isAuth/userinfo?', function(req, res){

        var refresh_token = req.query.refresh_token;
        var isAuth = parseInt(req.params.isAuth);

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
                        oauth.getOpenidWithOAuth(AL.domain+"wechat/oauth/userinfo", null, res);
                    }
                    else
                    {
                        return res.end(JSON.stringify(result).toString("utf-8"));
                    }
                });
            });
        }
        else
        {
            oauth.getOpenidWithOAuth(AL.domain+"wechat/oauth/userinfo", isAuth, res);
        }
    });

    app.get('/wechat/hello', function (req, res) {

        //response.end("wechat-hello");
        var orderQ = new AV.Query(AL.config.CommodityOrder);
        orderQ.equalTo('objectId',"54be26d1e4b0644caafe1dcd");
        AL.config._includeKeyWithOrderQuery(orderQ);
        orderQ.containedIn('state',[AL.config.ALCommodityOrderState.waitingForDelivery]);
        orderQ.containedIn('deliveryState',[AL.config.ALCommodityOrderDeliveryState.undefine]);
        orderQ.notEqualTo('isDeleted',true);
        orderQ.ascending('deliveryFromDate');
        orderQ.first().then(function(order){

            if (!order)
            {
                console.dir("已被抢单");
                //res.end("已被抢单");
            }
            else
            {
                var wechat = require('cloud/routes/wechat');
                wechat.wechatSendOrderInfoToFlowerStore(order);
            }

        },function(error){

            //res.end("请刷新重试");
            console.dir("请刷新重试");
        });

        //var requestURL = "http://api.weixin.qq.com/cgi-bin/message/template/send?access_token=6v5fuFDbrVZXx51e0tSwDJeop3NPIH2OBxv1ZXbP-YHRFLn7-r5OYomQKu0ZiLX43VEUzRz6AGoyv80FxodN0sA6wvu8bFcyYUMckhm1VTg";
        //
        //var body = { "touser": "ofpYts0J8oFlGRCa_tS3lbJrjSUA",
        //    "template_id": "vsmxcksbfU_xdTnVavmhRQTtDLSgdD1ErPZAt0rhYes",
        //    "topcolor": "#FF0000",
        //    "url": "http://www.baidu.com",
        //    "data":
        //    { "productType": { "value": "您好，您已购买成功。", "color": "#173177" },
        //        "name": { "value": "微信数据容灾服务", "color": "#173177" },
        //        "number": { "value": "1分", "color": "#173177" },
        //        "expDate": { "value": "2014-09-12", "color": "#173177" },
        //        "remark": { "value": "请非工作日派送。", "color": "#173177" } } };
        //
        //
        //AV.Cloud.httpRequest({
        //    method: 'POST',
        //    headers: {
        //        'Content-Type': 'application/json'
        //    },
        //    url: requestURL,
        //    body: body,
        //    success: function(httpResponse) {
        //        console.dir("返回结果 : "+httpResponse.text);
        //        done(JSON.parse(httpResponse.text),null);
        //    },
        //    error: function(httpResponse) {
        //        done(null,that.error(httpResponse.status,"请求失败"));
        //    }
        //});


    });

    /**
     * 朋友圈 晒图
     */
    app.get('/showPhotoToMoments/:objectId', function(req, res){

        //res.render('index',{});
        //console.log(req.route);

        var params = req.query;
        var objectId = req.params.objectId;
        var sptm = AV.Object.createWithoutData("ShowPhotoToWechatMoments", objectId);
        sptm.fetch().then(function(obj){

            var wxData = {
                "appId"     :   wechatAppID, // 服务号可以填写appId
                "imgUrl"    :   obj.get('thumbnailURL')?obj.get('thumbnailURL'):"" ,
                "link"      :   "",
                "desc"      :   obj.get('message')?obj.get('message'):"" ,
                "title"     :   obj.get('title')?obj.get('title'):""
            };

            var renderData = {
                wxData      :   wxData,
                title       :   obj.get('title'),
                message     :   obj.get('message'),
                //thumbnailURL:   obj.get('thumbnailURL'),
                photos      :   obj.get('photos'),
                message     :   obj.get('message')
            };

            //wechatApiJS(wxData);

            res.render('cloud/dev_views/showPhotoToMoments',renderData);

        },function(error){

            res.render('404', {title: 'No Found'});
        });
    });

    //获取 access_token
    app.get('/wechat/refresh_access_token/', function (req, res) {

        accessToken.getToken(function (token, error) {
            console.dir(token);
            console.dir(error);
            if (token) res.end(token);
            if (error) res.end(error);
        });
    });

    //未完成的一个业务
    var waitingForEvent = function(json, done){

        var openId = json.FromUserName;

        if (!openId){
            return done(false,AL.error(777213,"openId已过期,请重新登录微信。"));
        }

        var eventQ = new AV.Query(AL.config.WechatEvent);
        eventQ.notEqualTo('done',true);
        eventQ.equalTo('openId',openId);
        eventQ.descending('createdAt');
        eventQ.limit(1);
        eventQ.find().then(function(events){

            if (events && events.length>0)
            {
                done(events[0],null);
            }
            else
            {
                done(null,null);
            }

        },function(error){
            done(null,error);
        });

    };

    //结束全部业务
    var cancelAllEvent = function(json, done){

        var openId = json.FromUserName;

        if (!openId){
            return done(false,AL.error(777213,"openId已过期,请重新登录微信。"));
        }

        var eventQ = new AV.Query(AL.config.WechatEvent);
        eventQ.notEqualTo('done',true);
        eventQ.equalTo('openId',openId);
        eventQ.find().then(function(events){

            if (events && events.length>0)
            {
                for (var i in events)
                {
                    events[i].set('done',true);
                }

                AL.saveAll(events,function(list,error){
                    if (!error)
                    {
                        done(true,null);
                    }
                    else
                    {
                        done(false,error);
                    }
                });
            }
            else
            {
                done(true,null);
            }


        },function(error){
            done(false,error);
        });

    };

    //开始一个新的业务
    var startEvent = function(json, done){

        var openId = json.FromUserName;

        if (!openId){
            return done(false,AL.error(777213,"openId已过期,请重新登录微信。"));
        }

        var wechatEvent= new AL.config.WechatEvent();
        wechatEvent.set('wechatId',json.ToUserName);
        wechatEvent.set('openId',openId);
        wechatEvent.set('event',json.Event);
        wechatEvent.set('eventKey',json.EventKey);
        wechatEvent.save().then(function(event){
            done(!AL.isEmpty(event),null);
        },function(error){
            done(false,error);
        });
    };

    //创建一条message
    var createMessage = function(json, done){

        var openId = json.FromUserName;

            if (!openId){
                return done(false,AL.error(777213,"openId已过期,请重新登录微信。"));
            }

            var wechatMessage = new AL.config.WechatMessage();
            wechatMessage.set('wechatId',json.ToUserName);
            wechatMessage.set('openId',openId);
            wechatMessage.set('msgType',json.MsgType);
            wechatMessage.set('msgId',json.MsgId);

            switch (json.MsgType){

            case 'text':
            {
                //console.dir("大青蛙");
                if (json.Content) wechatMessage.set('content',json.Content);
            }
                break;
            case 'location':
            {
                if (json.Location_X && json.Location_Y)
                {
                    console.dir("坐标 "+json.Location_X+json.Location_Y);
                    //wechatMessage.set('point',new Geolocation(json.Location_X,json.Location_Y));
                    wechatMessage.set('location',AV.GeoPoint({latitude: parseFloat(json.Location_X), longitude: parseFloat(json.Location_Y)}));
                    wechatMessage.set('content',json.Label);
                }
            }
                break;
            case 'link':
            {
                if (json.Title) wechatMessage.set('title',json.Title);
                if (json.Description) wechatMessage.set('description',json.Description);
                if (json.Url) wechatMessage.set('content',json.Url);
            }
                break;
            case 'image':
            case 'voice':
            case 'video':
            {
                if (json.MediaId) wechatMessage.set('mediaId',json.MediaId);
            }
                break;

        };

        wechatMessage.save().then(function(msg){
            done(msg,null);
        },function(err){
            done(null,err);
        });

    };

    //创建一条error
    var createError = function(json, description, done){

        var openId = json.FromUserName;

        if (!openId){
            return done(false,AL.error(777213,"openId已过期,请重新登录微信。"));
        }

        var wechatError = new AL.config.WechatError();
        wechatError.set('wechatData',json);
        wechatError.set('description',description);


    };

    //自动回复文字
    var reportTextMessage = function(res,json,reporContent){

        var report =    '<xml>'+
                        '<ToUserName><![CDATA['+json.FromUserName+']]></ToUserName>'+
                        '<FromUserName><![CDATA['+json.ToUserName+']]></FromUserName>'+
                        '<CreateTime>'+AL.getTimeStamp()/1000+'</CreateTime>'+
                        '<MsgType><![CDATA[text]]></MsgType>'+
                        '<Content><![CDATA['+reporContent+']]></Content>'+
                        '</xml>';

        //console.dir("自动回复 : ",report);

        res.end(report);
    };

    var json = { ToUserName: 'gh_bb6803184839',
        FromUserName: 'ofpYts0J8oFlGRCa_tS3lbJrjSUA',
        CreateTime  : '1422609911',
        MsgType     : 'event',
        Event       : 'CLICK',
        EventKey    : 'BLOOM_ABOUT' };

    var items = [{ Title: '关于Bloom',
        Description : '如何加入Bloom？',
        PicUrl      : 'http://bloom.qiniudn.com/icon.jpg',
        Url         : 'http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202339510&idx=1&sn=62fb92734c129e775c409aa17779ae10#rd' }];

    // 自动回复图文消息
    var reportNewsMessage = function(res,json,items){

        //console.dir(json);
        //console.dir(items);

        var itemsXML = '';
        for (var i in items)
        {
            var item = items[i];
            itemsXML += '<item>'+
                        '<Title><![CDATA['+item.Title+']]></Title>'+
                        '<Description><![CDATA['+item.Description+']]></Description>'+
                        '<PicUrl><![CDATA['+item.PicUrl+']]></PicUrl>'+
                        '<Url><![CDATA['+item.Url+']]></Url>'+
                        '</item>';
        }

        var report =    '<xml>'+
            '<ToUserName><![CDATA['+json.FromUserName+']]></ToUserName>'+
            '<FromUserName><![CDATA['+json.ToUserName+']]></FromUserName>'+
            '<CreateTime>'+AL.getTimeStamp()/1000+'</CreateTime>'+
            '<MsgType><![CDATA[news]]></MsgType>'+
            '<ArticleCount>'+items.length+'</ArticleCount>'+
            '<Articles>'+itemsXML+'</Articles>'+
            '</xml>'

        //console.dir("reportNewsMessage : "+report);

        res.end(report);
    };

    // 转至客服人员处理
    var reportToServers = function(res,json){

        //console.dir("json : "+JSON.stringify(json));
        //console.dir("json.ToUserName : "+json.ToUserName);
        //console.dir("json.FromUserName : "+json.FromUserName);

        createMessage(json,function(msg,err){

            var reportXML = '<xml>'+
                '<ToUserName><![CDATA['+json.FromUserName+']]></ToUserName>'+
                '<FromUserName><![CDATA['+json.ToUserName+']]></FromUserName>'+
                '<CreateTime>'+AL.getTimeStamp()/1000+'</CreateTime> '+
                '<MsgType><![CDATA[transfer_customer_service]]></MsgType>'+
                '</xml>';

            //console.dir(reportXML);

            res.end(reportXML);

        });

    };

    //使用wechat信息得到用户
    //var getUserWithWechat = function(userinfo, done) {
    //
    //    var openid = userinfo.openid;
    //
    //    searchUserWithAuthKey(openid, function (user, error) {
    //
    //        if (error)
    //        {
    //            done(false, error);
    //        }
    //        else if (user)  //已经注册
    //        {
    //            done(user, null);
    //        }
    //        else  //没有注册
    //        {
    //            signUpWithAuthKey(userinfo, done);
    //        }
    //    });
    //};

    //搜索wechat用户
    function searchUserWithAuthKey(openid, done) {

        if (!openid) {
            done(null, AL.error(777123, "参数错误"));
            return;
        }

        var userQ = new AV.Query(AL.config.User);
        //userQ.equalTo('authKey.wechat.openid', openid);
        userQ.equalTo('wechat.openid', openid);
        userQ.limit(1);
        userQ.find().then(function (users) {

            if (users.length > 0) {
                done(users[0], null);
            }
            else {
                done(null, null);
            }

        }, function (error) {
            done(null, AL.error(error.code, error.message));
        });
    }

    //使用wechat注册
    function signUpWithAuthKey(userinfo, done) {

        var openid = userinfo.openid;
        var nickname = userinfo.nickname;
        var headimgurl = userinfo.headimgurl;
        var sex = userinfo.sex;
        var province = userinfo.province;
        var city = userinfo.city;
        var country = userinfo.country;

        if (!openid) {
            return done(null, AL.error(777123, "参数错误"));
        }

        var guid = AL.guid();

        var user = new User();
        user.set('username', guid.toUpperCase());
        user.set('password', guid.toLowerCase());
        user.set('wechat', userinfo);

        if (nickname) user.set('nickname', nickname);
        if (headimgurl) user.set('headViewURL', headimgurl);
        user.set('gender', sex);
        user.set('province', province);
        user.set('city', city);
        user.set('country', country);
        user.fetchWhenSave(true);
        user.signUp(null, {
            success: function (user) {

                done(user, null);
            },
            error: function (user, error) {

                done(null, AL.error(error.code, error.message));
            }
        });
    }

    //给用户添加wechat信息
    function addAuthKey(user, userinfo, done) {

        if (!user || !userinfo) {
            return done(null, AL.error(777123, "参数错误"));
        }

        user.fetch({
            success: function (user) {

                //var authKey = user.get('authKey');
                //authKey['wechat'] = {'uid': unionId};

                user.set('wechat', userinfo);
                user.fetchWhenSave(true);
                user.save().then(function (user) {

                    done(user, null);

                }, function (error) {

                    done(null, error);
                });
            },
            error: function (user, error) {
                done(null, error);
            }
        });
    }

    // 注册
    var signUpWithOpenIdAndPhone = function(openId, phoneNumber, done){

        if (!openId || openId.length==0 || !phoneNumber || !phoneNumber.match(/^1[3|4|5|8][0-9]\d{8}$/g))
        {
            return done(null,AL.error(777342,"参数错误"));
        }

        oauth.getUserInfoWithOpenid(openId, function(userinfo, error){

            //获取用户信息成功
            if (userinfo && !error)
            {
                //查看手机号是否注册过
                var userQ = new AV.Query(AL.config.User);
                userQ.equalTo('phoneNumber',phoneNumber);
                userQ.limit(1);
                userQ.find().then(function(users){

                    //查看openid是否注册过
                    searchUserWithAuthKey(openId,function(user, error){

                        if (!error)
                        {
                            if (!users[0] && !user)
                            {
                                // 1.phoneNumber openid 都没用过
                                console.log("1.phoneNumber openid 都没用过");
                                // 使用微信userinfo注册
                                var openid = userinfo.openid;
                                var nickname = userinfo.nickname;
                                var headimgurl = userinfo.headimgurl;
                                var sex = userinfo.sex;
                                var province = userinfo.province;
                                var city = userinfo.city;
                                var country = userinfo.country;

                                if (!openid) {
                                    return done(null, AL.error(777123, "参数错误"));
                                }

                                var guid = AL.guid();

                                var user = new User();
                                user.set('username', guid.toUpperCase());
                                user.set('password', guid.toLowerCase());
                                user.set('wechat', userinfo);

                                if (nickname) user.set('nickname', nickname);
                                if (headimgurl) user.set('headViewURL', headimgurl);
                                user.set('gender', sex);
                                user.set('province', province);
                                user.set('city', city);
                                user.set('country', country);
                                user.set('phoneNumber',phoneNumber);
                                user.set('phonePwd',AL.MD5(AL.getRandomNumberWithDigit(6)).toUpperCase());
                                user.fetchWhenSave(true);
                                user.save().then(function(user){
                                    done(user,null);
                                },function(error){
                                    done(null,error);
                                });

                            }
                            else if (users[0] && !user)
                            {
                                // 2.phoneNumber 用过 openid 没用过
                                console.log("2.phoneNumber 用过 openid 没用过");
                                // 绑定微信userinfo
                                var user = users[0];

                                var openid = userinfo.openid;
                                var nickname = userinfo.nickname;
                                var headimgurl = userinfo.headimgurl;
                                var sex = userinfo.sex;
                                var province = userinfo.province;
                                var city = userinfo.city;
                                var country = userinfo.country;

                                if (!openid) {
                                    return done(null, AL.error(777123, "参数错误"));
                                }

                                user.set('wechat', userinfo);
                                if (nickname && !user.get('nickname')) user.set('nickname', nickname);
                                if (headimgurl && !user.get('headimgurl')) user.set('headViewURL', headimgurl);
                                if (user.get('gender')==0) user.set('gender', sex);
                                if (!user.get('province') && province) user.set('province', province);
                                if (!user.get('city') && city)user.set('city', city);
                                if (!user.get('country') && country)user.set('country', country);

                                user.fetchWhenSave(true);
                                user.save().then(function(user){
                                    done(user,null);
                                },function(error){
                                    done(null,error);
                                });

                            }
                            else if (!users[0] && user)
                            {
                                // 3.phoneNumber 没用过 openid 用过
                                console.log("3.phoneNumber 没用过 openid 用过");
                                // 绑定phoneNumber
                                user.set('phoneNumber',phoneNumber);
                                user.set('phonePwd',AL.MD5(AL.getRandomNumberWithDigit(6)).toUpperCase());
                                user.fetchWhenSave(true);
                                user.save().then(function(user){
                                    done(user,null);
                                },function(error){
                                    done(null,error);
                                });
                            }
                            else if (user.id == users[0].id)
                            {
                                //4. 都用过 且是一个人
                                console.log("4. 都用过 且是一个人");
                                done(user,null);
                            }
                            else
                            {
                                //5. 都用过 但不是一个人
                                console.log("5. 都用过 但不是一个人");
                                done(null,error);
                            }
                        }
                        else
                        {
                            done(null,error);
                        }

                    },function(error){
                        done(null,error);
                    });

                },function(error){
                    done(null,error);
                });
            }
            else
            {
                //console.dir("关注公众号 获取用户信息失败 : "+JSON.parse(error));
                done(null,error);
            }
        });
    };

    app.all('/wechat/signUpWithOpenIdAndPhone?', function (req, res){

        var openId = req.param("openId");
        var phoneNumber = req.param("phoneNumber");

        signUpWithOpenIdAndPhone(openId, phoneNumber,function(user,error){
            //AL.done(res,user,err);
            if (user && !error)
            {
                var trueName = req.param("trueName");
                var storeName = req.param("storeName");
                var storeAddress = req.param("storeAddress");
                var latitude = parseFloat(req.param("latitude"));
                var longitude = parseFloat(req.param("longitude"));

                if (trueName) user.set("trueName",trueName);
                if (storeName) user.set("storeName",storeName);
                if (storeAddress) user.set("storeAddress",storeAddress);
                if (latitude && longitude) user.set("storeLocation",new AV.GeoPoint({latitude: latitude, longitude: longitude}));

                user.set('userType',AL.config.ALUserType.store);
                user.save().then(function(user){
                    AL.done(res,user.id,error);
                },function(error){
                    AL.done(res,false,error);
                });
            }
            else
            {
                AL.done(res,false,error);
            }
        });
    });

    //检验 微信URL (第一次将后台接入微信公众号认证)
    app.all('/wechat/robot?', function (req, res) {

        console.dir("wechat/robot");

        // 消息验证
        var valid = API.checkWechatSignature(req, res);

        if (valid)
        {
            //xml2json
            API.wechatReceivedMessage(req,function(json,error){

                console.dir("json : "+JSON.stringify(json));

                json = json.xml;

                //return reportTextMessage(res,json,"🚧施工中...");

                if (json && !error){

                    //事件
                    if (json.MsgType=='event')
                    {
                        console.dir("事件");
                        switch (json.Event){

                            //点击事件
                            case 'CLICK':{
                                switch  (json.EventKey) {

                                    //关于Bloom
                                    case 'BLOOM_ABOUT':{
                                        console.dir("点击了 关于Bloom");

                                        //获取用户资料
                                        //oauth.getUserInfoWithOpenid(json.FromUserName,function(userinfo,error){
                                        //    console.dir("获取用户资料 : "+JSON.stringify(userinfo));
                                        //    //回复用户他的资料
                                        //    return reportTextMessage(json,JSON.stringify(userinfo),res);
                                        //});
                                        var items = [{Title:"关于Bloom",
                                            Description:"如何加入Bloom？",
                                            PicUrl:"http://bloom.qiniudn.com/icon.jpg",
                                            Url:"http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202339510&idx=1&sn=62fb92734c129e775c409aa17779ae10#rd"
                                        }];

                                        reportNewsMessage(res,json,items);

                                    } break;
                                    //加入Bloom(暂无)
                                    case 'BLOOM_JOIN':{
                                        console.dir("点击了 加入Bloom");

                                        startEvent(json,function(suc,err){
                                             if (suc && !err)
                                             {
                                                 return reportTextMessage(res,json,"请您输入手机号，我们会尽快与您取得联系。");
                                             }
                                            else
                                             {
                                                 return reportTextMessage(res,json,"无效请求，请重新尝试或与Bloom联系，我们会尽快解决。\n 错误信息 : "+JSON.stringify(err));
                                             }
                                        });

                                    } break;
                                    //我是买家
                                    case 'BLOOM_APP':{
                                        console.dir("点击了 我是买家");

                                        reportTextMessage(res,json,"Bloom iOS版本已上线，小伙伴们赶快去下载呀，挑选心仪的花送给你亲爱的Ta吧！\n" +
                                                                    "点击：https://itunes.apple.com/cn/app/bloom/id931918119?mt=8");

                                    } break;
                                    //如何加入bloom
                                    case 'BLOOM_ABOUT_JOIN':{
                                        console.dir("点击了 如何加入Bloom");

                                        var items = [{ Title: '如何加入Bloom?',
                                            Description : '还没有加入Bloom？赶快按照提示加入我们疯狂接单赚钱吧！',
                                            PicUrl      : 'https://mmbiz.qlogo.cn/mmbiz/9qhBHz7Sukibia6vUcxty7T9VtFiaTs28RDACvTpekichqnuTC5HibohFynWbNtES55ibjadyppeqbXH1kzV8394YRibQ/0',
                                            Url         : 'http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202339510&idx=1&sn=62fb92734c129e775c409aa17779ae10#rd' }];

                                        reportNewsMessage(res,json,items);

                                    } break;
                                    //接单流程
                                    case 'BLOOM_ABOUT_DELIVERY':{
                                        console.dir("点击了 接单流程");

                                        var items = [{ Title: '接单流程',
                                            Description : '不知道怎么接单？点击进入>>！',
                                            PicUrl      : 'https://mmbiz.qlogo.cn/mmbiz/9qhBHz7Sukibia6vUcxty7T9VtFiaTs28RDACvTpekichqnuTC5HibohFynWbNtES55ibjadyppeqbXH1kzV8394YRibQ/0',
                                            Url         : 'http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202410229&idx=1&sn=c2b03c4fb6c9407f471e7aa62810389b#rd' }];

                                        reportNewsMessage(res,json,items);
                                    }break;
                                    //接单须知
                                    case 'BLOOM_ABOUT_DELIVERY_DECLARATION':{

                                        console.dir("点击了 接单须知");

                                        var items = [{ Title: '接单须知',
                                            Description : '接单注意事项？点击进入>>！',
                                            PicUrl      : 'https://mmbiz.qlogo.cn/mmbiz/9qhBHz7Sukibia6vUcxty7T9VtFiaTs28RDACvTpekichqnuTC5HibohFynWbNtES55ibjadyppeqbXH1kzV8394YRibQ/0',
                                            Url         : 'http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202478350&idx=1&sn=cdb208f3308601386ff7ab18c28c47dc#rd' }];

                                        reportNewsMessage(res,json,items);
                                    }break;
                                }
                            }break;

                            case 'subscribe':{

                                // 关注
                                var items = [{Title:"【Bloom】把全世界最美的花放进口袋",
                                    Description:"Bloom iOS 版已登录 Appstore 点击 “下载Bloom” 获取下载链接。注册即可得到百元红包。",
                                    PicUrl:"https://mmbiz.qlogo.cn/mmbiz/9qhBHz7Sukic518BLicea3vQwWhg87icQzgnUVO6EMqdfCXeGXPPhAAUcmcXE2Y71hOujIviabAh5fxjMXxics7cFGg/0",
                                    Url:"http://mp.weixin.qq.com/s?__biz=MzAwNjEwOTMxMA==&mid=202557126&idx=1&sn=07816e755319d57c0ca93aabc4d6c3d7#rd"
                                }];

                                reportNewsMessage(res,json,items);

                            }break;
                            //case 'VIEW':
                            //{
                            //    //res.redirect("http://flowerso2o.avosapps.com/demo/wechat/oauth/0/userinfo");
                            //}
                            //    break;
                            //关注微信
                            //case 'subscribe':
                            //{
                            //    //res.redirect("http://flowerso2o.avosapps.com/demo/wechat/oauth/0/userinfo");
                            //
                            //    //注册 用户
                            //    console.dir("注册 用户");
                            //    signUpFromWechat(openId, function(user, error){
                            //
                            //        if (user && !error)
                            //        {
                            //            return reportTextMessage(json,"您已经是Bloom的会员了，点击\"关于Bloom\"获得更多Bloom的信息。",res);
                            //        }
                            //        else
                            //        {
                            //            return reportTextMessage(json,"您还不是Bloom的会员，请在公众号中回复注册，注册成为Bloom会员。",res);
                            //        }
                            //    });
                            //}
                            //    break;
                            default :
                            {
                                res.end('') ;
                            } break;
                        }
                    }
                    //文本消息
                    else if (json.MsgType=='text')
                    {
                        console.dir("微信 文字 消息 : "+JSON.stringify(json));

                        var content = json.Content;

                        //console.log("content : "+content);

                        var orderNOs = content.match(/(2015[0-9]{22})/g);

                        if (orderNOs)
                        {
                            var orderQ = new AV.Query(AL.config.CommodityOrder);
                            orderQ.equalTo('orderNO',orderNOs[0]);
                            orderQ.include("delivery");
                            orderQ.first().then(function (order) {
                                if (order)
                                {
                                    console.dir("发现order");
                                    if (order.toJSON().delivery) //测试delivery是否为null 直接get有时会报错
                                    {
                                        var delivery = order.get("delivery");
                                        console.dir("发现delivery");
                                        var deliveryCode = delivery.get("deliveryCode");
                                        if (deliveryCode)
                                        {
                                            console.dir("发现deliveryCode : "+deliveryCode);
                                            return reportTextMessage(res,json,deliveryCode);
                                        }
                                        else
                                        {
                                            //return reportToServers(res, json);
                                            return reportTextMessage(res,json,"订单尚未开始配送，请检查订单号及对应配送状态后重试。");
                                        }
                                    }
                                    else
                                    {
                                        //return reportToServers(res, json);
                                        return reportTextMessage(res,json,"未找到配送信息，请检查订单号及对应订单状态后重试。");
                                    }
                                }

                            }, function (error) {

                                //return reportToServers(res, json);
                                return reportTextMessage(res,json,"未找到订单信息，请检查订单号后重试。");
                            });
                        }
                        else
                        {

                            return reportToServers(res, json);
                        }

                        //waitingForEvent(json,function(wechatEvent,error){
                        //
                        //    if (wechatEvent && !error)//有等待处理的业务
                        //    {
                        //        console.dir("有未完成任务");
                        //
                        //        if (json.Content=='退出')
                        //        {
                        //            cancelAllEvent(json,function(suc,err){
                        //                if (suc && !err)
                        //                {
                        //                    return reportTextMessage(res,json,"感谢支持，业务已取消。");
                        //                }
                        //            });
                        //            return;
                        //        }
                        //
                        //        switch (wechatEvent.get('eventKey')){
                        //            case 'BLOOM_JOIN':
                        //            {
                        //                var phoneNumber = json.Content;
                        //
                        //                if (!AL.isEmpty(phoneNumber) && phoneNumber.match(/^1[3|4|5|8][0-9]\d{8}$/g)) //电话号
                        //                {
                        //                    //发现电话号
                        //                    //wechatEvent.set('content',json.Content);
                        //                    //wechatEvent.set('done',true);
                        //                    //wechatEvent.save().then(function(event){
                        //                    //    cancelAllEvent(json);
                        //                    //    return reportTextMessage(json,"感谢支持，我们会尽快与您取得联系。",res);
                        //                    //},function(error){
                        //                    //    return reportTextMessage(json,"手机号码保存有误，请重新输入。\n错误信息 : "+JSON.stringify(error),res);
                        //                    //});
                        //
                        //                    //注册 用户
                        //                    console.dir("注册 用户");
                        //                    cancelAllEvent(json,function(suc,err){
                        //                        if (suc && !err)
                        //                        {
                        //                            signUpWithOpenIdAndPhone(openId,phoneNumber, function(user, error){
                        //
                        //                                if (user && !error)
                        //                                {
                        //                                    var nickname = user.get('nickname');
                        //                                    if (!nickname) {
                        //
                        //                                    }
                        //
                        //                                    //var params = {
                        //                                    //    title:"有新的花艺师申请" +"\r\n",
                        //                                    //    content:"昵称 : "+nickname +"\r\n"
                        //                                    //    +"联系方式 : "+phoneNumber
                        //                                    //};
                        //                                    //AL.sendSMS(AL.config.ALPhoneOfServer,'servicesNotification',params);
                        //
                        //                                    reportTextMessage(res, json, "您已经是Bloom的会员了，如需修改手机号请在公众号中点击“加入Bloom”。");
                        //
                        //                                    return;
                        //                                }
                        //                                else
                        //                                {
                        //                                    return reportTextMessage(res, json,"您还不是Bloom的会员，请在公众号中点击\"加入Bloom\"，注册成为Bloom会员。");
                        //                                }
                        //                            });
                        //                        }
                        //                        else
                        //                        {
                        //                            createMessage(json,function(msg,err){
                        //                                return reportToServers(res, json);
                        //                            });
                        //                        }
                        //                    });
                        //                }
                        //                else
                        //                {
                        //                    //格式错误 请重发 如果输入错误，请重新选择 加入Bloom。
                        //                    return reportTextMessage(res, json,"您输入手机号有误请重新输入。\n 如果想要咨询问题或办理其他业务，可先回复\"退出\"或直接点击菜单切换服务。");
                        //                }
                        //            }
                        //            default:{
                        //                res.end('');
                        //            }
                        //                break;
                        //        }
                        //    }
                        //    else
                        //    {
                        //        //if (json.Content=='注册')
                        //        //{
                        //        //    signUpFromWechat(openId, function(user, error){
                        //        //
                        //        //        if (user && !error)
                        //        //        {
                        //        //            return reportTextMessage(json,"您已经是Bloom的会员了，点击\"关于Bloom\"获得更多Bloom的信息。",res);
                        //        //        }
                        //        //        else
                        //        //        {
                        //        //            return reportTextMessage(json,"您还不是Bloom的会员，请在公众号中回复注册，注册成为Bloom会员。",res);
                        //        //        }
                        //        //    });
                        //        //    return;
                        //        //}
                        //
                        //        createMessage(json,function(msg,err){
                        //            return reportToServers(res, json);
                        //        });
                        //    }
                        //
                        //});
                    }
                    else
                    {
                        return reportToServers(res, json);
                    }
                }
                else
                {
                    console.dir("处理失败2");
                    res.end('');
                }
            });
        }
        else
        {
            console.dir("验证失败 或 首次验证");
            res.end('');
        }

    });

    app.all('/wechat/searchUserWithOpenId?', function(req,res){

        var openId = req.param("openId");

        if (!openId || openId.length==0)
        {
            return done(null,AL.error(777342,"参数错误"));
        }

        //查看openid是否注册过
        searchUserWithAuthKey(openId,function(user, error){


            AL.done(res,user?user.id:"",error);

        });
    });

    app.all('/wechat/', function(req,res){});


};



