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

AV._initialize('g405gbttqiz691vvrnmeyua4c3444k6vudaiw5h8dteut3qc', 'w6nd1xgnur9yppvc5h7kdt8knit8sz1sdt8o55irx3s3uycy', '3wdbejwyy36sfa1lytoorhzaengunxuqnv04yzixn6jl1t8d');
AV.Cloud.useMasterKey();

var AL = require('cloud/lib/ALCommonUtil').AL();

/*
 用户路由
 */
exports.route = function(app,express) {

    /*
     具体来说cookie机制采用的是在客户端保持状态的方案，而session机制采用的是在服务器端保持状态的方案。
     */

    // cookie密钥
    var cookieSecret = "3wdbejwyy36sfa1lytoorhzaengunxuqnv04yzixn6jl1t8d";

    // 启用cookie
    app.use(express.cookieParser('Your Cookie Secure'));

    // session 存储  (它会自动将 AV.User 的登录信息记录到 cookie 里，用户每次访问会自动检查用户是否已经登录，如果已经登录，可以通过 AV.User.current() 获取当前登录用户。)
    var avosExpressCookieSession = require('avos-express-cookie-session');
    /*

     cookie -- 可选参数，设置 cookie 属性，例如 maxAge,secure 等。我们会强制将 httpOnly 和 signed 设置为 true。
     fetchUser -- 是否自动 fetch 当前登录的 AV.User 对象。默认为 false。如果设置为 true，每个 HTTP 请求都将发起一次 LeanCloud API 调用来 fetch 用户对象。如果设置为 false，默认只可以访问 AV.User.current() 当前用户的 id 属性，您可以在必要的时候 fetch 整个用户。通常保持默认的 false 就可以。
     key -- session 在 cookie 中存储的 key 名称，默认为 avos.sess。

     */
    app.use(avosExpressCookieSession({ cookie: { maxAge: 3600000 }}));

    // 渲染登录页面
    app.all('/login', function(req, res) {

        if (req.method == 'GET')
        {
            var username = "20A4EA19-BB01-424A-ACBE-BF84B51750CE";
            var password = "20A4EA19-BB01-424A-ACBE-BF84B51750CE".toLowerCase;

            AV.User.logIn(username, password).then(function() {
                //登录成功，avosExpressCookieSession会自动将登录用户信息存储到cookie
                //跳转到profile页面。
                console.log('signin successfully: %j', AV.User.current());
                //res.redirect('/profile');

            },function(error) {

                //登录失败，跳转到登录页面
                console.log('error : %j', error.message);
                //res.redirect('/login');
            });
}
        else if (request.method == 'POST')
        {

        }


        //console.log("POST LOG IN");
        //
        //var username = req.body.username;
        //var password = req.body.password;
        //
        //username = "20A4EA19-BB01-424A-ACBE-BF84B51750CE";
        //password = "20A4EA19-BB01-424A-ACBE-BF84B51750CE".toLowerCase;
        //
        //AV.User.logIn(username, password).then(function() {
        //    //登录成功，avosExpressCookieSession会自动将登录用户信息存储到cookie
        //    //跳转到profile页面。
        //    console.log('signin successfully: %j', AV.User.current());
        //    res.redirect('/profile');
        //},function(error) {
        //    //登录失败，跳转到登录页面
        //    console.log('error : %j', error.message);
        //    res.redirect('/login');
        //});
    });

    //查看用户profile信息
    app.get('/profile', function(req, res) {
        // 判断用户是否已经登录
        if (AV.User.current()) {
            // 如果已经登录，发送当前登录用户信息。
            res.send(AV.User.current());
        } else {
            // 没有登录，跳转到登录页面。
            res.redirect('/login');
        }
    });
    //调用此url来登出帐号
    app.get('/logout', function(req, res) {
        //avosExpressCookieSession将自动清除登录cookie信息
        AV.User.logOut();
        res.redirect('/profile');
    });


    //发送验证
    app.all('/user/login/postSmsCode?', function(req, res) {

        //var phoneNumber = req.param("phoneNumber");
        //if (phoneNumber)
        //{
        //    AL.done(res,false,AL.error(777101,"手机号"));
        //}
        //AV.Cloud.requestSmsCode(phoneNumber).then(function(){
        //    //发送成功
        //    AL.done(res,true);
        //}, function(err){
        //    //发送失败
        //    AL.done(res,false,err);
        //});
        //return;

        var phoneNumber = req.param("phoneNumber");
        if (!phoneNumber || !phoneNumber.match(/^1[3|4|5|8][0-9]\d{8}$/g))
        {
            return AL.done(res,null,AL.error(777220,"手机号输入有误，请重新输入。"));
        }

        var type = parseInt(req.param("type"));
        var operation = null;
        switch (type){
            case AL.config.ALSmsCodeType.signUp:
                operation = "手机号注册";
                break;
            case AL.config.ALSmsCodeType.resetPwd:
                operation = "重置密码";
                break;
            case AL.config.ALSmsCodeType.resetPhone:
                operation = "手机号绑定";
                break;
        }

        if (!operation)
        {
            return AL.done(res,false,AL.error(777234,"操作未定义"));
        }

        AL.sendSMS([phoneNumber], "smsCode", {operation:operation}, function(suc,err){
            if (suc && !err)
            {
                AL.done(res,true);
            }
            else
            {
                AL.done(res,false,err);
            }
        });

    });

    //接受验证
    app.all('/user/login/receiveSmsCode?', function(req, res) {

        var phoneNumber = req.param("phoneNumber");
        var phoneCode = req.param("phoneCode");

        AV.Cloud.verifySmsCode(phoneCode,phoneNumber).then(function(){
            AL.done(res,true);
        }, function(err){
            AL.done(res,false,err);
        });

    });

    // 检查手机号
    app.all('/user/login/checkPhoneNumber?', function(req, res) {

        if (req.method=="GET")
        {
            return res.end("GET");
        }

        var phoneNumber = req.body.phoneNumber;

        var userQ = new AV.Query(AL.config.User);
        userQ.equalTo('phoneNumber',phoneNumber);
        userQ.limit(1);
        userQ.find().then(function(objects){
            if (objects.length>0)
            {
                AL.done(res,AL.config.ALPhoneVerifyState.readyToLogin);
            }
            else
            {
                AL.done(res,AL.config.ALPhoneVerifyState.notReadyToLogin);
            }
        },function(error){
            AL.done(res,AL.config.ALPhoneVerifyState.undefine,error);
        });

    });

    var encryption = function(phoneNumber,phonePwd,username){
        return AL.MD5(phoneNumber+username.toLowerCase()+phonePwd);
    };

    var getLoginInfo = function(req, res) {

        console.dir("Login");

        var phoneNumber = req.body.phoneNumber;
        var phonePwd = req.body.phonePwd;

        console.dir("登录密码 : "+AL.MD5(phonePwd).toLowerCase());

        var userQ = new AV.Query(AL.config.User);
        userQ.equalTo('phoneNumber',phoneNumber);
        userQ.limit(1);
        userQ.find().then(function(objects){
            if (objects.length>0)
            {
                var user = objects[0];
                var username = user.get('username');
                //var password = AL.MD5(phoneNumber+username.toLowerCase()+phonePwd);
                console.dir("真实密码 : "+user.get('phonePwd'));

                if (user.get('phonePwd')==AL.MD5(phonePwd).toLowerCase())
                {
                    AL.done(res,{username:user.get('username').toUpperCase(),password:user.get('username').toLowerCase()});
                }
                else
                {
                    AL.done(res,null,AL.error(777255,"密码错误"));
                }
                //AL.done(res,{username:username,password:password});
            }
            else
            {
                AL.done(res,null,AL.error(777245,"没有注册"));
            }

        },function(error){
            AL.done(res,null,error);
        });

    };

    var newGetLoginInfo = function(req, res) {

        var phoneNumber = req.body.phoneNumber;
        var phonePwd = req.body.phonePwd;

        var userQ = new AV.Query(AL.config.User);
        userQ.equalTo('phoneNumber',phoneNumber);
        userQ.limit(1);
        userQ.find().then(function(objects){
            if (objects.length>0)
            {
                var user = objects[0];
                var username = user.get('username');
                var password = encryption(phoneNumber+username.toLowerCase()+phonePwd);;
                //if (user.get('phonePwd')==AL.MD5(phonePwd).toUpperCase())
                //{
                //    AL.done(res,{username:user.get('username').toUpperCase(),password:user.get('username').toLowerCase()});
                //}
                //else
                //{
                //    AL.done(res,null,AL.error(777255,"密码错误"));
                //}
                AL.done(res,{username:username,password:password});
            }
            else
            {
                AL.done(res,null,AL.error(777245,"没有注册"));
            }

        },function(error){
            AL.done(res,null,error);
        });

    };

    // 手机号登陆
    app.all('/user/login/getLoginInfo', getLoginInfo);

    var signUp = function(req, res) {

        //var guid = AL.guid();

        console.dir("signUp");

        var username = AL.guid().toUpperCase();
        var phoneNumber = req.param("phoneNumber");
        var phonePwd = req.param("phonePwd");

        var password = username.toLowerCase();

        //console.dir(username);
        //console.dir(password);
        //console.dir(phoneNumber);
        //console.dir(phonePwd);

        if (!phoneNumber || !phonePwd || phonePwd.length==0 || phoneNumber.length==0)
        {
            return AL.done(res,false,AL.error(777123,"参数错误"));
        }

        var userQ = new AV.Query(AL.config.User);
        userQ.equalTo('phoneNumber',phoneNumber);
        userQ.limit(1);
        userQ.find().then(function(objects){

            //console.dir(objects.length);

            if (objects.length==0)
            {
                var user = new AV.User();
                user.set('username',username);
                user.set('password',password);
                user.set('phoneNumber',phoneNumber);
                user.set('phonePwd',AL.MD5(phonePwd).toLowerCase());
                user.set('userType',AL.config.ALUserType.general);
                user.signUp(null, {
                    success: function(user) {

                        //54c5f5e5e4b068d1ee3c8f54
                        AL.done(res,user.id);
                    },
                    error: function(user, error) {

                        AL.done(res,null,error);
                    }
                });
            }
            else
            {
                AL.done(res,null,AL.error(777232,"已经注册"));
            }

        },function(error){
            AL.done(res,null,error);
        });
    };

    var newSignUp = function(req, res) {

        //var guid = AL.guid();

        var username = AL.guid().toUpperCase();
        var phoneNumber = req.body.phoneNumber;
        var phonePwd = req.body.phonePwd;

        var password = encryption(phoneNumber+username.toLowerCase()+phonePwd);

        var userQ = new AV.Query(AL.config.User);
        userQ.equalTo('phoneNumber',phoneNumber);
        userQ.limit(1);
        userQ.find().then(function(objects){
            if (objects.length==0)
            {
                var user = new AV.User();
                user.set('username',username);
                user.set('password',password);
                user.set('phoneNumber',phoneNumber);
                //user.set('phonePwd',AL.MD5(phoneNumber+phonePwd).toUpperCase());
                user.userType = AL.config.ALUserType.general;
                user.signUp(null, {
                    success: function(user) {

                        AL.done(res,user.id);
                    },
                    error: function(user, error) {

                        AL.done(res,null,error);
                    }
                });
            }
            else
            {
                AL.done(res,null,AL.error(777232,"已经注册"));
            }

        },function(error){
            AL.done(res,null,error);
        });

    };

    // 手机号注册
    app.all('/user/login/signUp?', signUp);

    var resetPassword =  function(req, res) {

        console.dir("resetPassword");

        var phoneNumber = req.body.phoneNumber;
        var phonePwd = req.body.phonePwd;

        console.dir("重置密码 : "+AL.MD5(phonePwd).toLowerCase());

        if (phoneNumber && phonePwd)
        {
            var userQ = new AV.Query(AL.config.User);
            userQ.equalTo('phoneNumber',phoneNumber);
            userQ.limit(1);
            userQ.find().then(function(objects) {
                if (objects.length>0)
                {
                    var user = objects[0];
                    user.set('phonePwd',AL.MD5(phonePwd).toLowerCase());
                    user.save().then(function(user){

                        AL.done(res,true);

                    },function(error){

                        AL.done(res,false,error);
                    });
                }
                else
                {
                    AL.done(res,false,AL.error(777245,"没有注册"));
                }

            },function(error){
                AL.done(res,false,error);
            });
        }
        else
        {
            AL.done(res,false,AL.error(777124,"参数错误"));
        }
    };

    var newResetPassword =  function(req, res) {

        var phoneNumber = req.body.phoneNumber;
        var phonePwd = req.body.phonePwd;

        if (phoneNumber && phonePwd)
        {
            var userQ = new AV.Query(AL.config.User);
            userQ.equalTo('phoneNumber',phoneNumber);
            userQ.limit(1);
            userQ.find().then(function(objects) {
                if (objects.length>0)
                {
                    var user = objects[0];
                    var password = encryption(phoneNumber+user.get('username').toLowerCase()+phonePwd);
                    user.set('phonePwd',AL.MD5(password).toLowerCase());
                    user.save().then(function(user){

                        AL.done(res,user.id);

                    },function(error){

                        AL.done(res,null,error);
                    });
                }
                else
                {
                    AL.done(res,null,AL.error(777245,"没有注册"));
                }

            },function(error){
                AL.done(res,null,error);
            });
        }
        else
        {
            AL.done(res,null,AL.error(777123,"参数错误"));
        }
    };

    app.all('/user/resetPassword/phoneNumber', resetPassword);

    // 修改密码
    app.all('/user/login/resetPassword/phoneNumber', resetPassword);

    app.all('/user/demo/:par1?', function(req, res){
        var par1 = req.param("par1");
        var par2 = req.param("par2");
        var test = req.param("test");
        //test = req.body.test;
        console.dir(par1);
        console.dir(par2);
        console.dir(req.body);
    });

    var updateNickname = function(request, res){

        //var nickname = request.params.nickname;
        //var user = request.user;

        var nickname = request.param("nickname");
        var userId = request.param("userId");

        console.dir(nickname);
        console.dir(userId);

        if (!nickname || !userId)
        {
            return AL.done(res,false,AL.error(777111,"参数错误"));
        }

        var user = AL.object('_User',userId);

        user.set('nickname',nickname);
        user.set('nicknameLowerCase',nickname.toLocaleLowerCase());
        user.save().then(function(user){
            return AL.done(res,true);
        },function(error){
            return AL.done(res,false,error);
        });

    };

    AV.Cloud.define("updateNickname", updateNickname);

    app.all('/user/nickname/update', updateNickname);

    // 查找用户 昵称
    app.all('/user/search/nickname/all', function(req, res) {

        var nicknames = request.body.nicknames;
        var notContainedUserIds = request.body.notContainedUserIds;
        var limit = parseInt(request.body.limit);

        var regex = ".*"+nicknames.join(".*")+".*";
        if (!__production) console.log(regex);

        var searchUserWithNickname = function (nicknameRegex,limit,notContainedUserIds,tryTimes,done){

            if (tryTimes<=0)
            {
                done(false,AL.error(777211,"请求次数超过限制"));
                return;
            }

            var userQ = new AV.Query(AL.config.User);
            if (limit) userQ.limit(limit);
            if (notContainedUserIds && notContainedUserIds.length) userQ.notContainedIn('objectId',notContainedUserIds);
            userQ.matches("nicknameLowerCase",nicknameRegex);
            AL.findQueryWithoutData(userQ, null, function(results,error){

                if (error)
                {
                    searchUserWithNickname(nicknameRegex,limit,notContainedUserIds,--tryTimes,done);
                }
                else
                {
                    done(results,null);
                }
            });
        };

        searchUserWithNickname(regex.toLocaleLowerCase(),limit,notContainedUserIds,10,function(userIds,error){

            if (!error)
            {
                AL.done(res,userIds);
            }
            else
            {
                AL.done(res,null,error);
            }
        });
    });

    // 查找用户 昵称 我的关注
    app.all('/user/search/nickname/userFollow', function(req, res) {

        var nicknames = request.body.nicknames;
        var notContainedUserIds = request.body.notContainedUserIds;
        var limit = parseInt(request.body.limit);
        var userId = request.body.userId;

        var searchUserByMyFollowWithNickname = function (user,nicknameRegex,limit,notContainedUserIds,tryTimes,done){

            if (tryTimes<=0)
            {
                done(false,AL.error(777211,"请求次数超过限制"));
                return;
            }

            var userQ = new AV.Query(AL.config.User);
            if (limit>0 && limit!="NaN") userQ.limit(limit);
            if (notContainedUserIds && notContainedUserIds.length) userQ.notContainedIn('objectId',notContainedUserIds);
            userQ.matches("nicknameLowerCase",nicknameRegex);

            var userRelationQ = new AV.Query(AL.config.UserRelation);
            userRelationQ.equalTo('fromUser',user);
            userRelationQ.matchesQuery('toUser',userQ);
            AL.findQueryWithoutData(userRelationQ,"toUser", function(results,error){

                if (error)
                {
                    searchUserByMyFollowWithNickname(nicknameRegex,limit,notContainedUserIds,--tryTimes,done);
                }
                else
                {
                    done(results,null);
                }
            });
        };

        var regex = ".*"+nicknames.join(".*")+".*";
        if (!__production) console.log(regex);

        searchUserByMyFollowWithNickname(AV.Object.createWithoutData('_User',userId),regex.toLocaleLowerCase(),limit,notContainedUserIds,10,function(userIds,error){

            if (!error)
            {
                //res.success(userIds);
                AL.done(res,userIds);
            }
            else
            {
//                res.error(ALERROR(error.code,error.message));
                AL.done(res,null,error);
            }
        });
    });

    app.all('/user/money',function(req,res){

        var userId = req.param("userId");

        if (AL.isEmpty(userId))
        {
            return AL.done(res,false,AL.error(777110,"参数错误"));
        }

        var user = AL.object('_User',userId);
        user.fetch().then(function(user){

            console.dir(user.get('money'));

            if (user && user.get('money'))
            {
                AL.done(res,user.get('money'));
            }
            else
            {
                AL.done(res,0);
            }

        },function(error){
            AL.done(res,0,error);
        });

    });

    app.all('/user/demo',function(req,res){

    });

};

