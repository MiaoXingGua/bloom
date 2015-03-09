/*  This work is licensed under Creative Commons GNU LGPL License.

 License: http://creativecommons.org/licenses/LGPL/2.1/
 Version: 0.9
 Author:  Stefan Goessner/2006
 Web:     http://goessner.net/
 */
/*
 *  obj json对象
 *  tab 缩进方式（为输出漂亮的格式）null或""为默认格式
 *  return XML String
 */

var ALParse = function () {

    if (!(this instanceof ALParse)) {

        return new ALParse();
    }

};


ALParse.prototype.json2xml =  function (obj, tab) {
    var toXml = function(v, name, ind) {
        var xml = "";
        if (v instanceof Array) {
            for (var i=0, n=v.length; i<n; i++)
                xml += ind + toXml(v[i], name, ind+"\t") + "\n";
        }
        else if (typeof(v) == "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            for (var m in v) {
                if (m.charAt(0) == "@")
                    xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                else
                    hasChild = true;
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
                for (var m in v) {
                    if (m == "#text")
                        xml += v[m];
                    else if (m == "#cdata")
                        xml += "<![CDATA[" + v[m] + "]]>";
                    else if (m.charAt(0) != "@")
                        xml += toXml(v[m], m, ind+"\t");
                }
                xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
            }
        }
        else {
            xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
        }
        return xml;
    }, xml="";
    for (var m in obj)
        xml += toXml(obj[m], m, "");
    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
};

ALParse.prototype.xml2json = function (xml, done) {

    var parseString = require('xml2js').parseString;
    parseString(xml, { explicitArray : false, ignoreAttrs : true }, function (err, result) {
        done(result,err);
    });

};

module.exports = {
    ALParse : ALParse
};