
var AL = require('cloud/lib/ALCommonUtil').AL();

var StatementAPI = function () {

    //并不是单例 这种写法只是 每次可以直接调用API()来创建API对象
    if (!(this instanceof StatementAPI)) {
        return new StatementAPI();
    }

    /*
    * userId,orderId,money,type,state,name,userTradeAccountId
    * */
    this.addStatement = function(statementInfo,done){

        var userId = statementInfo.userId;

        var name = statementInfo.name;
        var orderId = statementInfo.orderId;
        var userTradeAccountId = statementInfo.userTradeAccountId;

        var price = statementInfo.money;
        var type = statementInfo.type;
        var state = statementInfo.state;

        if (!userId || !name || !orderId || !userTradeAccountId || !money || !type || !state)
        {
            return done?done(null,AL.error(777101,"参数错误")):null;
        }

        try{

            money = parseInt(money);
            type = parseInt(type);
            state = parseInt(state);

        }catch(err){
            return done(null,err);
        }

        var statement = new AL.config.UserStatement();
        statement.set('user',AL.object('_User',userId));
        statement.set('money',money);
        statement.set('type',type);
        statement.set('state',state);
        statement.set('name',name);
        if (orderId) statement.set('order',AL.object('CommodityOrder',orderId));
        if (userTradeAccountId) statement.set('userTradeAccount',AL.object('UserTradeAccount',userTradeAccountId));

        statement.set('statementNO',AL.getDateFormat(null,"YYYYMMDDHHmmss")+AL.getRandomNumberWithDigit(6));
        AL.save(statement,function(obj,error){
            done(obj.id,error);
        });
    };

    /*
     * userId statementId
     * */
    this.deleteStatement = function(statementInfo,done){

        var userId = statementInfo.userId;
        var statementId = statementInfo.statementId;

        var statementQ = new AV.Query(AL.config.UserStatement);
        statementQ.equalTo('objectId',statementId);
        statementQ.equalTo('user',AL.object('_User',userId));
        AL.countQuery(statementQ,function(number,error){

            if (error)
            {
                return done(null,error);
            }
            else if (number==0)
            {
                return done(null,AL.error(777211,"权限异常，请联系客服。"));
            }
            else
            {
                var statement = AL.object('UserStatement',statementId);
                statement.set('isDeleted',false);
                AL.save(statement,function(obj,error){
                    done(obj.id,error);
                });
            }

        });
    };

    /*
     * userId,type,state,name,orderId,statementNO,userTradeAccountId,mixMoney,maxMoney
     * */
    this.searchStatement = function(statementInfo,done){

        var userId = statementInfo.userId;

        if (!userId)
        {
            return done?done(null,AL.error(777101,"参数错误")):null;
        }

        var name = statementInfo.name;
        var orderId = statementInfo.orderId;
        var userTradeAccountId = statementInfo.userTradeAccountId;

        var statementNO = statementInfo.statementNO;
        var mixMoney = statementInfo.mixMoney;
        var maxMoney = statementInfo.maxMoney;
        var type = statementInfo.type;
        var state = statementInfo.state;

        var withinData = statementInfo.withinData;

        mixMoney = mixMoney?parseInt(mixMoney):0;
        maxMoney = maxMoney?parseInt(maxMoney):0;
        type = type?parseInt(type):0;
        state = state?parseInt(state):0;
        withinData = withinData?parseInt(withinData):0;


        var statementQ = new AV.Query(AL.config.UserStatement);
        statementQ.equalTo('user', AL.object('_User',userId));
        if (name)
        {
            statementQ.matches('name',name);
        }
        if (orderId)
        {
            statementQ.equalTo('order',AL.object('CommodityOrder',orderId));
        }
        if (userTradeAccountId)
        {
            statementQ.equalTo('order',AL.object('UserTradeAccount',userTradeAccountId));
        }
        if (statementNO)
        {
            statementQ.matches('statementNO',statementNO);
        }
        // BUG 没有绝对值
        if (mixMoney)
        {
            statementQ.greaterThanOrEqualTo('money',mixMoney);
        }
        if (maxMoney)
        {
            statementQ.lessThanOrEqualTo('money',maxMoney);
        }
        if (type)
        {
            statementQ.equalTo('type',type);
        }
        if (state)
        {
            statementQ.equalTo('state',state);
        }

        if (withinData)
        {
            statementQ.include('order');
            statementQ.include('userTradeAccount');

            AL.findQuery(statementQ,null,done);
        }
        else
        {
            AL.findQueryWithoutData(statementQ,null,done);
        }

    };

    /*
     * userId statementId
     * */
    this.updateStatement = function(statementInfo,done){

        var userId = statementInfo.userId;
        var statementId = statementInfo.statementId;

        var statementQ = new AV.Query(AL.config.UserStatement);
        statementQ.equalTo('objectId',statementId);
        statementQ.equalTo('user',AL.object('_User',userId));
        AL.countQuery(statementQ,function(number,error){

            if (error)
            {
                return done(null,error);
            }
            else if (number==0)
            {
                return done(null,AL.error(777211,"权限异常，请联系客服。"));
            }
            else
            {
                var statement = AL.object('UserStatement',statementId);

                var type = statementInfo.type;
                var state = statementInfo.state;

                if (type)
                {
                    statementQ.equalTo('type',type);
                }
                if (state)
                {
                    statementQ.equalTo('state',state);
                }

                AL.save(statement,function(obj,error){
                    done(obj.id,error);
                });
            }

        });
    }

};

StatementAPI.prototype.addStatement = this.addStatement;
StatementAPI.prototype.deleteStatement = this.deleteStatement;
StatementAPI.prototype.searchStatement = this.searchStatement;
StatementAPI.prototype.updateStatement = this.updateStatement;


module.exports = {
    StatementAPI : StatementAPI
};