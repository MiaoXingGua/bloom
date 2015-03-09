
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



var AL = require('cloud/lib/ALCommonUtil').AL();

exports.route = function(app) {

    AV.Cloud.beforeSave("Photo", function(request, response) {

        var photo = request.object;

        var width = photo.get('width');
        var height = photo.get('height');
        var URL = photo.get('url');

        if (!URL)
        {
            response.error();
        }

        if (!width || !height) {
            AL.httpGetRequest(URL+"?imageMogr2/auto-orient|imageInfo",function(object,error){

                if (error)
                {
                    return response.error();
                }

                var width = parseFloat(object.get('width'));
                var height = parseFloat(object.get('height'));

                if (!width || !height)
                {
                    return response.error();
                }

                photo.set('width',width);
                photo.set('height',height);
                response.success();
            });
        }
    });
};