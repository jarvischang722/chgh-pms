/**
 * Created by Ian on 2016/12/01.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require("async");

/**
 * 插入還沒有SIP IP的護理站
 * */
exports.insertNonIPWardzone = function(callback){

    DBAgent.query("INS_NON_EXIST_SIP_IP",{} , function(err , rows){
        if(err){
            Logger.error(err);
            rows = [];
        }
        callback(rows);
    });

};


/**
 * 取得所有SIP IP
 * */
exports.getAllSIPIP = function(callback){
    DBAgent.query("QRY_ALL_SIP_IP",{} , function(err , rows){
        if(err){
            Logger.error(error);
            rows = [];
        }
         callback(rows);
    });
};


/**
 * 根據ward_zone_id取得SIP IP清單
 * */
exports.getSIPIPByWardzoneID = function(ward_zone_id, callback){

    var cond = {
        ward_zone_id:ward_zone_id
    };

    DBAgent.query("QRY_SIP_IP_BY_WARDZONE_ID",cond , function(err , rows){

        if(err){
            Logger.error(error);
            rows = [];
        }

        callback(rows);

    });
};


/**
 * 新增SIP IP
 * */
exports.insertSIPIP = function(sipIPObject, callback){



    DBAgent.updateExecute("ADD_SIP_IP", sipIPObject , function(error , result){
        if(error){
            Logger.error(error);
            console.log(error);
            callback(false, -9999);
        }else{
            callback(true);
        }
    });


};



/**
 * 更新SIP IP
 * */
exports.updateSIPIP = function(sip_ip_object, callback){




    if(sip_ip_object.sip_ip!=""
        && sip_ip_object.sip_ip_id!=""
        && sip_ip_object.DBAccount!=""
        && sip_ip_object.DBPassword!=""
        && sip_ip_object.DBPort!=""
        && sip_ip_object.DBName!=""
        && sip_ip_object.update_user!=""){

        DBAgent.updateExecute("UPDATE_SIP_IP", sip_ip_object , function(error , result){
            if(error){
                Logger.error(error);
                console.log(error);
                callback(false, -9999);
            }else{
                callback(true);
            }
        });


    }else{

        callback(false,-10);

    }




};



/**
 * 刪除SIP IP
 * */
exports.deleteSIPIP = function(sip_ip_ids, callback){

   var deleteFuncsArray=Array();

    if(sip_ip_ids instanceof Array){

        _.each(sip_ip_ids, function(sip_ip_id){

            if(!_.isUndefined(sip_ip_id)) {

                deleteFuncsArray.push(
                    function (callback) {

                        DBAgent.updateExecute("DEL_SIP_IP" , {id: sip_ip_id} , function(err , result){
                            callback(err,result)
                        })
                    }
                );
            }

        })

        async.parallel(deleteFuncsArray , function(err, result){
            if(err){

                callback(false,-9999);

            }else{

                callback(true);
            }

        })



    }else{

        callback(false,-10);
    }




};


/**
 * 確認SIP是否異常的時間間隔
 * */
exports.SIPGetCheckInterval = function(callback){

    DBAgent.query("QRY_SIP_CHECK_INTERVAL_ONLY_PARAM",{} , function(err , rows){

        if(err){

            Logger.error(err);
            rows = [];

        }else{

            try{

                var debug_time=rows[0];

                debug_time=debug_time["debug_time"];

                callback(debug_time);

            }catch(e){

                //出錯就回傳預設的5分鐘
                callback(5);

            }


        }



    });
};


/**
 * 確認SIP是否異常
 * */
exports.SIPCheckIsOnline = function(callback){
    DBAgent.query("QRY_OFFLINE_SIP_IP",{} , function(err , rows){
        if(err){
            Logger.error(err);
            rows = [];
        }
        callback(rows);
    },"SIP");
};