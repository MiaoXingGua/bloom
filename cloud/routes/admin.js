/****************
 通用函数
 *****************/

var AL = require('cloud/lib/ALCommonUtil').AL();

exports.route = function(app) {


    // 订单查询
    app.all("/admin/order?",function(request, response){

        console.dir("/admin/order");
        //var page = parseInt(request.query.page);
        //var state = parseInt(request.query.state);
        //var search = request.query.search;

        //var page = parseInt(request.query.page);
        //var state = parseInt(request.query.state);
        //var search = request.query.search;

        var page = request.param("page");
        var state = request.param("state");
        var search = request.param("search");

        var orderQ = new AV.Query(AL.config.CommodityOrder);
        orderQ.limit(100);
        if (page && page>0) orderQ.skip((page-1)*100);
        if (search) orderQ.matches('orderNO',search);
        orderQ.notContainedIn('state',[AL.config.ALCommodityOrderState.Close,AL.config.ALCommodityOrderState.undefine]);
        orderQ.notEqualTo('isDeleted',true);

        if (!AL.isEmpty(state))
        {
            if (AL.isArray(state))
            {
                var states = [];
                for (var i=0 in state)
                {
                    states.push(parseInt(state[i]));
                }
                orderQ.containedIn('state',states);
            }
            else
            {
                orderQ.containedIn('state',[parseInt(state)]);
            }
        }

        AL.config._includeKeyWithOrderQuery(orderQ);
        //orderQ.ascending('state');
        //orderQ.addAscending('deliveryFromDate');
        orderQ.descending('deliveryFromDate');

        orderQ.find().then(function(orders) {

            console.dir(orders);

            var orderList = [];
            for (var i in orders)
            {
                var order = orders[i];
                var params = {};
                params.objectId = order.id;
                params.orderNO = order.get('orderNO') || "";
                var tradeNO = order.get('tradeNO') || order.get('tradeNo') || "";

                if (tradeNO)
                {
                    if (tradeNO.length>8)
                        params.tradeNO = tradeNO.substring(tradeNO.length-8, tradeNO.length);
                    else
                        params.tradeNO = tradeNO;
                }

                params.totalPrice = parseInt(order.get('totalPrice'))/100;
                params.deliveryCountdown = AL.getRTime(order.get('deliveryFromDate'));//AL.getTimeStamp(order.get('deliveryFromDate'))-AL.getTimeStamp()/(1000*60) + " 分钟";

                //params.deliveryCountdown = AL.getDateFormat(order.get('deliveryFromDate'),"YYYY-MM-DD");

                //console.dir(delivery);

                //console.dir(delivery);
                //console.dir(delivery.id);
                //console.dir(delivery.get('objectId'));

                switch (order.get('type')){

                    case AL.config.ALCommodityOrderType.undefine:
                        params.type = "未知";
                        break;
                    case AL.config.ALCommodityOrderType.purchase:
                        params.type = "普通购买";
                        break;
                    case AL.config.ALCommodityOrderType.wechatShare:
                        params.type = "发微信朋友圈抢花";
                        break;
                    case AL.config.ALCommodityOrderType.wechatFriend:
                        params.type = "发微信好友";
                        break;
                    case AL.config.ALCommodityOrderType.phoneFriend:
                        params.type = "发手机通讯录信好友";
                        break;
                }

                switch (order.get('payMethod')){

                    case AL.config.ALPayMethod.undefine:
                        params.payMethod = "未支付";
                        break;
                    case AL.config.ALPayMethod.paypal:
                        params.payMethod = "贝宝";
                        break;
                    case AL.config.ALPayMethod.aliPay:
                        params.payMethod = "支付宝";
                        break;
                    case AL.config.ALPayMethod.wechatPay:
                        params.payMethod = "微信支付";
                        break;
                    default:
                        params.payMethod = "未支付";
                        break;

                }

                params.stateClass = "am-btn am-radius am-btn-xs ";
                params.state = order.get('state');
                switch (params.state){
                    case AL.config.ALCommodityOrderState.close:
                        params.stateString = "关闭";
                        params.stateClass += "am-btn-default";
                        break;
                    case AL.config.ALCommodityOrderState.undefine:
                        params.stateString = "未知";
                        params.stateClass += "am-btn-default";
                        break;
                    case AL.config.ALCommodityOrderState.waitingForPay:
                        params.stateString = "订单生成 等待付款";
                        params.stateClass += "am-btn-default";
                        break;
                    case AL.config.ALCommodityOrderState.waitingForDelivery:

                        params.stateString = "支付完成 等待配送";
                        params.stateClass += "am-btn-success";
                        break;
                    case AL.config.ALCommodityOrderState.waitingForReceive:
                        params.stateString = "开始配送 等待收货";
                        params.stateClass += "am-btn-secondary";
                        break;
                    case AL.config.ALCommodityOrderState.done:
                        params.stateString = "订单完成(已收货)";
                        params.stateClass += "am-btn-default";
                        break;
                    case AL.config.ALCommodityOrderState.refundApplication:
                        params.stateString = "订单申请退款中";
                        params.stateClass += "am-btn-danger";
                        break;
                    case AL.config.ALCommodityOrderState.refundVerifier:
                        params.stateString = "申请退款成功 等待人工审核";
                        params.stateClass += "am-btn-danger";
                        break;
                    case AL.config.ALCommodityOrderState.refunding:
                        params.stateString = "人工审核成功 等待退款";
                        params.stateClass += "am-btn-warning";
                        break;
                    case AL.config.ALCommodityOrderState.refundIsDone:
                        params.stateString = "订单退款成功";
                        params.stateClass += "am-btn-default";
                        break;
                }

                params.deliveryAddress = order.get('deliveryAddress');
                params.deliveryPhone = order.get('deliveryPhone');
                params.deliveryName = order.get('deliveryName');

                //console.log(123);
                params.deliveryStateClass = "am-btn am-radius am-btn-xs ";
                var delivery = order.get('delivery');

                if (delivery)
                {
                    //console.log(11221);
                    if (delivery.get('state')>0)
                    {
                        //console.log(111);
                        params.deliveryId = delivery.id || AL.guid();
                        params.deliveryCode = delivery.get('deliveryCode') || "";
                        params.locations = delivery.get('locations') || [];
                        params.deliverymanName = delivery.get('user').get('nickname');

                        params.deliveryState = delivery.get('state');
                        switch (params.deliveryState){

                            case AL.config.ALCommodityOrderDeliveryState.close:
                                params.deliveryStateString = "关闭";
                                params.deliveryStateClass += "am-btn-default";
                                break;
                            case AL.config.ALCommodityOrderDeliveryState.undefine:
                                params.deliveryStateString = "等待抢单";
                                params.deliveryStateClass += "am-btn-success";
                                break;
                            case AL.config.ALCommodityOrderDeliveryState.waitingForFetch:
                                params.deliveryStateString = "有人抢单 等待取件";
                                params.deliveryStateClass += "am-btn-primary";
                                break;
                            case AL.config.ALCommodityOrderDeliveryState.waitingForDelivery:
                                params.deliveryStateString = "已经取件 等待发货";
                                params.deliveryStateClass += "am-btn-secondary";
                                break;
                            case AL.config.ALCommodityOrderDeliveryState.deliverying:
                                params.deliveryStateString = "发货 配送中";
                                params.deliveryStateClass += "am-btn-warning";
                                break;
                            case AL.config.ALCommodityOrderDeliveryState.deliveryDone:
                                params.deliveryStateString = "配送完成";
                                params.deliveryStateClass += "am-btn-default";
                                break;

                        }
                    }
                    else
                    {
                        params.deliveryStateString = "等待抢单";
                        params.deliveryStateClass += "am-btn-success";
                    }

                }
                else if (order.get('state')==AL.config.ALCommodityOrderState.waitingForDelivery)
                {
                    params.deliveryStateString = "等待抢单";
                    params.deliveryStateClass += "am-btn-success";
                }
                else
                {
                    params.deliveryStateString = "配送信息";
                    params.deliveryStateClass += "am-btn-default";
                }

                //console.dir(params.deliveryState);
                orderList.push(params);
            }

            //console.dir(orderList);
            //for (var i in orderList)
            //{
            //    var order = orderList[i];
            //    console.dir(order.payMethod);
            //}

            orderQ.count().then(function(number){

                response.render('public/daemon/order',{orders:orderList,totalNumber:number,page:page||1,search:search});

            },function(error){
                //response.end(error);
                AL.done(response,null,error);
            });

        },function(error){
            console.dir(error);
            //response.end(error);
            AL.done(response,null,error);
        });
    });

    // 商品查询
    app.all("/admin/commodity?",function(request, response){

        console.dir("/admin/commodity");

        var page = parseInt(request.query.page);

        var search = request.query.search;

        var commodityQ = new AV.Query(AL.config.Commodity);
        commodityQ.limit(100);
        if (page && page>0) commodityQ.skip((page-1)*100);
        //if (search) orderQ.matches('orderNO',search);
        //orderQ.notContainedIn('state',[AL.config.ALCommodityOrderState.Close,AL.config.ALCommodityOrderState.undefine]);
        commodityQ.notEqualTo('isDeleted',true);

        AL.config._includeKeyWithCommodityQuery(commodityQ);
        commodityQ.ascending('createdAt');
        commodityQ.find().then(function(commoditys) {

            console.dir(commoditys);

            var items = [];

            for (var i in commoditys)
            {
                var commodity = commoditys[i];
                var item = {};
                item.id = commodity.id;
                item.name = commodity.get('name');
                item.coverViewURL = commodity.get('coverView').get('url');
                item.costPrice = commodity.get('costPrice');
                item.price = commodity.get('price');
                items.push(item);
            }

            commodityQ.count().then(function(number){

                response.render('public/daemon/commodity',{items:items,totalNumber:number,page:page||1,search:search});

            },function(error){

                AL.done(response,null,error);
            });

        },function(error){

            AL.done(response,null,error);
        });
    });

    //首页demo
    app.all("/admin/demo", function(req, res) {

        //res.render('public/daemon/demo');
        res.render("public/charisma/views/index",{title:"demo"});
        //res.render("public/charisma/index",{title:"demo"});
    });

    var getLoginInfo = function(req, res) {

        console.dir("Login");

        var phoneNumber = req.param("phoneNumber");
        var phonePwd = req.param("phonePwd");

        //不需要知道是 密码错误、用户不存在、用户没有权限 只要知道失败就可以
        var userQ = new AV.Query(AL.config.User);
        userQ.equalTo('phoneNumber',phoneNumber);
        userQ.equalTo('phonePwd',AL.MD5(phonePwd).toLowerCase());
        userQ.containedIn('objectId',AL.config.ALUserIdOfAdmin);
        userQ.limit(1);
        userQ.find().then(function(objects){
            if (objects.length>0)
            {
                var user = objects[0];
                var username = user.get('username');
                //var password = AL.MD5(phoneNumber+username.toLowerCase()+phonePwd);
                AL.done(res,{username:user.get('username').toUpperCase(),password:user.get('username').toLowerCase()});
            }
            else
            {
                AL.done(res,null,AL.error(777001,"用户不存在"));
            }

        },function(error){
            AL.done(res,null,error);
        });

    };

    // 手机号登陆
    app.all('/admin/login/getLoginInfo?', getLoginInfo);

                       //
    var testUsers = [
        AL.object('_User',"54c620dfe4b068d1ee40ab15"),
        //AL.object('_User',"54c871a7e4b02de93196b610"),
        AL.object('_User',"54c60070e4b068d1ee3d7468"),
        AL.object('_User',"54c60310e4b068d1ee3db496"),
        AL.object('_User',"54c61cc1e4b0c94525e6bf8f"),
        AL.object('_User',"54ca143ae4b0c6c6afbf13e0")
    ];

    var testCommoditys = [
        AL.object('Commodity',"54c220ace4b024f8f4ab7500")
    ];

    app.all("/admin/order/search?",function(req, res){

        var limit = req.param("limit");
        var skip = req.param("skip");
        var orderNO = req.param("orderNO");
        var states = req.param("states");
        var deliveryStates = req.param("deliveryStates");
        var withinData = req.param('withinData');

        var deliveryFromDate = req.param('deliveryFromDate');
        var deliveryToDate = req.param('deliveryToDate');

        //console.dir(orderNO);
        //console.dir(withinData);
        //console.dir(deliveryFromDate);
        //console.dir(deliveryToDate);
        //console.dir(states);
        //console.dir(deliveryStates);

        try{

            limit = limit?parseInt(limit):null;
            skip = skip?parseInt(skip):null;
            states = states?JSON.parse(states):null;
            deliveryStates = deliveryStates?JSON.parse(deliveryStates):null;
            withinData = withinData?parseInt(withinData):null;

            deliveryFromDate = deliveryFromDate?AL.getDate(deliveryFromDate):null;
            deliveryToDate = deliveryToDate?AL.getDate(deliveryToDate):null;

        }catch (err) {

            return AL.done(res,null,err);
        }

        if (deliveryStates.indexOf(-1)!=-1) deliveryStates = [];

        //console.dir(deliveryStates);

        var orderQ = new AV.Query(AL.config.CommodityOrder);

        //var beforeYesterday = AL.getTimeStamp(moment(new Date()).add(-2,'days').tz('Asia/Shanghai').toDate());
        //orderQ.lessThan('createdAt',beforeYesterday);

        //不显示大青蛙的订单

        //54ca143ae4b0c6c6afbf13e0
        //orderQ.notEqualTo('user',AL.object('_User',"54c620dfe4b068d1ee40ab15"));

        orderQ.notContainedIn('user',testUsers);

        //if (!withinData) AL.config._includeKeyWithOrderQuery(orderQ);
        if (AL.isNumber(limit) && limit!=0) orderQ.limit(limit);
        if (AL.isNumber(skip) && limit!=0) orderQ.skip(skip);
        if (orderNO && orderNO.length>0) orderQ.matches('orderNO',orderNO);
        if (AL.isArray(states) && states.length>0)
            orderQ.containedIn('state',states);
        if (AL.isArray(deliveryStates) && deliveryStates.length>0)
            orderQ.containedIn('deliveryState',deliveryStates);

        orderQ.exists('commoditySnapshotsString');
        //var beforeYesterday = moment(new Date()).add(-2,'days').tz('Asia/Shanghai').toDate();
        //console.dir(AL.getDateFormat(beforeYesterday));
        //orderQ.greaterThan('deliveryFromDate',beforeYesterday);
        //orderQ.equalTo('objectId',"54d9a3fbe4b0ffe4d4caf483");
        //orderQ.descending('createdAt');

        if (deliveryFromDate)
            orderQ.greaterThanOrEqualTo('deliveryFromDate',deliveryFromDate);
        if (deliveryToDate)
            orderQ.lessThanOrEqualTo('deliveryToDate',deliveryToDate);

        orderQ.ascending('deliveryFromDate');
        orderQ.notEqualTo('isDeleted',true);

        if (withinData)
        {
            orderQ.include("user");
            orderQ.include("delivery.user");
            orderQ.include("order.user");

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

    //首页
    app.all("/admin?", function(req, res) {

        res.render('public/daemon/index');
    });
};



