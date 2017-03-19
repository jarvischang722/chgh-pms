/**
 * Created by Eason on 2016/10/21.
 * 跑馬燈
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var marqueeService = require("../services/marqueeService");
var tools = require("../utils/commonTools");
var validate = require("validate.js");
var moment = require("moment");

//data validate define
var constraints = {
    content: {
        presence: {
            message: "內容不可為空"
        }
    },
    font_color_hex: {
        presence: {
            message: "文字顏色不可為空"
        }
    },
    ope_range: {
        presence: {
            message: "日期區間不可為空"
        }
    }
};

/**
 * 首頁
 * **/
exports.index = function(req, res){

    res.render("Marquee/index");
};

/**
 * 獲取有效時間內跑馬燈
 * **/
exports.getMarquee = function(req, res){
    marqueeService.getCurrentMarquee(function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 取得所有跑馬燈
 * **/
exports.getAllMarquee = function(req, res){
    marqueeService.getAllMarquee(function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 新增跑馬燈
 * **/
exports.insertMarquee = function(req, res){
    var data = req.body

    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    marqueeService.insertMarquee(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 刪除跑馬燈
 * **/
exports.deleteMarquee = function(req, res){
    marqueeService.deleteMarquee(req.body.marquees,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 修改跑馬燈
 * **/
exports.updateMarquee = function(req, res){
    var data = req.body

    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    marqueeService.updateMarquee(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};