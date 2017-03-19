/**
 * Created by ian on 2016/10/1.
 * 安裝精靈模組
 */




//加解密用的lib
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

var installerService = require("../services/installerService");

//1.安裝流程首頁，選擇語系，如果安裝過了就顯示已安裝
exports.index = function(req, res, next){

    installerService.checkKeyExist(
        function(isInstalled){

            if(isInstalled){

                res.send("安裝精靈已執行過安裝");

            }else{

                //沒安裝過，才會出現安裝的頁面
                res.render('installer/index', { title: '安裝精靈' });

            }

        })

};


//2.正式的安裝流程
exports.installStep = function(req, res, next){

    var installProcessLanguage = req.body["installProcessLanguage"];


    if(installProcessLanguage==='zh-TW'){
        //繁中
        res.render('installer/installStep', { title: '安裝精靈(繁中)' });

    }else{
        //簡中
        res.render('installer/installStep', { title: '安装精灵(简中)' });

    }


};


exports.checkKey = function(req, res, next){

    var key = req.body.key;

    //console.log("key:"+key);

    installerService.checkKey(
        key,
        function(result,errorCode){

            if(result){

                res.json(tools.getReturnJSON(true,result));


            }else{

                res.json(tools.getReturnJSON(false,result,errorCode));


            }

        })

};


exports.installFunction = function(req, res, next){

    var key = req.body["key"];

    var FunctionList=req.body.FunctionList;

    installerService.installFunction(
        key,
        FunctionList,
        function(result,errorCode){

            if(result){

                res.json(tools.getReturnJSON(true,[]));

            }else{

                res.json(tools.getReturnJSON(false,result,errorCode));

            }

        })


};



