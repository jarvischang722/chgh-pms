/**
 * Created by Jun on 2016/10/1.
 * 系統維護
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var wardZoneService = require("../services/wardZoneService");
var sha1 = require("sha1");
var tools = require("../utils/commonTools");



/**
 * 取得所有病房區的資料及最大病患人數、已開放模組
 * */
exports.getAllWardzoneWithNumberAndModule = function(req, res){

    //護理站id


    wardZoneService.getAllWardzoneWithNumberAndModule(function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });



};

/**
 * 修改病房區的資料
 * */
exports.updateWardzone = function(req, res){

    var ward_zone_id = req.body["ward_zone_id"] || 0;
    var wardZoneName = req.body["wardZoneName"] || 0;
    var wardZoneDescription = req.body["wardZoneDescription"] || "";

    var updater =req.session.user.account;

    wardZoneService.updateWardzone(ward_zone_id, wardZoneName, wardZoneDescription,updater, function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });


};


/**
 * 刪除病房區的資料
 * */
exports.deleteWardzone = function(req, res){


    var ward_zone_ids = req.body["ward_zone_ids"] || "";

    wardZoneService.deleteWardzone(ward_zone_ids, function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });


};