/**
 * Created by Ian on 2016/10/25.
 * 病人的待辦事項紀錄模組
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var tools = require("../utils/commonTools");

//病人資料
var patientService = require("../services/patientService");

//待辦事項
var patientTodoRecordService = require("../services/patientTodoRecordService");

//待辦資料
var patientTodoService = require("../services/patientTodoService");

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
 * 依病患id取得醫囑資料
 * **/
exports.queryPatientMedicalInformation = function(req, res){

    //沒傳的話，就指定全部
    var patient_person_id =
        req.query.patient_person_id
            || req.body["patient_person_id"]
            || 0;


    patientMedicalInformationService.getPatientMedicalInformation(
        patient_person_id,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })




};





/**
 * 加入病患過敏資料
 * **/
exports.addPatientMedicalInformation = function(req, res){

    var patients =
        req.body
            || [];

    var update_user=req.session.user.account || "";

    try{

        patientMedicalInformationService.insertPatientMedicalInformation(patients,update_user,
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
 * 更新病患過敏資料
 * **/
exports.updatePatientMedicalInformation = function(req, res){

    var patients =
        req.body
            || [];

    var update_user=req.session.user.account || "";

    try{

        patientMedicalInformationService.updatePatientMedicalInformation(patients,update_user,
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
 * 依病患id取得過敏資料
 * **/
exports.queryPatientAllergy = function(req, res){

    //沒傳的話，就指定全部
    var patient_person_id =
        req.query.patient_person_id
            || req.body["patient_person_id"]
            || 0;


    patientAllergyService.getPatientAllergy(
        patient_person_id,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })


};




/**
 * 加入病患過敏資料
 * **/
exports.addPatientAllergy = function(req, res){

    var patients =
        req.body
            || [];

    var update_user=req.session.user.account || "";

    try{

        patientAllergyService.insertPatientAllergy(patients,update_user,
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
 * 更新病患過敏資料
 * **/
exports.updatePatientAllergy = function(req, res){

    var patients =
        req.body
            || [];

    var update_user=req.session.user.account || "";

    try{

        patientAllergyService.updatePatientAllergy(patients,update_user,
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
 * 依病患id取得待辦資料
 * **/
exports.queryPatientTodo = function(req, res){

    //沒傳的話，就指定全部
    var patient_person_id =
        req.query.patient_person_id
            || req.body["patient_person_id"]
            || 0;


    patientTodoService.getPatientTodo(
        patient_person_id,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })


};



/**
 * 加入病患過敏資料
 * **/
exports.addPatientTodo = function(req, res){

    var patients =
        req.body
            || [];

    var update_user=req.session.user.account || "";

    try{

        patientTodoService.insertPatientTodo(patients,update_user,
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
 * 更新病患過敏資料
 * **/
exports.updatePatientTodo = function(req, res){

    var patients =
        req.body
            || [];

    var update_user=req.session.user.account || "";

    try{

        patientTodoService.updatePatientTodo(patients,update_user,
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
 * 依病歷id、或取得所有病患出院備註
 * **/
exports.queryPatientDischargedRemark = function(req, res){

    //沒傳的話，就指定全部
    var medical_record_id =
        req.query.medical_record_id
            || req.body["medical_record_id"]
            || 0;


    //沒傳的話，就指定全部
    var expect_discharged_date =
        req.query.expect_discharged_date
            || req.body["expect_discharged_date"]
            || null;



    //病房區的id
    var ward_zone_id =
        req.session.user.ward_zone_id || null;



    patientDischargedRemarkService.getPatientDischargedRemark(
        medical_record_id,expect_discharged_date,ward_zone_id,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })

};




/**
 * 依病患出院備註項目
 * **/
exports.queryPatientDischargedRemarkItems = function(req, res){


    patientDischargedRemarkService.getPatientDischargedRemarkItems(
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })

};


/**
 * 批次更新病患出院備註狀態
 * **/
exports.updatePatientDischargedRemark = function(req, res){


    var patient_medical_record_objects =
        req.body
            || [];

    var update_user=req.session.user.account || "";
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
        patient_medical_record_objects,update_user,
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

    var update_user=req.session.user.account || "";
    //console.log(patient_medical_record_ids);
    patientDischargedRemarkService.deletePatientDischargedRemark(patient_medical_record_ids,update_user,

        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,[]))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }


        })


};


/**
 * 依待辦事項項目
 * **/
exports.queryPatientTodoItem = function(req, res){

    var todo_class_id =
        req.query.todo_class_id
            || req.body["todo_class_id"]
            || "";


    patientTodoRecordService.getPatientTodoItem(
        todo_class_id,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })

};

/**
 * 依待辦事項類別
 * **/
exports.queryPatientTodoClass = function(req, res){

    patientTodoRecordService.getPatientTodoClass(
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })

};



/**
 * 依時間取得特定病患的待辦事項統計
 * **/
exports.queryPatientTodoCount= function(req, res){

    //沒傳的話，就指定現在時間
    var patient_todo_record_date =
        req.query.patient_todo_record_date
            || req.body["patient_todo_record_date"]
            || moment().format("YYYY/MM/DD");


    //病人病歷資料，有傳的話才去搜資料
    var patient_person_id =
        req.query.patient_person_id
            || req.body["patient_person_id"]
            || 0;


    patientTodoRecordService.countPatientTodoByDate(
        patient_person_id,patient_todo_record_date,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,result))
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
        || moment().format("YYYYMMDD");


        patient_todo_record_date=patient_todo_record_date.replace(/-/g,"");

    //病人身份證字號，有傳的話才去搜資料
    var patient_person_id =
        req.query.patient_person_id
            || req.body["patient_person_id"]
            || 0;


    //病床區id，有傳的話才去搜資料
    var ward_zone_id =
        req.session.user.ward_zone_id || 0;


    //是否完成，預設N還沒完成
    var is_finish =
        req.query.is_finish
            || req.body["is_finish"]
            || "";


    if(patient_person_id!=0){

        //有傳病患id時
        patientTodoRecordService.getPatientTodoByPatientID(
            patient_person_id,patient_todo_record_date,ward_zone_id,
            function(result,errorCode){

                if(result){
                    res.json(tools.getReturnJSON(true,result))
                }else{
                    res.json(tools.getReturnJSON(false,[],errorCode))
                }
            })



    }else if(is_finish!=""){


        //抓當天，未完成的
        patientTodoRecordService.getPatientTodoByDateNotFinish(
            patient_todo_record_date,
            ward_zone_id,
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
            ward_zone_id,
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
 * 依時間取得所有病患待辦事項的統計資料
 * **/
exports.queryPatientTodoCountRecord = function(req, res){

    //沒傳的話，就指定現在時間
    var patient_todo_record_date =
        req.query.patient_todo_record_date
            || req.body["patient_todo_record_date"]
            || moment().format("YYYYMMDD");



    patient_todo_record_date.replace("-","");

    //病床區id，有傳的話才去搜資料
    var ward_zone_id =
        req.session.user.ward_zone_id || 0;


        //有傳病患id時
        patientTodoRecordService.getPatientTodoCountByDate(
            patient_todo_record_date,ward_zone_id,
            function(result,errorCode){

                if(result){
                    res.json(tools.getReturnJSON(true,result))
                }else{
                    res.json(tools.getReturnJSON(false,[],errorCode))
                }
            })

};


/**
 * 加入病患待辦事項狀態
 * **/
exports.addPatientTodoRecord = function(req, res){

    var patient_todo_records =
            req.body
            || [];

    var update_user=req.session.user.account || "";
    var nur_id = req.session.nur_id;
    //console.log(patient_todo_records);

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

            patientTodoRecordService.addPatientTodo(patient_todo_records,nur_id,update_user,
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


    var patient_todo_record_ids =
        req.query.patient_todo_record_ids
        || req.body["patient_todo_record_ids"]
        || [];


    var is_finish =
        req.query.is_finish
            || req.body["is_finish"]
            || "";

    var update_user=req.session.user.account || "";


    patientTodoRecordService.updatePatientTodoStatus(
        patient_todo_record_ids, is_finish,update_user,
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

    var patient_todo_record_ids =
        req.body["patient_todo_record_ids"]
            || [];

    var medical_record_ids =
        req.body["medical_record_ids"]
            || [];

    var todo_date =
        req.body["todo_date"]
            || moment().format("YYYY/MM/DD");

    patientTodoRecordService.deletePatientTodo(patient_todo_record_ids,medical_record_ids,todo_date,
        function(result,errorCode){

            if(result){
                res.json(tools.getReturnJSON(true,[]))
            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })


};

/**
 *病人代辦事項設定畫面
 * **/
exports.patientTodoItem = function(req, res){
    res.render("Admin/Patient/patientTodoItem")
};







/**
 * 加入病患資料
 * **/
exports.addPatient = function(req, res){

    var patients =
        req.body
            || [];

    var update_user=req.session.user.account || "";

    try{

        patientService.insertPatientInfo(patients,update_user,
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
 * 更新病患資料
 * **/
exports.updatePatient = function(req, res){

    var patients =
        req.body
            || [];

    var update_user=req.session.user.account || "";

    try{

        patientService.updatePatientInfo(patients,update_user,
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
 * 取得病患資料
 * **/
exports.queryPatient = function(req, res){

    var person_id =
        req.query.person_id || "";



    try{

        patientService.queryPatientInfo(person_id,
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