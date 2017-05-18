/**
 * Created by Jun on 2017/4/9.
 * DashBoard資料交換之格式與定義API
 */
var fs = require("fs");
var _ = require("underscore");
var parseString = require('xml2js').parseString;
var commonTools = require("../utils/commonTools");
var request = require("request");
var SystemConfig = require("../configs/SystemConfig");
var alasql = require('alasql');
var async = require('async');
var moment = require("moment");

/**
 * 取得病房所有病床資訊
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            NurPatient{Array} : 所有病床資訊
 *        }
 */
exports.getNurPatient = function (formData, callback) {
    var checkValError = commonTools.checkParamsExist(['nurs_id'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }
    request.post({
        url: SystemConfig.web_service_url + "Get_nur_Patient_new",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var NurPatient = JSON.parse(result.string);
            callback(err, NurPatient);
        });

    });
};

/**
 * 取得前一日動態表資料
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            dayBeforeInfo{Array} : 前一日動態表資料
 *        }
 */
exports.getDayBeforeInfo = function (formData, callback) {
    var checkValError = commonTools.checkParamsExist(['nurs_id','Query_date'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }
    request.post({
        url: SystemConfig.web_service_url + "day_before_info_new",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var dayBeforeInfo = JSON.parse(result.string);
            callback(err, dayBeforeInfo);
        });

    });
};

/**
 * 取得入院、轉入院資料
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            inTranInData{Array} : 入院、轉入院資料
 *        }
 */
exports.getInTranInData = function (formData, callback) {
    var checkValError = commonTools.checkParamsExist(['nurs_id','Query_date'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }

    request.post({
        url: SystemConfig.web_service_url + "In_TranIn_Data_new",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var inTranInData = JSON.parse(result.string);
            callback(err, inTranInData);
        });

    });
};

/**
 * 取得出院、轉出資料
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            outTranOutData{Array} : 出院轉出資料
 *        }
 */
exports.getOutTranOutData = function (formData, callback) {
    var checkValError = commonTools.checkParamsExist(['nurs_id','Query_date'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }

    request.post({
        url: SystemConfig.web_service_url + "Out_TranOut_Data_new",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var outTranOutData = JSON.parse(result.string);
            callback(err, outTranOutData);
        });

    });
};

/**
 * 取得床位數資訊
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            nurBedInfo{Array} : 床位數資訊
 *        }
 */
exports.getNurBedInfo = function (formData, callback) {
    var checkValError = commonTools.checkParamsExist(['nurs_id'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }
    request.post({
        url: SystemConfig.web_service_url + "nur_bed_info_new",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var nurBedInfo = JSON.parse(result.string);
            callback(err, nurBedInfo);
        });

    });
};

/**
 * 手術排程資訊
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            opScheduleInfo{Array} : 手術排程資訊
 *        }
 */
exports.getOpScheduleInfo = function (formData, callback) {
    var checkValError = commonTools.checkParamsExist(['StratDate', 'EndDate','nur_id'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }

    request.post({
        url: SystemConfig.web_service_url + "op_schedule_info_new",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var opScheduleInfo = JSON.parse(result.string);
            callback(err, opScheduleInfo);
        });

    });
};

/**
 * 檢查排程資訊
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            examScheduleInfo{Array} : 排程資訊
 *        }
 */
exports.getExamScheduleInfo = function (formData, callback) {
    var checkValError = commonTools.checkParamsExist(['StratDate', 'EndDate','nurs_id'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }

    request.post({
        url: SystemConfig.web_service_url + "exam_schedule_info",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var examScheduleInfo = JSON.parse(result.string);
            callback(err, examScheduleInfo);
        });

    });

};

/**
 * 護理排班資訊
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            NisDutySchedule{Array} : 排程資訊
 *        }
 */
exports.getNisDutySchedule = function (formData, callback) {

    var checkValError = commonTools.checkParamsExist(['Query_date','nur_id'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }


    request.post({
        url: SystemConfig.web_service_url + "nis_duty_schedule_new",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var nisDutySchedule = JSON.parse(result.string);
            callback(err, nisDutySchedule);
        });

    });
};


/**
 * 病患過敏資訊
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            AllergyData{Array} : 排程資訊
 *        }
 */
exports.getAllergyData = function (formData, callback) {
    var checkValError = commonTools.checkParamsExist(['patient_id'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }

    request.post({
        url: SystemConfig.web_service_url + "Get_Allergy_Data",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var allergyData = JSON.parse(result.string);
            callback(err, allergyData);
        });

    });
};

/**
 * 取得空床資訊
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            EmptyBedNoList{Array} : 排程資訊
 *        }
 */
exports.getEmptyBedNo = function (formData, callback) {
    var checkValError = commonTools.checkParamsExist(['nur_id'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }
    request.post({
        url: SystemConfig.web_service_url + "Get_empty_bedno_new",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var EmptyBedNoList = JSON.parse(result.string);


            _.each(EmptyBedNoList, function (item, idx) {
                EmptyBedNoList[idx]["nur_id"] = item.nur_id.trim();
            })
            callback(err, EmptyBedNoList);
        });

    });
};


/**
 * 醫師與PA資訊
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 */
exports.getRetrieveVS = function (formData, callback) {

    var checkValError = commonTools.checkParamsExist(['_nurid'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }

    formData["_id"] = SystemConfig.auth_api._id;
    formData["_pwd"] = SystemConfig.auth_api._pwd;

    request.post({
        url: SystemConfig.hrweb_chgh_url + "RetrieveVS",
        form: formData,
        json: true
    }, function (error, response, RetrieveVS) {

        _.each(RetrieveVS, function (doctor, dIdx) {
            if (!_.isUndefined(doctor.AgentList)) {
                _.each(doctor.AgentList, function (agent) {
                    RetrieveVS[dIdx][agent.C.trim()] = agent.E.trim()
                })
            }
        })
        callback(error, RetrieveVS);

    });
};

/**
 * 各科值班表
 * @param formData{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            ShiftCollectList{Array} : 排程資訊
 *        }
 */
exports.getShiftCollectList = function (formData, callback) {
    formData['_nurid'] = "93"; //TODO 暫時寫死93
    var checkValError = commonTools.checkParamsExist(['_nurid','_ShiftDate'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }
    formData["_id"] = SystemConfig.auth_api._id;
    formData["_pwd"] = SystemConfig.auth_api._pwd;
    request.post({
        url: SystemConfig.hrweb_chgh_url + "ShiftCollectList",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            //var shiftCollectList = JSON.parse(result.string).ShiftCollect;
            var shiftCollectList = JSON.parse(result.string);
            callback(err, shiftCollectList);
        });

    });
};