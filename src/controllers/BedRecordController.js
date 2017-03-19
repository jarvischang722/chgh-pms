/**
 * Created by Ian on 2016/10/25.
 * 病人的待辦事項紀錄模組
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var tools = require("../utils/commonTools");

//病床紀錄資料
var BedRecordService = require("../services/bedRecordService");

var moment = require("moment");


/**
 * 加入病床紀錄資料
 * **/
exports.addBedRecord = function(req, res){

    var patients =
        req.body
            || [];

    var update_user=req.session.user.account || "";

    try{

        BedRecordService.insertbedRecord(patients,update_user,
            function(result){

                    res.json(tools.getReturnJSON(true,result));

            })

    }catch(err){

        //Logger.error(err);
        console.log(err);
        res.json(tools.getReturnJSON(false,[],-9999))

    }




};

