/**
 * Created by Jun on 2016/10/1.
 * 監測裝置
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var async = require("async");
var DBAgent = require("../plugins/mysql/DBAgent");
var tools = require("../utils/commonTools");
var moment = require("moment");

var BitClassService = require("../services/bitClassService");
var bitService = require("../services/bitService");
var validate = require("validate.js");

/** 點滴裝置分派 **/
exports.bitDeviceAssign = function(req, res){
    res.render("MonitorDevice/bitDeviceAssign");
};

/** 點滴參數設定 **/
exports.bitParamSet = function(req, res){
    res.render("MonitorDevice/bitParamSet");
};

/** 即時點滴數據查詢 **/
exports.immediateBitData = function(req, res){
    res.render("MonitorDevice/immediateBitData");
};

/** 統計報表 **/
exports.statisticalReport = function(req, res){
    res.render("MonitorDevice/statisticalReport");
};


/**
 *取得點滴裝置分派
 * **/
exports.queryBitDeviceAssign = function (req, res) {
      BitClassService.doFetchBitDeviceAssign(req,function(errorCode , bitRows){
          if(errorCode){

              res.json(tools.getReturnJSON(false,[],errorCode));

          }else{

              res.json(tools.getReturnJSON(true,{bitDeviceList:bitRows}));
          }
      })
};

/**
 * 儲存點滴裝置分派
 * **/
exports.saveBitDeviceAssign = function(req, res){
    var bitDeviceAssignList = req.body["bitDeviceParam"] || [];
    var bed_id = req.body["bed_id"] || "";

    BitClassService.doSaveBitDeviceAssign(bed_id, bitDeviceAssignList,function(error){
        if(error){

            res.json(tools.getReturnJSON(false,[],error));

        }else{

            res.json(tools.getReturnJSON(true));
        }
    })
};

/**
 * 搜尋點滴種類
 * **/
exports.getBitClass = function(req, res){


    BitClassService.getAllBitClass(function(result,errorCode){

            if(result){

                res.json(tools.getReturnJSON(true,result))

            }else{

                res.json(tools.getReturnJSON(false,[],errorCode))
            }


        });


};


/**
 * 加入點滴種類
 * **/
exports.addBitClass = function(req, res){

    var bit_no=req.body["bit_no"] || "";
    var bit_class_name=req.body["bit_class_name"] || "";
    var bit_capacity=req.body["bit_capacity"] || "";
    var bit_name=req.body["bit_name"] || "";
    var bit_empty_weight=req.body["bit_empty_weight"] || "";
    var update_user=req.session.user.account || "";


    var parameter_object=
    {
    "bit_no":bit_no,
    "bit_class_name":bit_class_name,
    "bit_capacity":bit_capacity,
    "bit_name":bit_name,
    "bit_empty_weight":bit_empty_weight,
    "update_user":update_user

    }



    BitClassService.insertBitClass(parameter_object, function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });

};

/**
 * 更新點滴種類
 * **/
exports.updateBitClass = function(req, res){

    var id=req.body["id"] || "";
    var bit_no=req.body["bit_no"] || "";
    var bit_class_name=req.body["bit_class_name"] || "";
    var bit_capacity=req.body["bit_capacity"] || "";
    var bit_name=req.body["bit_name"] || "";
    var bit_empty_weight=req.body["bit_empty_weight"] || "";
    var update_user=req.session.user.account || "";


    var parameter_object=
    {
        "id":id,
        "bit_no":bit_no,
        "bit_class_name":bit_class_name,
        "bit_capacity":bit_capacity,
        "bit_name":bit_name,
        "bit_empty_weight":bit_empty_weight,
        "update_user":update_user

    }


    BitClassService.updateBitClass(parameter_object, function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });


};

/**
 * 刪除點滴種類
 * **/
exports.deleteBitClass = function(req, res){


    var bit_class_ids = req.body["bit_class_ids"] || "";

    BitClassService.deleteBitClass(bit_class_ids, function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });


};

/**
 * 取得點滴參數設定檔
 * **/
exports.getBitSet = function(req, res){
    console.log("===req===");
    console.log(req);
    bitService.getBitSet(function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

//data validate define
var constraints = {
    monitor_time: {
        presence: {
            message: "監測時間不可為空"
        }
        ,numericality: {
            onlyInteger: true,
            greaterThan: 19,
            lessThanOrEqualTo: 300,
            message:"監測時間需介於20 ~ 300秒"
        }
    }
    ,statistic_time: {
        presence: {
            message: "統計時間不可為空"
        }
        ,numericality: {
            onlyInteger: true,
            greaterThan: 1,
            lessThanOrEqualTo: 60,
            message:"統計時間需介於2 ~ 60分"
        }
    }
    ,alarm_time: {
        presence: {
            message: "警示時間不可為空"
        }
        ,numericality: {
            onlyInteger: true,
            greaterThan: 4,
            lessThanOrEqualTo: 60,
            message:"警示時間需介於5 ~ 60分"
        }
    }
    ,alert_time: {
        presence: {
            message: "警報時間不可為空"
        }
        ,numericality: {
            onlyInteger: true,
            greaterThan: -1,
            lessThanOrEqualTo: 30,
            message:"警報時間需介於0 ~ 30分"
        }
    }
};

/**
 * 修改點滴參數設定檔
 * **/
exports.updateBitSet = function(req, res){
    var data = req.body.config;
    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    console.log("===req===");
    console.log(data);

    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    bitService.updateBitSet(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};


/**
 * 取得個別點滴參數
 * **/
exports.getBitBedConfig = function(req, res){
    var data = req.body;
    console.log("===data===");
    console.log(data);
    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;

    bitService.getBitBedConfig(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};


/**
 * 搜尋點滴輸液管種類
 * **/
exports.queryBitPipeClass = function(req, res){


    BitClassService.getAllBitPipeClass(function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,{bitPipeClassList:result}))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });


};

/**
 * 新增點滴輸液管種類
 * **/
exports.addBitPipeClass = function(req, res){
    var bit_pipe_name = req.body["bit_pipe_name"] || "";
    var bit_pipe_weight =  req.body["bit_pipe_weight"] || "";
    var capacity_in_pipe =  req.body["capacity_in_pipe"] || "";
    var paramObj = {
        bit_pipe_name:bit_pipe_name,
        weight:bit_pipe_weight,
        capacity_in_pipe:capacity_in_pipe,
        update_user:req.session.user.name
    };

    BitClassService.doAddBitPipeClass(paramObj,function(result,errorCode){
        if(result){

            res.json(tools.getReturnJSON(true))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 更新點滴輸液管種類
 * **/
exports.updateBitPipeClass = function(req, res){
    var bit_pipe_id  = req.body["bit_pipe_id"];
    var bit_pipe_name = req.body["bit_pipe_name"] || "";
    var bit_pipe_weight =  req.body["bit_pipe_weight"] || "";
    var capacity_in_pipe =  req.body["capacity_in_pipe"] || "";
    var paramObj = {
        bit_pipe_id:bit_pipe_id,
        bit_pipe_name:bit_pipe_name,
        weight:bit_pipe_weight,
        capacity_in_pipe:capacity_in_pipe,
        update_user:req.session.user.name
    };

    BitClassService.doUpdateBitPipeClass(paramObj,function(result,errorCode){
        if(result){

            res.json(tools.getReturnJSON(true))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 刪除點滴輸液管種類
 * **/
exports.deleteBitPipeClass = function(req, res){

};


/**
 * 修改個別點滴參數設定檔
 * **/
exports.updateBitBedConfig = function(req, res){
    var data = req.body;
    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    console.log("===req===");
    console.log(data);

    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    bitService.updateBitBedConfig(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};