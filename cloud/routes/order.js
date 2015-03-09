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
var wechatDelivery = require('cloud/routes/wechatDelivery');

exports.route = function(app) {


    app.all("/order/demo", function(request, response) {

        //console.dir(new Date().dataFormat("yyyy-MM-dd HH:mm:ss"));
        console.dir(AL.getDateFormat(null,"YYYYMMDDHHmmssSSS"));
        console.dir(AL.getRandomNumberWithDigit(9));

        //var cartQ = new AV.Query(CommodityCart);
        //cartQ.equalTo('objectId',"54891107e4b0a4f0f0b12d0c");
        //cartQ.include('commodity');
        //cartQ.first().then(function(cart){
        //    console.log(cart.get('commodity').get('price'));
        //    console.dir(JSON.stringify(cart.get('commodity')));
        //},function(error){
        //    console.dir(error);
        //});

    });

    app.all("/order/close", orderClose);

    app.all("/order/delete", orderDelete);

    app.all("/payment/order/update", function(req,res){
        orderAdd(req,function(order,error){
              AL.done(res,order.id,error);
        });
    });

    app.all("/order/add",  function(req,res){
        orderAdd(req,function(order,error){
            AL.done(res,order.id,error);
        });
    });

    app.all("/order/customEvaluate/get/:orderId", function(req, res){

        var orderId = req.params.orderId;

        res.render('cloud/views/customEvaluate',{orderId:orderId});
    });

    app.all("/order/customEvaluate/set/:orderId", function(req, res){

        var orderId = req.params.orderId;
        //var gitf = parseInt(req.body.gitf);
        //var delivery = parseInt(req.body.delivery);

        var order = AL.object('CommodityOrder',orderId);
        order.set('customEvaluate',req.body);
        order.save().then(function(order){
            AL.done(res,true);
        },function(error){
            AL.done(res,false,error);
        });
    });

    app.all("/order/search",function(req, res){

        var limit = req.param("limit");
        var skip = req.param("skip");
        var orderNO = req.param("orderNO");
        var states = req.param("states");
        var deliveryStates = req.param("deliveryStates");
        var withinData = req.param('withinData');

        try{

            limit = limit?parseInt(limit):null;
            skip = skip?parseInt(skip):null;
            states = states?JSON.parse(states):null;
            deliveryStates = deliveryStates?JSON.parse(deliveryStates):null;
            withinData = withinData?parseInt(withinData):null;

        }catch (err) {

            return AL.done(res,null,err);
        }

        var orderQ = new AV.Query(AL.config.CommodityOrder);
        if (!withinData) AL.config._includeKeyWithOrderQuery(orderQ);
        if (AL.isNumber(limit)) orderQ.limit(limit);
        if (AL.isNumber(skip)) orderQ.skip(skip);
        if (orderNO) orderQ.matches('orderNO',orderNO);
        if (AL.isArray(states) && states.length>0)
            orderQ.notContainedIn('state',states);
        if (AL.isArray(deliveryStates) && deliveryStates.length>0)
            orderQ.notContainedIn('deliveryState',deliveryStates);

        orderQ.ascending('createdAt');
        orderQ.notEqualTo('isDeleted',true);

        if (withinData)
        {
            AL.findQuery(orderQ,null,function(objects,error){
                AL.done(res,objects,error);
            });
        }
        else
        {
           AL.findQueryWithoutData(orderQ,null,function(ids, error){
                 AL.done(res,ids,error);
           });
        }

    });

};

exports.fetchOrder = function(orderId,done){

    var orderQ = new AV.Query(AL.config.CommodityOrder);
    orderQ.equalTo('objectId',orderId);
    AL.config._includeKeyWithOrderQuery(orderQ);
    orderQ.notEqualTo('isDeleted',true);
    orderQ.descending('createdAt');
    orderQ.first().then(function(order){
        done(order);
    },function(error){
        done(null,error);
    });
    //AL.findQuery(orderQ, null, function(orders,error){
    //
    //    if (orders && !error && AL.isArray(orders) && orders.length>0)
    //    {
    //        done(orders[0]);
    //    }
    //    else
    //    {
    //        done(null,error);
    //    }
    //});
};
/*
 订单支付成功 : {{ orderId }}
 用户 {{ userId }} 使用 {{ payMethod }} 支付金额 : {{ totalPrice }} 。
 订单详情:
 订单号 : {{ tradeNO }}
 支付号 : {{ tradeNo }}
 时间 : {{ date }}

 订单支付成功 ​​
 {{first.DATA}}支付金额：{{orderMoneySum.DATA}}商品信息：{{orderProductName.DATA}}{{Remark.DATA}}​内容示例
 我们已收到您的货款，开始为您打包商品，请耐心等待: )支付金额：30.00元商品信息：我是商品名字如有问题请致电400-828-1878或直接在微信留言，小易将第一时间为您服务！​
 */

exports.completeOrders = function (orderId, tradeNO, paymentAmount, params, payMethod, tryTimes, done) {

    if (tryTimes <= 0) {

        var errorPayment = new AL.config.ErrorOfPayment();
        errorPayment.set('orderId',orderId);
        errorPayment.set('tradeNO',tradeNO);
        errorPayment.set('paymentAmount',paymentAmount);
        errorPayment.set('payData',params);
        errorPayment.set('payMethod',payMethod);
        errorPayment.save();
        return done(false);
    }

    console.dir("开始完善订单 : " + orderId + "---" + tradeNO);

    if (AV._.isEmpty(orderId) || AV._.isEmpty(tradeNO) || AV._.isEmpty(params)) {

        var errorPayment = new AL.config.ErrorOfPayment();
        errorPayment.set('orderId',orderId);
        errorPayment.set('tradeNO',tradeNO);
        errorPayment.set('paymentAmount',paymentAmount);
        errorPayment.set('payData',params);
        errorPayment.set('payMethod',payMethod);
        errorPayment.save();
        return done(false);
    }

    if (orderId.length>24)
        orderId = orderId.substring(orderId.length-24, orderId.length);

    var that = this;

    //var order = AV.Object.createWithoutData("CommodityOrder", orderId);
    var orderQ = new AV.Query(AL.config.CommodityOrder);
    orderQ.equalTo('objectId',orderId);
    //orderQ.equalTo('totalPrice',paymentAmount); ///测试用
    orderQ.include('user');

    //console.log("totalPrice : "+paymentAmount);

    orderQ.first().then(function (order) {

        //console.dir(order);

        if (order)
        {                   //ALPayMethod
            order.set('tradeNO', tradeNO);
            order.set('payMethod', payMethod);
            order.set('paymentAmount',paymentAmount);
            order.set('payData', params);
            order.set('state', AL.config.ALCommodityOrderState.waitingForDelivery);
            order.save().then(function (order) {

                console.dir("完善订单OK");

                if (order) {

                    var payMethodStr = null;
                    switch (payMethod) {

                        case 1:
                        {
                            payMethodStr = "贝宝";
                        }
                            break;
                        case 2:
                        {
                            payMethodStr = "支付宝";
                        }
                            break;
                        case 3:
                        {
                            payMethodStr = "微信支付";
                        }
                            break;
                        default :
                        {
                            payMethodStr = "未知";
                        }
                            break;
                    }

                    var smsParams = {
                        orderId         : orderId,
                        tradeNo         : tradeNO,
                        orderNO         : order.get('orderNO'),
                        date            : AL.getDateFormat(order.get('deliveryFromDate'))+" 至 "+AL.getDateFormat(order.get('deliveryToDate'))+" 期间",
                        totalPrice      : order.get('totalPrice')/100,
                        paymentAmount   : paymentAmount/100,
                        payMethod       : payMethodStr,
                        userId          : order.get('user').id,
                        address         : order.get('deliveryAddress')
                    };

                    AL.sendSMS([order.get('user').get('phoneNumber')], "paymentCompleteToUser", smsParams);
                    //AL.sendSMS(AL.config.ALPhoneOfServer, "paymentCompleteToServices", smsParams);
                    wechatDelivery.wechatSendOrderInfoToFlowerStore(order);
                    done(true);
                }
                else {
                    that.completeOrders(orderId, tradeNO, paymentAmount, params, --tryTimes, done);
                }

            }, function (error) {
                that.completeOrders(orderId, tradeNO, paymentAmount, params, --tryTimes, done);
            });
        }
        else
        {
            that.completeOrders(orderId, tradeNO, paymentAmount, params, --tryTimes, done);
        }

    }, function (error) {
        that.completeOrders(orderId, tradeNO, paymentAmount, params, --tryTimes, done);
    });
};

exports.closeOrders = function (orderId, tradeNO, paymentAmount, params, payMethod, tryTimes, done) {

    if (tryTimes <= 0) {

        var errorPayment = new AL.config.ErrorOfPayment();
        errorPayment.set('orderId',orderId);
        errorPayment.set('tradeNO',tradeNO);
        errorPayment.set('paymentAmount',paymentAmount);
        errorPayment.set('refundData',params);
        errorPayment.set('payMethod',payMethod);
        errorPayment.save();
        return done(false);
    }

    console.dir("关闭订单 : " + orderId + "---" + tradeNO);

    if (AL.isEmpty(orderId) || AL.isEmpty(tradeNO) || AL.isEmpty(paymentAmount) || AL.isEmpty(params)) {

        var errorPayment = new AL.config.ErrorOfPayment();
        errorPayment.set('orderId',orderId);
        errorPayment.set('tradeNO',tradeNO);
        errorPayment.set('paymentAmount',paymentAmount);
        errorPayment.set('refundData',params);
        errorPayment.set('payMethod',payMethod);
        errorPayment.save();
        return done(false);
    }

    if (orderId.length>24)
        orderId = orderId.substring(orderId.length-24, orderId.length);

    var that = this;

    //var order = AV.Object.createWithoutData("CommodityOrder", orderId);
    var orderQ = new AV.Query(AL.config.CommodityOrder);
    orderQ.equalTo('objectId',orderId);
    orderQ.equalTo('payMethod',payMethod);
    orderQ.equalTo('paymentAmount',paymentAmount);
    orderQ.first().then(function (order) {
        if (order)
        {
            order.set('refundData',params);
            order.set('state',AL.config.ALCommodityOrderState.refundIsDone);
            order.save().then(function (order) {

                console.dir("关闭订单OK");

                if (order)
                {
                    done();
                }
                else
                {
                    that.closeOrders(orderId, tradeNO, paymentAmount, params, --tryTimes, done);
                }

            }, function (error) {
                that.closeOrders(orderId, tradeNO, paymentAmount, params, --tryTimes, done);
            });
        }

    }, function (error) {
        that.closeOrders(orderId, tradeNO, paymentAmount, params, --tryTimes, done);
    });

};

AV.Cloud.afterUpdate("CommodityOrder", function(request) {

    var order = request.object;
    var state = order.get('state');

    var orderRecorder = new AL.config.CommodityOrderChangeRecorder();
    orderRecorder.set('order',order);
    orderRecorder.set('state',state);
    orderRecorder.save();

});

var orderAdd = function(req, done) {

    var userId = req.body.userId;
    var userAddressId = req.body.userAddressId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var type = req.body.type;
    var isAnonymity = req.body.isAnonymity;
    var cartIds = req.body.cartIds;
    var couponOfUserIds = req.body.couponOfUserIds;
    var date = AL.getDate();
    var totalPrice_ = req.body.totalPrice;

    var cardId = req.body.cardId;
    var cardMsg = req.body.cardMsg;

    if (!userId || userId.length==0)
    {
        return done(null,AL.error(777110,"参数错误"));
    }

    try{

        fromDate = fromDate?AL.getDate(fromDate):null;
        toDate = toDate?AL.getDate(toDate):null;
        type = type?parseInt(type):null;
        isAnonymity = isAnonymity?parseInt(isAnonymity):null;
        cartIds = cartIds?JSON.parse(cartIds):null;
        couponOfUserIds = couponOfUserIds?JSON.parse(couponOfUserIds):null;
        totalPrice_ = totalPrice_?parseInt(totalPrice_):null;

    }catch(err){
        return done(null,err);
    }

    //console.dir(fromDate);
    //return;

    //时间 判空 为 true
    //console.dir(AL.isEmpty(fromDate));
    //console.dir(fromDate);
    //js 的|| 回一次返回第一个不为null或0或false的 如果没有符合条件的 返回false
    //console.dir(fromDate || toDate || AL.isEmpty(userAddressId));

    if (type!=1 && type!=2 && type!=3 && type!=4)
    {
        done(null,AL.error(777111,"参数错误"));
        return;
    }

    //时间判断
    // 普通购买
    //if (AL.config.ALCommodityOrderType.purchase)
    //{
    //    if (!fromDate || !toDate || AL.isEmpty(userAddressId))
    //    {
    //        done(null,AL.error(777115,"参数错误"));
    //        return;
    //    }
    //
    //    var dateCompare = function(date1,date2){
    //
    //        date1 = parseInt(AL.getDateFormat(date1,"YYYYMMDD"));
    //        date2 = parseInt(AL.getDateFormat(date2,"YYYYMMDD"));
    //        if (!__production) console.dir("fromDate :" + date1);
    //        if (!__production) console.dir("date : "+date2);
    //        return date1-date2 > 0;
    //    };
    //
    //    if (!__production) console.dir("toDate : "+toDate);
    //    if (!__production) console.dir("fromDate : "+fromDate);
    //
    //    console.dir(toDate>=fromDate);
    //
    //    if (!dateCompare(fromDate,date) || toDate>=fromDate)
    //    {
    //        done(null,AL.error(777116,"参数错误"));
    //        return;
    //    }
    //
    //}

    if (!AL.isArray(cartIds) || !AL.isArray(couponOfUserIds))
    {
        done(null,AL.error(777111,"参数错误"));
        return;
    }

    if (totalPrice_<0.01)
    {
        done(null,AL.error(777112,"参数错误"));
        return;
    }

    var dictionaryForCommodity = function (commodity){

        //console.dir(commodity.id);
        //console.dir(commodity.get('store').id);
        //console.dir(commodity.get('coverView').id);

        //console.dir(commodity.get('store'));
        //console.dir(commodity.get('coverView'));
        //console.dir(commodity.get('footerView'));
        //console.dir(commodity.get('coverView').get('url'));

        if (!commodity || !commodity.id)
        {
            return null;
        }

        commodityDict = {
            __type          : "Pointer",
            className       : "Commodity",
            objectId        : commodity.id,
            price           : commodity.get('price'),
            originalPrice   : commodity.get('originalPrice'),
            name            : commodity.get('name'),
            introduction    : commodity.get('introduction'),
            type            : commodity.get('type')

        };


        var store = commodity.get('store');
        //console.dir(store);
        if (store && store.id) {
            commodityDict.store = {
                __type: "Pointer",
                className: "CommodityStore",
                objectId: store.id,

                name: store.get('name'),
                headViewURL: store.get('headViewURL'),
                introduction: store.get('introduction')

            };


            if (store.get('creater') && store.get('creater').id) {

                commodityDict.store.creater = {
                    __type: "Pointer",
                    className: "_User",
                    objectId: store.get('creater').id
                }
            }
        }

        var coverView = commodity.get('coverView');
        if (coverView && coverView.id)
        {
            commodityDict.coverView = {
                __type      : "Pointer",
                className   : "Photo",
                objectId    : coverView.id,
                url         : coverView.get('url'),
                height      : parseFloat(coverView.get('height')),
                width       : parseFloat(coverView.get('width'))

            };
        }

        var footerView = commodity.get('footerView');
        if (footerView && footerView.id)
            commodityDict.footerView = {
                __type      : "Pointer",
                className   : "Photo",
                objectId    : footerView.id,
                url         : footerView.get('url'),
                height      : parseFloat(footerView.get('height')),
                width       : parseFloat(footerView.get('width'))

            };

        return commodityDict;
    };

    var cartQ = new AV.Query(AL.config.CommodityCart);
    cartQ.containedIn('objectId',cartIds);
    AL.config._includeKeyWithCartQuery(cartQ);
    cartQ.find().then(function(carts){

        var totalPrice = 0;
        var totalCostPrice = 0;
        var trueCarts = [];
        var falseCarts = [];

        var commoditySnapshots = [];
        var commodityName = "";

        for (var i in carts)
        {
            var cart = carts[i];

            // 大青蛙可以将任何购物车中的内容加入订单
            if (userId=="54c620dfe4b068d1ee40ab15" || (cart.get('isDeleted')!=true && cart.get('user').id==userId))
            {
                //var commodityDict = dictionaryForCommodity(cart.get('commodity'));

                var commodityDict = AL.object2Json(cart.get('commodity'));

                if (!commodityDict)
                {
                    falseCarts.push(cart);
                    continue;
                }

                cart.set('commoditySnapshotString',JSON.stringify(commodityDict));
                cart.set('isDeleted',true);

                trueCarts.push(cart);
                commoditySnapshots.push(commodityDict);

                if (i!=0)
                {
                    commodityName+=" ";
                }
                commodityName+=commodityDict.name;

                var surcharges = cart.get('commodity').get('surcharges');

                /*
                 [{ "fromDate":"2015-2-14 00:00:00",
                 "toDate":"2015-2-15 00:00:00",
                 "surcharge":{"price":"x1.2","costPrice":"x1.2"}}]
                 * */

                var thePrice = cart.get('commodity').get('price')*cart.get('amount');
                var theCostPrice = cart.get('commodity').get('costPrice')*cart.get('amount');

                for (var i in surcharges)
                {
                    var sur = surcharges[i];
                    var fromDateSur = new Date(sur.fromDate);
                    var toDateSur = new Date(sur.toDate);
                    var price = sur.surcharge.price;
                    var costPrice = sur.surcharge.costPrice;

                    if (fromDate > fromDateSur && toDate < toDateSur)
                    {
                        thePrice += price;
                        theCostPrice += costPrice;
                    }
                }

                totalPrice += thePrice;
                totalCostPrice += theCostPrice;
            }
            else
            {
                cart.set('isDeleted',true);
                falseCarts.push(cart);
            }
        }

        if (trueCarts.length==carts.length && trueCarts.length!=0 && falseCarts.length==0 && totalPrice!=0)
        {
            //代购物品验证成功
            //代购物品总金额计算完成


            //开始计算优惠券
            var couQ = new AV.Query(AL.config.CouponOfUser);
            couQ.containedIn('objectId',couponOfUserIds);
            couQ.include('coupon');
            couQ.include('user');
            couQ.find().then(function(couponOfUsers){

                var trueCouponOfUsers = [];
                var falseCouponOfUsers = [];

                for (var i in couponOfUsers)
                {
                    var couponOfUser = couponOfUsers[i];
                    var coupon = couponOfUser.get('coupon');

                    if (couponOfUser.get('user').id==userId && coupon.get('useRestriction')<=totalPrice && couponOfUser.get('state')<3)
                    {
                        totalPrice -= couponOfUser.get('faceValue');
                        couponOfUser.set('state',AL.config.ALCouponState.isUsered);
                        couponOfUser.set('isDeleted',true);
                        trueCouponOfUsers.push(couponOfUser);
                    }
                    else
                    {
                        falseCouponOfUsers.push(couponOfUser);
                    }
                }

                if (trueCouponOfUsers.length==couponOfUserIds.length && falseCouponOfUsers.length==0)
                {
                    //console.dir("优惠券验证成功");
                    //优惠券验证成功
                    if (totalPrice<=0)
                    {
                        totalPrice = 1;
                    }

                    //console.dir(totalPrice);
                    //console.dir(totalCostPrice);

                    if (totalPrice!=totalPrice_ && totalPrice_!=987654321)
                    {
                        done(null,AL.error(777212,"金额计算有误"));
                    }
                    else
                    {
                        //总金额计算完成
                        //开始验证地址
                        AV.Object.createWithoutData('UserAddress',userAddressId).fetch().then(function(userAddress){

                            if (!userAddress)
                            {
                                done(null,AL.error(777213,"地址信息错误"));
                                return;
                            }

                            //console.dir("地址验证成功");

                            var order = new AL.config.CommodityOrder();
                            order.set('orderNO',AL.getDateFormat(null,"YYYYMMDDHHmmssSSS")+AL.getRandomNumberWithDigit(9));
                            order.set('user',AL.object('_User',userId));
                            order.set('commodityName',commodityName);
                            order.set('deliveryName',userAddress.get('name'));
                            order.set('deliveryPhone',userAddress.get('phoneNumber'));
                            order.set('deliveryAddress',getDeliveryAddress(userAddress));
                            order.set('deliveryFromDate',fromDate);
                            order.set('deliveryToDate',toDate);
                            order.set('type',type);
                            order.set('state',1);
                            if (cardId) order.set('card',AL.object('CommodityCard',cardId));
                            if (cardMsg) order.set('cardMessage',cardMsg);
                            order.set('totalPrice',totalPrice);
                            order.set('totalCostPrice',totalCostPrice);
                            order.set('isAnonymity',isAnonymity);
                            order.relation('carts').add(trueCarts);
                            if (trueCouponOfUsers.length>0) order.relation('couponOfUsers').add(trueCouponOfUsers);
                            if (commoditySnapshots.length>0) order.set('commoditySnapshotsString',JSON.stringify(commoditySnapshots));

                            order.save().then(function(order){

                                if (order && order.id)
                                {
                                    var needToSaves = trueCarts.concat(trueCouponOfUsers);

                                    AL.saveAll(needToSaves,function(list,error){

                                        console.dir(error);
                                        if (!error)
                                        {
                                            done(order,null);
                                        }
                                        else
                                        {
                                            order.destroy();
                                            done(null,AL.error(777302,"修改待购商品失败"));
                                        }
                                    });
                                }
                                else
                                {
                                    done(null,AL.error(777301,"订单提交失败"));
                                }

                            },function(error){
                                done(null,error);
                            });

                        },function(error){
                            done(null,error);
                        });
                    }
                }
                else
                {
                    done(null,AL.error(777211,"优惠券内容有误"));
                }
            },function(error){
                done(null,error);
            });
        }
        else
        {
            //订单生成失败
            done(null,AL.error(777210,"购物车内容有误"));
            //falseCarts.save().then(function(){
            //    AL.done(response,null,AL.error(777210,"购物车内容有误"));
            //},function(error){
            //    AL.done(response,null,error);
            //});
        }
    },function(error){
        done(null,error);
    });
};

var orderDelete = function(req, res){

    var userId = req.body.userId;
    var orderId = req.body.orderId;

    //console.dir("delete orderId : "+orderId);
    //console.dir("delete userId : "+userId);

    if (!orderId || !userId)
    {
        return AL.done(res,false,AL.error(777110,"参数错误"));
    }

    var order = AL.object('CommodityOrder',orderId);
    var user = AL.object('_User',userId);

    if (!order)
    {
        return AL.done(res,null,AL.error(777216,"订单不存在"));
    }

    if (!user)
    {
        return AL.done(res,false,AL.error(777111,"参数错误"));
    }

    order.fetch().then(function(order){

        if (order)
        {
            if (order.get('user').id == userId)
            {
                order.set('isDeleted',true);
                //var needSaves = [order];
                //
                //if (order.get('state')<=1)
                //{
                //    order.relation("couponOfUsers").query().find().then(function(couponOfUsers){
                //
                //        //console.dir(couponOfUsers[0].id);
                //
                //        for (var i in couponOfUsers)
                //        {
                //            couponOfUsers[i].set('isDeleted',false);
                //            couponOfUsers[i].set('state',AL.config.ALCouponState.unfinished);
                //            needSaves.push(couponOfUsers[i]);
                //        }
                //
                //        //console.dir(needSaves.length);
                //
                //        AL.saveAll(needSaves,function(list,error){
                //            return AL.done(response,error==null,error);
                //        });
                //
                //    },function(error){
                //        console.dir(error);
                //        return AL.done(response,null,error);
                //    });
                //}
                //else
                //{
                AL.saveAll([order],function(list,error){
                    return AL.done(res,error==null,error);
                });
                //}
            }
            else
            {
                return AL.done(res,null,AL.error(777315,"权限不足"));
            }
        }
        else
        {
            return AL.done(res,null,AL.error(777217,"订单不存在"));
        }

    });

};

var orderClose = function(req, res){

    console.dir("orderClose");

    var userId = req.body.userId;
    var orderId = req.body.orderId;

    if (!orderId || !userId)
    {
        return AL.done(res,false,AL.error(777110,"参数错误"));
    }

    var order = AL.object('CommodityOrder',orderId);
    var user = AL.object('_User',userId);

    if (!order)
    {
        return AL.done(res,null,AL.error(777216,"订单不存在"));
    }

    if (!user)
    {
        return AL.done(res,false,AL.error(777111,"参数错误"));
    }

    order.fetch().then(function(order){

        if (order)
        {
            if (order.get('user').id == userId)
            {
                if (order.get('state')<=1) //可关闭订单
                {
                    order.set('state',AL.config.ALCommodityOrderState.close);

                    var needSaves = [order];

                    order.relation("couponOfUsers").query().find().then(function(couponOfUsers){

                        //console.dir(couponOfUsers[0].id);

                        for (var i in couponOfUsers)
                        {
                            couponOfUsers[i].set('isDeleted',false);
                            couponOfUsers[i].set('state',AL.config.ALCouponState.unfinished);
                            needSaves.push(couponOfUsers[i]);
                        }

                        console.dir(needSaves.length);

                        AL.saveAll(needSaves,function(list,error){

                            console.dir(list);

                            return AL.done(res,error==null,error);
                        });

                    },function(error){

                        return AL.done(res,null,error);
                    });
                }
                else
                {
                    return AL.done(res,null,AL.error(777327,"订单状态不允许关闭"));
                }
            }
            else
            {
                return AL.done(res,null,AL.error(777315,"权限不足"));
            }
        }
        else
        {
            return AL.done(res,null,AL.error(777217,"订单不存在"));
        }
    });
};

var getDeliveryAddress = function(userAddress){

    var country = userAddress.get('country');
    var province = userAddress.get('province');
    var city = userAddress.get('city');
    var district = userAddress.get('district');
    var street = userAddress.get('street');

    if (!country || !province || !city || !district || !street)
    {
        return null;
    }

    return country+" "+province+" "+city+" "+district+" "+street;
};

var userAddressIds = [  "54d2d952e4b05036bf6ef068",
                        "54d2d97ee4b05036bf6ef3da",
                        "54d2d918e4b05036bf6eebfe",
                        "54d2d8b8e4b05036bf6ee4e3",
                        "54ca1621e4b06b90a80860c9",
                        "54ca18d9e4b06b90a808d0af",
];

var cartIds = [
    "54d31e22e4b05036bf7579fd",
    "54d31e0fe4b05036bf757833",
    "54d31df2e4b05036bf7575f9",
    "54d31ddbe4b05036bf75745a",
    "54d31dcbe4b05036bf75734b",
    "54d31dc0e4b05036bf75725f",
    "54d31db3e4b02af839f90c6b",
    "54d2f57ee4b05036bf7133c6",
    "54d31d9be4b05036bf756f50",
    "54d31d91e4b05036bf756e94",
    "54d31d85e4b05036bf756dc0",
    "54d31d78e4b05036bf756cad",
    "54d31d6ce4b05036bf756bc5",
    "54d31d60e4b05036bf756ab8",
    "54d31d52e4b05036bf7569a3",
    "54d31d44e4b05036bf7568bd",
    "54d2f63de4b05036bf71452e",
    "54d31d24e4b05036bf756682",
    "54d31271e4b05036bf7463f0",
    "54d31245e4b05036bf745e78",
    "54d2f58ae4b05036bf7134d9",
    "54d2dfdde4b05036bf6f71b4",
    "54d2dfcee4b05036bf6f70ad",
    "54d2dfbbe4b05036bf6f6f6b",
    "54d2df9ee4b05036bf6f6d77",
];

var deliveryFromDates = [
    "09:00:00",
    "12:00:00",
    "15:00:00",
    "18:00:00",
];

var deliveryToDates = [
    "12:00:00",
    "15:00:00",
    "18:00:00",
    "21:00:00",
];

AV.Cloud.define("postTestOrder", function(req, res) {

    var date = new Date();

    req.body = {};
    req.body.userId = "54c620dfe4b068d1ee40ab15";
    req.body.userAddressId = userAddressIds[AL.getRandomNumberWithRange(0,userAddressIds.length-1)];
    var i = AL.getRandomNumberWithRange(0,deliveryFromDates.length-1);
    req.body.fromDate = AL.getTimeStamp(moment(AL.getDateFormat(date,"YYYY-MM-DD "+deliveryFromDates[i])).add(1,'days').tz('Asia/Shanghai').toDate());
    req.body.toDate = AL.getTimeStamp(moment(AL.getDateFormat(date,"YYYY-MM-DD "+deliveryToDates[i])).add(1,'days').tz('Asia/Shanghai').toDate());

    //var day = moment(AL.getDateFormat(date,"YYYY-MM-DD "+"09:00:00")).add('days',1).tz('Asia/Shanghai').toDate();
    //var stamp = AL.getTimeStamp(day);
    //console.dir(AL.getDate(stamp));
    //return;

    req.body.type = 1;
    req.body.isAnonymity = true;
    req.body.cartIds = JSON.stringify([cartIds[AL.getRandomNumberWithRange(0,cartIds.length-1)]]);
    req.body.couponOfUserIds = JSON.stringify([]);
    req.body.totalPrice = 987654321;
    req.body.cardId = "54535262e4b06af099a0b581";
    req.body.cardMsg = "测试订单";

    orderAdd(req,function(order,error){

        //var payURL = "http://192.168.199.232:3000/wechatPay/pay_notify";

        if (order && !error)
        {
            var payData = {
                "transaction_id":"1223282101201502056168585301",
                "sign":"297D560A73E1C64F95D68BEC6ADF48A6",
                "fee_type":"1",
                "partner":"1223282101",
                "input_charset":"UTF-8",
                "transport_fee":"0",
                "sign_type":"MD5",
                "total_fee":""+order.get('totalCostPrice'),
                "trade_state":"0",
                "out_trade_no":order.id,
                "time_end":"20150205155707",
                "bank_billno":"201502056102827313",
                "notify_id":"qoBvNq1YsO7Q_sVjw8w6Mc2iPVdrJgfLgCH7Op_8LZxsQSg86XPjVk85I4EZwPC1vz1xzkOJoLCshn5d_XgERE_i82S9KCmo",
                "bank_type":"2011",
                "trade_mode":"1",
                "discount":"0",
                "product_fee":"1"
            };

            mopyWechatPay(payData,null);
        }
        else
        {
             console.dir("又失败了"+JSON.stringify(error));
        }
    });

});

var mopyWechatPay = function(params,done){

    //console.dir("微信付款 : "+JSON.parse(params));
    var payment = new AL.config.CommodityPayment();
    payment.set("payMethod",AL.config.ALPayMethod.wechatPay);
    payment.set("payData",params);
    payment.save();

    if (params) {

        var orderId = params.out_trade_no;      //order id
        var tradeNO = params.transaction_id;     //第三方交易号
        var paymentAmount = parseInt(params.total_fee);   //支付金额(单位:分)

        //orderId,tradeNo,params,payMethod,tryTimes,done

        //console.dir(this.completeOrders);
        require('cloud/routes/order').completeOrders(orderId, tradeNO, paymentAmount, params, AL.config.ALPayMethod.wechatPay, 10, function (success) {

            done?done(success):console.dir("完成啦AAA");
        });
    }
    else
    {
        console.dir(444);
        done?done(false):console.dir("失败啦BBB");
    }

};






