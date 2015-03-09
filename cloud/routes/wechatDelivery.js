
var AL = require('cloud/lib/ALCommonUtil').AL();

var wechatAppID = AL.config.wechatOfBloomAshleyConfig.appId;
var wechatAppSecret = AL.config.wechatOfBloomAshleyConfig.appSecret;
var wechatToken = AL.config.wechatOfBloomAshleyConfig.token;
var encodinAESKey = AL.config.wechatOfBloomAshleyConfig.encodingAESKey;

var API = require('cloud/lib/wechatAPI').API(wechatAppID, wechatAppSecret, wechatToken);

// 群发
var wechatSendOrderInfoToFlowerStore = function(order){

    var tmplId = "ZjWC8f9t9Ky--tZoFziJrAXtGB-eEFK9d1cDHmT9WeY";

    var toOpenIds = null;

    if (order.get('user').id == "54c620dfe4b068d1ee40ab15")
    {
        //大青蛙的订单 都是测试订单
        toOpenIds = AL.config.ALOpenidOfFlowerStore;
        toOpenIds = AL.config.ALOpenidOfServers;
    }
    else
    {
        //这里都是真是订单 交给认证花店
        toOpenIds = AL.config.ALOpenidOfFlowerStoreTrue;
    }

    //ofpYtsxJ4I6DnY8n7du6rOVjFuPc
    //特殊id
    switch (order.id){

        //case ('54dd7634e4b04fce1956b90e'):
        //{
        //    toOpenIds = ['ofpYts0J8oFlGRCa_tS3lbJrjSUA'];
        //}break;
        case ('54dc321fe4b021f79dc9e08a'):
        case ('54d9cd5de4b0a6135360a62f'):
        {

            toOpenIds = ['ofpYts7uoC1JynK9ItEaievscIqU'];

        }break;

        case ('54dc1f21e4b0ba48c0ba9586'):
        case ('54dc4004e4b001aa8aba6930'):
        case ('54db7c7ae4b048d453a941a0'):

        case ('54db6afce4b0ffe4d4dc1f9b'):
        case ('54d9bf1fe4b0a3fb8d6347d0'):
        case ('54d9d123e4b08a85e49c33ac'):
        case ('54d9c7d5e4b037f99ee7235e'):
        case ('54d9cd5de4b0a6135360a62f'):
        case ('54daf95fe4b037f99ef8aefc'):
        case ('54dc3431e4b0a12c09a6937e'):
        case ('54dc60e3e4b042fc5548d0de'):
        case ('54dc2055e4b048d453ac2be7'):
        {
            //冯果
            toOpenIds = ['ofpYtsxJ4I6DnY8n7du6rOVjFuPc'];

        }break;
        case ('54dc3120e4b039bfbfcca16c'):
        {
            //苏鹏
            toOpenIds = ['ofpYts9y4IjW3unmM0kLVOEiycEc'];

        }break;
        case ('54dc5ceee4b042fc5548a99a'):
        case ('54dc4abbe4b02fa630df16d5'):
        case ('54dc291ee4b08a85e4b944e3'):
        case ('54d4ba29e4b0dc9825c80b79'):
        {
            //韩云杰
            toOpenIds = ['ofpYts-ovo_hvlEI_Ny7w94vqkqQ'];

        }break;
        case ('54daff65e4b08a85e4aaf575'):   //20150211150613227334017548 刘畅 望京
        case ('54db6d9ee4b08a85e4b37293'):   //20150211225630915276889788 王璐 朝阳区广顺北大街望京名苑211好楼2601
        case ('54db7c7ae4b048d453a941a0'):   //20150211235954827003230492 谢晚春 八里庄东里1号莱锦创意产业园CN12乐蜂网
        {
            //朵朵  ofpYts2osVCPSx9vmjceKiDP2Ohs
            toOpenIds = ['ofpYts2osVCPSx9vmjceKiDP2Ohs'];

        }break;
        case ('54dd3f63e4b06181898d52ba'):  //54dd3f63e4b06181898d52ba 周红艳
        case ('54daf95fe4b037f99ef8aefc'):  //20150211144031848405263067 文静  朝阳区 朝阳区 北辰世纪中心a座12层
        case ('54d9cd5de4b0a6135360a62f'):  //20150210172029573895042350 刘萌萌 丰台区 南四环西路188号17区15号
        case ('54db6afce4b0ffe4d4dc1f9b'):  //20150211224516656798813885 王楠 五棵松卓展购物中心5层耀莱国际影城综合办公室
        {

            //犹太杰 ofpYts7uoC1JynK9ItEaievscIqU
            toOpenIds = ['ofpYts7uoC1JynK9ItEaievscIqU'];

        }break;
        case ('54d9c7d5e4b037f99ee7235e'):  //20150210165653910734420842 唐玥   朝阳区 东三环北路5号北京发展大厦N200
        case ('54d9d123e4b08a85e49c33ac'):  //20150210173635017320291823 檀晓丹  朝阳区 光华路22号光华路soho O3座11层
        {

            // 朵朵 犹太杰
            toOpenIds = ['ofpYts2osVCPSx9vmjceKiDP2Ohs','ofpYts7uoC1JynK9ItEaievscIqU'];

        }break;
    }

    //toOpenIds = "ofpYts0J8oFlGRCa_tS3lbJrjSUA";
    var params = {};
    params.topcolor = "#FF0000";

    //toOpenIds = AL.config.ALOpenidOfServers;

    //params.url = "http://192.168.199.232:3000/delivery/getOrder/"+order.id;
    params.url = "http://flowerso2o.avosapps.com/wechat/delivery/getOrder?orderId="+order.id; //先获取userId在去delivery

    var commodity = JSON.parse(order.get('commoditySnapshotsString'))[0];

    params.data = {

        first:{
            value:"点我抢单",
            color:"#FF0000"
        },
        //商家
        keyword1: {
            value:"Bloom-"+commodity.name,
            color:"#173177"
        },
        //收货人
        keyword2:{
            value:order.get('deliveryName'),
            color:"#173177"
        },
        //地址
        keyword3:{
            value:order.get('deliveryAddress'),
            color:"#173177"
        },
        //电话
        keyword4:{
            value:order.get('deliveryPhone'),
            color:"#173177"
        },
        //总价
        keyword5: {
            value:(order.get('totalCostPrice') || order.get('totalPrice'))/100+" 元",
            color:"#173177"
        },
        //配送日期
        remark: {
            value:"配送日期："+AL.getDateFormat(order.get('deliveryFromDate')),
            color:"#173177"
        }
    };

    //console.dir(toOpenIds);
    //return;

    API.wechatSendTemplateMessage(tmplId, toOpenIds, params, function(suc,err){

        if (suc && !err)
        {
            if (!__production) console.dir("发送模板消息 成功");
        }
        else
        {
            if (!__production) console.dir("成功模板消息 失败");
            if (!__production) console.dir(err);
        }

    });

};

// 给指定的人发
var wechatSendOrderInfo = function(order,openIds,done){

    var tmplId = "ZjWC8f9t9Ky--tZoFziJrAXtGB-eEFK9d1cDHmT9WeY";

    //54dd7634e4b0f7eb9e491d92

    //console.dir(order.id);

    if (!order || !order.id || order.id.length!=24)
    {
        if (done) done(false,AL.error(777103,"参数错误"));
        return;
    }

    if (!openIds || openIds.length==0)//28
    {
        if (done) done(false,AL.error(777104,"参数错误"));
        return;
    }
    //var orderId = order.id;
    //
    //var commoditySnapshotsString = order.get('commoditySnapshotsString');
    //
    //if (!commoditySnapshotsString)
    //{
    //    if (done) done(false,AL.error(777102,"参数错误"));
    //}
    //
    //var commoditySnapshots = JSON.parse(commoditySnapshotsString);
    //
    //if (!commoditySnapshots || !AL.isArray(commoditySnapshots) || commoditySnapshots.lenght==0)
    //{
    //    if (done) done(false,AL.error(777103,"参数错误"));
    //}
    //
    //var commoditySnapshot = commoditySnapshots[0];
    //
    //if (order.get('user').id == "54c620dfe4b068d1ee40ab15")
    //{
    //    //大青蛙的订单 都是测试订单
    //    toOpenIds = AL.config.ALOpenidOfFlowerStore;
    //}
    //else
    //{
    //    //这里都是真是订单 交给认证花店
    //    toOpenIds = AL.config.ALOpenidOfFlowerStoreTrue;
    //}

    var params = {};
    params.topcolor = "#FF0000";

    //params.url = "http://192.168.199.232:3000/delivery/getOrder/"+order.id;
    params.url = "http://flowerso2o.avosapps.com/wechat/delivery/getOrder"+"?orderId="+order.id; //先获取userId在去delivery

    //console.dir(order.get('commoditySnapshots'));

    //var commodity = JSON.parse(order.get('commoditySnapshotsString'))[0];

    params.data = {

        first:{
            value:"点我抢单",
            color:"#FF0000"
        },
        //商家
        keyword1: {
            value:"Bloom-"+order.get('commodityName'),
            color:"#173177"
        },
        //收货人
        keyword2:{
            value:order.get('deliveryName'),
            color:"#173177"
        },
        //地址
        keyword3:{
            value:order.get('deliveryAddress'),
            color:"#173177"
        },
        //电话
        keyword4:{
            value:order.get('deliveryPhone'),
            color:"#173177"
        },
        //总价
        keyword5: {
            value:(order.get('totalCostPrice') || order.get('totalPrice'))/100+" 元",
            color:"#173177"
        },
        //配送日期
        remark: {
            value:"配送日期："+AL.getDateFormat(order.get('deliveryFromDate')),
            color:"#173177"
        }
    };

    //console.dir(openIds);
    //done(true);
    //return;

    API.wechatSendTemplateMessage(tmplId, openIds, params, done);
    /*
     function(suc,err){

     if (suc && !err)
     {
     if (!__production) console.dir("发送模板消息 成功");
     }
     else
     {
     if (!__production) console.dir("成功模板消息 失败");
     if (!__production) console.dir(err);
     }

     }
     */

};

exports.route = function(app) {

    var API = require('cloud/lib/wechatAPI').API(wechatAppID, wechatAppSecret, wechatToken, app),
        oauth = API.OAuth,
        accessToken = API.AccessToken
        ;

    //获取userInfo
    /*
        :isAuth
        0 直接获取 (没有关注，只能拿到)
        1 用户授权获取
     */
    app.all('/demo/wechat/oauth/:isAuth/userinfo?', function(req, res){

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

    /*
        微信配送
     */
    // 查看我的配送单
    app.all('/wechat/delivery/getMyDelivery?', function(req, res){

        var openid = req.query.openid;

        if (openid && openid.length > 0)
        {
            searchUserWithAuthKey(openid, function(user, error){

                if (user && !error)
                {
                    if (user.get('userType')==AL.config.ALUserType.store)
                    {
                        //花店
                        if (!__production) console.dir("是花店");
                        //console.dir("查看订单 : "+AL.domain+"delivery/getOrder"+"?orderId="+orderId+"&userId="+user.id+"&openId="+openId);
                        res.render("cloud/views/deliveryList",{userId:user.id,title:"我抢到的订单"});
                        //res.redirect(AL.domain+"delivery/getOrder"+"?orderId="+orderId+"&userId="+user.id+"&openId="+openId);
                    }
                    else
                    {
                        //不是花店
                        if (!__production) console.dir("不是花店");
                        AL.done(res,null,AL.error(777324,"您还没有通过Bloom的认证，我们会尽快与您取得联系，感谢支持。"));
                    }
                }
                else
                {
                    //没有注册
                    if (!__production) console.dir("没有注册");
                    AL.done(res,null,AL.error(777325,"您还不是Bloom的花艺师，请在公众号中点击\"加入Bloom\"，注册成为Bloom的花艺师。"));
                }

            });

        }
        else
        {
            oauth.getOpenidWithOAuth(AL.domain+"wechat/delivery/getMyDelivery", 0, res);
        }

    });

    //配送单详情
    app.all('/wechat/delivery/getOrder?', function(req, res){

        if (!__production) console.log("配送单详情1");

        var orderId = req.param("orderId");
        var openId = req.param("openid");

        if (openId && openId.length > 0 && orderId && orderId.length>0)
        {

            if (!__production) console.dir("认证成功");
            searchUserWithAuthKey(openId, function(user, error){

                if (user && !error)
                {
                    if (user.get('userType')==AL.config.ALUserType.store)
                    {
                        //花店
                        if (!__production) console.dir("是花店");
                        //console.dir("查看订单 : "+AL.domain+"delivery/getOrder"+"?orderId="+orderId+"&userId="+user.id+"&openId="+openId);

                        var userId = user.id;
                        //res.redirect(AL.domain+"delivery/getOrder"+"?orderId="+orderId+"&userId="+user.id+"&openId="+openId);
                        var orderEngine = require('cloud/routes/order');
                        orderEngine.fetchOrder(orderId, function(order, error){

                            if (order && !error)
                            {
                                var state = order.get('state');
                                var deliveryState = order.get('deliveryState');
                                var delivery = order.get('delivery');
                                var params = {};

                                //console.dir("DS : "+order.get('deliveryState'));

                                params.commodity = {};

                                var commodity = JSON.parse(order.get('commoditySnapshotsString'))[0];

                                params.commodity.name = commodity.name;
                                params.commodity.coverViewURL = commodity.coverView.url;
                                //params.commodity.introduction = commodity.introduction;
                                //params.commodity.price = (order.get('totalCostPrice') || order.get('totalPrice'))/100;
                                params.orderNO = order.get('orderNO');
                                params.orderId = order.id;
                                params.deliveryName = order.get('deliveryName');
                                params.deliveryPhone = order.get('deliveryPhone');
                                params.deliveryAddress = order.get('deliveryAddress');
                                params.deliveryFromDate = AL.getDateFormat(order.get('deliveryFromDate'));
                                params.deliveryCountdown = AL.getRTime(order.get('deliveryFromDate'));
                                params.deliveryman = userId;
                                params.totalCostPrice = (order.get('totalCostPrice') || order.get('totalPrice'))/100;
                                params.createdAt = AL.getDateFormat(order.createdAt);


                                function html_encode(str)
                                {
                                    var s = "";
                                    if (str.length == 0) return "";
                                    s = str.replace(/&/g, "&amp;");
                                    s = s.replace(/</g, "&lt;");
                                    s = s.replace(/>/g, "&gt;");
                                    s = s.replace(/ /g, "&nbsp;");
                                    s = s.replace(/\'/g, "&#39;");
                                    s = s.replace(/\"/g, "&quot;");
                                    s = s.replace(/\n/g, "<br>");
                                    return s;
                                }

                                params.cardMessage = html_encode(order.get('cardMessage'));
                                //console.dir("cardMessage : "+order.get('cardMessage'));

                                params.deliveryState = deliveryState;
                                if (delivery) params.deliveryId = delivery.id;

                                switch (deliveryState){
                                    case AL.config.ALCommodityOrderDeliveryState.close:{
                                        params.deliveryStateString = "关闭";
                                    }break;
                                    case AL.config.ALCommodityOrderDeliveryState.undefine:{
                                        params.deliveryStateString = "等待抢单";
                                    }break;
                                    case AL.config.ALCommodityOrderDeliveryState.waitingForFetch:{
                                        //params.deliveryStateString = "有人抢单 等待取件";
                                        params.deliveryStateString = "等待配送";
                                    }break;
                                    case AL.config.ALCommodityOrderDeliveryState.waitingForDelivery:{
                                        params.deliveryStateString = "已经取件 等待发货";
                                    }break;
                                    case AL.config.ALCommodityOrderDeliveryState.deliverying:{
                                        params.deliveryStateString = "配送中";
                                    }break;
                                    case AL.config.ALCommodityOrderDeliveryState.deliveryDone:{
                                        params.deliveryStateString = "配送完成";
                                    }break;
                                }

                                if (!__production) console.dir(params);

                                //无人抢单
                                if (deliveryState < AL.config.ALCommodityOrderDeliveryState.waitingForFetch || AL.isEmpty(delivery))
                                {
                                    // 等待抢单
                                    var title = "抢单";
                                    var url = AL.domain+"delivery/open"+"?orderId="+orderId+"&userId="+userId;
                                    res.render("cloud/views/deliveryOrder",{order:params,url:url,title:title,reportCodeURL:""});

                                }
                                //我抢的单
                                else if (delivery && delivery.get('user').id == userId)
                                {
                                    //////////////////
                                    if (!__production) console.log("我抢的单");

                                    switch (deliveryState){

                                        case  AL.config.ALCommodityOrderDeliveryState.close:  // 不会出现
                                        case  AL.config.ALCommodityOrderDeliveryState.undefine:{

                                            // 等待抢单
                                            //var title = "抢单";
                                            //var url = "http://192.168.199.232:3000/delivery/open"+"?orderId="+orderId+"&userId="+userId;
                                            //res.render("cloud/views/deliveryOrder",{order:params,url:url,title:title});
                                            AL.done(res,null,AL.error(777611,"订单异常,请与客服联系!"));
                                        }   break;

                                        case AL.config.ALCommodityOrderDeliveryState.waitingForFetch:  //目前没有这个状态
                                        // 有人抢单 等待取件
                                        case AL.config.ALCommodityOrderDeliveryState.waitingForDelivery:{

                                            // 已经取件 等待发货
                                            var title = "开始配送";
                                            var url = AL.domain+"delivery/start"+"?deliveryId="+delivery.id+"&userId="+userId;
                                            res.render("cloud/views/deliveryOrder",{order:params,url:url,title:title,reportCodeURL:""});

                                        }   break;

                                        case AL.config.ALCommodityOrderDeliveryState.deliverying:{

                                            //发货 配送中
                                            var title = "配送完成";
                                            var url = AL.domain+"delivery/done"+"?deliveryId="+delivery.id+"&userId="+userId;
                                            var reportCodeURL =  AL.domain+"delivery/repostCode"+"?deliveryId="+delivery.id+"&userId="+userId;
                                            res.render("cloud/views/deliveryOrder",{order:params,url:url,reportCodeURL:reportCodeURL,title:title});

                                        }   break;

                                        case AL.config.ALCommodityOrderDeliveryState.deliveryDone:{

                                            //配送完成
                                            var title = "配送完成";
                                            var url = "";
                                            res.render("cloud/views/deliveryOrder",{order:params,url:url,title:title,reportCodeURL:""});

                                        }   break;
                                    }

                                }
                                //别人的单
                                else
                                {
                                    if (!__production) console.dir("别人的单");
                                    //AL.done(res,null,AL.error(777321,"已被抢单。"));
                                    var title = "已被抢单";
                                    var url = "";
                                    params.deliveryStateString = "已被抢单";
                                    res.render("cloud/views/deliveryOrder",{order:params,url:url,title:title,reportCodeURL:""});
                                }



                                //var readUsers = order.relation('readUsers');
                                //readUsers.add(user);
                                //order.increment('readTimes');
                                //order.save();
                            }
                            else
                            {
                                if (!__production) console.dir("订单不存在");
                                AL.done(res,null,AL.error(777322,"订单不存在。"));
                            }
                        });
                    }
                    else
                    {
                        //不是花店
                        if (!__production) console.dir("不是花店");
                        AL.done(res,null,AL.error(777324,"您还没有通过Bloom的认证，我们会尽快与您取得联系，感谢支持。"));
                    }
                }
                else
                {
                    //没有注册
                    if (!__production) console.dir("没有注册");
                    AL.done(res,null,AL.error(777325,"您还不是Bloom的花艺师，请在公众号中点击\"加入Bloom\"，注册成为Bloom的花艺师。"));
                }
            });
        }
        else
        {

            oauth.getOpenidWithOAuth(AL.domain+"wechat/delivery/getOrder"+"?orderId="+orderId, 0, res);
        }
    });

    // 微信抢单 POST   (不用)
    app.all('/wechat/delivery/open?', function(req, res){

        var openId = req.query.openid;
        var orderId = req.query.orderId;

        if (openId && openId.length > 0)
        {
            searchUserWithAuthKey(openId, function(user, error){

                if (user && !error)
                {
                    if (user.get('userType')==AL.config.ALUserType.store)
                    {
                        //花店
                        if (!__production) console.dir("是花店");
                        AL.httpPostRequest(AL.domain+"delivery/open",{openId:openId,orderId:orderId},function(result,error){
                            AL.done(res,result,error);
                        });
                    }
                    else
                    {
                        //不是花店
                        if (!__production) console.dir("不是花店");
                        res.end("您还不是Bloom的花艺师，请在公众号中点击\"加入Bloom\"，注册成为Bloom的花艺师。".toString('utf-8'));
                        //AL.done(res,null,AL.error(777324,"您还不是Bloom的花艺师，请在公众号中点击\"加入Bloom\"，注册成为Bloom的花艺师。"));
                    }
                }
                else
                {
                    //没有注册
                    if (!__production) console.dir("没有注册");
                    res.end("您还未注册Bloom，请在公众号中回复注册，注册成为Bloom会员。".toString('utf-8'));
                    //AL.done(res,null,AL.error(777325,"您还未注册Bloom，请在公众号中回复注册，注册成为Bloom会员。"));
                }
            });
        }
        else
        {
            oauth.getOpenidWithOAuth(AL.domain+"wechat/delivery/open", 0, res);
        }

    });

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


};

// 商家新订单通知Id ZjWC8f9t9Ky--tZoFziJrAXtGB-eEFK9d1cDHmT9WeY
// 购买成功通知     vsmxcksbfU_xdTnVavmhRQTtDLSgdD1ErPZAt0rhYes
exports.wechatSendOrderInfoToFlowerStore = wechatSendOrderInfoToFlowerStore;
exports.wechatSendOrderInfo = wechatSendOrderInfo;

