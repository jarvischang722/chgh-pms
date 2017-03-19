/**
 * Created by Ian on 2016/10/25.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require('async');



var moment = require("moment");
/**
 * 取得所有出院備註項目
 * */
exports.getPatientDischargedRemarkItems= function(callback){


        DBAgent.query("QRY_ALL_DISCHARGED_REMARK_ITEM",{} , function(err , rows){

            if(err){
                Logger.error(error);
                callback(false,-9999);
            }else{
                callback(rows);
            }


        });



};

/**
 * 取得所有病患出院備註資料
 * */
exports.getPatientDischargedRemark = function(medical_record_id,expect_discharged_date, ward_zone_id, callback){


//    var status=null;
//
//    if(expect_discharged_date){
//        //有指定時間的話，就只找已經出院的病患
//        status="out";
//    }

    //有傳要指定哪個病患的病歷話
    if(medical_record_id){

        DBAgent.query("QRY_DISCHARGED_REMARK_WITH_NO_DISCHARGED_BY_MEDICAL_RECORD_ID",
            {medical_record_id:medical_record_id} ,
            function(err , rows){

            if(err){
                Logger.error(error);
                callback(false,-9999);
            }else{
                callback(rows);
            }



        });

    }
    else if(expect_discharged_date!="" || ward_zone_id!=0){
    //有傳要指定哪天，還有指定哪個病房區的話

        DBAgent.query("QRY_DISCHARGED_REMARK_WITH_NO_DISCHARGED_BY_DATE",
            {expect_discharged_date:expect_discharged_date,ward_zone_id:ward_zone_id} ,
            function(err , rows){

                if(err){
                    Logger.error(error);
                    callback(false,-9999);
                }else{
                    callback(rows);
                }



            });


    }
    else{

        DBAgent.query("QRY_ALL_DISCHARGED_REMARK_WITH_NO_DISCHARGED",{} , function(err , rows){

            if(err){
                Logger.error(error);
                callback(false,-9999);
            }else{
                callback(rows);
            }


        });


    }
};



/**
 * 批次修改病患出院備註
 * */
exports.updatePatientDischargedRemark = function(patient_medical_record_objects,update_user, callback){


    if(patient_medical_record_objects instanceof Array && patient_medical_record_objects.length>0){


        async.each(patient_medical_record_objects, function(patient_medical_record_object, callback){

           // console.log(patient_medical_record_object);

            var discharged_remark=patient_medical_record_object.discharged_remark || "";
            var patient_medical_record_id=patient_medical_record_object.patient_medical_record_id || 0;

            console.log("start time:");

            console.log(moment().format("YYYY/MM/D , h:mm:ss aD"));

            DBAgent.updateExecute("UPDATE_DISCHARGED_REMARK_BY_MEDICAL_RECORD_ID",
                {discharged_remark:discharged_remark,patient_medical_record_id:patient_medical_record_id,update_user:update_user }, function (error , result) {
                    if(error){
                        Logger.error(error);
                    }

                    console.log("end time:");
                    console.log(moment().format("YYYY/MM/D , h:mm:ss aD"));

                    callback(null);



                });


        }, function(err) {

            if( err ) {

                callback(false,-9999);

            } else {

                callback(true);
        }

        });


    }else{
        //輸入格式錯誤
        callback(false,-10);

    }


};

/**
 exports.updatePatientDischargedRemark = function(patient_medical_record_objects, callback){

    if(patient_medical_record_objects instanceof Array){
        DBAgent.updateBatchExecute("UPDATE_DISCHARGED_REMARK_BY_MEDICAL_RECORD_ID",
            patient_medical_record_objects, function (error , result) {
                if(error){
                    Logger.error(error);
                    console.error(error);
                    error.code ? callback(false,error.code) : callback(false,"9999");
                }else{
                    if(result && result.length<1){
                        callback(false,"-1");
                    }else{
                        callback(true);
                    }
                }
            });
    }else{
        //輸入格式錯誤
        callback(false,-10);
    }
};
 */



/**
 * 批次刪除病患出院備註
 * */
exports.deletePatientDischargedRemark = function(patient_medical_record_ids,update_user, callback){

    if(patient_medical_record_ids instanceof Array){

        async.each(patient_medical_record_ids, function(patient_medical_record_id, callback){

            DBAgent.updateExecute("UPDATE_DISCHARGED_REMARK_BY_MEDICAL_RECORD_ID",
                {discharged_remark:'',
                    patient_medical_record_id:patient_medical_record_id,update_user:update_user}, function (error , result) {
                    if(error){
                        Logger.error(error);
                    }

                    callback(null);

                })


        }, function(err) {

            if( err ) {

                callback(false, -9999);

            } else {

                callback(true);
            }

        });



    }else{

        callback(false,-10);

    }


};


/**
 * 取得所有病患待辦事項
 * */
exports.getAllPatientTodoRecord = function(callback){
    DBAgent.query("QRY_ALL_PATIENT_TODO_RECORD",{} , function(err , rows){

        if(err){
            Logger.error(error);
            rows = [];
        }

         callback(rows);

    });
};


/**
 * 依時間取得所有病患待辦事項
 * */
exports.getPatientTodoByDate = function(patient_todo_record_date, callback){

    DBAgent.query("QRY_ALL_PATIENT_TODO_RECORD_BY_DATE",{todo_date:patient_todo_record_date} , function(err , rows){

        if(err){
            Logger.error(error);
            rows = [];
        }

        callback(rows);

    });
};



/**
 * 批次加入病患待辦事項
 * */
exports.addPatientTodo = function(patient_todo_records, callback){


        if(!patient_todo_records instanceof Array){
            //check data type

            callback([]);

        }else{

            //轉成array給DBagent使用
            var patient_todo_record_array=[];

            for (var i = 0;i < patient_todo_records.length; i++) {

                var tempArray=[
                    patient_todo_records[i].medical_record_id,
                    patient_todo_records[i].todo_id,
                    patient_todo_records[i].todo_date,
                    patient_todo_records[i].is_finish];

                patient_todo_record_array.push(tempArray);

            }


            DBAgent.updateExecute("INS_PATIENT_TODO_RECORD", patient_todo_record_array, function (error , result) {
                if(error){
                    callback(false, error.message);
                }else{
                    callback(true, "");
                }

            })

        }

};


/**
 * 更新病患待辦事項狀態
 * */
exports.updatePatientTodoStatus = function(patient_todo_object, callback){

    console.log(patient_todo_object);

    if(patient_todo_object.patient_todo_record_id=='' || patient_todo_object.is_finish==''){

        callback(false, "");

    }else{


        DBAgent.updateExecute("UPDATE_PATIENT_TODO_RECORD_STATUS", patient_todo_object, function (error , result) {
            if(error){
                callback(false, error.message);
            }else{
                callback(true, "");
            }

        })


    }




};



