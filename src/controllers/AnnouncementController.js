/**
 * Created by Eason on 2016/10/21.
 * 病房公告
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var announcementService = require("../services/announcementService");
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
    ope_range: {
        presence: {
            message: "日期區間不可為空"
        }
    }
};

/**
 * 取得病房公告
 * **/
exports.getAllAnnouncement = function(req, res){
    var ward_zone_id = req.session.user.ward_zone_id;
    announcementService.getAllAnnouncement(ward_zone_id,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 新增病房公告
 * **/
exports.insertAnnouncement = function(req, res){
    var data = req.body
    data.ward_zone_id = req.session.user.ward_zone_id;
    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;

    announcementService.insertAnnouncement(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 修改病房公告
 * **/
exports.updateAnnouncement = function(req, res){
    var data = req.body

    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }
    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    announcementService.updateAnnouncement(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 刪除病房公告
 * **/
exports.deleteAnnouncement = function(req, res){
    announcementService.deleteAnnouncement(req.body.anns,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })

};