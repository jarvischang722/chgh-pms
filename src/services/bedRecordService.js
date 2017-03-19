/**
 * Created by Ian on 2016/12/18.
 * 病床紀錄資訊
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require('async');
var moment = require("moment");
var validate = require("validate.js");


/**
 * 取得病床紀錄資料
 * */
exports.querybedRecord = function(patient_person_id, callback){

    if(patient_person_id!=""){

        DBAgent.query("QRY_BED_RECORD_BY_PATIENT_ID",{patient_person_id:patient_person_id} , function(err , rows){

            if(err){
                Logger.error(err);

                callback(false,-9999);

            }else{

                callback(rows);

            }


        });


    }else{

        DBAgent.query("QRY_BED_RECORD_BY_PATIENT_ID",{} , function(err , rows){

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
 * 插入病床紀錄資料
 * */
exports.insertbedRecord = function(bedRecords, update_user,callback){

    var insertFuncsArray=Array();

    if(!bedRecords instanceof Array){
        //check data type
        callback("資料格式錯誤，非JsonArray");

    }else{

        var resultMsg=""; //準備回傳的訊息，公用變數


        _.each(bedRecords, function(BedRecord){

            if(!_.isUndefined(BedRecord)) {


                insertFuncsArray.push(function (callback) {


                    //驗證及得到驗證結果字串從當前的病床紀錄中
                    var validResult=insertValidAndGetMsgFrombedRecordObject(BedRecord);


                    if(validResult === ""){
                        //如果沒有錯誤，就產生欲插入資料表的物件，並插入資料
                        //在waterfall裡callback

                        var bedRecordObject=getInsertbedRecordObject(BedRecord);


                        //==1.
                        async.parallel(
                            [function(callback){

                                getBedID(bedRecordObject["bed_name"] , bedRecordObject["ward_name"],function(result){

                                    callback(null,result);

                                })


                            },
                            function(callback){
                                    //2.找尋該身份證是否存在於系統

                                    DBAgent.query("QRY_PATIENT_BY_PERSON_ID",{person_id:bedRecordObject["patient_person_id"]} , function(err , rows){

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

                                }
                            ]
                            , function (err, result) {
                                //3.驗證 && 插入資料

                                var bed_id = result[0];
                                var isPatientExist = result[1];


                                if(err){
                                    //插入病房失敗
                                    Logger.error(err);
                                    resultMsg += "插入身份證字號:"+bedRecordObject["patient_person_id"]+"的病床紀錄資料時，發生不知名錯誤，請嘗試重新插入!\n"

                                 //最後回傳結果
                                 callback(null);

                                }else if(bed_id!=0){
                                    //要有病床id才能插入


                                    //然後要看病人資料中，該病人資料在不在
                                    if(isPatientExist==1){
                                        //在的話才能新增

                                        //然後看病床現在有沒有住人
                                        checkBedIsAvaliable(bed_id, function(isAvaliable, patient_person_id){

                                            if(isAvaliable){

                                                //病床可住人
                                                bedRecordObject["last_update_time"]=moment().format("YYYY/MM/DD HH:mm:ss");
                                                bedRecordObject["update_user"]=update_user;
                                                bedRecordObject["bed_id"]=bed_id;

                                                DBAgent.query("INS_BED_RECORD",
                                                    bedRecordObject,
                                                    function(err , rows){

                                                        if(err){

                                                            Logger.error(err);
                                                            console.log(err);
                                                            resultMsg += "插入身份證字號:"+bedRecordObject["patient_person_id"]+"的病床紀錄資料時，" +
                                                                "發生不知名錯誤，請聯絡管理員處理該問題\n"

                                                        }else{

                                                            resultMsg += "插入身份證字號:"+bedRecordObject["patient_person_id"]+"的病床紀錄資料成功!\n"
                                                        }

                                                        //最後回傳結果
                                                        callback(null);

                                                    });

                                            }else{

                                                if(patient_person_id==""){
                                                    //系統錯誤
                                                    resultMsg += "病床名稱："+bedRecordObject["bed_name"]+"當前無法住病患\n";
                                                }else{
                                                    //病床已有人
                                                    resultMsg += "病床名稱："+bedRecordObject["bed_name"]+"，當前有住身份證："+patient_person_id+"的病患\n";
                                                }


                                                //最後回傳結果
                                                callback(null);

                                            }


                                        })



                                    }else{
                                        //不然就不能新增
                                        resultMsg += "插入身份證字號:"+bedRecordObject["patient_person_id"]+"的病床紀錄資料時失敗，病患資料中無該病患的資料!\n"


                                        //最後回傳結果
                                        callback(null);

                                    }



                                }else{

                                        //非0代表該資料已存在，無法新增
                                        resultMsg += "插入身份證字號:"+bedRecordObject["patient_person_id"]+"的病床紀錄資料時失敗，該病床名稱不存在!\n"

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
 * @param BedRecord
 * @returns {string} ""為該物件驗證沒有錯，如果有值表示該物件驗證有錯誤
 */
function insertValidAndGetMsgFrombedRecordObject(BedRecord){

    var reusltMsg="";

    //必填資訊
    var patient_person_id=validator.isPersonID(BedRecord["patient_person_id"]);
    var bed_name=validator.isString(BedRecord["bed_name"]);
    var ward_name=validator.isString(BedRecord["ward_name"]);

    //身份證沒過，就直接否定該筆資料，下面就不用再驗了
    if(!patient_person_id){

        reusltMsg += "身份證字號:"+BedRecord["patient_person_id"]+" 不為合法的身份證格式\n"

    }else{


        var generateErrorMsg=function(field){

            return " 身份證字號:"+patient_person_id+"的"+field+"欄位，不為正確的"+field+"格式\n";

        };

        if(!bed_name){
            reusltMsg += generateErrorMsg("病床名稱")
        }

        if(!ward_name){
            reusltMsg += generateErrorMsg("病房名稱")
        }

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


    }


}

function getInsertbedRecordObject(BedRecord){

    //驗證已經給前面的做過了，這邊就不再做
    var bed_name=BedRecord["bed_name"];
    var ward_name=BedRecord["ward_name"];
    var patient_person_id=BedRecord["patient_person_id"];


    var bedRecordObject={
        bed_name:bed_name,
        ward_name:ward_name,
        patient_person_id:patient_person_id
    }



    return bedRecordObject;
}




function getBedID(bed_name,ward_name,callback){

//==1.
    async.waterfall(
        [function(callback){
            //1.找該病房的對應id
            DBAgent.query("QRY_WARD_ID_BY_NAME",{ward_name:ward_name} , function(err , rows){

                if(err){
                    Logger.error(err);

                    callback(err,0);

                }else{

                    if(rows.length !=0){
                        //有取得資料的話
                        try{

                            var row=rows[0];
                            row=row['id'];
                            callback(null, row);

                        }catch(e){

                            callback(null,0);

                        }

                    }else{
                        callback(null,0);

                    }
                }

            });

        },
            function(ward_id, callback){
                //2.找該病床的對應id

                DBAgent.query("QRY_BED_ID_BY_NAME",{name:bed_name, ward_id:ward_id} , function(err , rows){

                    if(err){
                        Logger.error(err);

                        callback(err,0);

                    }else{

                        if(rows.length !=0){
                            //有取得資料的話
                            //有取得資料的話
                            try{

                                var row=rows[0];
                                var id=row['id'];
                                callback(null, id);

                            }catch(e){

                                callback(null,0);

                            };


                        }else{
                            callback(null,0);

                        }
                    }

                });

            }
        ]
        , function (err, result) {
            //3.

            var bed_id = result;

            if(err){
                //找病床id失敗
                Logger.error(err);
                console.log(err);

                //最後回傳結果
                callback(0);

            }else if(bed_id!=0){
                //有找到病床id

                callback(bed_id);


            }else{
                //沒找到病床id

                callback(0);
            }


        });


}

function checkBedIsAvaliable(bed_id,callback){

    DBAgent.query("QRY_BED_IS_HAVE_PATIENT",
        {bed_id:bed_id},
        function(err , rows){

            if(err){
                //search出問題
                Logger.error(err);
                console.log(err);
                callback(false,null);

            }else{

                if(rows.length ==0){
                    //沒人住
                    callback(true, null);

                }else{
                    //有資料
                    var row=rows[0];
                    var patient_person_id=row["patient_person_id"];
                    var hospital_status=row["status"];

                    if(hospital_status=="out"){
                        //有資料，但已出院
                        callback(true, null);
                    }else{
                        //有資料，而且還在床上
                        callback(false, patient_person_id);
                    }



                }


            }

        });


}


