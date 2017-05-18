/**
 * Created by Jun on 2016/10/1.
 * 電子白板模組
 */

var _ = require("underscore");
var request = require('request');
var parseString = require('xml2js').parseString;
// var DBAgent = require("../plugins/mysql/DBAgent");
var tools = require("../utils/commonTools");
var moment = require("moment");
var EWhiteBoardService = require("../services/EWhiteBoardService");
var DashBoardWebService = require("../services/DashBoardWebService");

/**
 * 病患資訊
 * **/
exports.index = function (req, res, next) {
    res.redirect('/eWhiteBoard/patientInfo');
};


/**
 * 病患資訊
 * **/
exports.patientInfo = function (req, res, next) {
    res.render('EWhiteBoard/patientInfo');
};

/**
 * 手術資訊
 * **/
exports.surgeryInfo = function (req, res, next) {
    res.render('EWhiteBoard/surgeryInfo');
};

/**
 * 檢查治療
 * **/
exports.checkTreatment = function (req, res, next) {
    res.render('EWhiteBoard/checkTreatment');
};

/**
 * 代辦事項
 * **/
exports.todoItem = function (req, res, next) {
    res.render('EWhiteBoard/todoItem');
};

/**
 * 出入院
 * **/
exports.in_out_info = function (req, res, next) {
    res.render('EWhiteBoard/in_out_info');
};

/**
 * 出院備註
 * **/
exports.dischargeNote = function (req, res, next) {
    res.render('EWhiteBoard/dischargeNote');
};

/**
 * 護理師排班
 * **/
exports.nurseScheduling = function (req, res, next) {
    res.render('EWhiteBoard/nurseScheduling');
};


/**
 * 醫師收治
 * **/
exports.doctorInfo = function (req, res, next) {
    res.render('EWhiteBoard/doctorInfo');
};

/**
 * 醫師值班
 * **/
exports.doctorOnDuty = function (req, res, next) {
    res.render('EWhiteBoard/doctorOnDuty');
};

/**
 * 病床公告
 * **/
exports.announcement = function (req, res, next) {
    res.render('EWhiteBoard/announcement');
};


/**
 * 電子白板模組->出院備註畫面API
 * **/
exports.getDischargeNote = function (req, res) {
    //用get
    // var ward_id = req.query.ward_id || 0;
    // console.log("ward_id-->" + ward_id);
    //預設今日
    var expect_discharged_date =
        req.query.expect_discharged_date
        || req.body["expect_discharged_date"]
        || moment().format("YYYYMMDD"); //moment().format("YYYY/MM/DD")

    //expect_discharged_date = "20170405";
    console.log("expect_discharged_date-->" + expect_discharged_date);

    var data = {"Query_date": expect_discharged_date,nur_id:req.session.nur_id};

    DashBoardWebService.getOutTranOutData(data, function (errorCode, result) {
        if (result) {
            var nowyear = moment().format("YYYY");
            for (var i = 0; i < result.length; i++) {
                var age = result[i].birthday.substr(0, 4);
                age = nowyear - age;
                result[i].age = age;
            }
            res.json(tools.getReturnJSON(true, result))
        } else {
            res.json(tools.getReturnJSON(false, [], [], errorCode))
        }
    })
};


/**
 * 取得手術資訊API
 */
exports.qrySurgeryInfo = function (req, res) {
    req.body["nur_id"] = req.session.nur_id || "";
    EWhiteBoardService.handleSurgeryInfo(req.body, function (err, surgeryInfoList) {
        if (err) {
            res.json(tools.getReturnJSON(false, {surgeryInfoList: []}, 9999, err));
        } else {
            res.json(tools.getReturnJSON(true, {surgeryInfoList: surgeryInfoList}));
        }
    })
};

/**
 * 依病床取得所有護理師-病床排班資料(電子白板系統)
 * **/
exports.getNurseSche = function (req, res) {
    //預設今日
    var expect_discharged_date =
        req.query.expect_discharged_date
        || req.body["expect_discharged_date"]
        || moment().format("YYYYMMDD"); //moment().format("YYYY/MM/DD")

    var data = {"QueryDate": expect_discharged_date, nur_id: req.session.nur_id || ""};

    EWhiteBoardService.processNurseSche(data, function (err, result) {
        if (result) {
            //res.json(tools.getReturnJSON(false,{surgeryInfoList:[]},9999,err));
            res.json(tools.getReturnJSON(true, result));
        } else {
            //res.json(tools.getReturnJSON(true,{surgeryInfoList:surgeryInfoList}));
            res.json(tools.getReturnJSON(false, [], [], err));
        }
    })
};

/**
 * 依病床取得所有護理師-病床排班資料(電子白板系統)
 * **/
exports.getDoctorOnDuty = function (req, res) {
    //預設今日
    var querydate =
        req.query.querydate
        || req.body["querydate"]
        || moment().format("YYYY/MM/DD"); //moment().format("YYYY/MM/DD")

    var data = {"_ShiftDate": querydate, "_nurid": req.session.nur_id};

    EWhiteBoardService.processDoctorOnDuty(data, function (err, result) {
        if (result) {
            //res.json(tools.getReturnJSON(false,{surgeryInfoList:[]},9999,err));
            res.json(tools.getReturnJSON(true, result));
        } else {
            //res.json(tools.getReturnJSON(true,{surgeryInfoList:surgeryInfoList}));
            res.json(tools.getReturnJSON(false, [], [], err));
        }
    })
}


/**
 * 取得全部病患資訊
 */
exports.fetchAllPatientInfo = function (req, res) {
    req.body["nur_id"] = req.session.nur_id || "";
    EWhiteBoardService.handlePatientInfo(req.body, function (err, allPatientInfo) {
        res.json({success: _.isNull(err), errorMsg: err, allPatientInfo: allPatientInfo});
    })
};

/**
 * 取得過敏資料
 */
exports.fetchAllergyData = function (req, res) {
    req.body["nur_id"] = req.session.nur_id || "";
    EWhiteBoardService.handleAllergyData(req.body, function (err, allergyData) {
        res.json({success: _.isNull(err), errorMsg: err, allergyData: allergyData});
    })
};

/**
 * 取得單一病患資訊
 */
exports.fetchSinglePatientInfo = function (req, res) {
    req.body["nur_id"] = req.session.nur_id || "";
    EWhiteBoardService.handleSinglePatientInfo(req.body, function (err, patientInfo) {
        res.json({success: _.isNull(err), errorMsg: err, patientInfo: patientInfo});
    })
};

/**
 * 取得前一天動態資訊
 */
exports.fetchDayBeforeInfo = function (req, res) {
    req.body["nur_id"] = req.session.nur_id || "";
    s
    EWhiteBoardService.handleDayBeforeInfo(req.body, function (err, DayBeforeInfo) {
        res.json({success: _.isNull(err), errorMsg: err, dayBeforeInfo: DayBeforeInfo});
    })
};

/**
 * 取得床位數
 */
exports.fetchNurBedInfo = function (req, res) {
    req.body["nur_id"] = req.session.nur_id || "";
    EWhiteBoardService.handleNurBedInfo(req.body, function (err, bedInfo) {
        res.json({success: _.isNull(err), errorMsg: err, bedInfo: bedInfo});
    })
};


/**
 * 取得入院轉入資料
 */
exports.fetchInTranInfo = function (req, res) {
    req.body["nur_id"] = req.session.nur_id || "";
    EWhiteBoardService.handleInTranInfo(req.body, function (err, InTranInfo) {
        res.json({success: _.isNull(err), errorMsg: err, inTranInfo: InTranInfo});
    })
};

/**
 * 取得出院轉出資料
 */
exports.fetchOutTranInfo = function (req, res) {
    req.body["nur_id"] = req.session.nur_id || "";
    EWhiteBoardService.handleOutTranInfo(req.body, function (err, OutTranInfo) {
        res.json({success: _.isNull(err), errorMsg: err, outTranInfo: OutTranInfo});
    })
};

/**
 *  檢查排程資訊
 */
exports.fetchExamScheduleInfo = function (req, res) {
    req.body["nur_id"] = req.session.nur_id || "";
    EWhiteBoardService.handleExamScheduleInfo(req.body, function (err, ExamScheduleInfo) {
        res.json({success: _.isNull(err), errorMsg: err, examScheduleInfo: ExamScheduleInfo});
    })
};

/**
 *  撈取醫師資訊
 */
exports.fetchDoctorInfo = function (req, res) {
    req.body["nur_id"] = req.session.nur_id || "";
    EWhiteBoardService.handleDoctorInfo(req.body, function (err, doctorList) {
        res.json({success: _.isNull(err), errorMsg: err, doctorList: doctorList});
    })
};


/**
 *  撈取醫師資訊
 */
exports.fetchDoctorInfo = function (req, res) {
    req.body["nur_id"] = req.session.nur_id || "";
    EWhiteBoardService.handleDoctorInfo(req.body, function (err, doctorList) {
        res.json({success: _.isNull(err), errorMsg: err, doctorList: doctorList});
    })
};
