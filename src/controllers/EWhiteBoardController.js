/**
 * Created by Jun on 2016/10/1.
 * 電子白板模組
 */
 
var _ = require("underscore");
// var DBAgent = require("../plugins/mysql/DBAgent");
var tools = require("../utils/commonTools");
var moment = require("moment");
var EWhiteBoardService = require("../services/EWhiteBoardService");


/**
 * 病床狀態
 * **/
exports.bedStatus = function(req, res, next){
    res.render('EWhiteBoard/bedStatus' );
};

/**
 * 病患資訊
 * **/
exports.patientInfo = function(req, res, next){
    res.render('EWhiteBoard/patientInfo' );
};

/**
 * 手術資訊
 * **/
exports.surgeryInfo = function(req, res, next){
    res.render('EWhiteBoard/surgeryInfo' );
};

/**
 * 代辦事項
 * **/
exports.todoItem = function(req, res, next){
    res.render('EWhiteBoard/todoItem' );
};

/**
 * 出入院
 * **/
exports.in_out_info = function(req, res, next){
    res.render('EWhiteBoard/in_out_info' );
};

/**
 * 出院備註
 * **/
exports.dischargeNote = function(req, res, next){
    res.render('EWhiteBoard/dischargeNote' );
};

/**
 * 護理師排班
 * **/
exports.nurseScheduling = function(req, res, next){
    res.render('EWhiteBoard/nurseScheduling' );
};


/**
 * 醫師資訊
 * **/
exports.doctorInfo = function(req, res, next){
    res.render('EWhiteBoard/doctorInfo' );
};

/**
 * 病床公告
 * **/
exports.announcement = function(req, res, next){
    res.render('EWhiteBoard/announcement' );
};


