/**
 * Created by Jun on 2016/11/2.
 */
var Logger = require("../plugins/Log4js").Logger();
var DBAgent = require("../plugins/mysql/DBAgent");
var _ = require("underscore");
var async = require("async");
var validate = require('validate.js');

/**
 * 獲取手術資訊
 * ***/
exports.querySurgery = function(condition,callback){
    DBAgent.query("QRY_SURGERY" , condition,function(err , surgeryList){
        callback(err , surgeryList);
    } )
};

function checkErrorInput(requiredValues,record){
    var resultMsg="";
    for(var key in requiredValues){
        var check  = validate.isEmpty(record[key]);
        if(check){
            resultMsg += requiredValues[key]+"必須輸入值!\n"
        }
    }
    return resultMsg;
}

var checkSurgeryKey={
    "surgery_date":"手術資訊時間",
    "surgery_name":"手術中文名稱",
    "surgery_eng_name":"手術英文名稱",
    "surgery_type":"手術類型",
    "surgery_status":"手術狀態",
    "doctor_no":"手術主治醫生編號",
    "medical_record_number":"對應到的病歷號碼",
    "surgery_room":"刀房",
    "surgery_number":"刀別",
};

/**
 * 新增手術資訊
 * */
exports.addSurgery = function(reqs,last_update_info,callback){

    for(var i=0;i<reqs.length;i++){
        thisreq = reqs[i];
        thisreq.last_update_time = last_update_info.last_update_time;
        thisreq.update_user = last_update_info.update_user;
    }
    console.log("===req===");
    console.log(reqs);

    var resultMsg=""; //準備回傳的訊息，公用變數
    var insertFuncsArray=Array();

    _.each(reqs, function(req){
        if(!_.isUndefined(req)) {
            insertFuncsArray.push(function (callback) {
                async.series([
                    function(callback) { //檢核資料是否存在
                        var msg = checkErrorInput(checkSurgeryKey,req);
                        if(msg!=""){
                            callback("CHECK_INPUT_ERROR",msg);
                        }else{
                            callback(null,null);
                        }
                    },
                    function(callback) {
                        async.series([
                                function(callback) {
                                    DBAgent.updateBatchExecute("ADD_SURGERY", [req], function(error , result){
                                        if(error){
                                            callback(error);
                                        }else{
                                            callback(null,result);
                                        }
                                    });
                                }
                        ],
                        // optional callback
                        function(error, results) {
                            callback(error,results);
                        });
                    }
                ],
                // optional callback
                function(error, results) {
                    console.log("===error===");
                    console.log(error);
                    console.log("===results===");
                    console.log(results);

                    if(error){
                        if(error=="CHECK_INPUT_ERROR"){
                            resultMsg += results+"\n";
                        }else{
                            resultMsg += "未知錯誤\n"
                        }
                        Logger.error(error);
                        callback(null);
                    }else{
                        callback(null);
                    }
                });
            });
        }
    });

    async.parallel(insertFuncsArray,function(error, results) {
        console.log("===parallel resultMsg===");
        console.log(resultMsg);
        if(error){
            console.log("===resultMsg 1===");
            console.log(error);
        }

        callback(resultMsg);
    });


    // DBAgent.updateBatchExecute("ADD_SURGERY", reqs , function(error , result){
    //     if(error){
    //         Logger.error(error);
    //         console.error(error);
    //         error.code ? callback(false,error.code) : callback(false,"9999");
    //     }else{
    //         callback(true);
    //     }
    // });
};

/**
 * 修改手術資訊
 * */
exports.updateSurgery = function(reqs,last_update_info,callback){

    for(var i=0;i<reqs.length;i++){
        thisreq = reqs[i];
        thisreq.last_update_time = last_update_info.last_update_time;
        thisreq.update_user = last_update_info.update_user;
    }
    console.log("===req===");
    console.log(reqs);

    var resultMsg=""; //準備回傳的訊息，公用變數
    var insertFuncsArray=Array();

    _.each(reqs, function(req){
        if(!_.isUndefined(req)) {
            insertFuncsArray.push(function (callback) {
                async.series([
                        function(callback) { //檢核資料是否存在
                            var msg = checkErrorInput(checkSurgeryKey,req);
                            if(msg!=""){
                                callback("CHECK_INPUT_ERROR",msg);
                            }else{
                                callback(null,null);
                            }
                        },
                        function(callback) {
                            async.series([
                                    function(callback) {
                                        DBAgent.updateBatchExecute("UPDATE_SURGERY", [req], function(error , result){
                                            if(error){
                                                callback(error);
                                            }else{
                                                callback(null,result);
                                            }
                                        });
                                    }
                                ],
                                // optional callback
                                function(error, results) {
                                    callback(error,results);
                                });
                        }
                    ],
                    // optional callback
                    function(error, results) {
                        console.log("===error===");
                        console.log(error);
                        console.log("===results===");
                        console.log(results);

                        if(error){
                            if(error=="CHECK_INPUT_ERROR"){
                                resultMsg += results+"\n";
                            }else{
                                resultMsg += "未知錯誤\n"
                            }
                            Logger.error(error);
                            callback(null);
                        }else{
                            callback(null);
                        }
                    });
            });
        }
    });

    async.parallel(insertFuncsArray,function(error, results) {
        console.log("===parallel resultMsg===");
        console.log(resultMsg);
        if(error){
            console.log("===resultMsg 1===");
            console.log(error);
        }

        callback(resultMsg);
    });

    // DBAgent.updateBatchExecute("UPDATE_SURGERY", req , function(error , result){
    //     if(error){
    //         Logger.error(error);
    //         console.error(error);
    //         error.code ? callback(false,error.code) : callback(false,"9999");
    //     }else{
    //         callback(true);
    //     }
    // });
};

