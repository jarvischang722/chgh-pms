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

/**
 * 依sip裝置類別id，取得所有sip裝置的分派表
 * */

exports.getSIPDistribute = function(sip_device_class_id,start, per_page,is_assign, callback){


    start = parseInt(start);
    per_page = parseInt(per_page);


    if(sip_device_class_id!=0){


        DBAgent.query("QRY_SIP_DISTRIBUTE_BY_CLASS_REMOTE",{sip_device_class_id:sip_device_class_id,start:start, per_page:per_page} , function(err , rows){

            if(err){
                Logger.error(err);
                console.log(err);
                callback(false,-9999);

            }else{

                callback(rows);

            }


        },"SIP");


    }else{


        if(is_assign=='yes'){

            DBAgent.query("QRY_SIP_DISTRIBUTE_REMOTE",{start:start, per_page:per_page} , function(err , rows){

                if(err){
                    Logger.error(err);
                    console.log(err);
                    callback(false,-9999);

                }else{

                    callback(rows);

                }


            },"SIP");


        }else{
            //未指派的
            DBAgent.query("QRY_SIP_DISTRIBUTE_REMOTE_NO_ASSIGN",{start:start, per_page:per_page} , function(err , rows){

                if(err){
                    Logger.error(err);
                    console.log(err);
                    callback(false,-9999);

                }else{

                    callback(rows);

                }


            },"SIP");

        }



    }

};



exports.getSIPDeviceClass = function(callback){


    DBAgent.query("QRY_SIP_DEVICE_CLASS",{} , function(err , rows){

        if(err){
            Logger.error(error);
            callback(false,-9999);

        }else{

            callback(rows);

        }

    });
}





/**
 * 更新sip分派
 * */

exports.updateSIPDistribute = function(phoneno,transno,da,phoneShowContent,ward_name, callback){


    if(checkSIPDeviceDataValid(phoneno,transno,da,phoneShowContent,ward_name)){

        var monitor=0;

        //裝置型態為1,8,9,10,11，monitor 欄位一律填
        if(da==1 || da==8 || da==9|| da==10 || da==11){

            monitor=1;
        }

        DBAgent.query("UPD_SIP_DISTRIBUTE_REMOTE",{transno:transno,da:da, realname:phoneShowContent, comments:ward_name, phoneno:phoneno,monitor:monitor} , function(err , rows){

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
 * 刪除SIP裝置分派
 * */
exports.deleteSIPDistribute = function(phonenos, callback){


    if(phonenos instanceof Array){

        async.each(phonenos, function(phoneno, callback){

            DBAgent.query("DEL_SIP_DISTRIBUTE_REMOTE",{phoneno:phoneno} , function(err , rows){

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

function checkSIPDeviceDataValid(phoneno,transno,da,phoneShowContent,ward_id){


    if(phoneno == ""){
        return false;
    }

    else if(da == ""){
        return false;
    }

    //裝置型態為8'9'10'11，必填病房歸屬
    else if(ward_id == 0 && (da==8 || da==9 || da==10 || da==11)){

        return false;
    }

    else if(phoneShowContent == ""){
        return false;
    }

    //裝置型態為10及11，必填類比緊急系統代碼，然後類比緊急系統代碼的長度限制為10
    else if(transno == "" && (da==10 || da==11) || transno.length>10){

        return false;

    }else{

        return true;

    }

}