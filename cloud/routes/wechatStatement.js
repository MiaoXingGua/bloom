
var AL = require('cloud/lib/ALCommonUtil').AL();

var wechatAppID = AL.config.wechatOfBloomAshleyConfig.appId;
var wechatAppSecret = AL.config.wechatOfBloomAshleyConfig.appSecret;
var wechatToken = AL.config.wechatOfBloomAshleyConfig.token;
var encodinAESKey = AL.config.wechatOfBloomAshleyConfig.encodingAESKey;

var API = require('cloud/lib/wechatAPI').API(wechatAppID, wechatAppSecret, wechatToken);


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

exports.route = function(app) {


    // 查看我的账单
    app.all('/wechat/statement/get?', function(req, res){

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
                        res.render("cloud/views/statementList",{userId:user.id});

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

};


