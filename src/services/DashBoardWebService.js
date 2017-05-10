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
    request.post({
        url: SystemConfig.web_service_url + "Get_nur_Patient",
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
    request.post({
        url: SystemConfig.web_service_url + "day_before_info",
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
    var checkValError = commonTools.checkParamsExist(['Query_date'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }

    request.post({
        url: SystemConfig.web_service_url + "In_TranIn_Data",
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
    var checkValError = commonTools.checkParamsExist(['Query_date'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }

    request.post({
        url: SystemConfig.web_service_url + "Out_TranOut_Data",
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
    request.post({
        url: SystemConfig.web_service_url + "nur_bed_info",
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
    var checkValError = commonTools.checkParamsExist(['StratDate', 'EndDate'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }

    request.post({
        url: SystemConfig.web_service_url + "op_schedule_info",
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
    var checkValError = commonTools.checkParamsExist(['StratDate', 'EndDate'], formData);
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

    var checkValError = commonTools.checkParamsExist(['Query_date'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }

    var checkValError = commonTools.checkParamsExist(['Query_date'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }

    request.post({
        url: SystemConfig.web_service_url + "nis_duty_schedule",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var nisDutySchedule = JSON.parse(result.string);
            callback(err, nisDutySchedule);
        });

    });
};

exports.processNurseSche = function (data, callback) {

    async.parallel({
        scheduleData: function (callback) {
            exports.getNisDutySchedule(data, function (err, schedule) {
                callback(err, schedule);
            })
        },
        patientData: function (callback) {
            exports.getNurPatient(data, function (err, patient) {
                callback(err, patient)
            })
        }
    }, function (err, results) {
        var result = alasql('SELECT schedule.*, patient.in_hospital_date, patient.patient_id ' +
            'FROM ? schedule LEFT JOIN ? patient USING bed_no ',
            [results.scheduleData, results.patientData]);

        var classBedObj = {};
        var today = moment().format("YYYYMMDD");
        for (var i = 0; i < result.length; i++) {
            var nur_id = result[i].nur_id;
            var patient_id = result[i].patient_id;
            var nurse_no = result[i].employee_id;
            var nurse_name = result[i].employee_name;
            var ward_id = result[i].bed_no; //病房
            var bed_name = result[i].bed_no; //病床
            var fire_control_group_name = result[i].group_name;
            var group_name_array = result[i].group_name.split(",");
            var subgroup_name_array = group_name_array.slice(1);
            subgroup_name_array = ["1", "2"];
            var class_id = result[i].schedule_type; //早班 中班 晚班
            var in_hospital_date = result[i].in_hospital_date; //入院日
            var call_number = result[i].call_number; //分機號碼

            var thisClassObjByWard; //依班別->病房顯示
            var wardObj;
            var wardList;
            var thisClassObjByNurse; //依班別->護理師顯示
            var nurseObj;
            var nurseList;
            if (class_id in classBedObj) {
                //依班別->病房顯示
                thisClassObjByNurse = classBedObj[class_id]['ward'];
                wardObj = thisClassObjByNurse['wardObj'];
                wardList = thisClassObjByNurse['wardList'];
                //依班別->護理師顯示
                thisClassObjByNurse = classBedObj[class_id]['nurse'];
                nurseObj = thisClassObjByNurse['nurseObj'];
                nurseList = thisClassObjByNurse['nurseList'];
            } else {
                //依班別->病房顯示
                wardObj = {};
                wardList = [];
                thisClassObjByWard = {'class_id': class_id, 'wardObj': wardObj, 'wardList': wardList};
                //依班別->護理師顯示
                nurseObj = {};
                nurseList = [];
                thisClassObjByNurse = {'class_id': class_id, 'nurseObj': nurseObj, 'nurseList': nurseList};
                classBedObj[class_id] = {'ward': thisClassObjByWard, 'nurse': thisClassObjByNurse};
            }
            //依班別->病房顯示
            var tmpchar = ward_id.slice(-1);
            if (!Number.isInteger(tmpchar)) {
                ward_id = ward_id.substr(0, ward_id.length - 1).split(" ")[1]; //病房名稱格式化
            } else {
                ward_id = ward_id.split(" ")[1]; //病房名稱格式化
            }
            if (ward_id in wardObj) {
                var thisWardObj = wardObj[ward_id];
                var this_wardList = thisWardObj['this_wardList'];
            } else {
                var this_wardList = [];
                var thisWardObj = {
                    'ward_id': ward_id,
                    'this_wardList': this_wardList,
                    'nurse_name': nurse_name,
                    'call_number': call_number
                };
                wardList.push(thisWardObj);
                wardObj[ward_id] = thisWardObj;
            }
            var tmpWardObj = {
                'bed_name': bed_name, 'nurse_name': nurse_name,
                'subgroup_name_array': subgroup_name_array,
                'mission_group_name': group_name_array[0]
            };
            this_wardList.push(tmpWardObj);
            //依班別->護理師顯示
            if (nurse_no in nurseObj) {
                var thisNurseObj = nurseObj[nurse_no];
                var this_bedList = thisNurseObj['this_bedList'];
            } else {
                var this_bedList = [];
                var thisNurseObj = {
                    'nurse_no': nurse_no,
                    'nurse_name': nurse_name,
                    'mission_group_name': group_name_array[0],
                    'subgroup_name_array': subgroup_name_array,
                    'call_number': call_number,
                    'this_bedList': this_bedList
                };
                nurseList.push(thisNurseObj);
                nurseObj[nurse_no] = thisNurseObj;
            }
            //var tmpNurseObj = {'ward-bed': ward_id + "-" + bed_name};
            var isNew;
            if (today == in_hospital_date) {
                isNew = true;
            } else {
                isNew = false;
            }

            bed_name = bed_name.substr(0,bed_name.length-1).replace(" ","-"); //病房名稱格式化
            var tmpNurseObj = {'wardbed': bed_name,'in_hospital_date':in_hospital_date,'isNew':isNew,'nur_id':nur_id,'patient_id':patient_id};

            this_bedList.push(tmpNurseObj);
        }

        callback(err, classBedObj);
    })
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
    var checkValError = commonTools.checkParamsExist(['PatientID'], formData);
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

    request.post({
        url: SystemConfig.web_service_url + "Get_empty_bedno",
        form: formData
    }, function (error, response, apiResult) {

        parseString(apiResult, {trim: true, ignoreAttrs: true}, function (err, result) {
            var EmptyBedNoList = JSON.parse(result.string);
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

        _.each(RetrieveVS,function(doctor,dIdx){
            if(!_.isUndefined(doctor.AgentList)){
                _.each(doctor.AgentList,function(agent){
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
    var checkValError = commonTools.checkParamsExist(['_id', '_pwd', '_nurid'], formData);
    if (checkValError) {
        return callback(checkValError, []);
    }
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