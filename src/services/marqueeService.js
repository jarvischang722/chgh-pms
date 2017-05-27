/**
 * Created by Eason on 2016/10/16.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");


/**
 * 取得目前時間內的跑馬燈資料
 * */
exports.getCurrentMarquee = function(callback){
    DBAgent.query("QRY_CURRENT_MARQUEE",{} , function(error , result){
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
 * 取得所有跑馬燈資料
 * */
exports.getAllMarquee = function(callback){
    DBAgent.query("QRY_ALL_MARQUEE",{} , function(error , result){
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
 * 新增跑馬燈資料
 * */
exports.insertMarquee = function(req,callback){
    console.log("===req===");
    req.start_datetime = req.ope_range.trim().split("~")[0];
    req.end_datetime = req.ope_range.trim().split("~")[1];
    delete req.ope_range;
    console.log(req);
    DBAgent.updateExecute("ADD_MARQUEE", req , function(error , result){
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
 * 刪除跑馬燈資料
 * */
exports.deleteMarquee = function(marquees,callback){
    if(marquees instanceof Array){
        DBAgent.updateBatchExecute("DEL_MARQUEE",marquees, function (error , result) {
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
 * 修改跑馬燈資料
 * */
exports.updateMarquee = function(req,callback){
    console.log("===req===");
    req.start_datetime = req.ope_range.trim().split("~")[0];
    req.end_datetime = req.ope_range.trim().split("~")[1];
    delete req.ope_range;
    console.log(req);
    DBAgent.updateExecute("UPDATE_MARQUEE", req , function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            callback(result);
        }
    });
};