/**
 * Created by Ian on 2016/10/25.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var Logger = require("../plugins/Log4js").Logger();
var async = require('async');


/**
 * 取得所有待辦事項項目
 * */
exports.getPatientTodoItem = function(todo_class_id, callback){

    DBAgent.query("QRY_ALL_PATIENT_TODO_ITEM",
        {todo_class_id:todo_class_id} , function(err , rows){

            if(err){
                Logger.error(err);
                console.log(err);
                callback(false,-9999);

            }else{

                callback(rows);

            }


        });
};

/**
 * 取得所有待辦事項類別
 * */
exports.getPatientTodoClass = function( callback){

    DBAgent.query("QRY_ALL_PATIENT_TODO_CLASS",
        {} , function(err , rows){

            if(err){
                Logger.error(err);
                console.log(err);
                callback(false,-9999);

            }else{

                callback(rows);

            }


        });
};





/**
 * 依病患id及日期，取得所有病患待辦事項
 * */
exports.getPatientTodoByPatientID = function(patient_person_id,patient_todo_record_date, ward_zone_id, callback){

    DBAgent.query("QRY_PATIENT_TODO_RECORD_BY_PATIENT",
        {patient_id:patient_person_id,todo_date:patient_todo_record_date,ward_zone_id:ward_zone_id} , function(err , rows){

        if(err){
            Logger.error(err);
            console.log(err);
            callback(false,-9999);

        }else{

            callback(rows);

        }


    });
};


/**
 * 依時間取得所有病患待辦事項(未完成的)
 * */
exports.getPatientTodoByDateNotFinish = function(patient_todo_record_date, ward_zone_id,callback){


    DBAgent.query("QRY_ALL_PATIENT_TODO_RECORD_BY_DATE_NOT_FINISH",{todo_date:patient_todo_record_date,ward_zone_id:ward_zone_id} , function(err , rows){

        if(err){
            Logger.error(err);
            console.log(err);
            callback(false,-9999);

        }else{

            callback(rows);

        }


    });


};

/**
 * 依時間取得所有病患待辦事項
 * */
exports.getPatientTodoByDate = function(patient_todo_record_date, ward_zone_id,callback){


        DBAgent.query("QRY_ALL_PATIENT_TODO_RECORD_BY_DATE",{todo_date:patient_todo_record_date,ward_zone_id:ward_zone_id} , function(err , rows){

            if(err){
                Logger.error(err);
                console.log(err);
                callback(false,-9999);

            }else{

                callback(rows);

            }


        });


};


/**
 * 依時間取得病患待辦事項的統計
 * */
exports.countPatientTodoByDate = function(patient_person_id, patient_todo_record_date ,callback){


    DBAgent.query("QRY_PATIENT_TODO_RECORD_GORUP_BY_PATIENT",{todo_date:patient_todo_record_date,patient_id:patient_person_id} , function(err , rows){

        if(err){
            Logger.error(err);
            console.log(err);
            callback(false,-9999);

        }else{

            callback(rows);

        }


    });


};

/**
 * 依時間取得病患待辦事項統計資訊
 * */
exports.getPatientTodoCountByDate = function(patient_todo_record_date, ward_zone_id,callback){


    DBAgent.query("QRY_PATIENT_TODO_RECORD_GORUP_BY_PATIENT",{todo_date:patient_todo_record_date,ward_zone_id:ward_zone_id} , function(err , rows){

        if(err){
            Logger.error(err);
            console.log(err);
            callback(false,-9999);

        }else{

            callback(rows);

        }


    });
};


/**
 * 批次加入病患待辦事項
 * */
exports.addPatientTodo = function(patient_todo_records,nur_id,update_user, callback){





        if(!patient_todo_records instanceof Array){
            //check data type

            callback(false,-10);

        }else{

            //轉成array給DBagent使用
            var patient_todo_record_array=[];

            for (var i = 0;i < patient_todo_records.length; i++) {

                var tempArray=[
                    patient_todo_records[i].medical_record_id,
                    patient_todo_records[i].todo_id,
                    patient_todo_records[i].todo_date,
                    patient_todo_records[i].patient_name,
                    patient_todo_records[i].patient_sex,
                    patient_todo_records[i].patient_birthday,
                    nur_id,
                    patient_todo_records[i].bed_no,
                    patient_todo_records[i].is_finish,
                    update_user];

                patient_todo_record_array.push(tempArray);

            }


            DBAgent.updateExecute("INS_PATIENT_TODO_RECORD", patient_todo_record_array, function (error , result) {

                console.log(patient_todo_record_array);

                if(error){
                    Logger.error(error);
                    console.log(error);
                    callback(false, -9999);
                }else{
                    callback(true);
                }

            })

        }

};


/**
 * 更新病患待辦事項狀態
 * */
exports.updatePatientTodoStatus = function(patient_todo_record_ids, is_finish, update_user, callback){

    if(patient_todo_record_ids instanceof Array){

        async.each(patient_todo_record_ids, function(patient_todo_record_id, callback){

            DBAgent.updateExecute("UPDATE_PATIENT_TODO_RECORD_STATUS",
                {is_finish:'Y',
                    patient_todo_record_id:patient_todo_record_id,update_user:update_user}, function (error , result) {

                    if(error){
                        Logger.error(error);
                       // console.log(error);
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
 * 批次刪除病患待辦事項
 * */
exports.deletePatientTodo = function(patient_todo_record_ids,medical_record_ids,todo_date, callback){


    if(patient_todo_record_ids instanceof Array && patient_todo_record_ids.length>0){

        async.each(patient_todo_record_ids, function(patient_todo_record_id, callback){

            DBAgent.updateExecute("DEL_PATIENT_TODO_RECORD",
                {patient_todo_record_id:patient_todo_record_id}, function (error , result) {
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



    }else if(medical_record_ids  instanceof Array  && medical_record_ids.length>0 ){

        //依病歷資料，批次刪除
        async.each(medical_record_ids, function(medical_record_id, callback){

            DBAgent.updateExecute("DEL_PATIENT_TODO_RECORD_BY_medical_record_id",
                {medical_record_id:medical_record_id, todo_date:todo_date}, function (error , result) {
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




