/**
 * Created by Ian on 2016/11/15.
 * 緊急外部裝置種類分派
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var tools = require("../utils/commonTools");


var EmergencyExternalDeviceService = require("../services/EmergencyExternalDeviceService");
var moment = require("moment");



/**
 * 取得緊急外部裝置種類清單
 * **/
exports.queryEmergencyExternalDeviceClass = function(req, res){


    EmergencyExternalDeviceService.queryEmergencyExternalDeviceClass(
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        });


};


/**
 * 取得緊急外部裝置頁面
 * **/
exports.EmergencyExternalDeviceSet = function(req, res){

    res.render("SystemMaintain/deviceManage");

};


/**
 * 取得緊急外部裝置
 * **/
exports.queryEmergencyExternalDevice = function(req, res){


    //病房名稱
    var ward_name =
        req.query.ward_name
            || req.body["ward_name"]
            || ""

    //裝置種類no
    var emergency_external_device_class_no =
        req.query.emergency_external_device_class_no
            || req.body["emergency_external_device_class_no"]
            || "";


    EmergencyExternalDeviceService.queryEmergencyExternalDevice(
        ward_name,emergency_external_device_class_no,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        });



};



/**
 * 插入緊急外部裝置
 * **/
exports.insertEmergencyExternalDevice = function(req, res){

    //裝置名稱
    var device_name =
        req.body["device_name"]
            || "";

    //裝置種類的代碼
    var device_class_no =
        req.body["device_class_no"]
            || "";


    //裝置IP
    var device_IP =
        req.body["device_IP"]
            || "";


    //病房
    var ward_name =
        req.body["ward_name"]
            || "";



    EmergencyExternalDeviceService.insertEmergencyExternalDevice(
        device_name,device_class_no,device_IP,ward_name,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        });




};




/**
 * 插入緊急外部裝置
 * **/
exports.updateEmergencyExternalDevice = function(req, res){

    //裝置名稱
    var device_name =
        req.body["device_name"]
            || "";

    //裝置種類的代碼
    var device_class_no =
        req.body["device_class_no"]
            || "";


    //裝置IP
    var device_IP =
        req.body["device_IP"]
            || "";


    //病房
    var ward_name =
        req.body["ward_name"]
            || 0;


    //這筆資料的id
    var emergency_external_device_id =
        req.body["emergency_external_device_id"]
            || 0;



    EmergencyExternalDeviceService.updateEmergencyExternalDevice(
        emergency_external_device_id,device_name,device_class_no,device_IP,ward_name,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        });




};

/**
 * 批次刪除病患出院備註狀態
 * **/
exports.deleteEmergencyExternalDevice = function(req, res){

    var emergency_external_device_ids =
        req.body["emergency_external_device_ids"]
            || 0;

    //console.log(patient_medical_record_ids);
    EmergencyExternalDeviceService.deleteEmergencyExternalDevice(emergency_external_device_ids,

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