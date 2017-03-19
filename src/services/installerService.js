/**
 * Created by Ian on 2016/10/25.
 */
var CryptoJS = require("crypto-js");
var systemConfig = require('../configs/SystemConfig');
var moduleNameMappingList = require('../configs/moduleNameMappingList');
var tools = require("../utils/commonTools");


var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var mysql =require("mysql");
var moment = require("moment");
var async = require('async');

/**
 * 確認是否已安裝
 * */
exports.checkKeyExist = function(callback){

    var isInstalled=false;

    //查詢是否已新增過
    DBAgent.query("QRY_KEY",{} , function(err , rows){

        if(err){

            console.error(err);

        }else{
            console.log("length:"+rows.length);
            if(rows.length>0){
                //KEY的資料表有資料的話，就表示有安裝過
                isInstalled=true;

            }
        }

        callback(isInstalled);
    });


};



/**
 * 檢查key值是否valid並回傳相關資訊
 * */
exports.checkKey = function(key, callback){


    tools.checkKey(key,function(isValidKey){

        if(isValidKey){

            var resultObject={};


                    tools.getInfoFromKey(key,function(result){

                        resultObject.FunctionList=result.function_list;
                        resultObject.MaxUser=result.max_user_number;
                        callback(resultObject);

                    });



        }else{

            callback(false,-8888);

        }


    });




};


//取得valid的模組資料
function getValidFunctionList(FunctionList){

    var dataList=[];

    for(var index=0 ;index< FunctionList.length; index++){

        var Function =FunctionList[index];

        if(Function in moduleNameMappingList.nameArray){
            //如果config中，有該項目的中文名稱的話，才要插入資料庫

            var data=[moduleNameMappingList.nameArray[Function],Function,"Y"];
            dataList.push(data);
        }

    }

    return dataList;

}

/**
 * 檢查key值是否valid並回傳相關資訊
 * */
exports.installFunction = function(key, FunctionList, callback){


    //去掉空白
    key=key.trim();

    tools.getMaxUser(function(maxUser){

                   if(maxUser==0){
                       //未安裝過

                               if(tools.checkKey(key)){

                                   //開始插入資料庫
                                   async.series(
                                       [function(callback){
                                           //1.INSERT function model

                                           DBAgent.updateExecute("INS_FUNCTION", getValidFunctionList(FunctionList) , function(error , result){
                                               if(error){
                                                   Logger.error(error);
                                               }
                                               callback(null);
                                           });


                                       },function(callback){
                                           //2.INSERT key

                                           DBAgent.updateExecute("INS_KEY",
                                               {
                                                   key : key,
                                                   install_datetime : moment().format("YYYY/MM/DD hh:mm:ss")
                                               }
                                               , function(error){
                                                   if(error){
                                                       console.error(error);
                                                   }
                                                   callback(null);
                                               });

                                       }]
                                       , function (err, results) {

                                           if(err){
                                               //插入序號及模組失敗
                                               Logger.error(err);
                                               callback(false,-9999);

                                           }else{

                                               //插入序號及模組成功
                                               callback(true);
                                           }

                                       });





                               }else{
                                   //序號有誤
                                   callback(false,-8888);

                               }


                    }else{

                        //已經安裝過
                        callback(false,-7777);

                    }

    });








};




/**
 * 取得產品序號及產品可用人數
 * */
exports.getKeyAndMaxUser = function(callback){


    async.parallel([

        function(callback){

            tools.getKey(function(result){

                callback(null,result);

            });

        },
        function(callback){

            tools.getMaxUser(function(result){

                callback(null,result);

            });

        }

    ],function (err, results) {


            if(err){
                //插入序號及模組失敗
                Logger.error(err);
                callback(false,-9999);

            }else{

                var result={
                     key:results[0],
                     maxUserNumber:results[1]
                }

                callback(result);
            }


        });


};