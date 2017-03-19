/**
 * Created by Jun on 2016/10/2.
 */
var path = require('path');
var rootPath = path.resolve(".");
var request = require("request");
var moment = require('moment');
var validate = require('validate.js');
var _ = require('underscore');
var async = require('async');
var CryptoJS = require("crypto-js");
var systemConfig = require('../configs/SystemConfig');
var ErrorCodeMap = require('../configs/ErrorCode');
var Logger = require("../plugins/Log4js").Logger();
var DBAgent = require("../plugins/mysql/DBAgent");
var spawn = require('child_process').spawn;

var _this = this;

//jar的位置
var jarPath=path.dirname(require.main.filename)+"/bin/aes.jar";




/*
 確認護理站是否有該模組的權限
 */
exports.checkWardZoneHasModulePrivilege=function(req,moduleName){

    //console.log("可用模組:");
    //console.log(req.session.user.module_eng_name);

    if(moduleName!="EWhiteBoard" && moduleName!="Bit" && moduleName!="SIP"){

        return false;

    }else{

        if ((req.session.user.module_eng_name).indexOf(moduleName) > -1) {
            //In the array!
            return true;
        } else {
            //Not in the array
            return false;
        }

    }


}


/**
 * 合併兩個json object
 * @param obj1 : 第1個json
 * @param obj2 : 第2個json
 * @return mergeObj  : 合併後的JSON
 * **/
exports.mergeObject = function(obj1, obj2){
    var mergeObj = {};
    for (var attrname in obj1) { mergeObj[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { mergeObj[attrname] = obj2[attrname]; }
    return mergeObj;
};


/**
 * 產生回傳用的json物件
 * @param success true/false
 * @param result
 * @param errorCode
 * @param error_message
 * @returns {{}}
 */
exports.getReturnJSON = function(success, result,errorCode, error_message){

    var jsonObject={};

    if(success){

        jsonObject.success=true;
        jsonObject.result=result;

    }else{

        if(ErrorCodeMap[errorCode]!=null){

            jsonObject.success=false;
            jsonObject.result=[];
            jsonObject.errorCode=errorCode;
            jsonObject.errorMsg=ErrorCodeMap[errorCode];

            //若有自定錯誤訊息，加入errorMsg中
            if(error_message){
                if (_.isArray(error_message)){
                    for(var i=0;i<error_message.length;i++){
                        jsonObject.errorMsg = jsonObject.errorMsg+ "\n" + error_message[i];
                    }
                }else if(_.isObject(error_message)){
                    Object.keys(error_message).forEach(function(key) {
                        var val = error_message[key];
                        jsonObject.errorMsg = jsonObject.errorMsg + "\n" + val;
                    });
                }else{
                    jsonObject.errorMsg = jsonObject.errorMsg+ "\n" + error_message;
                }
            }

        }else{
            //如果該errorcode沒有被定義的話，一律傳系統錯誤

            jsonObject.success=false;
            jsonObject.result=[];
            jsonObject.errorCode=-9999;
            jsonObject.errorMsg="系統錯誤"

        }

    }

    return jsonObject;

};



/**
 * 加密字串
 * @param key : 要被加密的字串
 * @return encryptKEY  : 加密後的字串
 * **/
exports.encryptKEY = function(key,callback){

    //加解密的bin
    exe(["-jar",jarPath,"encrypt",key], function(encryptKEY){

        callback(encryptKEY);

    });

};

/**
 * 解密字串
 * @param key : 要被解密的字串
 * @return encryptKEY  : 解密後的字串
 * **/
exports.decryptKEY = function(key,callback){

    //加解密的bin

            exe(["-jar",jarPath,"decrypt",key], function(decryptKEY){

            callback(decryptKEY);

        });


};


/**
 * 檢查key是不是valid
 * @param key : key
 * @return result  : true/false
 * **/
exports.checkKey = function(key,callback){


        this.decryptKEY(key,function(decryptKEY){

            try{

                decryptKEY = unquoted(decryptKEY);

                var jsonObjectTmp=JSON.parse(decryptKEY);

                jsonObjectTmp=jsonObjectTmp["result"];

                if ('function_list' in jsonObjectTmp
                    && 'max_user_number' in jsonObjectTmp
                    && (typeof jsonObjectTmp.max_user_number == 'number')
                    && (Array.isArray(jsonObjectTmp.function_list))) {

                    callback(true);

                }else{

                    callback(false);
                }

            }catch(err){

                console.log(err);
                Logger.error("checkKey failed with:"+err);
                callback(false);

            }


        });



};


/**
 * 從加密過的key中，取得功能清單及最大系統使用人數
 * @param key : key
 * @return jsonObject  : 功能清單及最大系統使用人數, JSON format
 * **/
exports.getInfoFromKey = function(key,callback){


    this.decryptKEY(key,function(decryptKEY){


        var jsonObject={function_list:[], max_user_number:0};

        try{

            decryptKEY = unquoted(decryptKEY);


            var jsonObjectTmp=JSON.parse(decryptKEY);

            jsonObjectTmp=jsonObjectTmp["result"];


            callback(jsonObjectTmp);

        }catch(err){

            console.log(err);
            callback(jsonObject);

        }




    });



};




/**
 * 從資料庫取得key，並得到系統人數上限
 * @return key  : 產品序號
 * **/
exports.getKey = function(callback){

    var key="";

    //1.從資料庫取得key
    DBAgent.query("QRY_KEY" , function(err , rows){

        if(err){

            Logger.error(err);
            callback(false,-9999);

        }else{

            if(rows.length==1){
                //有取得資料的話
                var row=rows[0];

                key=row.key;
                callback(key);

            }else{

                callback("");

            }
        }

    });


};


/**
 * 從資料庫取得key，並得到系統人數上限
 * @return maxUser  : 系統人數上限
 * **/
exports.getMaxUser = function(callback){

    var maxUser=0;

    async.waterfall([
        function(callback){

            //1.從資料庫取得key
            DBAgent.query("QRY_KEY" , function(err , rows){

                if(err){

                    Logger.error(err);

                }else{
                    if(rows.length==1){
                        //有取得資料的話
                        var row=rows[0]
                        //console.log(row.key);
                        callback(null,  _this.getInfoFromKey(row.key));

                    }else{

                        callback(null,  0);

                    }
                }

            });

        }
    ], function (err, result) {

        if(err){

            console.log(err);
            callback(0);

        }else{

            var maxUser= result.max_user_number;
            console.log("maxUser:"+maxUser);

            if(maxUser>0){

                callback(maxUser);


            }else{

                callback(0);

            }


        }



    });



};


/**
 * 從資料庫取得key，並得到系統可用模組清單
 * @return function_list  : 系統可用模組清單
 * **/
exports.getFunctionList = function(callback){

    var maxUser=0;


    async.waterfall([
        function(callback){

            //1.從資料庫取得key
            DBAgent.query("QRY_KEY" , function(err , rows){

                if(err){

                    Logger.error(err);

                }else{

                    if(rows.length==1){
                        //有取得資料的話
                        var row=rows[0]
                        console.log(row.key);
                        callback(null,  _this.getInfoFromKey(row.key));

                    }

                }

            });


        }
    ], function (err, result) {

        var function_list= result.function_list;
        console.log("function_list:"+function_list);
        callback(function_list);

    });



};




/**
 * 從key，得到系統人數上限
 * @return maxUser  : 系統人數上限
 * **/
//exports.getMaxUserFromKey = function(key){
//
//    var maxUser=0;
//
//    var keyInfo = this.getInfoFromKey(key);
//
//    var maxUser= keyInfo.max_user_number;
//
//    console.log("maxUser:"+maxUser);
//
//    return maxUser;
//
//};


/**
 * 從取得key，得到系統可用模組清單
 * @return function_list  : 系統可用模組清單
 * **/

// exports.getFunctionListFromKey = function(key,callback){
//
//    var keyInfo = this.getInfoFromKey(key);
//
//    var function_list= keyInfo.function_list;
//
//    console.log("function_list:"+function_list);
//
//    return function_list;
//
//
//};



//執行jar的function
function exe(command,callback){
    // linux下，不用 cmd /c java -jar yuicompressor.jar test.js，这种形式，直接
    // java -jar yuicompressor.jar test.js 即可
    var cmd = spawn("java",command);

    var G_data="";

    cmd.stdout.setEncoding("UTF-8");


    cmd.stdout.on("data",function(data){

        console.log("------------------------------");
        console.log("從jar檔得到資料成功:"+data);
        console.log("------------------------------");

        G_data=data;

    });


    cmd.stderr.on("data",function(data){
        console.log("------------------------------");
        console.log("從jar檔得到資料失敗:"+data);
        console.log("------------------------------");

        G_data=data;

    });


    cmd.on("exit",function(code){
        //console.log("從jar檔得到資料結束");
        //console.log("------------------------------");
        callback(G_data);
    });

};




exports.unquoted = function(quotedStr){

    return unquoted(quotedStr);

}


/**
 * 拿掉大框號前面的雙引號
 * @param quotedStr
 * @returns {string|*|XML|void|String}
 */
function unquoted(quotedStr){

    quotedStr = quotedStr.replace("\":\"{\"", "\":{\"");
    quotedStr = quotedStr.replace("}\",\"", "},\"");

  return quotedStr.replace (/(^")|("$)/g, '');
}