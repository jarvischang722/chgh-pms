/**
 * Created by Ian on 2016/12/19.
 * 定時抓資料的Cron主程式
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require("async");
var moment = require("moment");

//獨立的mysql
var mysql = require('mysql');

var sipIPService = require("../services/sipIPService");

var sipSchedule = require('node-schedule');

var DBConfig = require("../configs/DBConfig.js");
var _this = this;

//全域變數，用來儲存Cron的instance
G_SIPCron=null;


exports.getSIPCron = function(){

return G_SIPCron;

}

exports.setSIPCron = function(CronObject){

    G_SIPCron = CronObject;

}


/**
 * 定時抓取SIP通聯紀錄
 * */
exports.SIPRecordStart = function(){
    console.log("=== Execute SIPRecordStart===");
    if(G_SIPCron!=null){
        //如果原本有排程，砍掉舊的
        G_SIPCron.cancel();
        G_SIPCron=null;
    }

    //固定sync的時間
    var sync_period=0;


    DBAgent.query("QRY_SIP_PARAM", {}, function (err, sipRows) {
        if(err){
            Logger.error(err);
            console.log(err);

        }else{

            try{
                //1.取得固定sync的時間，只取"小時"
                if("get_call_record_time" in sipRows[0]){
                    sync_period=sipRows[0]["get_call_record_time"];
                    sync_period=sync_period.split(":");
                    sync_period=sync_period[0];

                    if(isNaN(sync_period)){
                        //小時的部份，不為數字
                        sync_period="00";
                    }

                }else{
                    sync_period="00";
                }

            }catch(e){
                sync_period="00";
            }


            //2.啟動排程，並把排程物件存至G_SIPCron
                G_SIPCron=sipSchedule.scheduleJob('00 '+sync_period+' * * *', function(){
                    console.log("開始向已設定的SIP IP抓取SIP的通訊紀錄");
                    Logger.log("開始向已設定的SIP IP抓取SIP的通訊紀錄")
                    getSIPIPS();
                })


        }

    });

};



//取得本機儲存的sipip資料
var getSIPIPS = function(){

/*
目前都用DBConfig裡面的SIP Server當測試
sipIPService.getAllSIPIP(function(rows){

        for(var i=0;i<rows.length;i++){

            var row=rows[i];

            if("sip_ip" in row && "ward_zone_id" in row){
                //依據這兩個開始去遠端抓資料，及插入本機
                //console.log(row["sip_ip"], row["ward_zone_id"]);
                getSIPRecordFromRemote(row["sip_ip"], row["ward_zone_id"]);
            }


        }

    });

    */

    getSIPRecordFromRemote(DBConfig.SIP.host, 0);

}


//從遠端取得SIP資料，並插入本機
var getSIPRecordFromRemote=function(sip_ip, ward_zone_id){

    try{

        //暫時都只連線DBConfig設定的SIP Server位置

        var connection = mysql.createConnection({
            host : sip_ip,
            user :DBConfig.SIP.user,
            password :DBConfig.SIP.password,
            database :DBConfig.SIP.database,
            port :DBConfig.SIP.port,
            timezone :DBConfig.SIP.timezone
        });


        connection.connect();

        //只抓前一天的00:00:01到今天這個時間的資料
        var StartDateTime = moment().subtract(1, "days").format("YYYY-MM-DD 00:00:01");


        connection.query("select id,clid,dstchannel,start,answer,end,duration,billsec, disposition,type, emercanceltime from cdrtable " +
            "where start >= ? ",
            [StartDateTime],
            function(err, rows) {
            if (err){
                Logger.error(err);

                console.log("連線sip資料庫失敗，ip:"+sip_ip);
                //console.log(err);

            } else{
                console.log("連線sip資料庫成功");
                //連線成功並取得資料時
                insertSIPRecord(ward_zone_id,rows);
            }

            connection.end();

        });


    }catch(e){

        Logger.error(e);
        console.log("連線sip資料庫失敗");
    }

}


//插入本機
var insertSIPRecord=function(ward_zone_id,rows){

        async.parallel(
            [function(callback){
                //1.清掉舊的

                var StartDateTime = moment().subtract(1, "days").format("YYYY-MM-DD 00:00:01");

                //砍掉前一天的00:00:01到今天這個時間的資料
                DBAgent.updateExecute("DEL_SIP_RECORD", {StartDateTime:StartDateTime} , function(error , result){
                    if(error){
                        Logger.error(error);
                        console.log(error);
                        callback(error,"");
                    }else{
                        callback(null,"");
                    }



                });


            },function(callback){
                //轉成array才能做bulk insert

                var resultArray=[];

                for(var i=0;i<=rows.length;i++){

                    if(i==rows.length){
                        //長度相等時，代表已經處理完成
                        callback(null,resultArray);
                        break;

                    }else{

                        var row=rows[i];

                        try{

                            var tempArray=[
                                row.clid,
                                row.dstchannel,
                                row.start,
                                row.answer,
                                row.end,
                                row.duration,
                                row.billsec,
                                row.disposition,
                                row.type,
                                row.emercanceltime,
                                ward_zone_id
                            ];

                            resultArray.push(tempArray);


                        }catch(e){

                            console.log("解析欄位時發生問題");

                        }

                    }


                }



            }]
            , function (err,result) {
                //2.插入新的

                result=result[1];
                //console.log(result);

                if(err){
                    //刪除失敗
                    Logger.error(err);


                }else{

                    if(result>1){
                        //有資料，插入新的
                        DBAgent.updateExecute("ADD_SIP_RECORD", result , function(error , result){
                            if(error){
                                Logger.error(error);
                                console.log(error);
                            }
                        });

                    }else{
                        //沒資料
                        Logger.error("No SIP Record Exist");
                        console.log("No SIP Record Exist");
                    }

                }

            });


}

