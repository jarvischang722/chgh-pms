/**
 * Created by Jun on 2016/10/16.
 *　其他模組
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");


/** 代辦事項片語管理 **/
exports.todoPhrase = function(req, res){
    res.render("Other/todoPhrase");
};

/** 病房公告維護 **/
exports.bedAnnounceMaintain = function(req, res){
    res.render("Other/bedAnnounceMaintain");
};

/** 跑馬燈訊息維護 **/
exports.marqueeMsgMaintain = function(req, res){
    res.render("Other/marqueeMsgMaintain");
};

/** 班別時段設定 **/
exports.shiftTimePeriodSet = function(req, res){
    res.render("Other/shiftTimePeriodSet");
};

/** 醫師別維護 **/
exports.doctorClassMaintain = function(req, res){
    res.render("Other/doctorClassMaintain");
};

/** 通聯記錄查詢 **/
exports.communiRecord = function(req, res){
    res.render("Other/communiRecord");
};

/** 消防記錄維護**/
exports.firemissionMaintain = function(req, res){
    res.render("Other/firemissionMaintain");
};







