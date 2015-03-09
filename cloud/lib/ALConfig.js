/**
 * Created by albert on 14-12-26.
 */

var ALConfig = function () {

    if (!(this instanceof ALConfig)) {

        return new ALConfig();
    }
};

ALConfig.prototype.User = AV.Object.extend('_User');
ALConfig.prototype.Commodity = AV.Object.extend('Commodity');
ALConfig.prototype.CommodityCard = AV.Object.extend('CommodityCard');
ALConfig.prototype.CommodityCart = AV.Object.extend('CommodityCart');
ALConfig.prototype.CommodityDelivery = AV.Object.extend('CommodityDelivery');
ALConfig.prototype.ErrorOfCommodityDelivery = AV.Object.extend('ErrorOfCommodityDelivery');
ALConfig.prototype.CommodityOrder = AV.Object.extend('CommodityOrder');
ALConfig.prototype.CommodityOrderChangeRecorder = AV.Object.extend('CommodityOrderChangeRecorder');
ALConfig.prototype.CommodityPayment = AV.Object.extend('CommodityPayment');
ALConfig.prototype.CommodityShowPhoto = AV.Object.extend('CommodityShowPhoto');
ALConfig.prototype.CommodityShowPhotoStyle = AV.Object.extend('CommodityShowPhotoStyle');
ALConfig.prototype.CommodityStore = AV.Object.extend('CommodityStore');
ALConfig.prototype.CommodityTheme = AV.Object.extend('CommodityTheme');
ALConfig.prototype.Coupon = AV.Object.extend('Coupon');
ALConfig.prototype.CouponOfUser = AV.Object.extend('CouponOfUser');
ALConfig.prototype.FeedbackThread = AV.Object.extend('FeedbackThread');
ALConfig.prototype.FeedbackPost = AV.Object.extend('FeedbackPost');
ALConfig.prototype.Nationality = AV.Object.extend('Nationality');
ALConfig.prototype.News = AV.Object.extend('News');
ALConfig.prototype.Photo = AV.Object.extend('Photo');
ALConfig.prototype.Voice = AV.Object.extend('Voice');
ALConfig.prototype.ReportLog = AV.Object.extend('ReportLog');
ALConfig.prototype.ShowPhoto = AV.Object.extend('ShowPhoto');
ALConfig.prototype.ShowPhotoComment = AV.Object.extend('ShowPhotoComment');
ALConfig.prototype.ShowPhotoRelation = AV.Object.extend('ShowPhotoRelation');
ALConfig.prototype.ShowPhotoToWechatMoments = AV.Object.extend('ShowPhotoToWechatMoments');
ALConfig.prototype.UserAddress = AV.Object.extend('UserAddress');
ALConfig.prototype.DeliverymanInfo = AV.Object.extend('DeliverymanInfo');

ALConfig.prototype.WechatMessage = AV.Object.extend('WechatMessage');
ALConfig.prototype.WechatEvent = AV.Object.extend('WechatEvent');
ALConfig.prototype.WechatError = AV.Object.extend('WechatError');
ALConfig.prototype.WechatAccessToken = AV.Object.extend('WechatAccessToken');

ALConfig.prototype.ErrorOfPayment = AV.Object.extend('ErrorOfPayment');

ALConfig.prototype.UserTradeAccount = AV.Object.extend('UserTradeAccount');
ALConfig.prototype.UserStatement = AV.Object.extend('UserStatement');


ALConfig.prototype.CommodityOrderNotification = AV.Object.extend('CommodityOrderNotification');


ALConfig.prototype._includeKeyWithOrderQuery = function(orderQ){

    orderQ.include('commodity');
    orderQ.include('commodity.coverView');
    orderQ.include('commodity.footerView');
    orderQ.include('commodity.store');
    orderQ.include('commodity.store.creater');
    orderQ.include('commodity.store.coverView');
    orderQ.include('delivery');
    orderQ.include('delivery.user');
    orderQ.include('user');

};

ALConfig.prototype._includeKeyWithCommodityQuery = function(commodityQ){

    commodityQ.include('store');
    commodityQ.include('store.creater');
    commodityQ.include('store.coverView');
    commodityQ.include('coverView');
    commodityQ.include('footerView');

};

ALConfig.prototype._includeKeyWithCartQuery = function(cartQ){

    cartQ.include('commodity');
    cartQ.include('commodity.coverView');
    cartQ.include('commodity.footerView');
    cartQ.include('commodity.store');
    cartQ.include('commodity.store.creater');
    cartQ.include('commodity.store.coverView');
    cartQ.include('user');

};



ALConfig.prototype.phoneOfWechatNewsVIP = [

    "18600815758",//房纬   ok-
    "18601307260",//余扬
    "18501126287",//栾峰
    "18610150398",//贺婉莹
    "13910694576",//沙日夫
    "18610106157",//周冠文
    "13810054925",//马文亮
    "13810436955",//王卫
    "13466686632",//张思谦   ok
    "13755090000",//陈凝

    "18612952225",  //400

    "13301296363",  //71   2/10 00:17

    "18601058896",

    "18600648276",  //100
    "13401170011",  //71   2/9 22:11
    "18601033869",  //73   2/9 22:05

    "18601318013",   //ok
    "18800155900",     //ok-
    "18610631420",     //ok-
    "18601296996",  // 王洁明
    "13901077476",
    "18511337204",  //84   2/9 22:10
    "13810781646",  //92   2/10 02:07
    "15971190988",
    "18511337204",  //400
    "18600648276",  //400

    "13638670363",  //罗西
    "18918207016",  //盖克
    "13801023483",  //张米

    "13601300771",  //赵楠
    "13911252607",  //张琳    ok
    "13910556401",  //吕丽红

    "18618187118",  //陈修远
    "18610058100",  //周松
    "13910683698",  //王辉

    "18610240969",  //徐菁睛
    "13810048303",  //刘硕裴

    "18618365707",   //ok-
    "18676708610",

    "13910300518",   // 吴英男

    "15812345678"

];

//管理员userid
ALConfig.prototype.ALUserIdOfAdmin = [
    "54c620dfe4b068d1ee40ab15",//李杨
    "54c61cc1e4b0c94525e6bf8f"//刘佳
];

// 客服openid
ALConfig.prototype.ALOpenidOfServers = [

    "ofpYts0J8oFlGRCa_tS3lbJrjSUA",//李杨
    //"ofpYts_OAxR3M5HBeTcwGHN1Q6d0",
    //"ofpYtszU_QFkuHFTzaXPnoE-iDoY",
    //"ofpYts5wM7ZUb9IU85muH8ttIf50",
    //"ofpYtsyI-tzbmfZtH-LJrpS-dHss",
    //"ofpYts5PI-DCPP7GAVpt5qBXth2o"//朱总

];

ALConfig.prototype.ALOpenidOfFlowerStoreTrue = [

    "ofpYts0J8oFlGRCa_tS3lbJrjSUA", //李杨
    "ofpYts_OAxR3M5HBeTcwGHN1Q6d0",
    "ofpYtszU_QFkuHFTzaXPnoE-iDoY",
    "ofpYts5wM7ZUb9IU85muH8ttIf50",
    "ofpYtsyI-tzbmfZtH-LJrpS-dHss",
    "ofpYts5PI-DCPP7GAVpt5qBXth2o", //朱总
    "ofpYts2osVCPSx9vmjceKiDP2Ohs", //朵朵
    "ofpYts7uoC1JynK9ItEaievscIqU", //犹太杰
    "ofpYtsyaHRZ700RauCU_KrpTZ0d4", //杨华清
    "ofpYtsxJ4I6DnY8n7du6rOVjFuPc", //冯果
    "ofpYts-ovo_hvlEI_Ny7w94vqkqQ"
];

/*
* 54dc5ceee4b042fc5548a99a
* 54dc4abbe4b02fa630df16d5
* 54dc291ee4b08a85e4b944e3
* 54d4ba29e4b0dc9825c80b79
* */
// 花艺师openid
ALConfig.prototype.ALOpenidOfFlowerStore = [

    "ofpYts0J8oFlGRCa_tS3lbJrjSUA",//李杨
    "ofpYts_OAxR3M5HBeTcwGHN1Q6d0",
    "ofpYtszU_QFkuHFTzaXPnoE-iDoY",
    "ofpYts5wM7ZUb9IU85muH8ttIf50",
    "ofpYtsyI-tzbmfZtH-LJrpS-dHss",
    "ofpYts5PI-DCPP7GAVpt5qBXth2o",//朱总



    "ofpYts-ovo_hvlEI_Ny7w94vqkqQ",
    "ofpYtsxGen1kSpyLCwYEQ7uuovYY",
    "ofpYtsyfsKF-iA67m9ofbLfZbaL4",
    "ofpYts0wy7NuUyqxbeG4N4EGE6Ss",
    "ofpYtsxJ4I6DnY8n7du6rOVjFuPc",
    "ofpYtsyWvHh57Ec2rgzPLBHVpVIA",
    "ofpYts0B9dOerAY5fM3sblsO8bjo",
    "ofpYts7LN4R9gy5AHeVHJ7GGkVzY",
    "ofpYts3ZYRcbwhzNWDCoAOh9QqbU",
    "ofpYtsxJ4I6DnY8n7du6rOVjFuPc",
    "ofpYts0LZ1yNJ29JS1ecuHogthiQ",
    "ofpYtswYlNJLWMQKyG_5DcCvaKuU",
    "ofpYts1IpjsOALvqn0KVmf0K-5MI",
    "ofpYts58kref9qjWRawHLsQe0Glo",
    "ofpYts9fo19-ZVaeGriQ9_oT6Uig",
    "ofpYtsxjq_sdLIty-qpALR6ijEDs",
    "ofpYts6EPpl8srJ0OxQ-AWPSH-Cw",
    "ofpYts5gq3GraJqNPrwJAejpU44k",
    "ofpYts6vGI4NnLGlxt4hAchB3wbI",
    "ofpYts97kTe7gWPo4RWxjV2bRKJc",
    "ofpYtsyaHRZ700RauCU_KrpTZ0d4",
    "ofpYts71Ryta_iwW2xoaVjEPa4Fc",
    "ofpYts_nkppvE8n8p1F6kvO6sIAw",
    "ofpYts3Q2nFgsidw0x-_ie91QBFQ",
    "ofpYts7uoC1JynK9ItEaievscIqU",
    "ofpYts-1TyvWJz7YKbprLLGZ_kRQ",
    "ofpYtswmwUm2BWnrH8YHmriDh8GY",
    "ofpYts2osVCPSx9vmjceKiDP2Ohs"
];

/*
 openId : ofpYts-ovo_hvlEI_Ny7w94vqkqQ
 phoneNumber : 13911106202
 trueName : 韩运杰
 storeName : 吉韵花艺工作室
 storeAddress : 北京市朝阳区建国门外大街1号(中国大饭店内)
 latitude : 39.91561
 longitude : 116.465846

 openId : ofpYtsxGen1kSpyLCwYEQ7uuovYY
 phoneNumber : 13911488036
 trueName : 高华
 storeName : 爱丽思花苑
 storeAddress : 北京市东城区东直门内大街1号
 latitude : 39.941518
 longitude : 116.431445

 openId : ofpYtsyfsKF-iA67m9ofbLfZbaL4
 phoneNumber : 15801696103
 trueName : 苏玉
 storeName : 微末森林flower
 storeAddress : 北京市东城区崇文门西大街2号
 latitude : 39.900506
 longitude : 116.417703

 openId : ofpYts0wy7NuUyqxbeG4N4EGE6Ss
 phoneNumber : 13910840676
 trueName : 贾琼
 storeName : 如意花卉
 storeAddress : 北京市朝阳区麦子店西路9号莱太商城鲜切花厅9-10
 latitude : 39.9572
 longitude : 116.46721

 openId : ofpYts9y4IjW3unmM0kLVOEiycEc
 phoneNumber : 13001984355
 trueName : 苏鹏
 storeName :
 storeAddress :
 latitude :
 longitude :

 openId : ofpYtsyWvHh57Ec2rgzPLBHVpVIA
 phoneNumber : 13261009798
 trueName : 崔信誉
 storeName : 花领域花店
 storeAddress : 北京市朝阳区光华路乙一号
 latitude : 39.913225
 longitude : 116.454634

 openId : ofpYts0B9dOerAY5fM3sblsO8bjo
 phoneNumber : 15110086323
 trueName : 向元
 storeName : 北京爱尚幸福鲜花礼品店（金宝街）
 storeAddress : 北京市东城区朝阳门南小街16号
 latitude : 39.916415
 longitude : 116.427975

 openId : ofpYts7LN4R9gy5AHeVHJ7GGkVzY
 phoneNumber : 13051350495
 trueName : 夏银屏
 storeName : 花雨名轩
 storeAddress : 北京市朝阳区安立路68号飘亮阳光广场(及北辰购物中心)
 latitude : 39.997995
 longitude : 116.409207

 openId : ofpYts3ZYRcbwhzNWDCoAOh9QqbU
 phoneNumber : 18911870907
 trueName : 雅萍
 storeName : 鲜花婚礼策划
 storeAddress : 北京市朝阳区朝阳北路十里堡地铁东100米
 latitude : 39.923149
 longitude : 116.503245

 openId : ofpYtsxJ4I6DnY8n7du6rOVjFuPc
 phoneNumber : 13601331503
 trueName : 冯果
 storeName : CBDflower
 storeAddress : 北京市朝阳区金桐西路10号远洋光华国际AB座B一层
 latitude : 39.915985
 longitude : 116.454406

 openId : ofpYts0LZ1yNJ29JS1ecuHogthiQ
 phoneNumber : 13581513867
 trueName : 汪瑞
 storeName : 北京E网花艺
 storeAddress : 北京市通州区翠屏北里西区底商18号
 latitude : 39.890721
 longitude : 116.644928

 openId : ofpYtswYlNJLWMQKyG_5DcCvaKuU
 phoneNumber : 15010154182
 trueName : 李然
 storeName : 北京美娜朵花艺设计工作室
 storeAddress : 北京市朝阳区豆各庄厂南路2号
 latitude : 39.845614
 longitude : 116.564469

 openId : ofpYts1IpjsOALvqn0KVmf0K-5MI
 phoneNumber : 13911075947
 trueName : 陈浩
 storeName : 沁萱坊
 storeAddress : 北京西城区鼓楼西大街167号
 latitude : 39.94686
 longitude : 116.383225

 openId : ofpYts58kref9qjWRawHLsQe0Glo
 phoneNumber : 13466781038
 trueName : 叶鹏伟
 storeName : 小叶子鲜花
 storeAddress : 北京市朝阳区幸福一村西里5号楼一层绿叶子超市鲜花部
 latitude : 39.936227
 longitude : 116.445961

 openId : ofpYts9fo19-ZVaeGriQ9_oT6Uig
 phoneNumber : 13911534161
 trueName : 段晓光
 storeName : 珍妮花艺
 storeAddress : 北京市东城区霄云路霞光里3号楼1单元
 latitude : 39.961503
 longitude : 116.459883

 openId : ofpYtsxjq_sdLIty-qpALR6ijEDs
 phoneNumber : 13718772087
 trueName : 刘德举
 storeName : 高山积雪花店
 storeAddress : 北京市海淀区万柳金元新燕莎MALL东（西顶路南）
 latitude : 39.958756
 longitude : 116.292188


 openId : ofpYts6EPpl8srJ0OxQ-AWPSH-Cw
 phoneNumber : 18311221986
 trueName : 苏菲
 storeName : 6㎡鲜花店
 storeAddress : 北京市海淀区五道口北京语言大学西门往北150米
 latitude : 39.994819
 longitude : 116.343665

 openId : ofpYts5gq3GraJqNPrwJAejpU44k
 phoneNumber : 13488898301
 trueName : 黄鹏
 storeName : 莫忘花艺
 storeAddress : 北京市朝阳区双井桥富力城
 latitude : 39.896473
 longitude : 116.459692

 openId : ofpYts6vGI4NnLGlxt4hAchB3wbI
 phoneNumber : 15712866128
 trueName : 谢军
 storeName : 向阳花卉
 storeAddress : 北京市海淀区远大路1号世纪金源购物中心东广场金源花卉市场地下2层鲜花区B06
 latitude : 39.958718
 longitude : 116.288564

 openId : ofpYts97kTe7gWPo4RWxjV2bRKJc
 phoneNumber : 13611286292
 trueName : 宋姐
 storeName : 雨林花卉
 storeAddress : 北京市海淀区西四环北路117号居易室美花卉市场1016，1017，1027，1037
 latitude : 39.943878
 longitude : 116.271045

 openId : ofpYtsyaHRZ700RauCU_KrpTZ0d4
 phoneNumber : 13701076144
 trueName : 杨化清
 storeName : 莱太花卉
 storeAddress : 北京市朝阳区星火西路辛庄村
 latitude : 39.944288
 longitude : 116.497865

 openId : ofpYts71Ryta_iwW2xoaVjEPa4Fc
 phoneNumber : 13520628209
 trueName : 戴燕华
 storeName : 罗斯花苑
 storeAddress : 裕中西里小区
 latitude : 39.975393
 longitude : 116.395062

 openId : ofpYts_nkppvE8n8p1F6kvO6sIAw
 phoneNumber : 13501008364
 trueName : 朱小玟
 storeName : 罗斯花苑
 storeAddress : 远大路金源花卉市场
 latitude : 39.958956
 longitude : 116.292232

 openId : ofpYts3Q2nFgsidw0x-_ie91QBFQ
 phoneNumber : 13436688738
 trueName : 杨涛
 storeName : 花藤创意鲜花坊
 storeAddress : 北京市丰台区丰桥路三环新城七号院
 latitude : 39.851539
 longitude : 116.31012

 openId : ofpYts7uoC1JynK9ItEaievscIqU
 phoneNumber : 13716581618
 trueName : 尤太杰
 storeName : 北京茗艺花卉
 storeAddress : 北京市海淀区远大路一号世纪金源购物广场东广场金源花卉
 latitude : 39.95881
 longitude : 116.29214

 openId : ofpYts-1TyvWJz7YKbprLLGZ_kRQ
 phoneNumber : 18600319291
 trueName : 邢云娇
 storeName : CityFlower
 storeAddress : 北京市朝阳区望京SOHO
 latitude : 39.995008
 longitude : 116.479272

 openId : ofpYtswmwUm2BWnrH8YHmriDh8GY
 phoneNumber : 18611790547
 trueName : 王加友
 storeName : 花落谁家
 storeAddress : 北京市朝阳区酒仙桥
 latitude : 39.969981
 longitude : 116.494617

 openId : ofpYts2osVCPSx9vmjceKiDP2Ohs
 phoneNumber : 13641233035
 trueName : 朵朵
 storeName : 北京美娜朵花艺设计工作室
 storeAddress : 北京市朝阳区黄厂南里富力又一城区26号楼底商
 latitude : 39.802799
 longitude : 116.583731

 openId : ofpYts3reJ-AYk0H4hslgoo4t8UM
 phoneNumber : 13651046206
 trueName : 高玉东
 storeName : 麒麟花坊
 storeAddress : 北京市西城区双全大厦西南(安华桥地铁站西350米)
 latitude : 39.96899
 longitude : 116.390815

 openId : ofpYts4163skafXpD7WdN46essYY
 phoneNumber : 13260167616
 trueName : 张迅
 storeName : 浪漫花屋
 storeAddress : 北京市朝阳区北苑东路勇士营对面闽龙国际生活广场2号门A1-29
 latitude : 40.032106
 longitude : 116.445345

 openId : ofpYts_AgO6myuHer3faR7kDynqg
 phoneNumber : 18676733413
 trueName : 侯凤玲
 storeName : 花艺微课堂
 storeAddress : 四川省成都市环球中心W1-2124
 latitude : 30.569586
 longitude : 104.065107

 openId : ofpYtsxaTHxsPmsemBlNoQuUMSis
 phoneNumber : 13683289193
 trueName : 张光
 storeName : 米蘭花艺
 storeAddress : 北京市朝阳区来广营朝来春花卉市场
 latitude : 40.031187
 longitude : 116.442466

 openId : ofpYts2pP7qA8xErqQKDbRG3zJpE
 phoneNumber : 13693661364
 trueName : 王海木
 storeName : 木子花艺
 storeAddress : 北京市海淀区沙窝桥东西郊伟伟市场花卉大厅1#
 latitude : 39.897733
 longitude : 116.282454

 openId : ofpYts88aLokWZ5GWm-c3eu4zpd8
 phoneNumber : 13853216645
 trueName : 李娴
 storeName : 花涩花艺
 storeAddress : 青岛市鲁信含章花园小区
 latitude : 36.114818
 longitude : 120.429752

 openId : ofpYtsxJ4I6DnY8n7du6rOVjFuPc
 phoneNumber : 13601331503
 trueName : 冯果
 storeName : DBCFlower
 storeAddress :
 latitude :
 longitude :


 */

// 客服phone
ALConfig.prototype.ALPhoneOfServer = [
    "15810513348",//李洋
    "18710103168",//卫杰
    // 朱总
];

// 订单类型
ALConfig.prototype.ALCommodityOrderType = {
        undefine : 0,      //未知、未定义、不做限制
        purchase : 1,      //普通购买
        wechatShare : 2,   //发微信朋友圈抢花
        wechatFriend : 3,  //发微信好友
        phoneFriend : 4   //发手机通讯录信好友
};

// 订单支付方式
ALConfig.prototype.ALPayMethod = {
        undefine : 0,  //未知
        paypal : 1,    //贝宝
        aliPay : 2,    //支付宝
        wechatPay : 3 //微信
};



//花艺师抢单
ALConfig.prototype.ALCommodityOrderDeliveryState = {

    undefine  : 0              //未知、未定义、不做限制


};

//订单状态
ALConfig.prototype.ALCommodityOrderState = {

    close : -1,//订单关闭

    undefine  : 0,              //未知、未定义、不做限制

    waitingForPay : 1,          //订单生成 等待付款

    waitingForDelivery : 2,//3,     //支付完成 等待配送

    //花艺师抢单
    //快递抢单

    waitingForReceive : 3,//5,      //开始配送 等待收货

    done : 4,//10,                   //订单完成(已收货)

    refundApplication : 11,     //订单申请退款中

    refundVerifier : 12,        //申请退款成功 等待人工审核

    refunding : 13,             //人工审核成功 等待退款

    refundIsDone : 14           //订单退款成功
};

//配送状态
ALConfig.prototype.ALCommodityOrderDeliveryState = {

    close: -1,              //关闭
    undefine: 0,              //未知、未定义、不做限制
    waitingForFetch: 1,       //有人抢单 等待取件
    waitingForDelivery : 3,   //已经取件 等待发货
    deliverying: 5,           //发货 配送中
    deliveryDone: 10           //配送完成

};

/*
    支付宝
 */
ALConfig.prototype.alipayConfig = {

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



/*
    微信
 */
// 爱视狸科技 公众号 (获取用户数据)
ALConfig.prototype.wechatOfAshleyConfig = {

    appId           : "wx966a571968e8cdee",
    appSecret       : "05de0873c601d0025f8042e28c250a3c",
    token           : "WIE7FIWU4FGIUBDF",
    encodingAESKey  : "AMw4bpIBYJo63lcH8elsVBUsQirPzPDigMHQi9tjRjR",
    URL             : "http://flowerso2o.avosapps.com/wechat/",
    accessToken     : "",
    accessTokenExpiresIn : null

};

// bloom 公众号 ()
ALConfig.prototype.wechatOfBloomAshleyConfig = {

    appId           : "wxf3353c73c4e2d552",
    appSecret       : "f31a689fbd7233690b492549bf3cb702",
    token           : "8cf2b1a7827cd736e9bee9847a5b869f",
    encodingAESKey  : "GUU9EN8U6GBWfn45QbgWzLBvk0zr1jaWUBURZGvzqO8",
    URL             : "http://flowerso2o.avosapps.com/wechat/",
    accessToken     : "",
    accessTokenExpiresIn : null

};

// bloom 开发账号 (付款、分享)
ALConfig.prototype.wechatOfBloomConfig = {

    appId           : "wx8d7deb2e14afbbd4",
    appKey          : "9vjPBQ6UA6CvuiAiGC7YdFQsfEFduDk0BqiY52khrpWMIUBxK9zebPZJPMrcnXi8BYfVIkJHjaLdP3SaZSzKpL6jyfjENLQ44PjF1KZhCGerkJdq60PcGH2EJvBhcV4x",
    appSecret       : "f31a689fbd7233690b492549bf3cb702",
    partnerKey      : "04f0e3bc4ae941ea329aefe2439f217b",
    partnerId       : "1223282101",

    signtype        : 'SHA1',
    notify_url      :"http://flowerso2o.avosapps.com/wechat/pay_notify"

};

ALConfig.prototype.ALPhoneVerifyState = {
    undefine  : 0,      //未知、未定义、不做限制
    readyToLogin : 1,   //需要注册
    notReadyToLogin : 2    //已经注册,可直接登陆
};

ALConfig.prototype.ALSmsCodeType = {
    undefine  : 0,  //未知、未定义、不做限制
    signUp : 1,     //手机注册
    resetPwd : 2,   //重置密码
    resetPhone : 3  //更换手机号
};

ALConfig.prototype.ALUserType = {
    undefine  : 0,   //未知、未定义、不做限制
    general : 1,    //普通用户
    store : 2,   //商户
    deliveryman : 3   //快递

};

ALConfig.prototype.ALCouponType = {
    undefine : 0,
    store : 1,
    commdity : 2,
    bloom : 5,
    wechat : 10
};

ALConfig.prototype.ALCouponState = {
        undefined : 0,  //未知、未定义、不做限制
        unfinished : 1,  //未完成
        finished : 2,    //已完成(已使用、金额满)
        isUsered : 3    //已使用
};

ALConfig.prototype.ALUserStatementType = {
    undefined   : 0,  //未知、未定义、不做限制
    delivery    : 1,  //抢单配送
    expenditure : 2,    //提现、支出
    systemReward : 11,    //系统奖励
    systemPunish : 12     //系统惩罚
};

ALConfig.prototype.ALUserStatementState = {
    undefined   : 0,  //未知、未定义、不做限制
    underway    : 1,  //进行中
    done        : 2,  //完成
    fail        : 3   //关闭
};

module.exports = {
    ALConfig : ALConfig
};

