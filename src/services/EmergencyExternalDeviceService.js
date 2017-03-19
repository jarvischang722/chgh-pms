/**
 * Created by Ian on 2016/10/25.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var Logger = require("../plugins/Log4js").Logger();
var request = require('request');
var parseString = require('xml2js').parseString;
var async = require("async");
var _this=this;
/**
 * 依sip裝置類別id，取得所有sip裝置的分派表
 * */

exports.queryEmergencyExternalDevice = function(ward_name,emergency_external_device_class_no,callback){


    if(ward_name!=""){
        //病房名稱
        DBAgent.query("QRY_EMERGENCY_EXTERNAL_DEVICE_BY_BED",{ward_name:ward_name} , function(err , rows){

            if(err){
                Logger.error(err);
                console.log(err);
                callback(false,-9999);

            }else{

                callback(rows);

            }


        },"SIP");

    }else if(emergency_external_device_class_no!=""){
        //裝置種類no
        DBAgent.query("QRY_EMERGENCY_EXTERNAL_DEVICE_BY_CLASS",{emergency_external_device_class_no:emergency_external_device_class_no} , function(err , rows){

            if(err){
                Logger.error(err);
                console.log(err);
                callback(false,-9999);

            }else{

                callback(rows);

            }


        },"SIP");


    }else{



        DBAgent.query("QRY_EMERGENCY_EXTERNAL_DEVICE",{} , function(err , rows){

            if(err){
                Logger.error(err);
                console.log(err);
                callback(false,-9999);

            }else{

                callback(rows);

            }


        },"SIP");


    }

};



exports.queryEmergencyExternalDeviceClass = function(callback){


    DBAgent.query("QRY_EMERGENCY_EXTERNAL_DEVICE_CLASS",{} , function(err , rows){

        if(err){
            Logger.error(error);
            callback(false,-9999);

        }else{

            callback(rows);

        }

    });
}





/**
 * 插入緊急外部裝置
 * */
exports.insertEmergencyExternalDevice = function(device_name,device_class_no,device_IP,ward_name, callback){


    if(checkExternalDeviceDataValid(device_name,device_class_no,device_IP,ward_name)){

        var comments="";

        if(device_class_no==1){
            //0-病房燈號需填寫《病房名稱》
            comments=ward_name;

        }else if(device_class_no==2){
            //1-走道LED看板需填寫《裝置名稱》
            comments=device_name;

        }else{
            comments="";

        }

        DBAgent.query("INS_EMERGENCY_EXTERNAL_DEVICE",{comments:comments,device_class_no:device_class_no,device_IP:device_IP} , function(err , rows){

            if(err){
                Logger.error(err);
                console.log(err);
                callback(false,-9999);

            }else{

                callback(rows);

            }

        },"SIP");

    }else{

        callback(false,-10);

    }

};



/**
 * 刪除緊急外部裝置
 * */
exports.deleteEmergencyExternalDevice = function(emergency_external_device_ids, callback){

    if(emergency_external_device_ids instanceof Array){

        async.each(emergency_external_device_ids, function(emergency_external_device_id, callback){

            DBAgent.query("DEL_EMERGENCY_EXTERNAL_DEVICE",{emergency_external_device_id:emergency_external_device_id} , function(err , rows){

                if(err){
                    Logger.error(err);
                    console.log(err);
                    callback(err);

                }else{

                    callback(null);

                }

            },"SIP");



        }, function(err) {

            if( err ) {
                console.log(err);
                callback(false, -9999);

            } else {

                callback(true);
            }

        });



    }else{

        callback(false,-10);

    }







};



/**
 * 更新緊急外部裝置
 * */
exports.updateEmergencyExternalDevice = function(emergency_external_device_id,device_name,device_class_no,device_IP,ward_name, callback){


    if(checkExternalDeviceDataValid(device_name,device_class_no,device_IP,ward_name) && emergency_external_device_id!=0){

        var comments="";

        if(device_class_no==1){
            //1-病房燈號需填寫《病房名稱》
            comments=ward_name;

        }else if(device_class_no==2){
            //2-走道LED看板需填寫《裝置名稱》
            comments=device_name;

        }else{
            comments="";

        }



        DBAgent.query("UPD_EMERGENCY_EXTERNAL_DEVICE",{
            emergency_external_device_id:emergency_external_device_id,
            comments:comments,
            device_class_no:device_class_no,
            device_IP:device_IP} , function(err , rows){

            if(err){
                Logger.error(err);
                Logger.error(err);
                console.log(err);
                callback(false,-9999);

            }else{

                callback(rows);

            }

        },"SIP");

    }else{

        callback(false,-10);

    }

};



function checkExternalDeviceDataValid(device_name,device_class_no,device_IP,ward_name){

    //若選擇1-走道LED看板需填寫《裝置名稱》
    if(device_name == "" && device_class_no==2){
        return false;
    }

    else if(device_IP == ""){
        return false;
    }

    else if(device_class_no == ""){

        return false;
    }


    else if(ward_name == "" && device_class_no==1){
        //0病房燈號的裝置，要寫病房名稱
        return false;
    }

    else{

        return true;

    }

}