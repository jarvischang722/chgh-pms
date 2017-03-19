/**
 * Created by Eason on 2016/10/16.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");

/**
 * 取得所有時段資料
 * */
exports.getAllTimePeriod = function(callback){
    DBAgent.query("QRY_ALL_PERIOD",{} , function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            if(result.length>0){
                for (var i=0;i<result.length;i++){
                    var thisobj = result[i];
                    console.log(thisobj);
                    var start_time = thisobj.start_time.substring(0,5);
                    thisobj.start_time = start_time;
                    thisobj.start_hour = start_time.split(":")[0];
                    thisobj.start_min = start_time.split(":")[1];
                    var end_time = thisobj.end_time.substring(0,5);
                    thisobj.end_time = end_time;
                    thisobj.end_hour = end_time.split(":")[0];
                    thisobj.end_min = end_time.split(":")[1];
                    console.log(thisobj);
                }
            }
            callback(result);
        }
    });
};

/**
 * 新增時段資料
 * */
exports.insertTimePeriod = function(req,callback){
    console.log("===req===");
    req.start_time = req.start_hour+":"+req.start_min;
    req.end_time = req.end_hour+":"+req.end_min;
    delete req.start_hour;
    delete req.start_min;
    delete req.end_hour;
    delete req.end_min;
    console.log(req);
    DBAgent.query("QRY_MAX_PERIOD",{} , function(error , result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            req.class_id = parseInt(result[0].id,10) + 1;
            console.log("===result.class_id===");
            console.log(result[0].class_id);
            DBAgent.updateExecute("ADD_PERIOD", req , function(error , result){
                if(error){
                    Logger.error(error);
                    console.error(error);
                    error.code ? callback(false,error.code) : callback(false,"9999");
                }else{
                    callback(result);
                }
            });
        }
    });
};

/**
 * 刪除時段資料
 * */
exports.deleteTimePeriod = function(periods,callback){
    if(periods instanceof Array){
        DBAgent.updateBatchExecute("DEL_PERIOD",periods, function (error , result) {
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

/**
 * 修改時段資料
 * */
exports.updateTimePeriod = function(req,callback){
    console.log("===req===");
    req.start_time = req.start_hour+":"+req.start_min;
    req.end_time = req.end_hour+":"+req.end_min;
    console.log(req);
    DBAgent.updateExecute("UPDATE_PERIOD", req , function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            callback(result);
        }
    });
};