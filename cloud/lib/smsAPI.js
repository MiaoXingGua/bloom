
exports.sendSMS = function (phoneNumbers,template,params,done){

    if (AV._.isArray(phoneNumbers) && phoneNumbers.length>0 && !AV._.isEmpty(params))
    {
        if (!__production) console.log("进入");
        for (var i in phoneNumbers)
        {
            params.mobilePhoneNumber = String(phoneNumbers[i]);
            if (params.mobilePhoneNumber == "15810513348")
            {
                continue;
            };

            params.template = template;

            console.dir(params);

            AV.Cloud.requestSmsCode(params).then(function(){
                if (!__production) console.dir("sms发送成功");
                done?done(true,null):null;
            }, function(err){
                if (!__production) console.dir("sms发送失败 : "+err.message);
                done?done(false,err):null;
            });
        }
    }
};

/*
 短信模块
 订单支付成功 : {{ orderId }}
 用户 {{ userId }} 使用 {{ payMethod }} 支付金额 : {{ totalPrice }} 。
 订单详情:
 订单号 : {{ orderNO }}
 支付号 : {{ tradeNO }}
 时间 : {{ date }}
 我们已收到您的货款，开始为您打包商品，请耐心等待: )
 如有问题请致电110或直接在微信留言，Bloom将第一时间为您服务!
 */
