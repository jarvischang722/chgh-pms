/**
 * Created by Eason on 2016/12/05
 * 群組
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var firemissionService = require("../services/firemissionService");
var tools = require("../utils/commonTools");
var validate = require("validate.js");
var moment = require("moment");

//data validate define
var constraints = {
    group_name: {
        presence: {
            message: "群組名稱不可為空"
        }
    }
    ,group_sname: {
        presence: {
            message: "群組縮寫不可為空"
        }
    }
};

/**
 * 取得所有群組
 * **/
exports.getAllFireMission = function(req, res){
    console.log("===req===");
    console.log(req);
    var type = req.body.type;
    firemissionService.getAllFireMission(type,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 新增群組
 * **/
exports.insertFireMission = function(req, res){
    var data = req.body

    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    firemissionService.insertFireMission(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 刪除群組
 * **/
exports.deleteFireMission = function(req, res){
    firemissionService.deleteFireMission(req.body.groups,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 修改群組
 * **/
exports.updateFireMission = function(req, res){
    var data = req.body

    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    firemissionService.updateFireMission(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};