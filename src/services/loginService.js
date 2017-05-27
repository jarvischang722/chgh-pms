
/**
 * Created by Ian on 2016/10/26.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var sha1 = require("sha1");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require('async');
var moment = require("moment");

/**
 * 員工登入
 * */
exports.login = function(login_data,callback){


    //加入當前時間
    login_data. current_date = moment().format("YYYY/MM/DD");

    if(!checkLoginInfo(login_data)){

        callback(false,-9000);
        return;

    }else{

        DBAgent.query("CHECK_VALID_USER_DATA",login_data , function(err , rows){

            if(err){

                Logger.error(err);

                callback(false,-9999);

            }else if(rows.length==1){
                //有找到唯一一筆的員工資料





                //補上欲登入的系統名稱
                rows[0]['system_type']=login_data.system_type;
                callback(rows);



            }else{
                //登入失敗

                callback(false,-9000);
            }



        });

    }



};





/**
 * 更換病房區，寫入登出記錄、
 * 員工登出，也要寫入
 * */
exports.insertLeaveLog = function(account,log_system_type,ward_zone_id,user_role_id,callback){


    DBAgent.query("INS_LOG_HISTORY",{account:account,log_system_type:log_system_type,ward_zone_id:ward_zone_id,log_type:"logout"} , function(err , rows){

        if(err){

            Logger.error(err);

            callback(false,-9999);

        }else{

            callback(true);

        }

    });


};


/**
 * 登入紀錄log
 * */
exports.checkAllowLoginWardZone = function(account,log_system_type,ward_zone_id,user_role_id,callback){


    async.parallel([

            function(callback){

                DBAgent.query("QRY_WARD_ZONE_PRIVILEGE_BY_USER_ROLE_ID_AND_WARD_ZONE_ID",{user_role_id:user_role_id,ward_zone_id:ward_zone_id} , function(err , rows){

                    if(err){

                        Logger.error(err);

                        callback(err,-9999);

                    }else if(rows.length>0){
                        //有找到資料

                        callback(null);


                    }else{
                        //登入失敗

                        callback(-9200,-9200);
                    }


                })
            }

    ],function (err, results) {


        if(err){
            //驗證失敗
            Logger.error(err);
            callback(false,-9200);

        }else{

            DBAgent.query("INS_LOG_HISTORY",{account:account,log_system_type:log_system_type,ward_zone_id:ward_zone_id,log_type:"login"} , function(err , rows){

                if(err){

                    Logger.error(err);

                    callback(false,-9999);

                }else{

                    callback(true);

                }

            });

        }


    });




};


/*** Functions   **/
function checkLoginInfo(login_data){

    var result = false;

    if(_.size(login_data) < 1){


    }else if(!isVaild(login_data["employee_account"])){


    }else if(!isVaild(login_data["employee_password"])){


    }else if(!isVaild(login_data["system_type"])){


    }
    else{

        result=true;
    }

    return result;

}

function isVaild(value){
    if(_.isUndefined(value) ||_.isEmpty(value) ){
        return false;
    }
    return true;
}