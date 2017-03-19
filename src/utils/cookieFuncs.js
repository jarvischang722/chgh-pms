/**
 * Created by Jun Chang on 2016/12/25.
 * cookie 工具
 */

var http = require('http');
var moment = require('moment');
var _ = require('underscore');
var async = require('async');
var cookieParser = require('cookie-parser');
var signature = require('cookie-signature');
var cookie = require('cookie');
var commonTools = require('./commonTools');


/**
 * 設定 Cookie
 * @param res
 * @param cName {String} :　cookie名稱
 * @param cValue {String,Object,Array} : cookie值
 */
exports.setCookie = function (res, cName, cValue, otherParams) {
    //有效時間保存  1*24*60*60*1000 (天 * 時 * 分 * 秒  * 毫秒)
    var maxAge = 30 * 60 * 1000;
    var options = {
        maxAge: maxAge
    };


    options = commonTools.mergeObject(options, otherParams);
    res.setHeader('Set-Cookie', cookie.serialize(cName, cValue, options));

};


/**
 * 清空User Cookie
 * **/
exports.clearUserCookie = function (req, res) {
    //清空入住人和購買人資料的cookie
    res.clearCookie("user");
};


/**
 * 更新req的cookie
 * @param req
 */
exports.updateReqCookie = function (req) {
    try{

        var cookies = req.headers.cookie;
        req.cookies = Object.create(null);      //create object for coockie
        req.cookies = cookie.parse(cookies);    //解析cookie
        req.cookies = this.JSONCookies(req.cookies);    // 將cookie 轉為Object

    }catch(e){

        console.log("add cookie failed");

    }

};


/**
 * cookie轉為JSON型態
 * @param obj
 * @return {*}
 * @constructor
 */
exports.JSONCookies = function (obj) {
    var cookies = Object.keys(obj);    //取obj对象的property
    var key;
    var val;

    //循环判断并解析
    for (var i = 0; i < cookies.length; i++) {
        key = cookies[i];
        val = exports.JSONCookie(obj[key]);

        //如果是JSON字符序列则保存
        if (val) {
            obj[key] = val;
        }
    }

    return obj;
};

/**
 * 解析JSON字符序列
 * @param str
 * @constructor
 */
exports.JSONCookie = function (str) {
    if (!str || str.substr(0, 2) !== 'j:') return; //判断是否为JSON字符序列，如果不是返回undefined

    try {
        return JSON.parse(str.slice(2));    //解析JSON字符序列
    } catch (err) {
        return {};
    }
};


/**
 * 取得有Singed的coockie
 * @param obj
 * @param secret
 * @return {Object}
 */
exports.signedCookies = function (obj, secret) {
    var cookies = Object.keys(obj);    //获取obj对象的property
    var dec;
    var key;
    var ret = Object.create(null);  //创建返回对象
    var val;

    for (var i = 0; i < cookies.length; i++) {
        key = cookies[i];
        val = obj[key];
        dec = exports.signedCookie(val, secret);

        //判断是否是去掉签名后的value，如果是保存该值到ret中同时删除obj中的相应property
        if (val !== dec) {
            ret[key] = dec;
            delete obj[key];
        }
    }

    return ret;
};

/**
 * 判断是否加了簽名Signed，如果添加了則去掉Singed，否則返回原字串
 * @param str
 * @param secret
 * @return {String }
 */
exports.signedCookie = function (str, secret) {

    return str.substr(0, 2) === 's:'
        ? signature.unsign(str.slice(2), secret)
        : str;
};