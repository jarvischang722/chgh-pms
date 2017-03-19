/**
 * Created by Eason on 2016/12/05
 * 時段
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var timepPeriodService = require("../services/timepPeriodService");
var tools = require("../utils/commonTools");
var validate = require("validate.js");
var moment = require("moment");

//data validate define
var constraints = {
    class_name: {
        presence: {
            message: "時段名稱不可為空"
        }
    }
};

/**
 * 取得所有時段
 * **/
exports.getAllTimePeriod = function(req, res){
    timepPeriodService.getAllTimePeriod(function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 新增時段
 * **/
exports.insertTimePeriod = function(req, res){
    var data = req.body

    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    timepPeriodService.insertTimePeriod(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 刪除時段
 * **/
exports.deleteTimePeriod = function(req, res){
    timepPeriodService.deleteTimePeriod(req.body.periods,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 修改時段
 * **/
exports.updateTimePeriod = function(req, res){
    var data = req.body

    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    timepPeriodService.updateTimePeriod(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};