/**
 * Created by Ian on 2016/11/26.
 * 護理站(病房區)權限 ward_zone_privilege
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var request = require('request');
var async = require("async");
var tools = require("../utils/commonTools");

var wardZoneService = require("../services/wardZoneService");

var _this = this;




/**
 * 護理站，取得開放的模組及最大使用人數清單  API
 * @param req
 * @param res
 */
exports.wardZoneInfoGet = function(ward_zone_id,callback){


    async.parallel([

        function(callback){

            //1.找模組清單
            DBAgent.query("QRY_SYSTEM_MODULE",{} , function(err , rows){

                if(err){
                    Logger.error(err);
                    console.log(err);

                    callback(null,"");

                }else{

                    callback(null,rows);

                }

            });

        },
        function(callback){
            //2.找各個護理站的模組及最大使用人數

            _this.getWardZoneModulesInfomation(function(result){

                if(result){

                    callback(null, result);

                }else{

                    callback(null, "");

                }

            });


        }

    ],function (err, results) {

        var module_list=results[0];
        var decryptObject=results[1];

        if(err){

            Logger.error(err);





            callback(null);

        }else{

            getWardzoneDetailFromDecryptObjects(decryptObject, function(result){

                var resultJson={};
                resultJson['success']=true;

                if(ward_zone_id){
                    //有指定要哪個護理站的話
                    resultJson['result']=getSingleWardzoneDetail(ward_zone_id,result);

                }else{
                    //反之就傳全部的
                    resultJson['result']=result;

                }


                resultJson['module_list']=module_list;


                callback(resultJson);

            });


        }


    });

};

function getSingleWardzoneDetail(ward_zone_id,rows){

    var result=[];

    _.each(rows,function(row){

        if(row["ward_zone_id"] == ward_zone_id){
            result[0]=row;
        }
    });

    return result;



}

/**
 * 從解密的資料中取得取得護理站的詳細資料
 * @param ward_zone_object
 * @param callback
 */
function getWardzoneDetailFromDecryptObjects(ward_zone_objects, callback){

    var funcsArray=Array();

    try{

        _.each(ward_zone_objects, function(ward_zone_object, index){

            if(!_.isUndefined(ward_zone_object)) {

                funcsArray.push(function (callback) {

                    //如果沒有錯誤，就產生欲插入資料表的物件，並插入資料
                    //在waterfall裡callback

                    try{

                        //加密字串，用,分隔
                        var ward_zone_id=ward_zone_object['ward_zone_id'];

                        DBAgent.query("QRY_WARD_ZONE_BY_ID",{ward_zone_id:ward_zone_id} , function(err , rows){

                            if(err){

                                Logger.info(err);
                                console.log(err);

                                callback(null);

                            }else{
                                //有找到資料的話
                                if(ward_zone_objects[index]!==undefined && rows.length >0){

                                    var row=rows[0];

                                    try{
                                        ward_zone_objects[index]["ward_zone_name"]=row["ward_zone_name"];
                                        ward_zone_objects[index]["ward_zone_description"]=row["ward_zone_description"];
                                    }catch(e){
                                        ward_zone_objects[index]["ward_zone_name"]="";
                                        ward_zone_objects[index]["ward_zone_description"]="";
                                    }

                                }else{
                                    //沒找到資料，就從陣列中砍掉該資料
                                    ward_zone_objects.splice(index,1);

                                }

                                callback(null);
                            }

                        });


                    }catch(e){
                        //出錯，設空值並callback
                        //console.log(e);
                        ward_zone_objects[index]["ward_zone_name"]=null;
                        ward_zone_objects[index]["ward_zone_description"]=null;
                        callback(null);
                    }



                });


            }

        });


        //執行
        async.parallel(funcsArray , function(err, result){
            if(err){

                console.log(err);

                callback("");

            }else{
                //沒錯誤的話
                callback(ward_zone_objects);
            }


        });


    }catch(e){
        console.log(e);
        callback("");

    }

}



/**
 * 取得每個護理站的權限資訊，從加密字串取得
 * **/

 exports.getWardZoneModulesInfomation = function (callback) {

    DBAgent.query("QRY_WARD_ZONE_MODULE",
        {}, function (err, rows) {

            if (err) {
                Logger.error(err);
                console.log(err);
                callback([]);

            }else if(rows.length==0){
                callback([]);
            } else {

                var row = rows[0];
                var encryptStr = row['value'];

                //解密成明碼
                tools.decryptKEY(encryptStr, function (result) {

                    try {
                        //轉成jsonStr
                        result = JSON.parse(result);

                        //取得result的欄位
                        result = result["result"];

                        //再把result欄位轉成jsonStr
                        result = JSON.parse(result);

                        callback(result);

                    } catch (e) {

                        console.log(e);
                        callback([]);

                    }


                })

            }


        });


};


/**
 * 插入護理站
 * **/
exports.insertWardZoneModulesInfomation = function (jsonObject, callback) {

    //1.確認資料是不是符合格式
    validWardZoneJsonObject(jsonObject, function (result) {

        if (result) {
            //通過的話

            //2.插入新護理站至資料庫
            insertNoExistWardzone(jsonObject, function (newData) {

                //3.取得原先的資料
                _this.getWardZoneModulesInfomation(function (originData) {

                    originData = originData.concat(newData);


                    var jsonStr = JSON.stringify(originData);
                    //jsonStr="[{\"ward_zone_bed_max\":100,\"ward_zone_name\":\"A1\",\"module_eng_name\":[\"SIP\",\"EWhiteBoard\"],\"ward_zone_id\":1},{\"ward_zone_bed_max\":120,\"ward_zone_name\":\"A2\",\"module_eng_name\":[\"SIP\",\"EWhiteBoard\"],\"ward_zone_id\":2}]";
                    //加密字串
                    tools.encryptKEY(jsonStr, function (result) {

                        var result = JSON.parse(result);
                        result = result['result'];

                        DBAgent.query("UPD_WARD_ZONE_MODULE",
                            {value: result}, function (err) {

                                if (err) {
                                    Logger.error(err);
                                    console.log(err);
                                    callback(false, -9999);

                                } else {

                                    callback(true);

                                }

                            });

                    })


                });


            })

        } else {
            //沒通過
            callback(false, -10);

        }


    })


};


/**
 * 更新每個護理站的權限資訊
 * **/
exports.updateWardZoneModulesInfomation = function (jsonObject, callback) {

    //1.確認資料是不是符合格式
    validWardZoneJsonObject(jsonObject, function (result) {

        if (result) {
            //通過的話

            //2.確認有沒有新的護理站資料進來
            insertNoExistWardzone(jsonObject, function (result) {


                var jsonStr = JSON.stringify(jsonObject);

                //加密字串
                tools.encryptKEY(jsonStr, function (result) {

                    var result = JSON.parse(result);
                    result = result['result'];

                    DBAgent.query("UPD_WARD_ZONE_MODULE",
                        {value: result}, function (err) {

                            if (err) {
                                Logger.error(err);
                                console.log(err);
                                callback(false, -9999);

                            } else {

                                callback(true);

                            }

                        });

                })


            })

        } else {
            //沒通過
            callback(false, -10);

        }


    })


};

/**
 * 插入不存在的護理站
 * @param jsonObject
 * @param callback
 */
function insertNoExistWardzone(ward_zone_objects, callback) {

    var funcsArray = Array();

    try {

        _.each(ward_zone_objects, function (ward_zone_object, index) {


            //不存在ward_zone_id的才要做新增的動作
            if (!_.isUndefined(ward_zone_object) && !("ward_zone_id" in ward_zone_object)) {

                funcsArray.push(function (callback) {

                    //如果沒有錯誤，就產生欲插入資料表的物件，並插入資料
                    //在waterfall裡callback

                    try {
                        //都先放第一個院區
                        DBAgent.query("INS_WARD_ZONE", {district_id: 1, ward_zone_name: ward_zone_object['ward_zone_name']}, function (err, rows) {

                            if (err) {

                                Logger.info(err);
                                console.log(err);

                                callback(null);

                            } else {
                                //取得ward_zone_id
                                ward_zone_objects[index]["ward_zone_id"] = rows["insertId"];
                                callback(null);
                            }

                        });


                    } catch (e) {
                        //出錯，設空值並callback
                        //console.log(e);
                        ward_zone_objects[index]["ward_zone_id"] = null;
                        callback(null);
                    }


                });


            }

        });


        //執行
        async.parallel(funcsArray, function (err, result) {
            if (err) {

                console.log(err);

                callback("");

            } else {
                //沒錯誤的話
                callback(ward_zone_objects);
            }


        });


    } catch (e) {
        console.log(e);
        callback("");

    }

}


function validWardZoneJsonObject(ward_zone_objects, callback) {


    _.each(ward_zone_objects, function (ward_zone_object, index) {

        if (!_.isUndefined(ward_zone_object)) {

            if (!('ward_zone_bed_max' in ward_zone_object && validator.isNumber(ward_zone_object['ward_zone_bed_max']))) {

                callback(false);

            }
            else if (!('ward_zone_name' in ward_zone_object && validator.isString(ward_zone_object['ward_zone_name']))) {

                callback(false);

            }
            else if (!('module_eng_name' in ward_zone_object && validator.isValidModule(ward_zone_object['module_eng_name']))) {

                callback(false);

            }


            if (index + 1 == ward_zone_objects.length) {
                //上面驗證都通過，而且到了最後一個了
                callback(true);
            }

        } else {

            callback(false);

        }


    });


}


var validator = {

    isString: function (input) {

        if (typeof input === 'string' && input != "") {
            return true;
        }
        return false;
    },
    isNumber: function (input) {

        if (!isNaN(input) && input != "0" || input != 0) {
            return true;
        }

        return false;
    },
    isValidModule: function (toArray) {


        try {

            //如果狀態有值，一一驗證每個值是不是這四個狀態的其中一個
            for (var i = 0; i < toArray.length; i++) {

                if (toArray[i] !== "Bit" && toArray[i] !== "SIP" && toArray[i] !== "EWhiteBoard") {
                    //console.log(toArray[i]);
                    return false;
                }

            }

            return true;


        } catch (e) {

            return false;

        }


    }


}


/**
 * 更新護理站病床上限
 * **/
exports.updateWardZoneBedInfoUpdate = function (jsonObject, callback) {

    //1.確認資料是不是符合格式
    try {

        //得到當前的護理站資訊
        this.getWardZoneModulesInfomation(function (decryptStr) {

            //2.更新病床數
            updateSelectWardZoneBedNumber(jsonObject, decryptStr, function (resultJson) {


                //3.加密字串後，再存回去
                tools.encryptKEY(JSON.stringify(resultJson), function (result) {

                    //轉成jsonObject
                    result = JSON.parse(result);

                    //取得result的欄位
                    result = result["result"];


                    DBAgent.query("UPD_WARD_ZONE_MODULE",
                        {value: result}, function (err) {

                            if (err) {
                                Logger.error(err);
                                console.log(err);
                                callback(false, -9999);

                            } else {

                                callback(true);

                            }

                        });

                })


            });


        });


    } catch (e) {

        console.log(e);
        //沒通過
        callback(false, -9999);

    }


};

/**
 * 修改護理站的病床上限
 * @param updadteJsonObjects
 * @param decryptObject
 * @param callback
 */
function updateSelectWardZoneBedNumber(updadteJsonObjects, decryptObject, callback) {

    _.each(updadteJsonObjects, function (updadteJsonObject, index) {

        //物件valid正常的，才要更新
        if (!_.isUndefined(updadteJsonObject)
            && ("ward_zone_id" in updadteJsonObject)
            && ("ward_zone_bed_max" in updadteJsonObject)
            && (validator.isNumber(updadteJsonObject["ward_zone_bed_max"]))) {


            for (var i = 0; i < decryptObject.length; i++) {

                //找到對應的ward_zone_id後，就更新它的ward_zone_bed_max
                if (decryptObject[i]["ward_zone_id"] == updadteJsonObject["ward_zone_id"]) {

                    decryptObject[i]["ward_zone_bed_max"] = updadteJsonObject["ward_zone_bed_max"];

                }

            }

        }

        //跑完最後一個了
        if (index + 1 == updadteJsonObjects.length) {
            callback(decryptObject);
        }

    });


}


/**
 * 更新護理站開放模組
 * **/
exports.updateWardZoneModuleInfoUpdate = function (jsonObject, callback) {

    //1.確認資料是不是符合格式
    try {

        //得到當前的護理站資訊
        this.getWardZoneModulesInfomation(function (decryptStr) {

            //2.更新可用模組
            updateSelectWardZoneModule(jsonObject, decryptStr, function (resultJson) {


                //3.加密字串後，再存回去
                tools.encryptKEY(JSON.stringify(resultJson), function (result) {

                    //轉成jsonObject
                    result = JSON.parse(result);

                    //取得result的欄位
                    result = result["result"];


                    DBAgent.query("UPD_WARD_ZONE_MODULE",
                        {value: result}, function (err) {

                            if (err) {
                                Logger.error(err);
                                console.log(err);
                                callback(false, -9999);

                            } else {

                                callback(true);

                            }

                        });

                })


            });


        });


    } catch (e) {

        console.log(e);
        //沒通過
        callback(false, -9999);

    }


};

/**
 * 修改護理站的可用模組
 * @param updadteJsonObjects
 * @param decryptObject
 * @param callback
 */
function updateSelectWardZoneModule(updadteJsonObjects, decryptObject, callback) {

    _.each(updadteJsonObjects, function (updadteJsonObject, index) {

        //物件valid正常的，才要更新
        if (!_.isUndefined(updadteJsonObject)
            && ("ward_zone_id" in updadteJsonObject)
            && ("module_eng_name" in updadteJsonObject)
            && (validator.isValidModule(updadteJsonObject["module_eng_name"]))) {


            for (var i = 0; i < decryptObject.length; i++) {

                //找到對應的ward_zone_id後，就更新它的ward_zone_bed_max
                if (decryptObject[i]["ward_zone_id"] == updadteJsonObject["ward_zone_id"]) {

                    decryptObject[i]["module_eng_name"] = updadteJsonObject["module_eng_name"];

                }

            }

        }

        //跑完最後一個了
        if (index + 1 == updadteJsonObjects.length) {
            callback(decryptObject);
        }

    });


}


/**
 * 刪除護理站
 * **/
exports.deleteWardZoneModulesInfomation = function (ward_zone_ids, callback) {

    if (ward_zone_ids instanceof Array) {

        //1.取得原先的資料
        _this.getWardZoneModulesInfomation(function (originData) {

            //2.從原本先資料，砍掉護理站
            deleteExistWardzone(ward_zone_ids, originData, function (newData) {

                var jsonStr = JSON.stringify(newData);

                //3.加密字串，並存資料庫
                tools.encryptKEY(jsonStr, function (result) {

                    var result = JSON.parse(result);
                    result = result['result'];

                    DBAgent.query("UPD_WARD_ZONE_MODULE",
                        {value: result}, function (err) {

                            if (err) {
                                Logger.error(err);
                                console.log(err);
                                callback(false, -9999);

                            } else {

                                callback(true);

                            }

                        });

                })

            });


        })

    } else {
        //沒通過
        callback(false, -10);

    }


};


/**
 * 刪除護理站
 * @param jsonObject
 * @param callback
 */
function deleteExistWardzone(ward_zone_ids,decryptObject, callback) {

    async.series([

        function(callback){
        //1.砍資料庫裡面的資料
            wardZoneService.deleteWardzone(ward_zone_ids,function(result){
                callback(null);
            })

        }


    ],function(err,result){

        //2.砍加密字串內的資料
        _.each(ward_zone_ids, function (ward_zone_id, index) {

            //物件valid正常的，才要更新
            if (!_.isUndefined(ward_zone_id)) {

                for (var i = 0; i < decryptObject.length; i++) {

                    //找到對應的ward_zone_id後，就更新它的ward_zone_bed_max
                    if (decryptObject[i]["ward_zone_id"] == ward_zone_id) {

                        decryptObject.splice(i, 1);

                    }

                }

            }

            //跑完最後一個了
            if (index + 1 == ward_zone_ids.length) {
                callback(decryptObject);
            }

        });


    });





}