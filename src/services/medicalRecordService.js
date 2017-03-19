/**
 * Created by Ian on 2016/12/18.
 * 病歷資訊
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require('async');
var moment = require("moment");
var validate = require("validate.js");


/**
 * 取得病歷資料
 * */
exports.queryMedicalRecord = function(patient_person_id, callback){

    if(patient_person_id!=""){

        DBAgent.query("QRY_ALL_MEDICAL_RECORD",{patient_person_id:patient_person_id} , function(err , rows){

            if(err){
                Logger.error(err);

                callback(false,-9999);

            }else{

                callback(rows);

            }


        });


    }else{

        DBAgent.query("QRY_ALL_MEDICAL_RECORD",{} , function(err , rows){

            if(err){
                Logger.error(err);

                callback(false,-9999);

            }else{

                callback(rows);

            }



        });

    }

};


/**
 * 更新病歷資料
 * */
exports.updateMedicalRecord = function(medicalRecords, update_user,callback){

    var updateFuncsArray=Array();

    if(!medicalRecords instanceof Array){
        //check data type
        callback("資料格式錯誤，非JsonArray");

    }else{

        var resultMsg=""; //準備回傳的訊息，公用變數


        _.each(medicalRecords, function(medicalRecord){

            if(!_.isUndefined(medicalRecord)) {


                updateFuncsArray.push(function (callback) {


                    //驗證及得到驗證結果字串從當前的病患資訊中
                    var validResult=updateValidAndGetMsgFromMedicalRecordObject(medicalRecord);


                    if(validResult === ""){
                        //如果沒有錯誤，就產生欲更新資料表的物件，並更新資料
                        //在waterfall裡callback

                        var medicalRecordObject=getUpdateMedicalRecordObject(medicalRecord);


                        //==1.
                        async.parallel(
                            [function(callback){
                                //1.找尋該身份證及病歷號碼

                                DBAgent.query("QRY_ALL_MEDICAL_RECORD",{patient_person_id:medicalRecordObject["patient_person_id"]} , function(err , rows){

                                    if(err){
                                        Logger.error(err);

                                        callback(err,0);

                                    }else{

                                        if(rows.length >0){
                                            //有取得資料的話
                                            callback(null, 1);

                                        }else{
                                            callback(null,0);

                                        }
                                    }

                                });

                            }
                            ]
                            , function (err, result) {
                                //3.驗證 && 插入資料


                                if(err){
                                    //插入病房失敗
                                    Logger.error(err);
                                    resultMsg += "更新身份證字號:"+medicalRecordObject["patient_person_id"]+"的病歷資料時，發生不知名錯誤，請嘗試重新更新!\n"

                                    //最後回傳結果
                                    callback(null);

                                }else if(result==1){
                                    //0代表有找到該身份證的資訊，可以更新

                                    medicalRecordObject["update_user"]=update_user;

                                    DBAgent.query("UPD_MEDICAL_RECORD_BY_PATIENT_ID",
                                        medicalRecordObject,
                                        function(err , rows){

                                            if(err){
                                                Logger.error(err);
                                                console.log(err);
                                                resultMsg += "更新身份證字號:"+medicalRecordObject["patient_person_id"]+"的病歷資料時，發生不知名錯誤!\n"

                                            }else{

                                                resultMsg += "更新身份證字號:"+medicalRecordObject["patient_person_id"]+"的病歷資料成功!\n"
                                            }

                                            //最後回傳結果
                                            callback(null);

                                        });

                                }else{

                                    //非0代表該資料已存在，無法新增
                                    resultMsg += "查無身份證字號:"+medicalRecordObject["patient_person_id"]+"的病患\n"


                                    //最後回傳結果
                                    callback(null);
                                }


                            });
                        //==


                    }else{
                        //有錯誤，直接callback
                        resultMsg+=validResult;
                        callback(null);

                    }


                } );


            }

        });

        async.parallel(updateFuncsArray , function(err, result){
            if(err){
                console.log(err);
            }

            callback(resultMsg);

        })


    }


};

/**
 * 插入病歷資料
 * */
exports.insertMedicalRecord = function(medicalRecords, update_user,callback){

    var insertFuncsArray=Array();

    if(!medicalRecords instanceof Array){
        //check data type
        callback("資料格式錯誤，非JsonArray");

    }else{

        var resultMsg=""; //準備回傳的訊息，公用變數


        _.each(medicalRecords, function(medicalRecord){

            if(!_.isUndefined(medicalRecord)) {


                insertFuncsArray.push(function (callback) {


                    //驗證及得到驗證結果字串從當前的病患資訊中
                    var validResult=insertValidAndGetMsgFromMedicalRecordObject(medicalRecord);


                    if(validResult === ""){
                        //如果沒有錯誤，就產生欲插入資料表的物件，並插入資料
                        //在waterfall裡callback

                        var medicalRecordObject=getInsertMedicalRecordObject(medicalRecord);


                        //==1.
                        async.parallel(
                            [function(callback){
                                //1.找尋該身份證及病歷號碼

                                DBAgent.query("QRY_ALL_MEDICAL_RECORD",{patient_person_id:medicalRecordObject["patient_person_id"]} , function(err , rows){

                                    if(err){
                                        Logger.error(err);

                                        callback(err,0);

                                    }else{

                                        if(rows.length !=0){
                                            //有取得資料的話
                                            callback(null, 1);

                                        }else{
                                            callback(null,0);

                                        }
                                    }

                                });

                            },
                            function(callback){
                                    //2.找尋該身份證是否存在於系統

/*                                    先跳過該驗證，
DBAgent.query("QRY_PATIENT_BY_PERSON_ID",{person_id:medicalRecordObject["patient_person_id"]} , function(err , rows){

                                        if(err){
                                            Logger.error(err);

                                            callback(err,0);

                                        }else{

                                            if(rows.length !=0){
                                                //有取得資料的話
                                                callback(null, 1);

                                            }else{
                                                callback(null,0);

                                            }
                                        }

                                    });*/
                                callback(null, 1);
                                }
                            ]
                            , function (err, result) {
                                //3.驗證 && 插入資料

                                var isMedicalRecordExist = result[0];
                                var isPatientExist = result[1];


                                if(err){
                                    //插入病房失敗
                                    Logger.error(err);
                                    resultMsg += "插入身份證字號:"+medicalRecordObject["patient_person_id"]+"的病歷資料時，發生不知名錯誤，請嘗試重新插入!\n"

                                 //最後回傳結果
                                 callback(null);

                                }else if(isMedicalRecordExist==0){
                                    //0代表該病歷不存在，可以插入


                                    //然後要看病人資料中，該病人資料在不在
                                    if(isPatientExist==1){
                                        //在的話才能新增

                                        medicalRecordObject["last_update_time"]=moment().format("YYYY/MM/DD HH:mm:ss");
                                        medicalRecordObject["update_user"]=update_user;

                                        DBAgent.query("INS_MEDICAL_RECORD",
                                            medicalRecordObject,
                                            function(err , rows){

                                                if(err){
                                                    Logger.error(err);
                                                    console.log(err);
                                                    resultMsg += "插入身份證字號:"+medicalRecordObject["patient_person_id"]+"的病歷資料時，發生不知名錯誤，" +
                                                        "請確認身份證字號及病歷號碼是否已存在於系統後，再重新插入!\n"

                                                }else{

                                                    resultMsg += "插入身份證字號:"+medicalRecordObject["patient_person_id"]+"的病歷資料成功!\n"
                                                }

                                                //最後回傳結果
                                                callback(null);

                                            });


                                    }else{
                                        //不然就不能新增
                                        resultMsg += "插入身份證字號:"+medicalRecordObject["patient_person_id"]+"的病歷資料時失敗，病患資料中無該病患的資料!\n"


                                        //最後回傳結果
                                        callback(null);

                                    }



                                }else{

                                        //非0代表該資料已存在，無法新增
                                        resultMsg += "插入身份證字號:"+medicalRecordObject["patient_person_id"]+"的病歷資料時失敗，該身份證或病歷號碼已經存在!\n"


                                    //最後回傳結果
                                    callback(null);
                                }


                            });
                        //==


                    }else{
                        //有錯誤，直接callback
                        resultMsg+=validResult;
                        callback(null);

                    }


                } );


            }

        });

        async.parallel(insertFuncsArray , function(err, result){
            if(err){
                console.log(err);
            }

            callback(resultMsg);

        })


    }


};




/**
 * 插入驗證用
 * @param medicalRecord
 * @returns {string} ""為該物件驗證沒有錯，如果有值表示該物件驗證有錯誤
 */
function insertValidAndGetMsgFromMedicalRecordObject(medicalRecord){

    var reusltMsg="";

    //必填資訊
    var number=validator.isString(medicalRecord["number"]);
    var patient_person_id=validator.isPersonID(medicalRecord["patient_person_id"]);
    var doctor_no=validator.isString(medicalRecord["doctor_no"]);
    var status=validator.isHospitalStatus(medicalRecord["status"]);



    //身份證沒過，就直接否定該筆資料，下面就不用再驗了
    if(!patient_person_id){

        reusltMsg += "身份證字號:"+medicalRecord["patient_person_id"]+" 不為合法的身份證格式\n"

    }else{


        var generateErrorMsg=function(field){

            return " 身份證字號:"+patient_person_id+"的"+field+"欄位，不為正確的"+field+"格式\n";

        }

        if(!doctor_no){
            reusltMsg += generateErrorMsg("主治醫生編號")
        }
        if(!status){
            reusltMsg += generateErrorMsg("住院狀態");
        }
        if(!number){
            reusltMsg += generateErrorMsg("病歷號碼");
        }

    }



    return  reusltMsg;

}


/**
 *  更新驗證用
 * @param medicalRecord
 * @returns {string} ""為該物件驗證沒有錯，如果有值表示該物件驗證有錯誤
 */
function updateValidAndGetMsgFromMedicalRecordObject(medicalRecord){

    var reusltMsg="";

    //必填資訊
    var patient_person_id=validator.isPersonID(medicalRecord["patient_person_id"]) || null;


    //身份證沒過，就直接否定該筆資料，下面就不用再驗了
    if(!patient_person_id){

        reusltMsg += "身份證字號:"+medicalRecord["patient_person_id"]+" 不為合法的身份證格式\n"

    }else{

        var generateErrorMsg=function(field){

            return " 身份證字號:"+patient_person_id+"的"+field+"欄位，不為正確的"+field+"格式\n";

        }


        //有傳入的資料，就分別做出對應的驗證
        Object.keys(medicalRecord).forEach(function(key,index) {
            // key: the name of the object key
            // index: the ordinal position of the key within the object

            if(key == "number"){

                var name=validator.isString(medicalRecord["number"]);

                if(!name){
                    reusltMsg += generateErrorMsg("病歷號碼");
                }

            }else if(key == "doctor_no"){
                var doctor_no=validator.isString(medicalRecord["doctor_no"]);

                if(!doctor_no){
                    reusltMsg += generateErrorMsg("主治醫生編號")
                }

            }else if(key == "status"){

                var status=validator.isHospitalStatus(medicalRecord["status"]);

                if(!status){
                    reusltMsg += generateErrorMsg("住院狀態");
                }

            }else if(key == "in_out_datetime"){

                var in_out_datetime=validator.isDatetime(medicalRecord["in_out_datetime"]);

                if(!in_out_datetime){
                    reusltMsg += generateErrorMsg("出入院時間");
                }

            }else if(key == "expect_discharged_date"){

                var expect_discharged_date=validator.isDatetime(medicalRecord["expect_discharged_date"]);

                if(!expect_discharged_date){
                    reusltMsg += generateErrorMsg("預計出院時間");
                }

            }




        });

    }


    return  reusltMsg;

}



var validator={

    isString:function(input){

        if(typeof input === 'string' && input!="" ){
            return input;
        }
            return null;
    },
    isDatetime:function(input){

        if(moment(input, 'YYYY-MM-DD HH:mm:ss',true).isValid()){
            return input;
        }
        return null;

    },
    isPersonID:function(input) {

        try{
            tab = "ABCDEFGHJKLMNPQRSTUVXYWZIO"
            A1 = new Array (1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3 );
            A2 = new Array (0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5 );
            Mx = new Array (9,8,7,6,5,4,3,2,1,1);

            if ( input.length != 10 ) return null;
            i = tab.indexOf( input.charAt(0) );
            if ( i == -1 ) return null;
            sum = A1[i] + A2[i]*9;

            for ( i=1; i<10; i++ ) {
                v = parseInt( input.charAt(i) );
                if ( isNaN(v) ) return null;
                sum = sum + v * Mx[i];
            }
            if ( sum % 10 != 0 ) return null;
            return input;
        }catch(e){
            return null;
        }


    },
    isHospitalStatus:function(input){

        if( input =="in" || input =="out"){
            return input;
        }
        return null;

    }


}

function getInsertMedicalRecordObject(medicalRecord){

    //驗證已經給前面的做過了，這邊就不再做
    var number=medicalRecord["number"];
    var patient_person_id=medicalRecord["patient_person_id"];
    var doctor_no=medicalRecord["doctor_no"];
    var discharged_remark=medicalRecord["discharged_remark"] || "";
    var status=medicalRecord["status"];
    var expect_discharged_date=medicalRecord["expect_discharged_date"] || "";
    var in_out_datetime=medicalRecord["in_out_datetime"] || "";


    var medicalRecordObject={
        number:number,
        patient_person_id:patient_person_id,
        doctor_no:doctor_no,
        discharged_remark:discharged_remark,
        status:status,
        expect_discharged_date:expect_discharged_date,
        in_out_datetime:in_out_datetime
    }



    return medicalRecordObject;
}



function getUpdateMedicalRecordObject(medicalRecord){
    //驗證已經給前面的做過了，這邊就不再做

    var patient_person_id=medicalRecord["patient_person_id"];

    var number=medicalRecord["number"] || null;
    var doctor_no=medicalRecord["doctor_no"] || null;
    var discharged_remark=medicalRecord["discharged_remark"] || null;
    var status=medicalRecord["status"] || null;
    var expect_discharged_date=medicalRecord["expect_discharged_date"] || null;
    var in_out_datetime=medicalRecord["in_out_datetime"] || null;


    var medicalRecordObject={
        number:number,
        patient_person_id:patient_person_id,
        doctor_no:doctor_no,
        discharged_remark:discharged_remark,
        status:status,
        expect_discharged_date:expect_discharged_date,
        in_out_datetime:in_out_datetime
    }


    return medicalRecordObject;
}


