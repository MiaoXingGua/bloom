
var UINT8_MAX = 255;
var UINT16_MAX = 65535;  //0~65535

/*
 模块引用
 */
//  1.核心模块
// require('bbb') bbb引入的模块
//  2.自定义模块
// require('./aaa')相对路径 require('path/ccc')绝对路径

var url = require('url'),
    querystring = require('querystring'),
    crypto = require('crypto'),
    events = require('events'),
    emitter = new events.EventEmitter(),
//  xml2js = require('xml2js'),
//  parse = require('xml2js').Parser(),
//  parseString = require('xml2js').parseString,
//  moment = require('moment')
    moment = require('moment-timezone')
    ;


//相当于定义一个class
var AL = function () {

    //并不是单例 这种写法只是 每次可以直接调用API()来创建API对象
    if (!(this instanceof AL)) {

        return new AL();
    }

    /*
        模块中API定义
     */
    // 模块中API定义1
    // this.aaa aaa不会对外开放(私有函数)
    // 相当于定义私有属性
    this.smsAPI = require("cloud/lib/smsAPI");
    this.request = require('request');
};



//模块中API定义2
//this.prototype.ccc ccc会对外开放(公有函数)
// 相当于定义公有属性

// xml2json
AL.prototype.parse = require("cloud/lib/ALParse").ALParse();

// config
AL.prototype.config = require("cloud/lib/ALConfig").ALConfig();

// sms
AL.prototype.sendSMS = function(phoneCodes,template,params,done){

    this.smsAPI.sendSMS(phoneCodes,template,params,done);
};



AL.prototype.httpPostRequest = function (requestURL, body, done){

    console.dir(requestURL);
    console.dir(body);

    this.request.post({url:requestURL, json: body}, function(error,response, body){
        if (!__production) console.dir("返回结果 : "+JSON.stringify(body));
        done(body,null);
    });
};

AL.prototype.httpGetRequest = function (requestURL,done){

    //console.dir("requestURL : "+requestURL);
    var that = this;
    AV.Cloud.httpRequest({
        method: 'GET',
        url: requestURL,
        success:function(httpResponse) {

            if (!__production) console.dir("返回结果 : "+httpResponse.text);
            done(JSON.parse(httpResponse.text),null);
        },
        error:function(httpResponse) {

            done(null,that.error(httpResponse.status,"请求失败"));
        }
    });

    //this.request(requestURL, function (error, response, body) {
    //    if (!error) {
    //        console.dir("返回结果 : "+body);
    //        done(JSON.parse(body),null);
    //    }
    //    else{
    //        done(null,that.error(response.statusCode,"请求失败"));
    //    }
    //});
};

AL.prototype.object = function(className,objectId){

    var obj = null;
    try{
       obj = AV.Object.createWithoutData(className,objectId);
    }catch (error){
        console.dir(error);
    }

    return obj;
};

//这样声明的属性 才是对外开放的
AL.prototype.domain =  "http://flowerso2o.avosapps.com/";
//AL.prototype.domain = __production?"http://flowerso2o.avosapps.com/":"http://192.168.199.232:3000/";

//AL.prototype.domain = function(requset){
//
//    return "http://"+requset.headers.host;
//};

AL.prototype.url = function(requset){

    return requset.url;
};

//生成guid
AL.prototype.guid = function (){
    var S4 = function() {
        Math.floor(Math.random()*16.0).toString(16);
        return (((1+Math.random())*UINT16_MAX)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

//获取时间戳
AL.prototype.getTimeStamp = function (date){
    if (!AV._.isDate(date))
    {
        date = new Date();
    }
    return parseInt(date.getTime());
};

//获取时间
AL.prototype.getDate = function (timeStamp){

    if (isNaN(parseInt(timeStamp)))
    {
        return new Date();
    }
    else
    {
        return new Date(parseInt(timeStamp));
    }
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18

AL.prototype.getRTime = function (EndTime){

    function checkTime(i)
    {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    var NowTime = new Date();
    var ts =EndTime.getTime() - NowTime.getTime();

    var string = "";

    if (ts>=0)
    {
        string+="剩余 ";
    }
    else
    {
        string+="超时 ";
        ts*=-1;
    }

    var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
    var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
    var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
    var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数

    dd = checkTime(dd);
    hh = checkTime(hh);
    mm = checkTime(mm);
    ss = checkTime(ss);


    if (dd>0) string+=dd+" 天 ";
    if (hh>0) string+=hh+" 时 ";
    if (mm>0) string+=mm+" 分 ";
    if (ss>0) string+=ss+" 秒 ";
     //console.dir(string);
    return string;
};


//获取字符串时间
AL.prototype.getDateFormat = function (date,format){

    //console.dir("date : "+date);

    if (!date)
    {
        date = new Date();
    }

    if (!format)
    {
        format = "YYYY-MM-DD HH:mm:ss";
    }
    //console.dir(moment(date).tz('Asia/Shanghai').format(format));

    return moment(date).tz('Asia/Shanghai').format(format);
};

//随机数
AL.prototype.getRandomNumberWithRange = function (Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
};

//随机码
AL.prototype.getRandomNumberWithDigit = function addNumber(_idx){
    var str = '';
    for(var i = 0; i < _idx; i += 1){
        str += Math.floor(Math.random() * 10);
    }
    return str;
};

//生成error
AL.prototype.error = function (_code,_message){
    return {code:_code,message:_message};
};

AL.prototype.done = function(res, obj, error){

    var result = {};
    obj||obj==false?result.object = obj:null;
    error?result.error = {code:error.code,message:error.message}:null;

    console.dir("返回结果 : "+JSON.stringify(result));
    //"Content-Type", "application/json;charset=utf-8"
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
    res.write(JSON.stringify(result));
    res.end();
};



//数据类型
AL.prototype.isArray = function(array){
    return AV._.isArray(array);
};

AL.prototype.isEmpty = function(obj){
    return AV._.isEmpty(obj);
};

AL.prototype.isNumber = function(obj){
  return AV._.isNumber(obj);
};

AL.prototype.save = function(object,done){
    object.save(null, {
        success: function(obj) {
            done(obj,null);
        },
        error: function(obj, error) {
            done(obj,error);
        }
    });
};

AL.prototype.saveAll = function(list,done){
     AV.Object.saveAll(list,done);
};

AL.prototype.destroyAll = function(list){
    AV.Object.destroyAll(list);
};

//MD5
AL.prototype.MD5 = function (prestr) {

    var crypto = require('crypto');
    return crypto.createHash('MD5').update(prestr, "utf-8").digest("hex");
};

// 这里应该有一个迭代 以后再写 (目前只能接嵌套一层的)（多层嵌套要避免循环引用）
AL.prototype.object2Json = function(object){

    var obj = object.toJSON();
    obj.className = object.className;
    obj.__type = "Pointer";
    //console.dir(111);
    //console.dir(obj);
    for (var j in obj)  //遍历属性
    {
        // 如果obj[j]是一个指针
        if(obj[j])
        {
            if (obj[j].__type=="Pointer")
            {
                var json = object.get(j).toJSON();
                json.__type = "Pointer";
                json.className = obj[j].className;
                obj[j] = json;
            }
        }

    }
    //console.dir(222);
    //console.dir(obj);
    return obj;
};



AL.prototype.countQuery = function (query,done){

    var _error = this.error;
    query.count().then(function(number){
        done?done(number,null):null;
    },function(error){
        done?done(0,_error(error.code,error.message)):null;
    });
};

//查询
AL.prototype.findQueryWithoutData = function (query,selectKey,done){

    var _error = this.error;

    if (selectKey&&selectKey.length>0) {
        query.select(selectKey);
        query.include(selectKey);
    }else{
        query.select("objectId");
    }

    query.find().then(function(objects){
        //console.dir(objects);

        var objectIds = [];
        for (var i in objects)
        {
            //console.dir(objects[i].id);
            //console.dir(objects[i].get('deliveryFromDate'));
            objectIds.push((selectKey&&selectKey.length>0)?objects[i].get(selectKey).id:objects[i].id);
        }
        done?done(objectIds,null):null;

    },function(error){
        done?done(null,_error(error.code,error.message)):null;
    });
};

AL.prototype.findQuery = function (query,selectKey,done){

    var that = this;
    var _error = that.error;

    if (selectKey&&selectKey.length>0) {
        query.select(selectKey);
        query.include(selectKey);
    }

    query.find().then(function(objects){

        //console.dir("objects + "+objects.length);

        var objs = [];
        for (var i in objects)
        {
            if (selectKey&&selectKey.length>0)
            {
                objs.push(objects[i].get(selectKey).toJSON());
            }
            else
            {
                objs.push(that.object2Json(objects[i]));
            }
        }

        done?done(objs,null):null;

    },function(error){
        done?done(null,_error(error.code,error.message)):null;
    });
};



/*
 模块定义
 相当于 : 对外开放的class
 */

// 引用方法1
// module : 模块本身
// module.exports : 模块的exports属性
module.exports = {
    AL : AL
};

// 引用方法2
// exports : 为module.exports赋值的方法(会覆盖module.exports的值)
// exports.AL = AL;
