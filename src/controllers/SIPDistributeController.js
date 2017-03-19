/**
 * Created by Ian on 2016/11/03.
 * SIP 裝置分派
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var tools = require("../utils/commonTools");

//SIP裝置分配
var SIPDistributeService = require("../services/SIPDistributeService");
var moment = require("moment");


/**
 * 首頁
 * **/
//exports.index = function(req, res){
//
//    //res.render("Marquee/index");
//    patientTodoRecordService.getAllPatientTodoRecord(function(result){
//        res.json({success:true , msg:'' , result:result})
//    })
//
//};


/**
 * 取得SIP裝置型態清單
 * **/
exports.querySIPDeviceClass = function(req, res){



    SIPDistributeService.getSIPDeviceClass(
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        });


};


/**
 * 管理SIP裝置分配表頁面
 * **/
exports.SIPSet = function(req, res){

    res.render("SystemMaintain/sipManage");

};


/**
 * 取得SIP裝置分配表
 * **/
exports.querySIPDeviceDistribute = function(req, res){


    //沒傳的話，就指定全部
    var sip_device_class_id =
        req.query.sip_device_class_id
            || req.body["sip_device_class_id"]
            || 0

    //啟始筆數
    var start =
        req.query.start
            || req.body["start"]
            || 0;

    //每頁數量
    var per_page =
        req.query.per_page
            || req.body["per_page"]
            || 10;

    //是否被指派，預設yes
    var is_assign =
        req.query.is_assign
            || req.body["is_assign"]
            || "yes";


    SIPDistributeService.getSIPDistribute(
        sip_device_class_id,start,per_page,is_assign,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        });



};



/**
 * 更新SIP裝置分配表
 * **/
exports.updateSIPDeviceDistribute = function(req, res){

    //裝置分機
    var phoneno =
        req.body["phoneno"]
            || "";

    //類比緊急代碼
    var transno =
        req.body["transno"]
            || "";


    //裝置型態
    var da =
        req.body["da"]
            || "";


    //裝置來電顯示內容
    var phoneShowContent =
        req.body["phoneShowContent"]
            || "";


    //病房歸屬
    var ward_name =
        req.body["ward_name"]
            || 0;



    SIPDistributeService.updateSIPDistribute(
        phoneno,transno,da,phoneShowContent,ward_name,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        });




};


/**
 * 刪除SIP裝置分配表
 * **/
exports.deleteSIPDeviceDistribute = function(req, res){

    //裝置分機
    var phonenos =
        req.body["phonenos"]
            || "";


    SIPDistributeService.deleteSIPDistribute(
        phonenos,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        });




};



/**
 * 批次更新病患出院備註狀態
 * **/
exports.updatePatientDischargedRemark = function(req, res){


    var patient_medical_record_objects =
        req.body
            || [];

    //console.log(patient_medical_record_objects);

//    try{
//
//        //因為會傳json string進來，所以要parse成json object
//        patient_medical_record_objects = JSON.parse(patient_medical_record_objects);
//
//    }catch(err){
//
//        patient_medical_record_objects=[];
//
//    }

    patientDischargedRemarkService.updatePatientDischargedRemark(
        patient_medical_record_objects,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,[]))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })

};


/**
 * 批次刪除病患出院備註狀態
 * **/
exports.deletePatientDischargedRemark = function(req, res){

    var patient_medical_record_ids =
        req.body["patient_medical_record_ids"]
            || 0;

    //console.log(patient_medical_record_ids);
    patientDischargedRemarkService.deletePatientDischargedRemark(patient_medical_record_ids,

        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,[]))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }


        })


};



/**
 * 依時間取得所有病患待辦事項
 * **/
exports.queryPatientTodoRecord = function(req, res){

    //沒傳的話，就指定現在時間
    var patient_todo_record_date =
        req.query.patient_todo_record_date
        || req.body["patient_todo_record_date"]
        || moment().format("YYYY/MM/DD");


    //病人id，有傳的話才去搜資料
    var patient_id =
        req.query.patient_id
            || req.body["patient_id"]
            || 0;


    //病人id，有傳的話才去搜資料
    var ward_id =
        req.query.ward_id
            || req.body["ward_id"]
            || 0;

    if(patient_id!=0){

        //有傳病患id時
        patientTodoRecordService.getPatientTodoByPatientID(
            patient_id,
            function(result,errorCode){

                if(result){
                    res.json(tools.getReturnJSON(true,result))
                }else{
                    res.json(tools.getReturnJSON(false,[],errorCode))
                }
            })



    }else{

        //沒有傳，就依date排
        patientTodoRecordService.getPatientTodoByDate(
            patient_todo_record_date,
            ward_id,
            function(result,errorCode){

                if(result){
                    res.json(tools.getReturnJSON(true,result))
                }else{
                    res.json(tools.getReturnJSON(false,[],errorCode))
                }
            })

    }



};



/**
 * 加入病患待辦事項狀態
 * **/
exports.addPatientTodoRecord = function(req, res){

    var patient_todo_records =
            req.body
            || [];

    console.log(patient_todo_records);

//    try{
//
//        patient_todo_records=JSON.parse(patient_todo_records);
//
//    }catch(err){
//
//        console.log(err);
//        patient_todo_records=[];
//
//
//    }


    try{

            patientTodoRecordService.addPatientTodo(patient_todo_records,
                function(result,errorCode){

                    if(result){
                        res.json(tools.getReturnJSON(true,[]))
                    }else{
                        res.json(tools.getReturnJSON(false,[],errorCode))
                    }

                })

    }catch(err){

        res.json(tools.getReturnJSON(false,[],-9999))

    }




};


/**
 * 更新病患待辦事項狀態
 * **/
exports.updatePatientTodoRecordStatus = function(req, res){


    var patient_todo_record_id =
        req.query.patient_todo_record_id
        || req.body["patient_todo_record_id"]
        || "";


    var patient_todo_record_status =
        req.query.patient_todo_record_status
            || req.body["patient_todo_record_status"]
            || "";


    patientTodoRecordService.updatePatientTodoStatus(
        {patient_todo_record_id:patient_todo_record_id, is_finish:patient_todo_record_status},
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,[]))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })

};


/**
 * 刪除病患待辦事項狀態
 * **/
exports.deletePatientTodoRecord = function(req, res){

    var patient_todo_record_id =
        req.body["patient_todo_record_id"]
            || 0;


    patientTodoRecordService.deletePatientTodo(patient_todo_record_id,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,[]))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })


};


/**
 * 取得病人通訊紀錄
 * **/
exports.getAllSIPRecord = function(req, res){

    var start_date =
        req.query["start_date"]
            || moment().format("YYYY/MM/DD");

    var end_date =
        req.query["end_date"]
            || moment().format("YYYY/MM/DD");

    //裝置型態
    var da =
        req.query["da"]
            || null;


    var second_start = req.query["second_start"] || null;
    var second_end = req.query["second_end"] || null;


        DBAgent.query("QRY_SIP_CDR",
            {start_date:start_date,end_date:end_date,type:da,second_start:second_start, second_end:second_end},
            function(err , rows){


                if(err){
                    res.json(tools.getReturnJSON(false,[],-9999))
                }else{
                    res.json(tools.getReturnJSON(true,rows))
                }


        });



};