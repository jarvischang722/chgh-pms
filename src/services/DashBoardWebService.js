/**
 * Created by Jun on 2017/4/9.
 * DashBoard資料交換之格式與定義API
 */
var fs = require("fs");
var _ = require("underscore");
var parseString = require('xml2js').parseString;


/**
 * 取得病房所有病床資訊
 * @param params{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            NurPatient{Array} : 所有病床資訊
 *        }
 */
exports.getNurPatient = function (params,callback) {
    fs.readFile('../testData/InTranInData.xml', 'utf8', function(err, apiResult) {

        parseString(apiResult, {trim: true,ignoreAttrs:true}, function (err, result) {
            var NurPatient = JSON.parse(result.string);
            callback(err , NurPatient);
        });

    });
};

/**
 * 取得前一日動態表資料
 * @param params{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            dayBeforeInfo{Array} : 前一日動態表資料
 *        }
 */
exports.getDayBeforeInfo = function (params,callback) {
    fs.readFile('../testData/DayBeforeInfo.xml', 'utf8', function(err, apiResult) {

        parseString(apiResult, {trim: true,ignoreAttrs:true}, function (err, result) {
            var dayBeforeInfo = JSON.parse(result.string);
            callback(err , dayBeforeInfo);
        });

    });
};

/**
 * 取得入院、轉入院資料
 * @param params{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            inTranInData{Array} : 入院、轉入院資料
 *        }
 */
exports.getInTranInData = function (params,callback) {
    fs.readFile('../testData/InTranInData.xml', 'utf8', function(err, apiResult) {

        parseString(apiResult, {trim: true,ignoreAttrs:true}, function (err, result) {
            var inTranInData = JSON.parse(result.string);
            callback(err , inTranInData);
        });

    });
};

/**
 * 取得出院、轉出資料
 * @param params{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            outTranOutData{Array} : 出院轉出資料
 *        }
 */
exports.getOutTranOutData = function (params,callback) {
    fs.readFile('../testData/OutTranOutData.xml', 'utf8', function(err, apiResult) {

        parseString(apiResult, {trim: true,ignoreAttrs:true}, function (err, result) {
            var outTranOutData = JSON.parse(result.string);
            callback(err , outTranOutData);
        });

    });
};

/**
 * 取得床位數資訊
 * @param params{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            nurBedInfo{Array} : 床位數資訊
 *        }
 */
exports.getNurBedInfo = function (params,callback) {
    fs.readFile('../testData/NurBedInfo.xml', 'utf8', function(err, apiResult) {

        parseString(apiResult, {trim: true,ignoreAttrs:true}, function (err, result) {
            var nurBedInfo = JSON.parse(result.string);
            callback(err , nurBedInfo);
        });

    });
};

/**
 * 手術排程資訊
 * @param params{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            opScheduleInfo{Array} : 手術排程資訊
 *        }
 */
exports.getOpScheduleInfo = function (params,callback) {
    fs.readFile('../testData/OpScheduleInfo.xml', 'utf8', function(err, apiResult) {

        parseString(apiResult, {trim: true,ignoreAttrs:true}, function (err, result) {
            var opScheduleInfo = JSON.parse(result.string);
            callback(err , opScheduleInfo);
        });

    });
};

/**
 * 檢查排程資訊
 * @param params{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            examScheduleInfo{Array} : 排程資訊
 *        }
 */
exports.getExamScheduleInfo = function (params,callback) {
    fs.readFile('../testData/ExamScheduleInfo.xml', 'utf8', function(err, apiResult) {

        parseString(apiResult, {trim: true,ignoreAttrs:true}, function (err, result) {
            var examScheduleInfo = JSON.parse(result.string);
            callback(err , examScheduleInfo);
        });

    });
};

/**
 * 護理排班資訊
 * @param params{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            NisDutySchedule{Array} : 排程資訊
 *        }
 */
exports.getNisDutySchedule = function (params,callback) {
    fs.readFile('../testData/NisDutySchedule.xml', 'utf8', function(err, apiResult) {

        parseString(apiResult, {trim: true,ignoreAttrs:true}, function (err, result) {
            var nisDutySchedule = JSON.parse(result.string);
            callback(err , nisDutySchedule);
        });

    });
};

/**
 * 病患過敏資訊
 * @param params{Object} : 搜尋條件
 * @param callback{Function}:
 *        {
 *            err {String} : 錯誤
 *            AllergyData{Array} : 排程資訊
 *        }
 */
exports.getAllergyData = function (params,callback) {
    fs.readFile('../testData/AllergyData.xml', 'utf8', function(err, apiResult) {

        parseString(apiResult, {trim: true,ignoreAttrs:true}, function (err, result) {
            var allergyData = JSON.parse(result.string);
            callback(err , allergyData);
        });

    });
};

/**
 * 醫師與PA資訊
 * @param params{Object} : 搜尋條件
 * @param callback{Function}:
 */
exports.getRetrieveVS = function (params,callback) {
    //TODO
};
