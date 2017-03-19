/**
 * Created by Eason on 2016/10/16.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require('async');

/**
 * 取得所有群組資料
 * */
exports.getAllFireMission = function(type,callback){
    var sql;
    console.log("===type===");
    console.log(type);
    if(type=="F"){
        sql = "QRY_F_GROUP";
    }else{
        sql = "QRY_M_GROUP";
    }
    DBAgent.query(sql, {} , function(error , result){
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
 * 新增群組資料
 * */
exports.insertFireMission = function(req,callback){
    console.log("===req===");
    var sql_str = req.type=='F'?"ADD_FIRE":"ADD_MISSION";
    delete req.type;
    console.log(req);
    DBAgent.updateExecute(sql_str, req , function(error , result){
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
 * 刪除群組資料
 * */
exports.deleteFireMission = function(groups,callback){
    var groupF=[];
    var groupM=[];
    for(var i=0;i<groups.length;i++){
        if(groups[i].type=="F"){
            groupF.push(groups[i]);
        }else{
            groupM.push(groups[i]);
        }
    }
    console.log("===groupF===");
    console.log(groupF);
    console.log("===groupM===");
    console.log(groupM);
    async.series([
            function(callback) {
                if(groupF instanceof Array){
                    DBAgent.updateBatchExecute("DEL_FIRE",groupF, function (error , result) {
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
                }else{
                    //輸入格式錯誤
                    callback(null,null);
                }
            }
            ,function(callback) {
                if(groupF instanceof Array){
                    DBAgent.updateBatchExecute("DEL_MISSION",groupM, function (error , result) {
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
                }else{
                    //輸入格式錯誤
                    callback(null,null);
                }
            }
        ],
        // optional callback
        function(error, results) {
            console.log("===error===");
            console.log(error);
            console.log("===results===");
            console.log(results);

            if(error){
                Logger.error(error);
                console.error(error);
                error.code ? callback(false,error.code) : callback(false,"9999");
            }else{
                callback(true);
            }
        });
};

/**
 * 修改群組資料
 * */
exports.updateFireMission = function(req,callback){
    console.log("===req===");
    var sql_str = req.type=='F'?"UPDATE_FIRE":"UPDATE_MISSION";
    DBAgent.updateExecute(sql_str, req , function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            callback(result);
        }
    });
};