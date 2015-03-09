

/****************
通用函数
*****************/

var
    moment = require('moment-timezone')
    ;

var AL = require('cloud/lib/ALCommonUtil').AL();
var StatementAPI = require('cloud/lib/ALUserStatementAPI').StatementAPI();
var wechatDelivery = require('cloud/routes/wechatDelivery');

exports.route = function(app) {

    //54c620dfe4b068d1ee40ab15

    //查看全部账单
    app.all('/statement/search?', function (req, res) {

        var userId = req.param("userId");
        var withinData = req.param('withinData');

        if (!userId)
        {
            return AL.done(res,null,AL.error(777101,"参数错误"));
        }

        withinData = withinData?parseInt(withinData):null;

        var statementInfo = {
            userId:userId,
            withinData:withinData
        };

        StatementAPI.searchStatement(statementInfo,function(statements, error){
             AL.done(res,statements,error);
        });

        //var stateQ = new AV.Query(AL.config.UserStatement);
        //stateQ.equalTo('user',AL.object('_User',userId));
        //stateQ.include('order');
        //stateQ.include('userTradeAccount');
        //
        //stateQ.descending('createdAt');
        //stateQ.notEqualTo('isDeleted',true);
        //
        //if (withinData)
        //{
        //    AL.findQuery(stateQ,null,function(objects,error){
        //        AL.done(res,objects,error);
        //    });
        //}
        //else
        //{
        //    AL.findQueryWithoutData(stateQ,null,function(ids, error){
        //        AL.done(res,ids,error);
        //    });
        //}
    });

    //增加账单
    app.all('/statement/add?', function(req, res){

        var userId = req.param("userId");
        var type = req.param('type');

        //生成type=1
        var orderId = req.param("orderId");

        //生成type=2
        var money = req.param('money');

        if (!userId)
        {
            return AL.done(res,null,AL.error(777101,"参数错误"));
        }

        try{

            type = type?parseInt(type):null;
            money = money?parseInt(money):null;

        } catch(err) {
            return AL.done(res,null,err);
        }

        if (money<=0)
        {
            return AL.done(res,null,AL.error(777104,"参数错误"));
        }

        var statementInfo = {
            userId:userId
        };

        switch (type){
            //抢单配送
            case AL.config.ALUserStatementType.delivery:{
                return AL.done(res,null,AL.error(777321,"不支持创建这种类似账单"));
            }break;
            //提现、支出
            case AL.config.ALUserStatementType.expenditure:{

                var userTradeAccountId = req.param('userTradeAccountId');

                if (!userTradeAccountId)
                {
                    return AL.done(res,null,AL.error(777105,"参数错误"));
                }

                statementInfo.name = "提现";
                statementInfo.userTradeAccountId = userTradeAccountId;
                statementInfo.money = money;
                statementInfo.type = type;
                statementInfo.state = AL.config.ALUserStatementState.underway;

            }break;
            //系统奖励
            case AL.config.ALUserStatementType.systemReward:{
                return AL.done(res,null,AL.error(777322,"不支持创建这种类似账单"));
            }break;
            //系统惩罚
            case AL.config.ALUserStatementType.systemPunish:{
                return AL.done(res,null,AL.error(777323,"不支持创建这种类似账单"));
            }break;
            default :{
                return AL.done(res,null,AL.error(777102,"参数错误"));
            }
        }

         StatementAPI.addStatement(statementInfo,function(statementId,error){
               AL.done(res,statementId,error);
         });
    });



};
