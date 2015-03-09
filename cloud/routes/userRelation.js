/****************
 通用函数
 *****************/

var url = require('url'),
    querystring = require('querystring'),
    crypto = require('crypto'),
    events = require('events'),
    emitter = new events.EventEmitter(),
    moment = require('moment-timezone')
    ;

var User = AV.Object.extend('_User'),
    Photo = AV.Object.extend('Photo')
    ;



var AL = require('cloud/lib/ALCommonUtil').AL();

AV._initialize('g405gbttqiz691vvrnmeyua4c3444k6vudaiw5h8dteut3qc', 'w6nd1xgnur9yppvc5h7kdt8knit8sz1sdt8o55irx3s3uycy', '3wdbejwyy36sfa1lytoorhzaengunxuqnv04yzixn6jl1t8d');
AV.Cloud.useMasterKey();

/*
 活动路由
 */

// http://flowerso2o.avosapps.com/bloom/news/coupon/kuma/
exports.route = function(app) {

    var wechatAppID = AL.config.wechatOfBloomAshleyConfig.appId;
    var wechatAppSecret = AL.config.wechatOfBloomAshleyConfig.appSecret;
    var wechatToken = AL.config.wechatOfBloomAshleyConfig.token;
    var encodinAESKey = AL.config.wechatOfBloomAshleyConfig.encodingAESKey;

    var API = require('cloud/lib/wechatAPI').API(wechatAppID, wechatAppSecret, wechatToken, app),
        oauth = API.OAuth,
        accessToken = API.AccessToken
        ;

    //用户关系 : 接口

/*
*   添加关系
*/
    //app.all("/userRelation/add", function(req, res) {
AV.Cloud.define("addUserRelation", function(request, response){

    var fromUserId = request.params.fromUserId;
    var toUserId = request.params.toUserId;

    var type = request.params.type;
    var bkName = request.params.bkName;

//    if (!__production) console.dir(fromUserId);
//    if (!__production) console.dir(toUserId);
//    if (!__production) console.dir(type);

    if (!fromUserId || !toUserId || !type)
    {
        response.error(ALERROR(777123,"参数错误"));
        return;
    }

    var fromUser = AV.Object.createWithoutData("_User",fromUserId);
    var toUser = AV.Object.createWithoutData("_User",toUserId);

    //添加用户关系
    addUserRelationIfIsNotExist(fromUser,toUser,type,bkName,function (isExist,error){

        if (isExist)
        {
            checkIsBilateral(fromUser,toUser,type,10,function(success,error){

                if (!error)
                {
                    response.success();
                }
                else
                {
                    response.error(error);
                }
            });
        }
        else
        {
            response.error(error);
        }
    });
});

/*
*   查看关系是否存在
*/
AV.Cloud.define("checkRelationWhetherIsExist", function(request, response){

    var fromUserId = request.params.fromUserId;
    var toUserId = request.params.toUserId;

    var type = request.params.type;

    if (!__production) console.dir(fromUserId+":"+toUserId+":"+type);

    if (!fromUserId || !toUserId || !type)
    {
        response.error(ALERROR(777123,"参数错误"));
        return;
    }

    var fromUser = AV.Object.createWithoutData("_User",fromUserId);
    var toUser = AV.Object.createWithoutData("_User",toUserId);

    //检查用户关系
    getUserRelation(fromUser,toUser,type,function (object,error){

        if (error)
        {
            response.error(error);
        }
        else
        {
            response.success(object?true:false);
        }
    });
});

/*
移除关注
*/
AV.Cloud.define("removeUserRelation", function(request, response){

    var fromUserId = request.params.fromUserId;
    var toUserId = request.params.toUserId;
    var type = request.params.type;

    if (!fromUserId || !toUserId || !type)
    {
        response.error(ALERROR(777123,"参数错误"));
        return;
    }

    var fromUser = AV.Object.createWithoutData("_User",fromUserId);
    var toUser = AV.Object.createWithoutData("_User",toUserId);

    //移除用户关系
    removeUserRelation(fromUser,toUser,type,function (success,error){

        if (success)
        {
            checkIsBilateral(fromUser,toUser,type,10,function(success,error){

                if (!error)
                {
                    response.success();
                }
                else
                {
                    response.error(error);
                }
            });
        }
        else
        {
            response.error(error);
        }
    });
});

/*
添加特别关注
*/
AV.Cloud.define("updateUserRelationToSpecial", function(request, response){

    var fromUserId = request.params.fromUserId;
    var toUserId = request.params.toUserId;
    var type = parseInt(request.params.type);

    if (!fromUserId || !toUserId || !type)
    {
        response.error(ALERROR(777123,"参数错误"));
        return;
    }

    var fromUser = AV.Object.createWithoutData("_User",fromUserId);
    var toUser = AV.Object.createWithoutData("_User",toUserId);

    updateUserRelationToSpecial(fromUser,toUser,type,true,function (success,error){

        if (success)
        {
            response.success();
        }
        else
        {
            response.error(error);
        }
    });
});

/*
取消特别关注
*/
AV.Cloud.define("updateUserRelationToUnspecial", function(request, response){

    var fromUserId = request.params.fromUserId;
    var toUserId = request.params.toUserId;
    var type = parseInt(request.params.type);

    if (!fromUserId || !toUserId || !type)
    {
        response.error(ALERROR(777123,"参数错误"));
        return;
    }

    var fromUser = AV.Object.createWithoutData("_User",fromUserId);
    var toUser = AV.Object.createWithoutData("_User",toUserId);

    updateUserRelationToSpecial(fromUser,toUser,type,false,function (success,error){

//        if (!__production) console.dir("什么情况");
//        if (!__production) console.dir(error);

        if (success)
        {
            response.success();
        }
        else
        {
            response.error(error);
        }
    });
});


AV.Cloud.define("getUserRelation", function(request, response){

    var fromUser = request.params.fromUser;
    var toUser = request.params.toUser;
    var type = request.params.type;
    var isSpecial = request.params.isSpecial;
    var limit = request.params.limit;
    var skip = request.params.skip;

    if (!fromUser.id || !toUser.id)
    {
        response.error(ALERROR(777120,"参数错误"));
        return;
    }

    getUserRelation(fromUser,toUser,type,isSpecial,limit,skip,function (users,error){
        if (!error)
        {
            response.success(users);
        }
        else
        {
            response.error(error);
        }
    });
});

function getUserRelation(fromUser,toUser,type,isSpecial,limit,skip,done){

    var userRelationQ = new AV.Query(UserRelation);
    userRelationQ.equalTo('fromUser',fromUser);
    userRelationQ.equalTo('toUser',toUser);
    if (type) userRelationQ.equalTo('type',type);
    if (isSpecial) userRelationQ.equalTo('isSpecial',isSpecial);
    userRelationQ.find().then(function(userRs){

        done(userRs,null);

    },function(error){

        done(null,error);

    });
}

/*
*
*   用户关系 : 函数
*
*/

// 添加一个关系 如果他不存在
function addUserRelationIfIsNotExist(fromUser,toUser,type,bkName,done){

//    var fromUser = AV.Object.createWithoutData("_User",fromUser.objectId);
//    var toUser = AV.Object.createWithoutData("_User",toUser.objectId);

    //查看关系是否已经存在
    getUserRelation(fromUser,toUser,type,function(object,error){

        if (error) //查询失败
        {
            done(false,error);
        }
        else if (object)  //已经关注
        {
            if (object.get('type') == type)
            {
                done(false,{'code':777212,'message':"已经关注"});
            }
            else
            {
                //类别不同 修改类别
                object.set('type',type);
                object.save().then(function(object) {

                    done(true,null);

                }, function(error) {

                    done(false,error);
                });
            }
        }
        else   //没有关注
        {
            if (!__production) console.log("没有关注");
            var userRelation = new UserRelation();
            userRelation.set('fromUser',fromUser);
            userRelation.set('toUser',toUser);
            userRelation.set('type',type);
            userRelation.set('bkName',bkName);
            userRelation.save().then(function(object) {

                done(true,null);

            }, function(error) {

                done(false,error);
            });
        }

    });
}

//查看关系是否已经存在
function getUserRelation(fromUser,toUser,type,done) {

    if (!__production) console.dir("开始检查");

    if (!__production) console.dir(fromUser.id);
    if (!__production) console.dir(toUser.id);
    if (!__production) console.dir(type);

    var userRelationQ = new AV.Query(UserRelation);
    userRelationQ.equalTo('fromUser',fromUser);
    userRelationQ.equalTo('toUser',toUser);
    userRelationQ.equalTo('type',type);
    userRelationQ.first().then(function(object){

        if (object)
        {
            //已经存在 OK
            if (!__production) console.dir("已经存在 OK");
        }
        else
        {
            //不存在   OK
            if (!__production) console.dir("不存在 OK");
        }

        done(object,null);

    },function(error){

        //查询失败  NOT OK
        if (!__production) console.dir("查询失败 NOT OK");
        done(false,error);

    });
}


var SystemError = AV.Object.extend("SystemError");

//查看是否是双向的
function checkIsBilateral(user1, user2, type, tryTimes, done){

    if (tryTimes<=0)
    {
        done(false,ALERROR(777211,"请求次数超过限制"));
        return;
    }

//    var user1 =  AV.Object.createWithoutData("_User",user1.objectId);
//    var user2 = AV.Object.createWithoutData("_User",user2.objectId);
//
//    if (!__production) console.dir(user1);
//    if (!__production) console.dir(user2);

    var userRQ1 = new AV.Query(UserRelation);
    userRQ1.equalTo('fromUser',user1);
    userRQ1.equalTo('toUser',user2);

    var userRQ2 = new AV.Query(UserRelation);
    userRQ2.equalTo('fromUser',user2);
    userRQ2.equalTo('toUser',user1);


    var userRelationQ = AV.Query.or(userRQ1,userRQ2);
    userRelationQ.equalTo('type',type);
    userRelationQ.find().then(function(objects){

        if (!objects || objects.length==0)
        {
            done(false,null);
        }
        else if (objects.length==1)
        {
//            var userR = objects[0];
            objects[0].set('isBilateral',false);
            objects[0].save();
            done(false,null);
        }
        else if (objects.length==2)
        {
            objects[0].set('isBilateral',true);
            objects[1].set('isBilateral',true);
            AV.Object.saveAll(objects);
            done(true,null);
        }
        else
        {
            var systemError = new SystemError();
            systemError.set('message',"用户关系创建重复 : "+user1.id+"---"+user2.id);
            systemError.save();
            done(false,ALERROR(777894,"用户关系创建重复 : "+user1.id+"---"+user2.id));
        }


    },function(error){

        //查询失败
        checkIsBilateral(user1, user2, type, --tryTimes, done);

    });


//        first({
//        success: function(object1) {
//            if (object1) //已经关注
//            {
//                if (!__production) console.log("互粉:已经关注");
//                var userRelationQ = new AV.Query(UserRelation);
//                userRelationQ.equalTo('fromUser',user2);
//                userRelationQ.equalTo('toUser',user1);
//                userRelationQ.equalTo('type',type);
//                userRelationQ.first({
//                    success: function(object2) {
//                        if (object2)//已经粉丝
//                        {
//                            if (!__production) console.log("互粉:已经粉丝");
////                            user1.increment('numberOfBilaterals');
////                            user2.increment('numberOfBilaterals');
//                            object1.set('isBilateral',true);
//                            object2.set('isBilateral',true);
//
//                            _saveAll([user1, user2, object1, object2], function(list, error) {
//                                if (list)
//                                {
//                                    done(true,null);
//                                }
//                                else
//                                {
//                                    //保存失败
//                                    checkIsBilateral(user1, user2, type, --tryTimes, done);
//                                }
//                            });
//                        }
//                        else
//                        {
//                            //没有粉丝
//                            if (!__production) console.log("互粉:不是粉丝");
//                            done(true,null);
//                        }
//
//                    },
//                    error: function(error) {
//                        //查询失败
//                        checkIsBilateral(user1, user2, type, --tryTimes, done);
//                    }
//                });
//            }
//            else
//            {
//                //没有关注
//                if (!__production) console.log("互粉:不是关注");
//                done(true,null);
//            }
//        },
//        error: function(error) {
//            //查询失败
//            checkIsBilateral(user1, user2, type, --tryTimes, done);
//        }
//    });
}



function removeUserRelation(fromUser,toUser,type,done){

//    var fromUser = AV.Object.createWithoutData("_User",fromUser.objectId);
//    var toUser = AV.Object.createWithoutData("_User",toUser.objectId);

//    if (!__production) console.dir(fromUser);
//    if (!__production) console.dir(toUser);

    var userRelationQ = new AV.Query(UserRelation);
    userRelationQ.equalTo('fromUser',fromUser);
    userRelationQ.equalTo('toUser',toUser);
    userRelationQ.equalTo('type',type);
    userRelationQ.first({
        success: function(object) {
            if (object)
            {
                //已经关注
//                if (!__production) console.log("已经关注");
                object.destroy({
                    success: function(object) {
//                        if (!__production) console.log("删除成功");
                        done(true,null);

                    },
                    error: function(object, error) {
//                        if (!__production) console.log("删除失败"+error.message);
                        done(false,error);
                    }
                });
            }
            else
            {    //没有关注
//                if (!__production) console.log("没有关注");
                done(false,{'code':777311,'message':"没有关注"});

            }
        },
        error: function(error) {
            //查询失败
//            alert("Error: " + error.code + " " + error.message);
            done(false,error);
        }
    });
}




function updateUserRelationToSpecial(fromUser,toUser,type,isToSpecial,done){

//    var type = ALUserRelationTypeOfFollow;

    //查看关系是否已经存在
    getUserRelation(fromUser,toUser,type,function(object,error){

        if (error) //查询失败
        {
            done(false,error);
        }
        else if (object)  //已经关注
        {
            if (object.get('isSpecial') == isToSpecial)
            {
                done(false,{'code':711,'message':isToSpecial?"已经是特别关注了":"已经取消特别关注了"});
                return;
            }

            object.set('isSpecial',isToSpecial);
            object.save().then(function(object) {

                done(true,null);

            }, function(error) {

                done(false,error);
            });
        }
        else   //没有关注
        {
            if (!__production) console.log("没有关系");
            done(false,ALERROR(777382,"没有关注该用户"));
        }

    });
}
};

