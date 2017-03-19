/**
 * Created by Ian on 2016/10/25.
 * 病人的待辦事項紀錄模組
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var tools = require("../utils/commonTools");

//病歷資料
var MedicalRecordService = require("../services/medicalRecordService");

//病房
var bedService = require("../services/bedService");
//手術
var surgeryService = require("../services/surgeryService");


var moment = require("moment");


/**
 * 加入病歷資料
 * **/
exports.addMedicalRecord = function(req, res){

    var patients =
        req.body
            || [];

    var update_user=req.session.user.account || "";

    try{

        MedicalRecordService.insertMedicalRecord(patients,update_user,
            function(result){

                    res.json(tools.getReturnJSON(true,result));

            })

    }catch(err){

        //Logger.error(err);
        console.log(err);
        res.json(tools.getReturnJSON(false,[],-9999))

    }




};



/**
 * 更新病歷資料
 * **/
exports.updateMedicalRecord = function(req, res){

    var patients =
        req.body
            || [];

    var update_user=req.session.user.account || "";

    try{

        MedicalRecordService.updateMedicalRecord(patients,update_user,
            function(result){

                res.json(tools.getReturnJSON(true,result));

            })

    }catch(err){

        //Logger.error(err);
        console.log(err);
        res.json(tools.getReturnJSON(false,[],-9999))

    }




};


/**
 * 取得病歷資料
 * **/
exports.queryMedicalRecord = function(req, res){

    var person_id =
        req.query.person_id || "";



    try{

        MedicalRecordService.queryMedicalRecord(person_id,
            function(result,errorCode){

                if(result){
                    res.json(tools.getReturnJSON(true,result))
                }else{
                    res.json(tools.getReturnJSON(false,[],errorCode))
                }


            })

    }catch(err){

        //Logger.error(err);
        console.log(err);
        res.json(tools.getReturnJSON(false,[],-9999))

    }


};

/**
 * 新增病房轉床紀錄
 * **/
exports.addBedChangeRecord = function(req, res){

    var data = req.body||[];
    var last_update_info={};
    last_update_info.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    last_update_info.update_user = req.session.user.account;


    bedService.addBedChangeRecord(data,last_update_info,function(result,error){
        if(result==""){
            res.json(tools.getReturnJSON(true,"新增病房轉床紀錄成功!"))
        }else{
            res.json(result);
        }
    })
};

/**
 * 更新轉院記錄資料 EASONTODO
 * **/
exports.updateBedChangeRecord = function(req, res){
    var data = req.body||[];
    var last_update_info={};
    last_update_info.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    last_update_info.update_user = req.session.user.account;

    bedService.updateBedChangeRecord(data,last_update_info,function(result,error){
        if(result==""){
            res.json(tools.getReturnJSON(true,"更新病房轉床紀錄成功!"))
        }else{
            res.json(result);
        }
    })
};

/**
 * 新增手術資料
 * **/
exports.addSurgery = function(req, res){

    var data = req.body||[];
    var last_update_info={};
    last_update_info.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    last_update_info.update_user = req.session.user.account;

    surgeryService.addSurgery(data,last_update_info,function(result,error){
        if(result==""){
            res.json(tools.getReturnJSON(true,"新增手術資料成功!"))
        }else{
            res.json(result);
        }
    })
};

/**
 * 更新手術資料 EASONTODO
 * **/
exports.updateSurgery = function(req, res){
    var data = req.body||[];
    var last_update_info={};
    last_update_info.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    last_update_info.update_user = req.session.user.account;

    surgeryService.updateSurgery(data,last_update_info,function(result,error){
        if(result==""){
            res.json(tools.getReturnJSON(true,"更新手術資料成功!"))
        }else{
            res.json(result);
        }
    })
};