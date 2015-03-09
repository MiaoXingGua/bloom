

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

var AL = require('cloud/lib/ALCommonUtil').AL();
var StatementAPI = require('cloud/lib/ALUserStatementAPI').StatementAPI();
var wechatDelivery = require('cloud/routes/wechatDelivery');

exports.route = function(app) {

    app.all('/delivery/demo',function(req, res){

        var orderQ = new AV.Query(AL.config.CommodityOrder);
        orderQ.equalTo('objectId',"54ae5dade4b0cdc4e0a43d4f");
        orderQ.first().then(function(order) {
            postCustomEvaluate(order);
        });
    });

    // 申请成为快递员
    app.all('/delivery/authentication', function (req, res) {

        var userId = req.body.userId;

        // 工作照
        var certificatePhotoId = req.body.certificatePhotoId;

        // 所在地区
        var workAddress = req.body.workAddress;

        // 真实姓名
        var realName = req.body.realName;

        // 身份证号
        var IDNumber = req.body.IDNumber;

        // 紧急联系人
        var emergencyContactNumber = req.body.emergencyContactNumber;

        // 联络电话
        var phoneNumber = req.body.phoneNumber;

        // 身份证照（正面）
        var IDCardPhotoId1 = req.body.IDCardPhotoId1;

        // 身份证照（反面）
        var IDCardPhotoId2 = req.body.IDCardPhotoId2;

        var deliverymanInfo = new AL.config.DeliverymanInfo();
        deliverymanInfo.set('user',AL.object('_User',userId));
        deliverymanInfo.set('certificatePhoto',AL.object('Photo',certificatePhotoId));
        deliverymanInfo.set('workAddress',workAddress);  deliverymanInfo.set('workAddress',workAddress);
        deliverymanInfo.set('realName',realName);
        deliverymanInfo.set('IDNumber',IDNumber);
        deliverymanInfo.set('emergencyContactNumber',emergencyContactNumber);
        deliverymanInfo.set('phoneNumber',phoneNumber);
        deliverymanInfo.set('IDCardPhotoId1',AL.object('Photo',IDCardPhotoId1));
        deliverymanInfo.set('IDCardPhotoId2',AL.object('Photo',IDCardPhotoId2));
        deliverymanInfo.save().then(function(obj){
            AL.done(res,obj.id);
        },function(error){
            AL.done(res,null,error);
        });
        //00:26:bb:0c:95:b7
        //e0:f8:47:40:94:32
    });

    // 申请成为花艺师
    app.all('/delivery/auth/bloomer?', function(req, res){

        var userId = req.body.userId;

        // 工作照
        var certificatePhotoId = req.body.certificatePhotoId;

        // 所在地区
        var workAddress = req.body.workAddress;

        // 真实姓名
        var realName = req.body.realName;

        // 身份证号
        var IDNumber = req.body.IDNumber;

        // 紧急联系人
        var emergencyContactNumber = req.body.emergencyContactNumber;

        // 联络电话
        var phoneNumber = req.body.phoneNumber;

        // 身份证照（正面）
        var IDCardPhotoId1 = req.body.IDCardPhotoId1;

        // 身份证照（反面）
        var IDCardPhotoId2 = req.body.IDCardPhotoId2;

        var deliverymanInfo = new AL.config.DeliverymanInfo();
        deliverymanInfo.set('user',AL.object('_User',userId));
        deliverymanInfo.set('certificatePhoto',AL.object('Photo',certificatePhotoId));
        deliverymanInfo.set('workAddress',workAddress);  deliverymanInfo.set('workAddress',workAddress);
        deliverymanInfo.set('realName',realName);
        deliverymanInfo.set('IDNumber',IDNumber);
        deliverymanInfo.set('emergencyContactNumber',emergencyContactNumber);
        deliverymanInfo.set('phoneNumber',phoneNumber);
        deliverymanInfo.set('IDCardPhotoId1',AL.object('Photo',IDCardPhotoId1));
        deliverymanInfo.set('IDCardPhotoId2',AL.object('Photo',IDCardPhotoId2));
        deliverymanInfo.save().then(function(obj){
            AL.done(res,obj.id);
        },function(error){
            AL.done(res,null,error);
        });

    });

    // 配送里程
    // 评分
    // 配送单数

    //查看全部订单
    app.all('/delivery/getWaitingForDeliveryOrders?', function (req, res) {

        var orderQ = new AV.Query(AL.config.CommodityOrder);
        orderQ.containedIn('state',[AL.config.ALCommodityOrderState.waitingForDelivery]);
        orderQ.containedIn('deliveryState',[AL.config.ALCommodityOrderDeliveryState.undefine]);
        orderQ.notEqualTo('isDeleted',true);
        orderQ.ascending('deliveryFromDate');
        //orderQ.doesNotExist('delivery');
        orderQ.limit(100);
        AL.findQueryWithoutData(orderQ, null, function(ids, error){
            AL.done(res,ids,error);
        });
    });

    //抢单
    app.all('/delivery/open?', function (req, res) {

        //console.dir("/delivery/open");

        var orderId = req.param("orderId");
        var userId = req.param("userId");

        //console.dir(req.url);
        //console.dir(orderId);
        //console.dir(userId);

        if (!orderId || !userId)
        {
            return AL.done(res,false,AL.error(777110,"参数错误"));
        }

        var order = null;
        var user = null;

        try{

            order = AL.object('CommodityOrder',orderId);
            user = AL.object('_User',userId);

        }catch (error){

            return AL.done(res,false,error);
        }

        var deliveryQ = new AV.Query(AL.config.CommodityDelivery);
        deliveryQ.equalTo('order', order);
        deliveryQ.notEqualTo('isDeleted',true);
        deliveryQ.notEqualTo('state',AL.config.ALCommodityOrderDeliveryState.close);
        deliveryQ.count().then(function(number){

            if (!__production) console.log("number : "+number);

            if (number>0)
            {
                //已经被抢单
                AL.done(res,false,AL.error(777231,"已经被抢单"));
            }
            else
            {
                //可以抢单
                if (!__production) console.dir("可以抢单");
                var delivery = new AL.config.CommodityDelivery();
                delivery.set('state',AL.config.ALCommodityOrderDeliveryState.waitingForFetch);
                delivery.set('order', order);
                delivery.set('user', user);

                //配送信息
                delivery.set('deliveryPoint', order.get('deliveryPoint'));
                delivery.set('deliveryName', order.get('deliveryName'));
                delivery.set('deliveryPhone', order.get('deliveryPhone'));
                delivery.set('deliveryAddress', order.get('deliveryAddress'));
                delivery.set('deliveryFromDate', order.get('deliveryFromDate'));
                delivery.set('deliveryToDate', order.get('deliveryToDate'));


                delivery.save().then(function(delivery){

                    if (!delivery)
                    {
                        AL.done(res,false,AL.error(777265,"订单不存在"));
                    }
                    else
                    {
                        if (!__production) console.dir("抢单成功");
                        var deliveryQ = new AV.Query(AL.config.CommodityDelivery);
                        deliveryQ.equalTo('order', order);
                        deliveryQ.notEqualTo('isDeleted',true);
                        deliveryQ.notEqualTo('state',AL.config.ALCommodityOrderDeliveryState.close);
                        deliveryQ.ascending("createdAt");
                        deliveryQ.find().then(function(deliverys){

                            if (deliverys.length>1)
                            {
                                //有多个人同时抢单
                                if (!__production) console.dir("有多个人同时抢单");
                                var trueDelivery = deliverys[0];
                                deliverys.splice(0,1);
                                AL.destroyAll(deliverys);
                                if (delivery.id != trueDelivery.id)
                                {
                                    //我不是第一个抢到的
                                    return AL.done(res,false,AL.error(777232,"已经被抢单"));
                                }
                            }

                            if (!__production) console.dir("修改订单");
                            order.set('delivery',AL.object("CommodityDelivery",delivery.id));
                            //order.set('state',AL.config.ALCommodityOrderState.waitingForReceive);
                            order.set('deliveryState',AL.config.ALCommodityOrderDeliveryState.waitingForFetch);
                            order.save().then(function(order){
                                if (!__production) console.dir("OK");
                                AL.done(res,true);
                            },function(error){
                                AL.done(res,false,error);
                            });

                        },function(error){
                            if (!__production) console.dir("抢单失败2");
                            AL.done(res,false,error);
                        });
                    }

                },function(error){
                    if (!__production) console.dir("抢单失败1");
                    AL.done(res,false,error);
                });
            }
        },function(error){
            AL.done(res,false,error);
        });

    });

    //我抢到的配送单
    app.all('/delivery/getMyDelivery?', function (req, res) {

        console.log("delivery/getMyDelivery");

        var userId = req.param("userId");
        var withinData = req.param("withinData");
        var limit = req.param("limit");
        var skip = req.param("skip");
        var states = req.param("states");
        var deliveryStates = req.param("deliveryStates");

        try{

            limit = limit?parseInt(limit):null;
            skip = skip?parseInt(skip):null;
            states = states?JSON.parse(states):null;
            deliveryStates = deliveryStates?JSON.parse(deliveryStates):null;
            withinData = withinData?parseInt(withinData):null;

        }catch (err){
            return AL.done(res,null,err);
        }

        console.dir(userId);
        console.dir(limit);
        console.dir(skip);
        console.dir(states);
        console.dir(deliveryStates);
        console.dir(withinData);

        if (!userId)
        {
            return AL.done(res,false,AL.error(777110,"参数错误"));
        }

        //userId = "54c61903e4b038b5be1df518";

        var user = AL.object('_User',userId);

        var deliveryQ = new AV.Query(AL.config.CommodityDelivery);

        if (withinData)
        {
            deliveryQ.include('order');
            deliveryQ.include('order.user');
            deliveryQ.include('order.card');
        }

        //deliveryQ.exists('commoditySnapshotsString');
        deliveryQ.equalTo('user', user);
        deliveryQ.notEqualTo('isDeleted', true);
        deliveryQ.notContainedIn('state', [-1,0]);
        if (limit) deliveryQ.limit(limit);
        if (skip) deliveryQ.limit(skip);
        if (AL.isArray(states) && states.length>0 && states.indexOf(0)==-1)
        {
            deliveryQ.containedIn('state', states);
        }
        deliveryQ.descending('createdAt');
        //deliveryQ.addDescending('state');
        //console.dir(deliveryQ.className);

        if (withinData)
        {
            AL.findQuery(deliveryQ,null,function(objects,error){

                //console.dir("objs : "+JSON.stringify(objects));
                //var objs = [];
                //while(objs.length<limit){
                //
                //    objs.push(objects[0]);
                //};
                //AL.done(res,objs,error);

                //console.dir(objects);
                AL.done(res,objects,error);


            });
            //deliveryQ.find().then(function(deliverys){
            //
            //    //console.dir(deliverys[0].toJSON());
            //    console.dir(deliverys[0].get('order').toJSON());
            //
            //    var objs = [];
            //    for (var i in deliverys)
            //    {
            //        var obj = deliverys[i].toJSON();
            //        obj.className = "CommodityDelivery";
            //        obj.__type = "Pointer";
            //        objs.push(deliverys[i].toJSON());
            //    }
            //    AL.done(res,objs);
            //
            //},function(error){
            //    AL.done(res,null,error);
            //});
        }
        else
        {
            AL.findQueryWithoutData(deliveryQ,null,function(ids,error){
                AL.done(res,ids,error);
            });
        }
    });

    // 放弃订单
    app.all('/delivery/close?', function (req, res) {

        var orderId = req.param("orderId");
        var userId = req.param("userId");

        if (!userId || !orderId)
        {
            return AL.done(res,false,AL.error(777110,"参数错误"));
        }

        //console.dir(deliveryId);
        //console.dir(userId);
        //return;

        var deliveryQ = new AV.Query(AL.config.CommodityDelivery);
        deliveryQ.equalTo('order',AL.object('CommodityOrder',orderId));
        deliveryQ.include('order');
        deliveryQ.first().then(function(delivery){

            //var user = AL.object('_User',userId);

            if (delivery)
            {
                if (delivery.get('user').id == userId || AL.config.ALUserIdOfAdmin.indexOf(userId)!=-1)
                {

                    delivery.set('state',AL.config.ALCommodityOrderDeliveryState.close);

                    var order = delivery.get('order');
                    order.set('state',AL.config.ALCommodityOrderState.waitingForDelivery);
                    order.set('deliveryState',AL.config.ALCommodityOrderDeliveryState.undefine); //close

                    AL.saveAll([delivery,order],function(list,error){

                        AL.done(res,error==null,error);

                        if (list && !error)
                        {
                            //var payMethodStr = null;
                            //switch (order.get('payMethod')) {
                            //
                            //    case 1:
                            //    {
                            //        payMethodStr = "贝宝";
                            //    }
                            //        break;
                            //    case 2:
                            //    {
                            //        payMethodStr = "支付宝";
                            //    }
                            //        break;
                            //    case 3:
                            //    {
                            //        payMethodStr = "微信支付";
                            //    }
                            //        break;
                            //    default :
                            //    {
                            //        payMethodStr = "未知";
                            //    }
                            //        break;
                            //}
                            //
                            //var smsParams = {
                            //    orderId         : order.id,
                            //    tradeNo         : order.get('tradeNo'),
                            //    orderNO         : order.get('orderNO'),
                            //    date            : AL.getDateFormat(order.get('deliveryFromDate'))+" 至 "+AL.getDateFormat(order.get('deliveryToDate'))+" 期间",
                            //    totalPrice      : order.get('totalPrice')/100,
                            //    paymentAmount   : order.get('paymentAmount')/100,
                            //    payMethod       : payMethodStr,
                            //    userId          : order.get('user').id,
                            //    address         : order.get('deliveryAddress')
                            //};
                            //
                            //AL.sendSMS([order.get('user').get('phoneNumber')], "paymentCompleteToUser", smsParams);

                            if (AL.config.ALUserIdOfAdmin.indexOf(userId)==-1)
                            {
                                //花艺师关闭

                                wechatDelivery.wechatSendOrderInfoToFlowerStore(order);
                            }


                        }

                    });
                }
                else
                {
                    return AL.done(res,false,AL.error(777111,"参数错误"));
                }
            }
            else
            {
                return AL.done(res,false,AL.error(777234,"配送单不存在"));
            }

        },function(error){
            return AL.done(res,false,error);
        });
    });

    // 订单转发
    app.all('/wechat/delivery/send?', function(req,res){

        var orderId = req.param("orderId");
        var openIds = req.param("openIds");
        var userId = req.param("userId");

        //console.dir(orderId);
        //console.dir(openIds);
        //console.dir(userId);

        if (!orderId || !openIds || !userId)
        {
            return AL.done(res,false,AL.error(777101,"参数错误"));
        }

        if (AL.config.ALUserIdOfAdmin.indexOf(userId)==-1)
        {
            //不是管理员
            return AL.done(res,false,AL.error(777211,"不能转发订单"));
        }

        try{

            openIds = openIds?JSON.parse(openIds):null;

        }catch (err){

            return AL.done(res,false,err);

        }

        console.dir(openIds);

        if (!AL.isArray(openIds) || openIds.length==0)
        {
            return AL.done(res,false,AL.error(777102,"参数错误"));
        }

        var orderQ = new AV.Query(AL.config.CommodityOrder);
        orderQ.equalTo('objectId',orderId);
        orderQ.limit(1);
        orderQ.find().then(function(orders){

            if (orders && orders.length>0)
            {
                wechatDelivery.wechatSendOrderInfo(orders[0],openIds,function(suc,err){
                    if (suc && !err)
                    {
                        return AL.done(res,true);
                    }
                    else
                    {
                        return AL.done(res,false,err);
                    }
                });
            }
            else
            {
                return AL.done(res,false,AL.error(777211,"订单不存在"));
            }

        },function(error){

            return AL.done(res,false,error);
        });

        //AL.findQuery(orderQ,null,function(orders,error){
        //
        //    if (!error && orders && AL.isArray(orders) && orders.length!=0)
        //    {
        //        console.dir(orders[0]);
        //        console.dir(orders[0].id);
        //        wechatDelivery.wechatSendOrderInfo(orders[0],openIds,function(suc,err){
        //            if (suc && !err)
        //            {
        //                return AL.done(res,true);
        //            }
        //            else
        //            {
        //                return AL.done(res,false,err);
        //            }
        //        });
        //    }
        //    else
        //    {
        //        return AL.done(res,false,AL.error(777211,"订单不存在"));
        //    }
        //});
    });

    //开始配送
    app.all('/delivery/start?', function (req, res) {

        //var deliveryId = req.body.deliveryId;
        //var userId = req.body.userId;

        var deliveryId = req.param("deliveryId");
        var userId = req.param("userId");

        if (!userId || !deliveryId)
        {
            return AL.done(res,false,AL.error(777110,"参数错误"));
        }

        var deliveryQ = new AV.Query(AL.config.CommodityDelivery);
        deliveryQ.equalTo('objectId',deliveryId);
        deliveryQ.include('order');
        deliveryQ.first().then(function(delivery){

            if (delivery)
            {
                //var date = new Date();
                //date.setHours(date.getHours()+12);
                //console.dir(moment(new Date()).tz('Asia/Shanghai').add(12,'hours').toDate());
                //console.dir(moment(new Date()).add(12,'hours').toDate());
                //console.dir(delivery.toJSON());

                var deliveryFromDate = delivery.get('deliveryFromDate') || delivery.get('order').get('deliveryFromDate');
                console.dir(deliveryFromDate);
                if (moment(new Date()).tz('Asia/Shanghai').add(12,'hours').toDate() > deliveryFromDate)  // || true
                {
                    var deliveryCode = AL.getRandomNumberWithDigit(6);

                    if (delivery.get('user').id == userId && !AL.isEmpty(delivery))
                    {
                        delivery.set('state',AL.config.ALCommodityOrderDeliveryState.deliverying);
                        delivery.set('deliveryCode',deliveryCode);

                        var order = delivery.get('order');
                        order.set('state',AL.config.ALCommodityOrderState.waitingForReceive);
                        order.set('deliveryState',AL.config.ALCommodityOrderDeliveryState.deliverying);

                        AL.saveAll([delivery,order],function(list,error){

                            AL.done(res,error==null,error);

                            if (list && !error)
                            {
                                postDeliveryCode(delivery);
                            }
                        });
                    }
                    else
                    {
                        return AL.done(res,false,AL.error(777111,"参数错误"));
                    }
                }
                else
                {
                    return AL.done(res,false,AL.error(777223,"当前时间不可配送"));
                }

            }
            else
            {
                return AL.done(res,false,AL.error(777112,"订单不存在"));
            }

        },function(error){
            return AL.done(res,false,error);
        });
    });

    //重发
    app.all('/delivery/repostCode?', function (req, res) {

        var deliveryId = req.param("deliveryId");
        var userId = req.param("userId");

        if (!userId || !deliveryId)
        {
            return AL.done(res,false,AL.error(777110,"参数错误"));
        }

        var deliveryQ = new AV.Query(AL.config.CommodityDelivery);
        deliveryQ.equalTo('objectId',deliveryId);
        deliveryQ.include('order');
        deliveryQ.first().then(function(delivery){

            if (AL.isEmpty(delivery) || AL.isEmpty(delivery.get('deliveryCode')))
            {
                return AL.done(res,false,AL.error(777111,"参数错误"));
            }
            else
            {
                postDeliveryCode(delivery, function(success,error){
                    AL.done(res,success,error);
                });
            }

        },function(error){
            return AL.done(res,false,error);
        });

    });

    var postDeliveryCode = function(delivery,done){


        var params = {};
        var phoneCode = delivery.get('order').get('deliveryPhone');
        params.orderNO = delivery.get('order').get('orderNO');
        params.deliveryCode = delivery.get('deliveryCode');
        params.deliveryTime = 90;

        AL.sendSMS([phoneCode],"deliveryStart",params,done);
    };

    var postCustomEvaluate = function(order,done){

        var params = {};
        var phoneCode = order.get('deliveryPhone');
        params.orderNO = order.get('orderNO');
        params.customEvaluate = "http://flowerso2o.avosapps.com/order/customEvaluate/get/"+order.id;
        AL.sendSMS([phoneCode],"customEvaluate",params,done);
    };

    //上传坐标
    app.all('/delivery/updateDelivery', function (req, res) {

        var deliveryId = req.body.deliveryId;
        var userId = req.body.userId;
        var latitude = parseFloat(req.body.latitude);
        var longitude = parseFloat(req.body.longitude);
        var location = req.body.location;

        if (!__production) console.dir("location : " + location);

        var deliveryQ = new AV.Query(AL.config.CommodityDelivery);
        deliveryQ.equalTo('objectId',deliveryId);
        //deliveryQ.include('order');
        deliveryQ.first().then(function(delivery){

            //var user = AL.object('_User',userId);
            if (delivery.get('user').id == userId)
            {
                var locations = delivery.get('locations') || [];

                //console.dir({latitude: latitude, longitude: longitude, location:location});

                //console.dir(locations);

                locations.push({lat: latitude, lon: longitude, loc:location, date:parseInt(AL.getTimeStamp()/1000)});

                //console.dir(locations);

                delivery.set('locations',locations);
                //var order = delivery.get('order');
                //order.set('delivery',null);
                //order.set('state',ALCommodityOrderState.waitingForDelivery);
                AL.saveAll([delivery],function(list,error){
                    AL.done(res,error==null,error);
                });
            }

            else
            {
                return AL.done(res,false,AL.error(777111,"参数错误"));
            }

        },function(error){
            return AL.done(res,false,error);
        });
    });


    //送达 配送结束
    app.all('/delivery/done', function (req, res) {

        var deliveryId = req.param("deliveryId");
        var userId = req.param("userId");
        var deliveryCode = req.param("deliveryCode");

        if (!userId || !deliveryId)
        {
            return AL.done(res,false,AL.error(777110,"参数错误"));
        }

        //if (!deliveryCode || deliveryCode.length!=6)
        //{
        //    return AL.done(res,false,AL.error(777210,"验证码错误"));
        //}

        var incrementPrice = function(user,price,tryTimes,done){

            if (tryTimes<=0)
            {
                done(false,AL.error(777222,"保存失败"));
            }

            //if (!__production) console.log("金钱增加 : "+price);

            if (!user || !user.id || !price)
            {
               done(false,AL.error(777110,"参数错误"));
            }

            user.increment('deliveryTimes');
            user.increment('money',price);
            user.save().then(function(user){
                   done(true);
            },function(error){
                incrementPrice(user,price,--tryTimes,done);
            });
        };

        var addStatement = function(statementInfo,tryTimes,done){

            if (tryTimes<=0)
            {
               done(false);
            }

            Statement.addStatement(statementInfo, function(statementId,error){
                 if (!error && statementId)
                 {
                    done(true);
                 }
                 else
                 {
                     addStatement(statementInfo,--tryTimes,done);
                 }
            });

        } ;

        var deliveryQ = new AV.Query(AL.config.CommodityDelivery);
        deliveryQ.equalTo('objectId',deliveryId);
        // deliveryQ.equalTo('deliveryCode',deliveryCode);
        deliveryQ.include('order');
        deliveryQ.include('user');
        deliveryQ.first().then(function(delivery){

            //console.log(delivery);
            //var user = AL.object('_User',userId);
            var deliveryman = delivery.get('user');
            if (delivery && deliveryman.id == userId)
            {
                if (delivery.get('deliveryCode')==deliveryCode || true)
                {
                    delivery.set('state',AL.config.ALCommodityOrderDeliveryState.deliveryDone);

                    var order = delivery.get('order');
                    order.set('state',AL.config.ALCommodityOrderState.done);
                    order.set('deliveryState',AL.config.ALCommodityOrderDeliveryState.deliveryDone);

                    AL.saveAll([order,delivery],function(list,error){
                        if (list && !error)
                        {
                            // 发送给用户评价
                            postCustomEvaluate(order,null);

                            // 为快递员增加金钱
                            var money = order.get('totalCostPrice');
                            incrementPrice(deliveryman,money,10,function(suc,err){

                                /*
                                    加入账单系统
                                 */
                                var commoditySnapshotsString = order.get('commoditySnapshotsString');
                                var name = "";
                                if (commoditySnapshotsString)
                                {
                                    try{
                                        var commoditySnapshots = JSON.parse(commoditySnapshotsString);
                                        if (commoditySnapshots && AL.isArray(commoditySnapshots))
                                        {
                                            name = commoditySnapshots[0].name;
                                        }
                                        else
                                        {
                                            name = order.get('deliveryAddress');
                                        }

                                    }catch(err){
                                        name = order.get('deliveryAddress');
                                    }finally{

                                        var statementInfo = {
                                            userId:userId,
                                            orderId:order.id,
                                            money:money,
                                            type:AL.config.ALUserStatementType.delivery,
                                            name:name
                                        };

                                        //金钱增加成功
                                        if (suc && !err)
                                        {
                                            statementInfo.state = AL.config.ALUserStatementState.done;
                                        }
                                        //金钱增加失败
                                        else
                                        {
                                            statementInfo.state = AL.config.ALUserStatementState.underway;
                                        }

                                        addStatement(statementInfo,10,function(suc){
                                            if (!suc)
                                            {
                                                //异常 发微信
                                            }
                                        });

                                    }
                                }
                            });
                        }
                        AL.done(res,error==null,error);
                    });
                }
                else
                {
                    return AL.done(res,false,AL.error(777211,"验证码错误"));
                }
            }
            else
            {
                return AL.done(res,false,AL.error(777111,"参数错误"));
            }

        },function(error){
            return AL.done(res,false,error);
        });
    });

   /*
    账单
    */
    // 添加账单
    app.all('/delivery/statement/add', function(req, res){

    });

};
