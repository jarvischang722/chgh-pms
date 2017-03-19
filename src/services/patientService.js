/**
 * Created by Ian on 2016/12/18.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require('async');
var moment = require("moment");
var validate = require("validate.js");


/**
 * 取得病人資料
 * */
exports.queryPatientInfo = function(person_id, callback){

    if(person_id!=""){

        DBAgent.query("QRY_PATIENT_BY_PERSON_ID",{person_id:person_id} , function(err , rows){

            if(err){
                Logger.error(err);

                callback(false,-9999);

            }else{

                callback(rows);

            }


        });


    }else{

        DBAgent.query("QRY_PATIENT_BY_PERSON_ID",{} , function(err , rows){

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
 * 更新病人資料
 * */
exports.updatePatientInfo = function(patientInfos, update_user,callback){

    var updateFuncsArray=Array();

    if(!patientInfos instanceof Array){
        //check data type
        callback("資料格式錯誤，非JsonArray");

    }else{

        var resultMsg=""; //準備回傳的訊息，公用變數


        _.each(patientInfos, function(patientInfo){

            if(!_.isUndefined(patientInfo)) {


                updateFuncsArray.push(function (callback) {


                    //驗證及得到驗證結果字串從當前的病患資訊中
                    var validResult=updateValidAndGetMsgFromPatientInfoObject(patientInfo);


                    if(validResult === ""){
                        //如果沒有錯誤，就產生欲更新資料表的物件，並更新資料
                        //在waterfall裡callback

                        var patientInfoObject=getUpdatePatientInfoObject(patientInfo);


                        //==1.
                        async.parallel(
                            [function(callback){
                                //1.找尋該身份證及病歷號碼

                                DBAgent.query("QRY_PATIENT_BY_PERSON_ID",{person_id:patientInfoObject["person_id"]} , function(err , rows){

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
                                    resultMsg += "更新身份證字號:"+patientInfoObject["person_id"]+"的病人資料時，發生不知名錯誤，請嘗試重新更新!\n"

                                    //最後回傳結果
                                    callback(null);

                                }else if(result==1){
                                    //0代表有找到該身份證的資訊，可以更新

                                    patientInfoObject["last_update_time"]=moment().format("YYYY/MM/DD HH:mm:ss");
                                    patientInfoObject["update_user"]=update_user;

                                    DBAgent.query("UPD_PATIENT_BY_PATIENT_ID",
                                        patientInfoObject,
                                        function(err , rows){

                                            if(err){
                                                Logger.error(err);
                                                console.log(err);
                                                resultMsg += "更新身份證字號:"+patientInfoObject["person_id"]+"的病人資料時，發生不知名錯誤!\n"

                                            }else{

                                                resultMsg += "更新身份證字號:"+patientInfoObject["person_id"]+"的病人資料成功!\n"
                                            }

                                            //最後回傳結果
                                            callback(null);

                                        });

                                }else{

                                    //非0代表該資料已存在，無法新增
                                    resultMsg += "查無身份證字號:"+patientInfoObject["person_id"]+"的病患\n"


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
 * 插入病人資料
 * */
exports.insertPatientInfo = function(patientInfos, update_user,callback){

    var insertFuncsArray=Array();

    if(!patientInfos instanceof Array){
        //check data type
        callback("資料格式錯誤，非JsonArray");

    }else{

        var resultMsg=""; //準備回傳的訊息，公用變數


        _.each(patientInfos, function(patientInfo){

            if(!_.isUndefined(patientInfo)) {


                insertFuncsArray.push(function (callback) {


                    //驗證及得到驗證結果字串從當前的病患資訊中
                    var validResult=insertValidAndGetMsgFromPatientInfoObject(patientInfo);


                    if(validResult === ""){
                        //如果沒有錯誤，就產生欲插入資料表的物件，並插入資料
                        //在waterfall裡callback

                        var patientInfoObject=getInsertPatientInfoObject(patientInfo);


                        //==1.
                        async.parallel(
                            [function(callback){
                                //1.找尋該身份證及病歷號碼

                                DBAgent.query("QRY_PATIENT_BY_PERSON_ID",{person_id:patientInfoObject["person_id"]} , function(err , rows){

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


                                if(err){
                                    //插入病房失敗
                                    Logger.error(err);
                                    resultMsg += "插入身份證字號:"+patientInfoObject["person_id"]+"的病人資料時，發生不知名錯誤，請嘗試重新插入!\n"

                                 //最後回傳結果
                                 callback(null);

                                }else if(result==0){
                                    //0代表該資料不存在，可以新增

                                    patientInfoObject["last_update_time"]=moment().format("YYYY/MM/DD HH:mm:ss");
                                    patientInfoObject["update_user"]=update_user;

                                    DBAgent.query("INS_PATIENT",
                                        patientInfoObject,
                                        function(err , rows){

                                            if(err){
                                                Logger.error(err);
                                                console.log(err);
                                                resultMsg += "插入身份證字號:"+patientInfoObject["person_id"]+"的病人資料時，發生不知名錯誤，" +
                                                    "請確認身份證字號及病歷號碼是否已存在於系統後，再重新插入!\n"

                                            }else{

                                                resultMsg += "插入身份證字號:"+patientInfoObject["person_id"]+"的病人資料成功!\n"
                                            }

                                            //最後回傳結果
                                            callback(null);

                                        });

                                }else{

                                        //非0代表該資料已存在，無法新增
                                        resultMsg += "插入身份證字號:"+patientInfoObject["person_id"]+"的病人資料時失敗，該身份證或病歷號碼已經存在!\n"


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
 * 更新驗證用
 * @param patientInfo
 * @returns {string} ""為該物件驗證沒有錯，如果有值表示該物件驗證有錯誤
 */
function insertValidAndGetMsgFromPatientInfoObject(patientInfo){

    var reusltMsg="";

    //必填資訊
    var person_id=validator.isPersonID(patientInfo["person_id"]);

    var name=validator.isString(patientInfo["name"]);
    var sex=validator.isSexCode(patientInfo["sex"]);
    var birthday_date=validator.isDate(patientInfo["birthday_date"]);
    var record_no=validator.isString(patientInfo["record_no"]);
    var enter_date=validator.isDate(patientInfo["enter_date"]);
    var age=validator.isNumber(patientInfo["age"]);
    var status=validator.isStatus(patientInfo["status"]);
    var sick_level=validator.isSickLevel(patientInfo["sick_level"]);

    //以下選填資訊，目前暫無使用到
    var mobile=patientInfo["mobile"] || "";
    var emgy_name=patientInfo["emgy_name"] || "";
    var emgy_phone=patientInfo["emgy_phone"] || "";
    var emgy_rel=patientInfo["emgy_rel"] || "";
    var home_tel=patientInfo["home_tel"] || "";

    //身份證沒過，就直接否定該筆資料，下面就不用再驗了
    if(!person_id){

        reusltMsg += "身份證字號:"+patientInfo["person_id"]+" 不為合法的身份證格式\n"

    }else{


        var generatErrorMsg=function(field){

            return " 身份證字號:"+person_id+"的"+field+"欄位，不為正確的"+field+"格式\n";

        }


        if(!name){
            reusltMsg += generatErrorMsg("姓名");
        }
        if(!sex){
            reusltMsg += generatErrorMsg("性別")
        }
        if(!birthday_date){
            reusltMsg += generatErrorMsg("出生年月日");
        }
        if(!record_no){
            reusltMsg += generatErrorMsg("病歷號碼");
        }
        if(!enter_date){
            reusltMsg += generatErrorMsg("入院日期");
        }
        if(!age){
            reusltMsg += generatErrorMsg("年紀");
        }
        if(!status){
            reusltMsg += generatErrorMsg("病人狀態");
        }
        if(!sick_level){
            reusltMsg += generatErrorMsg("病情等級");
        }

    }



    return  reusltMsg;

}


/**
 *  更新驗證用
 * @param patientInfo
 * @returns {string} ""為該物件驗證沒有錯，如果有值表示該物件驗證有錯誤
 */
function updateValidAndGetMsgFromPatientInfoObject(patientInfo){

    var reusltMsg="";

    //必填資訊
    var person_id=validator.isPersonID(patientInfo["person_id"]);


    //身份證沒過，就直接否定該筆資料，下面就不用再驗了
    if(!person_id){

        reusltMsg += "身份證字號:"+patientInfo["person_id"]+" 不為合法的身份證格式\n"

    }else{

        var generatErrorMsg=function(field){

            return " 身份證字號:"+person_id+"的"+field+"欄位，不為正確的"+field+"格式\n";

        }

        //有傳入的資料，就分別做出對應的驗證
        Object.keys(patientInfo).forEach(function(key,index) {
            // key: the name of the object key
            // index: the ordinal position of the key within the object

            if(key == "name"){

                var name=validator.isString(patientInfo["name"]);

                if(!name){
                    reusltMsg += generatErrorMsg("姓名");
                }

            }else if(key == "sex"){
                var sex=validator.isSexCode(patientInfo["sex"]);

                if(!sex){
                    reusltMsg += generatErrorMsg("性別")
                }

            }else if(key == "birthday_date"){
                var birthday_date=validator.isDate(patientInfo["birthday_date"]);

                if(!birthday_date){
                    reusltMsg += generatErrorMsg("出生年月日");
                }


            }else if(key == "record_no"){
                var record_no=validator.isString(patientInfo["record_no"]);

                if(!record_no){
                    reusltMsg += generatErrorMsg("病歷號碼");
                }

            }else if(key == "enter_date"){
                var enter_date=validator.isDate(patientInfo["enter_date"]);

                if(!enter_date){
                    reusltMsg += generatErrorMsg("入院日期");
                }


            }else if(key == "age"){
                var age=validator.isNumber(patientInfo["age"]);

                if(!age){
                    reusltMsg += generatErrorMsg("年紀");
                }


            }else if(key == "status"){
                var status=validator.isStatus(patientInfo["status"]);

                if(!status){
                    reusltMsg += generatErrorMsg("病人狀態");
                }

            }else if(key == "sick_level"){
                var sick_level=validator.isSickLevel(patientInfo["sick_level"]);

                if(!sick_level){
                    reusltMsg += generatErrorMsg("病情等級");
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
    isNumber:function(input){

        if(!isNaN(input)  && input!="0" || input!=0){
            return input;
        }
        return null;
    },
    isSexCode:function(input){

        if(input==0 ||  input==1 ||input=="0" ||  input=="1"){
            return input;
        }
        return null;
    },
    isDate:function(input){

        if(moment(input, 'YYYY-MM-DD',true).isValid()){
            return input;
        }
        return null;

    },
    isPersonID:function(input) {

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

    },
    isStatus:function (input){

            var toArray = input.split(",");

            if(input===""){

                //可接受空字串，代表沒有狀態
                return input;

            }else{

                //如果狀態有值，一一驗證每個值是不是這四個狀態的其中一個
                for(var i=0;i<toArray.length;i++){

                    if( toArray[i] !=="檢查異常" && toArray[i]  !=="過敏" && toArray[i]  !=="跌倒" && toArray[i]  !=="隔離"){
                        //console.log(toArray[i]);
                        return null;
                    }

                }

            }

            return input;

        },
    isSickLevel:function(input){

        if( input =="一般" || input =="DNR" || input =="不確定" ){
            return input;
        }
        return null;

    }


}

function getInsertPatientInfoObject(patientInfo){

    //驗證已經給前面的做過了，這邊就不再做
    var name=patientInfo["name"];
    var sex=patientInfo["sex"];
    var birthday_date=patientInfo["birthday_date"];
    var record_no=patientInfo["record_no"];
    var enter_date=patientInfo["enter_date"];
    var person_id=patientInfo["person_id"];
    var age=patientInfo["age"];
    var emgy_name=patientInfo["emgy_name"] || "";
    var emgy_phone=patientInfo["emgy_phone"] || "";
    var emgy_rel=patientInfo["emgy_rel"] || "";
    var home_tel=patientInfo["home_tel"] || "";
    var mobile=patientInfo["mobile"] || "";
    var status=patientInfo["status"];
    var sick_level=patientInfo["sick_level"];


    var patientInfoObject={
        name:name,
        sex:sex,
        birthday_date:birthday_date,
        record_no:record_no,
        enter_date:enter_date,
        person_id:person_id,
        age:age,
        emgy_name:emgy_name,
        emgy_phone:emgy_phone,
        emgy_rel:emgy_rel,
        home_tel:home_tel,
        mobile:mobile,
        status:status,
        sick_level:sick_level
    }



    return patientInfoObject;
}



function getUpdatePatientInfoObject(patientInfo){
    //驗證已經給前面的做過了，這邊就不再做

    var person_id=patientInfo["person_id"];

    var name=patientInfo["name"] || null;
    var sex=patientInfo["sex"] || null;
    var birthday_date=patientInfo["birthday_date"] || null;
    var record_no=patientInfo["record_no"] || null;
    var enter_date=patientInfo["enter_date"] || null;
    var age=patientInfo["age"] || null;
    var status=patientInfo["status"] || null;
    var sick_level=patientInfo["sick_level"] || null;

    var patientInfoObject={
        name:name,
        sex:sex,
        birthday_date:birthday_date,
        record_no:record_no,
        enter_date:enter_date,
        person_id:person_id,
        age:age,
        status:status,
        sick_level:sick_level
    }


    return patientInfoObject;
}


