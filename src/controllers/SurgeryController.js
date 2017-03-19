/**
 * Created by Jun on 2016/11/2.
 */
var _ = require("underscore");
var surgeryService = require("../services/surgeryService");
var DBAgent = require("../plugins/mysql/DBAgent");



/**
 * 手術資訊
 * ***/
exports.surgeryQuery = function(req, res){

    surgeryService.querySurgery(req.body , function(err ,surgeryList ){
        var success = true;
        var errorCode = "";
        var errorMsg = "";
        if(err){
            success = false;
            errorCode = "0000";
            errorMsg =  err;
            surgeryList = [];
        }

        res.json({success:success, errorCode:errorCode, errorMsg:errorMsg, surgeryList:surgeryList})
    })
};