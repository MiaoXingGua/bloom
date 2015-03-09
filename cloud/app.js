// nodejs 入口

/**
* 模块依赖 （相当于import）
* node对于模块加载采取了三个步骤，路径分析，文件定位，模块编译.
*/
var express = require('express');

//var avosExpressHttpsRedirect = require('avos-express-https-redirect');
//app.use(avosExpressHttpsRedirect());
/*
 * 初始化 Express 应用
 */
var app = express();
/*
 ./routes代表的是在当前目录下是否有routes.js, routes.node, routes.json，如果没有，那在找是否有routes文件夹，如果有
 就返回里面的index.js文件，或者你通过在routes里面有个包配置文件package.json里面的main字段指向的文件，如果没有的，node进程就报not fount xx module
 */
//, routes = require(__dirname+'/routes')//加载了routes/index.js (index.js必须存在)
//, user = require(__dirname+'/routes/user')
//, http = require('http')
//, path = require('path')
    ;


var AL = require('cloud/lib/ALCommonUtil').AL();
moment = require('moment-timezone');

/*
* 环境变量
*/
app.configure(function(){

    //设置值
    /*
     env 运行时环境，默认为 process.env.NODE_ENV 或者 "development"
     trust proxy 激活反向代理，默认未激活状态
     jsonp callback name 修改默认?callback=的jsonp回调的名字
     json replacer JSON replacer 替换时的回调, 默认为null
     json spaces JSON 响应的空格数量，开发环境下是2 , 生产环境是0
     case sensitive routing 路由的大小写敏感, 默认是关闭状态， "/Foo" 和"/foo" 是一样的
     strict routing 路由的严格格式, 默认情况下 "/foo" 和 "/foo/" 是被同样对待的
     view cache 模板缓存，在生产环境中是默认开启的
     view engine 模板引擎
     views 模板的目录, 默认是"process.cwd() + ./views"

     */
    //app.set('port', process.env.PORT || 3000);

    /*
        <% code %>      JS代码。
        <%= code %>     替换的内容 原样显示
        <%- code %>     动态加载内容
     */
    app.set('view engine', 'ejs');          // 设置template引擎
    //app.set('view engine', 'html');

    // 设置模板目录   __dirname当前脚本所在目录
    app.set('views', "/");
    //if(__production)
    //    app.set('views', 'cloud'+'/views');
    //else
    //    app.set('views', 'cloud'+'/dev_views');


    //app.register('.html', require('ejs'));

    /*
     app.use([path], function)
     使用中间件 function,可选参数path默认为"/"。
     挂载的路径不会在req里出现，对中间件 function不可见，这意味着你在function的回调参数req里找不到path。 这么设计的为了让间件可以在不需要更改代码就在任意"前缀"路径下执行
     使用 app.use() “定义的”中间件的顺序非常重要，它们将会顺序执行，use的先后顺序决定了中间件的优先级。 比如说通常 express.logger() 是最先使用的一个组件，纪录每一个请求
     */
//    app.use(express.logger());
    app.use(express.favicon());     //使用默认的favicon图标
    app.use(express.logger('dev')); //在开发环境下终端会显示详细日志
    app.use(express.bodyParser());    // 读取请求body的中间件
    //app.use(avosExpressHttpsRedirect()); //启用HTTPS的中间件
    app.use(express.methodOverride());  //协助处理POST请求 伪装PUT DELETE 等

//    app.use(app.router);      // 调用路由解析的规则
//    app.use(express.static('/public'));   //静态文件服务的中间件
});
//
///*
//    开发环境的错误处理：输出错误信息
// */
////if ('development' == app.get('env')){
////    app.user(express.errorHandler());
////}
//




/*
    返回头
 */
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.get('/hello?', function(req, res) {

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

    // 回复图文消息
    var reportNewsMessage = function(json,items){

        if (!__production) console.dir(json);
        if (!__production) console.dir(items);

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

        if (!__production) console.dir("reportNewsMessage : "+report);

    };

    reportNewsMessage(json,items);

    return;

    AL.sendSMS(["15810513348"], "customEvaluate", {customEvaluate:"111\r\n\t222\r\n333"});
    return;

    var wechat = require('cloud/routes/wechatDelivery');
    var orderQ = new AV.Query(AL.config.CommodityOrder);
    orderQ.equalTo('objectId', "54ca0db5e4b06b90a807266b");
    orderQ.find().then(function(orders){
        if (!__production) console.dir("tz时间 :" + AL.getDateFormat(orders[0].get('deliveryFromDate')) +"  "+__production);
        //wechat.wechatSendOrderInfoToFlowerStore(orders[0]);
        AL.done(res,"tz时间 :" + AL.getDateFormat(orders[0].get('deliveryFromDate')) +"  "+__production);
    });

    return;

    var url = require('url');
    if (!__production) console.dir("req.url : "+req.url);
    if (!__production) console.dir(url.parse(req.url));
    return res.end(req.host);
    return res.end(req.url);

    var dict = {};
    dict.path = {};
    dict.path.tt = "呵呵";

    res.end(JSON.stringify(dict));
    return;

    if (!__production) console.log(req.method);
    //res.end("hello : "+req.method);
    //res.render("cloud/dev_view/learn/AJAX.ejs");
    var array = [1,2,3];
    array.indexOf(1);    // 返回0
    array.indexOf(5);    // 返回-1
    res.end(""+array.indexOf(1));
});

app.all('/demo?', function(req, res){

    var params = {
        orderNO:"0981123",
        deliveryCode:"123456",
        deliveryTime: '90',
        mobilePhoneNumber: '18910557310',
        template: 'deliveryStart'
    };

    /*
    * 您的礼品已在途中，单号 : {{orderNO}}，收件密码 : {{deliveryCode}}，预计{{deliveryTime}}分钟内到达，请保持电话畅通。
    * */

    AV.Cloud.requestSmsCode(params).then(function(){
        if (!__production) console.dir("sms发送成功");
        //done?done(true,null):null;
        AL.done(res,true);
    }, function(err){
        if (!__production) console.dir("sms发送失败 : "+err.message);
        //done?done(false,err):null;
        console.dir(err.message);
        AL.done(res,false,err);
    });

    return;

    AV.Cloud.requestSmsCode('18910557310').then(function(){
        //发送成功
        AL.done(res,true);
    }, function(err){
        //发送失败
        AL.done(res,false,err);
    });

    return;


    /*
    模板名 smsCode
     您正在执行{{operation}}操作，验证码是:{{code}}，有效期为:{{ttl}}分钟。【{{name}}】
    */
    var params = {
        operation: '手机号注册',
        mobilePhoneNumber: '18601399428',
        template: 'smsCode'
    };

    AV.Cloud.requestSmsCode(params).then(function(){
        if (!__production) console.dir("sms发送成功");
        //done?done(true,null):null;
        AL.done(res,true);
    }, function(err){
        if (!__production) console.dir("sms发送失败 : "+err.message);
        //done?done(false,err):null;
        console.dir(err.message);
        AL.done(res,false,err);
    });

    //console.dir(req);
    //req.body = {};
    //req.body.orderId = "5448cc80e4b03f69b4e2786a";
    //var userId = req.param("userId");
    //var orderId = req.param("orderId");
    //if (!__production) console.dir(userId);
    //if (!__production) console.dir(orderId);
    //if (!__production) console.dir(req);

    //console.dir("欢迎使用hello");
    //
    //res.query = {
    //    "transaction_id":"1223282101201502056168585301",
    //    "sign":"297D560A73E1C64F95D68BEC6ADF48A6",
    //    "fee_type":"1",
    //    "partner":"1223282101",
    //    "input_charset":"UTF-8",
    //    "transport_fee":"0",
    //    "sign_type":"MD5",
    //    "total_fee":"1",
    //    "trade_state":"0",
    //    "out_trade_no":"54d321fbe4b04e1d9fcd968d",
    //    "time_end":"20150205155707",
    //    "bank_billno":"201502056102827313",
    //    "notify_id":"qoBvNq1YsO7Q_sVjw8w6Mc2iPVdrJgfLgCH7Op_8LZxsQSg86XPjVk85I4EZwPC1vz1xzkOJoLCshn5d_XgERE_i82S9KCmo",
    //    "bank_type":"2011",
    //    "trade_mode":"1",
    //    "discount":"0",
    //    "product_fee":"1"
    //};
    //
    //console.dir(res.query);
    //
    //res.redirect("http://192.168.199.232:3000/wechatPay/pay_notify",res.query);

});


app.get('/404?', function(req, res) {

    return res.redirect("/404.html");
});

exports.hello = function(res){

    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
    res.write("hello".toString('utf-8'));
    res.end();
};

//app.get('/alipay/hello', function(request, response) {
//    response.end("alipay-hello");
//});

//app.get('/hello', function(req, res) {
//
//    //var hello = require('./hello');
//    //console.log(hello.sayHello());
//    //console.log(hello.name);
//    res.end('Congrats, you just set up your app!');
//
//    //res.render('cloud/views/hello', { message: 'Congrats, you just set up your app!' });
//});
//
//app.get('/egret',function(req, res){
//
//    // socket
//    res.render('egret-index',{nickname:"我是喵星呱"});
//});
//
//app.get('/seajs/hello', function(req, res) {
//
//    //直接返回
//    //response.send("hello");
//    //加载ejs模板 后返回
//
//    //var params = {str1:"str1"};
//    //params.push({str2:"str2",str3:"str3"});
//    //  console.dir(params);
//    //response.render('hello', { message: "http://www.w3school.com.cn/i/movie.ogg" });
//
//
//    //console.log(app.path());
//    //console.dir(req.route);
//    //console.log(req.ip);
//    //console.log(req.hostname);
//    //console.log(req.path);
//    //console.log(app.mountpath());
//
//    // seajs
//
//    console.log("是是是");
//
//    var photoURLs = [
//        "https://i.alipayobjects.com/e/201211/1cqKb32QfE.png"
//        ,"https://i.alipayobjects.com/e/201211/1cqKb2rJHI.png"
//        ,"https://i.alipayobjects.com/e/201211/1cqKeZrUpg.png"
//        ,"https://i.alipayobjects.com/e/201211/1cqM4u3Ejk.png"
//        ,"https://i.alipayobjects.com/e/201211/1cqKoKV2Sa.png"
//        ,"https://i.alipayobjects.com/e/201211/1cqKb4JU4K.png"
//        ,"https://i.alipayobjects.com/e/201211/1cqKojFDLY.png"
//        ,"https://i.alipayobjects.com/e/201211/1cqKb2sBO8.png"
//        ,"https://i.alipayobjects.com/e/201211/1cqKb2LmXk.png"
//        ,"https://i.alipayobjects.com/e/201211/1cqKb1jcWC.png"
//        ,"https://i.alipayobjects.com/e/201211/1cqKojb72y.png"
//    ];
//
//    res.render('seajs/app/hello',{photos:photoURLs});
//
//
//
//});
//
//app.get('/seajs/lucky', function(req, res) {
//
//    res.render('seajs/app/lucky',{});
//});
//
//app.get('/seajs/ng-todo', function(req, res) {
//
//    res.render('seajs/app/ng-todo',{});
//});
//
//app.get('/seajs/todo', function(req, res) {
//
//    res.render('seajs/app/todo',{});
//});
//
//app.get('/ajax', function(req, res) {
//
//    console.dir("ajax");
//    //使用ejs
//    res.render('AJAX.ejs');
//});
//
//app.get('/html5', function(req, res) {
//
//    console.dir("html5");
//    //使用ejs
//    res.render('learn/h5',{});
//});
//
//app.get('/getDate', function(req, res) {
//
//    res.send(new Date());
//});
//
//app.get('/getNumber', function(request, response) {
//
//    getNumber(function(count,error){
//
//        if (!error)
//        {
//            response.success(count);
//        }
//        else
//        {
//            response.error(error);
//        }
//
//    });
//});
//
//app.get('/subNumber', function(request, response) {
//
//    subNumber(function(count,error){
//
//        if (!error)
//        {
//            response.success(count);
//        }
//        else
//        {
//            response.error(error);
//        }
//    });
//});
//
//function getNumber(done){
//
//    var tempCountQ = AV.Object.createWithoutData('tempCount',"5449e2a0e4b03a97c23388a1");
//    tempCountQ.fetch().then(function(tempCount){
//
//        if (tempCount)
//        {
//            done(tempCount.get('count'));
//        }
//        else
//        {
//            done(0,ALEEROR("124","不存在"));
//        }
//
//    },function(error){
//
//        done(0,ALEEROR(error.code,error.message));
//    });
//}
//
//function subNumber(done){
//
//    var tempCountQ = AV.Object.createWithoutData('tempCount',"5449e2a0e4b03a97c23388a1");
//    tempCountQ.increment('count',-1);
//    tempCountQ.fetchWhenSave(true);
//    tempCountQ.save().then(function(tempCount){
//
//        if (tempCount)
//        {
//            done(tempCount.get('count'));
//        }
//        else
//        {
//            done(0,ALEEROR("124","不存在"));
//        }
//
//    },function(error){
//
//        done(0,ALEEROR(error.code,error.message));
//    });
//}


/*
    路由
*/
/**
* app中的函数改变 需要重新部署
* 静态ejs和AV.Object.define 则不需要
*/
require('cloud/routes/user').route(app,express);
require('cloud/routes/admin').route(app);
require('cloud/routes/order').route(app);
require('cloud/routes/delivery').route(app);
require('cloud/routes/statement').route(app);

require('cloud/routes/wechat').route(app);
require('cloud/routes/wechatPay').route(app);
require('cloud/routes/wechatDelivery').route(app);
require('cloud/routes/wechatStatement').route(app);


require('cloud/routes/alipay').route(app);
require('cloud/routes/coupon').route(app);
require('cloud/routes/news').route(app);
require('cloud/routes/showPhoto').route(app);




var HarpyAlertType = {
    undefine : 0,
    force : 1,    // 现在
    option : 2,   // 现在,下次提示
    skip : 3      // 现在,下次提示,跳过这个版本
};



// 检查版本号
app.all('/checkVersion', function(req, res) {

    var platform = req.body.platform;
    if (platform == "iOS")
    {
       AL.done(res,{appID:"931918119",Bloom:"Bloom",alertType:HarpyAlertType.force,timeInterval:60,now:(AL.getTimeStamp()/1000)},null);
    }
});

app.all('/report/add', function(req, res) {

    var userId = req.body.userId;
    var objectId = req.body.objectId;
    var reason = req.body.reason;
    var classStr = req.body.class;

    var obj = AV.Object.createWithoutData(classStr,objectId);
    obj.increment('reportCount');

    var ReportLog = AV.Object.extend("ReportLog");
    var reportLog = new ReportLog();
    reportLog.set(classStr,obj);
    reportLog.set('reason',reason);
    reportLog.set('user',AV.Object.createWithoutData('_User',userId));
    reportLog.save().then(function(reportLog){
           AL.done(res,reportLog.id);
    },function(error){
        AL.done(res,null,error);
    });
});


// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();