/**
 * Created by Eason on 2016/10/23.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require("async");

/**
 * 取得所有病房區的資料及最大病患人數、已開放模組(暫無使用)
 * */
exports.getAllWardzoneWithNumberAndModule = function(callback){

    var decryptFuncsArray=Array();


            //1.得到護理站資訊
            DBAgent.query("QRY_ALL_WARD_ZONE_WITH_LIMIT_AND_MODULE",{} , function(err , rows){

                if(err){
                    Logger.error(err);
                    rows = [];

                    callback(err,rows);

                }else{

                    //2.每行rows自行去把他的加密資料改成明碼
                    _.each(rows, function(row, index){

                        if(!_.isUndefined(row)) {

                            decryptFuncsArray.push(function (callback) {

                                if(row['system_module_list'] !== ""){
                                    //如果沒有錯誤，就產生欲插入資料表的物件，並插入資料
                                    //在waterfall裡callback

                                    try{

                                        //加密字串，用,分隔
                                        var system_module_list=row['system_module_list'];

                                        getModuleNameListFromEncrptyStr(system_module_list,function(result){

                                            rows[index]['system_module_list']=result;

                                            callback(null);
                                        })

                                    }catch(e){
                                        //出錯，設空值並callback
                                        //console.log(e);
                                        rows[index]['system_module_list']="";
                                        callback(null);
                                    }



                                }else{
                                    //為空值，就把它設為空字串並callback
                                    rows[index]['system_module_list']="";
                                    callback(null);

                                }


                            });


                        }

                    });

                    async.parallel(decryptFuncsArray , function(err, result){
                        if(err){
                            console.log(err);
                        }
                        //最後把rows回傳回去
                        callback(rows);

                    })

                }

            });



};


/**
 * 從加密過的字串，取得模組名稱清單
 * @param String  用,分隔的多個加密字串
 */
function getModuleNameListFromEncrptyStr(EncrptyStrs,callback){

    EncrptyStrs = EncrptyStrs.split(",");

    var DecrptyStrs = "";

    var decryptFuncsArray=Array();


    //2.每行rows自行去把他的加密資料改成明碼
    _.each(EncrptyStrs, function(EncrptyStr){

        if(!_.isUndefined(EncrptyStr)) {

            decryptFuncsArray.push(function(callback) {

                if(EncrptyStr !== ""){
                    //在waterfall裡callback

                    try{

                        //1.得到解密字串之後
                        DecrptyStr(EncrptyStr,function(DecrptyStr){

                            //2.對找資料庫對應的解密值
                            DBAgent.query("QRY_SYSTEM_MODULE_BY_ID",{id:DecrptyStr} , function(err , rows){

                                if(err){
                                    Logger.error(err);

                                    callback(null,"");

                                }else{

                                    if(rows.length !=0){
                                        //有取得資料的話
                                        var row = rows[0];

                                        callback(null, row["module_name"]);

                                    }else{

                                        callback(null,"");

                                    }
                                }

                            });


                        });

                    }catch(e){
                        //出錯，設空值並callback
                        console.log(e);
                        callback(null, "");
                    }



                }else{
                    //為空值，就把它設為空字串並callback
                    callback(null, "");

                }

            });

        }

    });

    async.parallel(decryptFuncsArray , function(err, result){
        if(err){

            console.log(err);

            callback("");

        }else{

            for(var i=0; i<result.length; i++){

                var DecrptyStr=result[i];

                 if(DecrptyStr!=""){
                     DecrptyStrs+=DecrptyStr+",";
                 }


            }

            //砍掉最後一個逗點
            DecrptyStrs= DecrptyStrs.replace(/\,$/, "");

            //最後把rows回傳回去
            callback(DecrptyStrs);
        }


    });



}


/**
 * 解密字串
 * @param String  單個加密字串
 */
function DecrptyStr(EncrptyStr,callback){


    callback(EncrptyStr);


}


/**
 * 新增病房區的資料
 * */
exports.insertWardzone = function(wardZoneName,callback){


    DBAgent.updateExecute("INS_WARD_ZONE",
        {ward_zone_name:wardZoneName}
        , function(error , result){

            if(error){
                Logger.error(error);
                console.error(error);
                error.code ? callback(false,error.code) : callback(false,"9999");
            }else{
                callback(result);
            }

        });


};

/**
 * 修改病房區的資料
 * */
exports.updateWardzone = function(id, wardZoneName, wardZoneDescription, updater,callback){


    DBAgent.updateExecute("UPD_ALL_WARD_ZONE",
        {id:id, ward_zone_name:wardZoneName, ward_zone_description:wardZoneDescription, update_user:updater}
        , function(error , result){

        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            callback(result);
        }

    });

};



/**
 * 刪除病房區的資料
 * */
exports.deleteWardzone = function(ward_zone_ids, callback){

    var deleteFuncsArray=Array();

    if(ward_zone_ids instanceof Array){

        _.each(ward_zone_ids, function(ward_zone_id){

            if(!_.isUndefined(ward_zone_id)) {

                deleteFuncsArray.push(
                    function (callback) {

                        DBAgent.updateExecute("DEL_WARD_ZONE" , {id: ward_zone_id} , function(err , result){
                            callback(err,result)
                        })
                    }
                );
            }

        });

        async.parallel(deleteFuncsArray , function(err, result){
            if(err){
                console.log(err);
                callback(false,-9999);

            }else{

                callback(true);
            }

        })



    }else{

        callback(false,-10);
    }




};