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
    Photo = AV.Object.extend('Photo'),
    ShowPhoto = AV.Object.extend('ShowPhoto'),
    ShowPhotoComment = AV.Object.extend('ShowPhotoComment'),
    ShowPhotoRelation = AV.Object.extend('ShowPhotoRelation'),
    Relation = AV.Object.extend('Relation'),
    Coupon = AV.Object.extend('Coupon'),
    CouponOfUser = AV.Object.extend('CouponOfUser'),
    CommodityCart = AV.Object.extend('CommodityCart'),
    Commodity = AV.Object.extend('Commodity'),
    CommodityOrder = AV.Object.extend('CommodityOrder')
    ;

var AL = require('cloud/lib/ALCommonUtil').AL();

AV._initialize('g405gbttqiz691vvrnmeyua4c3444k6vudaiw5h8dteut3qc', 'w6nd1xgnur9yppvc5h7kdt8knit8sz1sdt8o55irx3s3uycy', '3wdbejwyy36sfa1lytoorhzaengunxuqnv04yzixn6jl1t8d');
AV.Cloud.useMasterKey();

exports.route = function(app) {

    var showPhotoDict = function (showPhotoId,done){

        if (!showPhotoId)
        {
            done(null,AL.error(777123,"参数错误"));
        }

        var calculateDate = function (date){

            var diff = moment(new Date()).diff(moment(date));

            if (diff < 0)
            {
                diff = moment(new Date()).diff(moment(date).add('hours',-8));
            }

            diff /= 1000;

            console.log(diff);

            if (diff<60)
            {
                return parseInt(diff)+"秒前";
            }
            else if (diff>=60 && diff<3600)
            {
                return parseInt(diff/60)+"分钟前";
            }
            else if (diff>=3600 && diff<86400)
            {
                return parseInt(diff/60/60)+"小时前";
            }
            else if (diff>=86400 && diff<432000)
            {
                return parseInt(diff/60/60/24)+"天前";
            }
            else
            {
                return moment(date).format("YYYY-MM-DD");
            }

            return '未知';
        };

        var userDictFromUserObject = function (user){
            var userDict = {};
            userDict['objectId'] = user.id;
            if (user.get('gender'))
            {
                userDict['gender'] = true;
            }
            else
            {
                userDict['gender'] = false;
            }
            userDict['nickname'] = user.get('nickname');
            userDict['headViewURL'] = user.get('headViewURL');
            return userDict;
        };

        var userDictsFromUserObjects = function (users){

            console.log("收藏人数 : "+users.length);
            var userDicts = [];

            for (var userKey in users)
            {
                userDicts.push(userDictFromUserObject(users[userKey]));
            }

            return userDicts;
        };

        var commentDictFromCommentObject = function (comment){

            var commentDict = {};
            commentDict['objectId'] = comment.id;
            commentDict['user'] = userDictFromUserObject(comment.get('user'));
            commentDict['createdAt'] = calculateDate(comment.createdAt);//comment.get('createdAt'); bug
            var content = comment.get('content');
            if (content)
            {
                commentDict.content = {};
                commentDict.content.text = content.url;

            }
            else
            {
                commentDict.content = {'text':'我什么都没说'};
            }

            return commentDict;
        };

        var commentDictsFromCommentObjects = function (comments){

            var commentDicts = [];

            for (var commentKey in comments)
            {
                commentDicts.push(commentDictFromCommentObject(comments[commentKey]));
            }

            return commentDicts;
        };

        var resultDic = {};
        resultDic['objectId'] = showPhotoId;

        var showPhotoQ = new AV.Query(ShowPhoto);
        showPhotoQ.equalTo('objectId',showPhotoId);

        showPhotoQ.include('user');
        showPhotoQ.include('photo');

        showPhotoQ.first().then(function(showPhoto) {

            console.log(11111);
            if (showPhoto)
            {
                var photo = showPhoto.get('photo');

                resultDic['originalURL'] = photo.get('url');
                //resultDic['thumbnailURL'] = showPhoto.photo.get('thumbnailURL');

                resultDic['width'] = photo.get('width');
                resultDic['height'] = photo.get('height');
                resultDic['createdAt'] = calculateDate(showPhoto.createdAt);

                var commentsCount = showPhoto.get('numberOfComments');
                resultDic['commentsCount'] = commentsCount ? commentsCount : 0;

                var faviconsCount = showPhoto.get('numberOfFavicons');
                resultDic['faviconsCount'] = faviconsCount ? faviconsCount : 0;

                var introduction = showPhoto.get('introduction');
                var contentDict = {};
                contentDict['text'] = introduction ? introduction : "";
                resultDic['content'] = contentDict;

                var user = showPhoto.get('user');
                resultDic['user'] = user ? userDictFromUserObject(user) : {};


                //tags
                resultDic.tags = [];

                var tags = showPhoto.get('tags');


                for (var i in tags)
                {

                    resultDic.tags[i] = {};

                    var tag = tags[i];
                    //console.dir(tag.point);

                    resultDic.tags[i].direction = tag.isLeft?"rightTag":"leftTag";
                    resultDic.tags[i].title = tag.title;
                    resultDic.tags[i].point = tag.point;
                }


                //resultDic['tags'] = tagList;

                console.dir(resultDic);

                // 收藏的人
                var relationQ = new AV.Query(ShowPhotoRelation);
                relationQ.equalTo('showPhoto', AV.Object.createWithoutData("ShowPhoto", showPhotoId));
                relationQ.descending('createdAt');
                relationQ.notContainedIn('isDeleted',[1,true]);
                relationQ.select('user');
                relationQ.include('user');
                relationQ.limit(8);
                return relationQ.find();
            }

        },function(error){

            done(null,AL.error(error.code,"查询收藏列表失败 : "+error.message));

            // 收藏人
        }).then(function(relations){

            console.log(2222);
            if (relations.length > 0)
            {
                var faviconUsers = [];
                for (var i in relations)
                {
                    faviconUsers.push(relations[i].get('user'));
                }
                resultDic['faviconUsers'] = userDictsFromUserObjects(faviconUsers);
            }
            else
            {
                resultDic['faviconUsers'] = [];
            }

            var commentQ = new AV.Query(ShowPhotoComment);

            commentQ.equalTo('showPhoto',AV.Object.createWithoutData("ShowPhoto", showPhotoId));
            commentQ.include(['user']);

            return commentQ.find();

        }, function(error) {

            done(null,AL.error(error.code,"查询收藏列表失败 : "+error.message));

            // 评论
        }).then(function(comments){


            resultDic['comments'] = commentDictsFromCommentObjects(comments);
            console.dir(resultDic);
            done(resultDic,null);

        }, function(error) {

            done(null,AL.error(error.code,"查询评论列表失败 : "+error.message));
        });
    };

    // showPhoto
    app.all("/showPhoto/:showPhotoId?", function(req, res) {

        var showPhotoId = req.params.showPhotoId;

        if (!showPhotoId)
        {
            res.end("404");
            return;
        }

        showPhotoDict(showPhotoId,function(photoDict,error){

            console.dir(photoDict);
            if (photoDict && !error)
            {
                res.render('cloud/views/showPhoto',{ photoDict : photoDict});
            }
            else
            {
                console.dir(error);
                res.render('500',500)
            }
        });


    });


    app.all("/showPhoto/get/:showPhotoId?", function(req, res) {

        var showPhotoId = req.params.showPhotoId;

        if (!showPhotoId)
        {
            AL.done(res, null, AL.error(777123,"参数错误"));
            return;
        }

        AL.done(res, AL.domain+"showPhoto/"+showPhotoId, null);
    });

    AV.Cloud.beforeSave("Photo", function(request, response) {

        var photo = request.object;

        var width = photo.get('width');
        var height = photo.get('height');
        var URL = photo.get('url');

        if (!URL)
        {
            response.error();
        }
         //http://ac-g405gbtt.clouddn.com/4TruCAi8layBtO3kEXGy6zoBlt52iUfoV1lXGoYP.jpg
        if (!width || !height) {
            AL.httpGetRequest(URL+"?imageMogr2/auto-orient|imageInfo",function(object,error){

                if (error)
                {
                    return response.error();
                }

                console.dir("imageInfo : "+JSON.stringify(object));

                var width = parseFloat(object.width);
                var height = parseFloat(object.height);

                if (!width || !height)
                {
                    return response.error();
                }

                photo.set('width',width);
                photo.set('height',height);
                response.success();
            });
        }
        else{
            response.success();
        }
    });
};

