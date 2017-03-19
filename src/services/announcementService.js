/**
 * Created by Eason on 2016/10/23.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");

/**
 * 取得所有病房公告
 * */
exports.getAllAnnouncement = function(ward_zone_id,callback){
    DBAgent.query("QRY_ALL_ANNOUNCEMENT",{"ward_zone_id":ward_zone_id} , function(error , result){
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
 * 新增病房公告資料
 * */
exports.insertAnnouncement = function(req,callback){
    console.log("===req===");
    req.start_datetime = req.ope_range.trim().split("~")[0];
    req.end_datetime = req.ope_range.trim().split("~")[1];
    delete req.ope_range;
    console.log(req);
    DBAgent.updateExecute("ADD_ANNOUNCEMENT", req , function(error , result){
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
 * 刪除病房公告資料
 * */
exports.deleteAnnouncement = function(anns,callback){
    if(anns instanceof Array){
        DBAgent.updateBatchExecute("DEL_ANNOUNCEMENT",anns, function (error , result) {
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
 * 修改病房公告資料
 * */
exports.updateAnnouncement = function(req,callback){
    console.log("===req===");
    req.start_datetime = req.ope_range.trim().split("~")[0];
    req.end_datetime = req.ope_range.trim().split("~")[1];
    console.log(req);
    DBAgent.updateExecute("UPDATE_ANNOUNCEMENT", req, function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            callback(result);
        }
    });
};