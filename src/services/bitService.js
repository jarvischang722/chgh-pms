/**
 * Created by Eason on 2016/12/17.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require('async');

/**
 * 取得點滴參數設定檔
 * */
exports.getBitSet = function(callback){
    DBAgent.query("QRY_BIT_COMMON_CONFIG", {} , function(error , result){
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
 * 修改點滴參數設定檔
 * */
exports.updateBitSet = function(data,callback){
    DBAgent.updateExecute("UPDATE_BIT_COMMON_CONFIG", data , function(error , result){
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
 * 取得個別點滴參數
 * */
exports.getBitBedConfig = function(data,callback){
    var ADD_DATA=[];
    var bit_common_config={};
    async.series([
            function(callback) { //刪除個別點滴參數
                DBAgent.updateBatchExecute("DEL_BIT_BED_CONFIG",{}, function (error , result) {
                    if(error){
                        callback(error, null);
                    }else{
                        if(result && result.length<1){
                            callback({code:-1}, null);
                        }else{
                            callback(null,null);
                        }
                    }
                });
            }
            ,function(callback) {  //取得共用點滴系統參數
                DBAgent.query("QRY_BIT_COMMON_CONFIG", {} , function(error , result){
                    if(error){
                        Logger.error(error);
                        console.error(error);
                        callback(error, null);
                    }else{
                        bit_common_config = result[0];
                        callback(null,result);
                    }
                });
            }
            ,function(callback) {  //搜尋待新增的個別點滴系統參數
                DBAgent.query("QRY_ADD_BIT_BED_CONFIG", {} , function(error , result){
                    if(error){
                        Logger.error(error);
                        console.error(error);
                        callback(error, null);
                    }else{
                        ADD_DATA = result;
                        for(var i=0;i<ADD_DATA.length;i++){
                            var thisobj = ADD_DATA[i];
                            for(var key in bit_common_config){
                                if(key!='id'){
                                    thisobj[key] = bit_common_config[key];
                                }

                            }
                            thisobj["last_update_time"] = data.last_update_time;
                            thisobj["update_user"] = data.update_user;
                            thisobj["bit_distribute_record_id"] = thisobj["id"];
                            thisobj["bit_pipe_class_id"] = '1';
                            thisobj["bit_class_no"] = 'B0011';
                            thisobj["sampling_count"] = 0;
                            delete thisobj.id;
                            delete thisobj.bed_id;
                            delete thisobj.bit_no;
                            delete thisobj.measure_method;
                        }
                        callback(null,result);
                    }
                });
            }
            ,function(callback) {  //新增個別點滴參數
                console.log("===ADD_DATA===");
                console.log(ADD_DATA);
                DBAgent.updateBatchExecute("ADD_BIT_BED_CONFIG",ADD_DATA, function (error , result) {
                    if(error){
                        callback(error, null);
                    }else{
                        if(result && result.length<1){
                            callback({code:-1}, null);
                        }else{
                            callback(null,null);
                        }
                    }
                });
            }
            ,function(callback) {  //搜尋個別點滴參數
                console.log("===getBitBedConfig data===");
                console.log(data);
                DBAgent.query("QRY_BIT_BED_CONFIG", data, function(error , result){
                    if(error){
                        callback(error, null);
                    }else{
                        callback(error,result);
                    }
                });
            }
        ],
        // optional callback
        function(error, results) {
            console.log("===error===");
            console.log(error);
            console.log("===results===");
            console.log(results[4]);

            if(error){
                Logger.error(error);
                console.error(error);
                error.code ? callback(false,error.code) : callback(false,"9999");
            }else{
                callback(results[4]);
            }
        });
};

/**
 * 修改個別點滴參數設定檔
 * */
exports.updateBitBedConfig = function(data,callback){
    DBAgent.updateExecute("UPDATE_BIT_BED_CONFIG", data , function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            callback(result);
        }
    });
};