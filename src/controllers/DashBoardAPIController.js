/**
 * Created by Jun on 2017/4/11.
 * 模擬振興API
 */

var _ = require("underscore");
var request = require('request');
var parseString = require('xml2js').parseString;
var tools = require("../utils/commonTools");
var moment = require("moment");
var fs = require("fs");

/**
 *取得病房所有病床資訊
 */
exports.Get_nur_Patient = function(req, res){
    fs.readFile(__dirname+'/../testData/NurPatient.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};

/**
 *取得前一日動態表資料
 */
exports.day_before_info = function(req, res){
    fs.readFile(__dirname+'/../testData/DayBeforeInfo.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};

/**
 *取得入院、轉入院資料
 */
exports.In_TranIn_Data = function(req, res){
    fs.readFile(__dirname+'/../testData/InTranInData.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};

/**
 * 取得出院、轉出資料
 */
exports.Out_TranOut_Data = function(req, res){
    fs.readFile(__dirname+'/../testData/OutTranOutData.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};

/**
 *取得床位數資訊
 */
exports.nur_bed_info = function(req, res){
    fs.readFile(__dirname+'/../testData/NurBedInfo.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};

/**
 *取得床位數資訊
 */
exports.nur_bed_info_new = function(req, res){
    fs.readFile(__dirname+'/../testData/NurBedInfo_new.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};

/**
 *手術排程資訊
 */
exports.op_schedule_info = function(req, res){
    fs.readFile(__dirname+'/../testData/OpScheduleInfo.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};

/**
 *檢查排程資訊
 */
exports.exam_schedule_info = function(req, res){
    fs.readFile(__dirname+'/../testData/ExamScheduleInfo.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};

/**
 *護理排班資訊
 */
exports.nis_duty_schedule = function(req, res){
    fs.readFile(__dirname+'/../testData/NisDutySchedule.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};

/**
 *病患過敏資訊
 */
exports.Get_Allergy_Data = function(req, res){
    fs.readFile(__dirname+'/../testData/AllergyData.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};

/**
 *醫師與PA資訊
 */
exports.RetrieveVS = function(req, res){
    var RetrieveVSObj = JSON.parse(fs.readFileSync(__dirname+'/../testData/RetrieveVS.json', 'utf8'));
    res.json(RetrieveVSObj);
};

/**
 *各科值班表
 */
exports.ShiftCollectList = function(req, res){
    fs.readFile(__dirname+'/../testData/ShiftCollectList.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};

/**
 *取得空床資訊
 */
exports.Get_empty_bedno = function(req, res){
    fs.readFile(__dirname+'/../testData/Get_empty_bedno.xml', 'utf8', function(err, apiResult) {
        res.header('Content-Type', 'text/xml').send(apiResult);
    });
};