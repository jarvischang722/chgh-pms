/**
 * Created by Jun on 2017/4/5.
 */
var _ = require("underscore");
var async = require("async");
var DashBoardWebSvc = require("./DashBoardWebService");

var patientTodoRecordService = require("./patientTodoRecordService");

var moment = require("moment");
var request = require('request');
var parseString = require('xml2js').parseString;
var alasql = require('alasql');

var DBAgent = require("../plugins/mysql/DBAgent");
var Logger = require("../plugins/Log4js").Logger();
/**
 * 取得手術資料
 * @param postData
 * @param callback
 */
exports.handleSurgeryInfo = function (postData, callback) {

    async.parallel({
        surgeryInfo: function (callback) {
            DashBoardWebSvc.getOpScheduleInfo(postData, function (err, opScheduleInfo) {
                callback(err, opScheduleInfo);
            })
        },
        patientInfo: function (callback) {
            DashBoardWebSvc.getNurPatient(postData, function (err, NurPatient) {
                callback(err, NurPatient);
            })
        }
    }, function (err, results) {
        if (err) {
            return callback(err, []);
        }
        var surgeryInfo = alasql('SELECT si.*, pi.*  FROM ? si left JOIN ? pi USING patient_id', [results.surgeryInfo, results.patientInfo]);
        callback(null, surgeryInfo);
    });

};

/**
 * 取得所有護理師-病床排班資料
 * ward 病房{id, district_id, ward_name}
 * bed 病床{id, bed_name, ward_id}
 * nurse_bed_assignment 護理師病床分派{id, nurse_id, bed_id, class, assign_date}
 * nurse 護士
 * */
exports.getNurseSche = function (req, callback) {

    request.post(
        'http://localhost:8889/EWhiteBoard/api/nis_duty_schedule_api',
        {json: {Query_date: expect_discharged_date}},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                parseString(body, function (err, result) {
                    var result = JSON.parse(result.string._);
                    var classBedObj = {};
                    if (result != null && result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var nurse_no = result[i].employee_id;
                            var nurse_name = result[i].employee_name;
                            var ward_id = result[i].nur_id;
                            var bed_name = result[i].bed_no;
                            var fire_control_group_name = result[i].group_name;
                            var mission_group_name = result[i].group_name;
                            var class_id = result[i].schedule_type; //早班 中班 晚班

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
                                thisClassObjByNurse = {
                                    'class_id': class_id,
                                    'nurseObj': nurseObj,
                                    'nurseList': nurseList
                                };
                                classBedObj[class_id] = {'ward': thisClassObjByWard, 'nurse': thisClassObjByNurse};
                            }
                            //依班別->病房顯示
                            if (ward_id in wardObj) {
                                var thisWardObj = wardObj[ward_id];
                                var this_wardList = thisWardObj['this_wardList'];
                            } else {
                                var this_wardList = [];
                                var thisWardObj = {'ward_id': ward_id, 'this_wardList': this_wardList};
                                wardList.push(thisWardObj);
                                wardObj[ward_id] = thisWardObj;
                            }
                            var tmpWardObj = {
                                'bed_name': bed_name, 'nurse_name': nurse_name,
                                'fire_control_group_name': fire_control_group_name,
                                'mission_group_name': mission_group_name
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
                                    'fire_control_group_name': fire_control_group_name
                                    ,
                                    'mission_group_name': mission_group_name,
                                    'this_bedList': this_bedList
                                };
                                nurseList.push(thisNurseObj);
                                nurseObj[nurse_no] = thisNurseObj;
                            }
                            var tmpNurseObj = {'ward-bed': ward_id + "-" + bed_name};
                            this_bedList.push(tmpNurseObj);
                        }
                    }
                    callback(classBedObj);
                });
            } else {
                callback(false, "9999");
            }
        }
    );
};


/**
 * 取得病患資訊
 * @param postData
 * @param callback
 */
exports.handlePatientInfo = function (postData, callback) {
    var nur_id = postData.nur_id;
    async.parallel({
        doctorList: function (callback) {
            DashBoardWebSvc.getRetrieveVS(postData, function (err, DoctorList) {
                callback(err, DoctorList);
            })
        },
        patientInfo: function (callback) {
            DashBoardWebSvc.getNurPatient(postData, function (err, NurPatient) {
                callback(err, NurPatient);
            })
        },
        emptyBedNoList: function (callback) {
            DashBoardWebSvc.getEmptyBedNo(postData, function (err, emptyBedNoList) {
                emptyBedNoList = _.filter(emptyBedNoList, function (bed) {
                    return bed.nur_id.trim() == nur_id.trim()
                });
                callback(err, emptyBedNoList);
            })
        }
    }, function (err, results) {
        if (err) {
            return callback(err, []);
        }

        var allpatientInfo = results.patientInfo;
        var emptyBedNoList = results.emptyBedNoList;
        var doctorList = results.doctorList;


        allpatientInfo = alasql('SELECT pi.*, doc.*  ' +
            'FROM ? pi LEFT JOIN ? doc ON pi.bed_no = doc.bed_no '
            , [allpatientInfo, doctorList]);

        //塞入空房
        _.each(emptyBedNoList, function (emptyBedInfo) {
            if (_.findIndex(allpatientInfo, {ed_no: emptyBedInfo.bed_no}) == -1) {
                allpatientInfo.push(emptyBedInfo);
            }
        });
        allpatientInfo = _.sortBy(allpatientInfo, "bed_no");
        callback(null, allpatientInfo);
    });

};

/**
 * 取得過敏資訊
 * @param postData
 * @param callback
 */
exports.handleAllergyData = function (postData, callback) {
    DashBoardWebSvc.getAllergyData(postData, function (err, AllergyData) {
        callback(err, AllergyData);
    })
};

/**
 * 取得單一病患資訊
 * @param postData
 * @param callback
 */
exports.handleSinglePatientInfo = function (postData, callback) {
    var nur_id = postData.nur_id || "";
    var patient_id = postData.patient_id || "";
    var patientInfo = {};
    async.parallel({
        doctorList: function (callback) {
            DashBoardWebSvc.getRetrieveVS(postData, function (err, DoctorList) {
                callback(err, DoctorList);
            })
        },
        patientInfo: function (callback) {
            DashBoardWebSvc.getNurPatient(postData, function (err, NurPatient) {
                patientInfo = _.findWhere(NurPatient, {nur_id: nur_id, patient_id: patient_id}) || {};
                callback(err, patientInfo);
            })
        },
        allergyData: function (callback) {
            DashBoardWebSvc.getAllergyData(postData, function (err, allergyData) {
                if (err) {
                    console.error(err);
                    allergyData = [];
                }
                callback(err, allergyData);
            })
        },
        patientTodo: function (callback) {
            //Ian add 0528


            var patient_todo_record_date = moment().format("YYYYMMDD");

            patientTodoRecordService.getPatientTodoByPatientID(patient_id, patient_todo_record_date, nur_id, function (todoData, errorCode) {
                if (errorCode) {
                    console.error(errorCode);
                    todoData = [];
                }
                callback(errorCode, todoData);
            });

            //DashBoardWebSvc.getAllergyData(postData, function (err, allergyData) {
            //    if(err){
            //        console.error(err);
            //        allergyData = [];
            //    }
            //    callback(err, allergyData);
            //})
        }
    }, function (err, results) {
        if (err || _.size(patientInfo) == 0) {
            return callback(err, {});
        }

        var doctorData = _.find(results.doctorList, function (doc) {
            return doc.bed_no.trim() == patientInfo.bed_no.trim()
        });

        if (!_.isUndefined(doctorData)) {
            patientInfo = _.extend(patientInfo, doctorData)
        }
        _.each(results.allergyData, function (allergy) {
            if (_.isEqual(allergy.source, "藥物")) {
                patientInfo.drugAllergy = allergy.drug_name || "";  // 藥物過敏
            } else if (_.isEqual(allergy.source, "非藥物")) {
                patientInfo.otherAllergy = allergy.drug_name || "";  // 其他過敏
            }
        });

        if (!_.isUndefined(patientInfo["bed_no"])) {
            patientInfo["bed_no"] = patientInfo["bed_no"].replace(" ", "-");
        } else {
            patientInfo["bed_no"] = "";
        }


        //待辦事項字串產生
        var todoString = "";

        if (!_.isUndefined(results.patientTodo)) {

            _.each(results.patientTodo, function (patientTodo) {

                var tempStr = "";
                if (_.isEqual(patientTodo.is_finish, "Y")) {

                    tempStr += patientTodo.todo_name + "(已完成)";

                } else if (_.isEqual(patientTodo.is_finish, "N")) {

                    tempStr += patientTodo.todo_name + "(未完成)";

                }

                todoString += tempStr + ",";
            });


        }

        //空值處理
        if (todoString == "") {
            todoString = "該病患無待辦事項";
        } else {
            //砍掉最後一個逗號
            todoString = todoString.replace(/,\s*$/, "");
        }

        patientInfo["todo"] = todoString;

        callback(null, patientInfo);
    });

};

/**
 * 取得前一日動態表資料
 * @param postData
 * @param callback
 */
exports.handleDayBeforeInfo = function (postData, callback) {

    DashBoardWebSvc.getDayBeforeInfo(postData, function (err, DayBeforeInfo) {
        DayBeforeInfo = DayBeforeInfo.length > 0 ? DayBeforeInfo[0] : {};
        callback(err, DayBeforeInfo);
    })

};

/**
 * 取得入院資料
 * @param postData
 * @param callback
 */
exports.handleInTranInfo = function (postData, callback) {
    async.parallel({
        inTranData: function (callback) {
            DashBoardWebSvc.getInTranInData(postData, function (err, Intran) {
                callback(err, Intran);
            })
        },
        allPatient: function (callback) {
            DashBoardWebSvc.getNurPatient(postData, function (err, patients) {
                callback(err, patients)
            })
        }
    }, function (err, results) {
        var resResult = alasql('SELECT inTran.*, patient.major_assess_id,patient.icd_desc,patient.nurse_name  ' +
            'FROM ? inTran LEFT JOIN ? patient USING patient_id ',
            [results.inTranData, results.allPatient]);
        resResult = _.sortBy(resResult, "bed_no");
        callback(err, resResult);
    })


};


/**
 * 取得出院資料
 * @param postData
 * @param callback
 */
exports.handleOutTranInfo = function (postData, callback) {

    async.parallel({
        outTranData: function (callback) {
            DashBoardWebSvc.getOutTranOutData(postData, function (err, outtran) {
                callback(err, outtran);
            })
        },
        allPatient: function (callback) {
            DashBoardWebSvc.getNurPatient(postData, function (err, patients) {
                callback(err, patients)
            })
        }
    }, function (err, results) {
        var resResult = alasql('SELECT outTran.*, patient.major_assess_id,patient.icd_desc,patient.nurse_name  ' +
            'FROM ? outTran LEFT JOIN ? patient USING patient_id ',
            [results.outTranData, results.allPatient]);
        resResult = _.sortBy(resResult, "bed_no");
        callback(err, resResult);
    })

};

/**
 * 檢查排程資訊
 * @param postData
 * @param callback
 */
exports.handleExamScheduleInfo = function (postData, callback) {
    DashBoardWebSvc.getExamScheduleInfo(postData, function (err, ExamScheduleInfo) {
        callback(err, ExamScheduleInfo);
    })

};

/**
 * 醫師資訊
 * @param postData
 * @param callback
 */
exports.handleDoctorInfo = function (postData, callback) {
    async.parallel({
        doctorList: function (callback) {
            DashBoardWebSvc.getRetrieveVS(postData, function (err, doctorList) {
                callback(err, doctorList);
            })
        },
        allPatient: function (callback) {
            DashBoardWebSvc.getNurPatient(postData, function (err, patientList) {
                callback(err, patientList);
            })
        }
    }, function (err, results) {
        var resResult = alasql('SELECT dct.*, patient.*  ' +
            'FROM ? dct INNER JOIN ? patient USING bed_no ',
            [results.doctorList, results.allPatient]);
        var tmpList = _.groupBy(resResult, "employee_name");
        var doctorList = [];
        _.each(Object.keys(tmpList), function (doctor_name) {
            doctorList.push({
                doctor_name: doctor_name,
                bedList: tmpList[doctor_name]
            });
        })
        callback(err, doctorList);
    })
};

/**
 * 床位數資訊
 * @param postData
 * @param callback
 */
exports.handleNurBedInfo = function (postData, callback) {

    DashBoardWebSvc.getNurBedInfo(postData, function (err, bedInfo) {
        bedInfo = bedInfo.length > 0 ? bedInfo[0] : {};
        callback(err, bedInfo);
    })

};

exports.processNurseSche = function (data, callback) {

    async.parallel({
        scheduleData: function (callback) {
            DashBoardWebSvc.getNisDutySchedule(data, function (err, schedule) {
                callback(err, schedule);
            })
        },
        patientData: function (callback) {
            DashBoardWebSvc.getNurPatient(data, function (err, patient) {
                callback(err, patient)
            })
        }
    }, function (err, results) {
        var result = alasql('SELECT schedule.*, patient.in_hospital_date, patient.patient_id ' +
            'FROM ? schedule LEFT JOIN ? patient USING bed_no ',
            [results.scheduleData, results.patientData]);

        for (var i = 0; i < result.length; i++) {
            var ward_id = result[i].bed_no; //病房
            //依班別->病房顯示
            var tmpchar = ward_id.slice(-1);
            if (!Number.isInteger(tmpchar)) {
                ward_id = ward_id.substr(0, ward_id.length - 1).split(" ")[1]; //病房名稱格式化
            } else {
                ward_id = ward_id.split(" ")[1]; //病房名稱格式化
            }
            result[i].ward_id = ward_id;
        }

        result.sort(function (a, b) {
            if (a.ward_id > b.ward_id) {
                return 1;
            }
            if (a.ward_id < b.ward_id) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        var classBedObj = {};
        var today = moment().format("YYYYMMDD");
        for (var i = 0; i < result.length; i++) {
            var nur_id = result[i].nur_id;
            var patient_id = result[i].patient_id;
            var nurse_no = result[i].employee_id;
            var nurse_name = result[i].employee_name;
            var ward_id = result[i].bed_no; //病房
            var bed_name = result[i].bed_no; //病床
            var group_name_array = result[i].group_name.split(",");
            var subgroup_name_array = group_name_array.slice(1);
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
            /*
             var tmpchar = ward_id.slice(-1);
             if (!Number.isInteger(tmpchar)) {
             ward_id = ward_id.substr(0, ward_id.length - 1).split(" ")[1]; //病房名稱格式化
             } else {
             ward_id = ward_id.split(" ")[1]; //病房名稱格式化
             }
             */
            ward_id = ward_id.split(" ")[1]; //病房名稱格式化

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

            bed_name = bed_name.replace(" ", "-"); //病房名稱格式化
            var tmpNurseObj = {
                'wardbed': bed_name,
                'in_hospital_date': in_hospital_date,
                'isNew': isNew,
                'nur_id': nur_id,
                'patient_id': patient_id
            };

            this_bedList.push(tmpNurseObj);
        }

        callback(err, classBedObj);
    })
};

exports.processDoctorOnDuty = function (data, callback) {
    async.parallel({
        shiftCollectList: function (callback) {
            DashBoardWebSvc.getShiftCollectList(data, function (err, collect) {
                callback(err, collect);
            })
        },
        retrieveVS: function (callback) {
            DashBoardWebSvc.getRetrieveVS(data, function (err, patient) {
                callback(err, patient)
            })
        }
    }, function (err, results) {
        /*
         var result = alasql('SELECT schedule.*, patient.in_hospital_date, patient.patient_id ' +
         'FROM ? schedule LEFT JOIN ? patient USING bed_no ',
         [results.scheduleData, results.patientData]);
         */
        var shiftCollectList = results.shiftCollectList;
        var retrieveVS = results.retrieveVS;

        //整理retrieveVS
        retrieveVSMap = {};
        for (var i = 0; i < retrieveVS.length; i++) {
            var thisItem = retrieveVS[i];
            var physician_id = thisItem.physician_id;
            var AgentList = thisItem.AgentList || [];
            var bed_no = thisItem.bed_no;
            var employee_name = thisItem.employee_name;
            var gsm_brevity_code = thisItem.gsm_brevity_code;

            var tmpList;
            var tmpMap;
            var nurseMap;
            if (physician_id in retrieveVSMap) {
                tmpMap = retrieveVSMap[physician_id];
                tmpList = tmpMap["palist"] || [];
                nurseMap = tmpMap["nursemap"] || {};
            } else {
                tmpList = [];
                tmpMap = {};
                nurseMap = {};
                tmpMap["palist"] = tmpList;
                tmpMap["nursemap"] = nurseMap;
                retrieveVSMap[physician_id] = tmpMap;
            }

            for (var j = 0; j < AgentList.length; j++) {
                var C = AgentList[j].C;
                var E = AgentList[j].E;
                if (C == "PA") {
                    if (!(nurseMap.hasOwnProperty(E))) {
                        var padata = {
                            "E": E,
                            "bed_no": bed_no,
                            "employee_name": employee_name,
                            "gsm_brevity_code": gsm_brevity_code
                        };
                        nurseMap[E] = E;
                        tmpList.push(padata);
                    }
                }
            }
        }

        var nurseMap = {};

        var rtnResult = {};
        if (shiftCollectList) {
            var ShiftCollect = shiftCollectList.ShiftCollect;
            var ShiftCollectMap = {};
            for (var i = 0; i < ShiftCollect.length; i++) {
                var thisItem = ShiftCollect[i];
                if (!(thisItem.ShiftDataID in ShiftCollectMap)) {
                    ShiftCollectMap[thisItem.ShiftDataID] = thisItem.ShiftDataName;
                }
            }

            var NusBoard = shiftCollectList.NusBoard;
            for (var i = 0; i < NusBoard.length; i++) {
                var tmpObject = NusBoard[i];
                var EmpName = tmpObject.EmpName;
                var GSMBrevity = tmpObject.GSMBrevity.replace("(", "").replace(")", "");
                var EmpType = tmpObject.EmpType;
                //資料整理
                if ("" == EmpType) { //護理師
                    nurseMap[EmpName] = tmpObject;
                }
            }

            for (var i = 0; i < NusBoard.length; i++) {
                var ShiftDataID = NusBoard[i].ShiftDataID;
                var ShiftDataName = ShiftCollectMap[ShiftDataID];
                var Title = NusBoard[i].Title; //值班時段
                var EmpType = NusBoard[i].EmpType;
                var EmpName = NusBoard[i].EmpName;
                var GSMBrevity = NusBoard[i].GSMBrevity;
                var physician_id = NusBoard[i].physician_id;
                var ShiftDataList;
                var tmpObject = {};
                var nurseList = [];

                if (ShiftDataID in rtnResult) {
                    tmpObject = rtnResult[ShiftDataID];
                    ShiftDataList = tmpObject["dataList"];
                    //nurseList = tmpObject["nurseList"];
                } else {
                    ShiftDataList = [];
                    tmpObject = {};
                    tmpObject["ShiftDataID"] = ShiftDataID;
                    tmpObject["ShiftDataName"] = ShiftDataName;
                    tmpObject["physician_id"] = physician_id;
                    tmpObject["dataList"] = ShiftDataList;
                    tmpObject["Title"] = Title;
                    if (EmpType != "") {
                        rtnResult[ShiftDataID] = tmpObject;
                    }
                }

                if (physician_id in retrieveVSMap) {
                    nurseList = retrieveVSMap[physician_id]["palist"] || [];
                    if (nurseList && nurseList.length > 0) {
                        var nurseList2 = nurseList.slice(1);
                        tmpObject["nurseList"] = nurseList2;
                        tmpObject["nurse1Name"] = nurseList[0].E;
                        tmpObject["nurseNum"] = nurseList.length;
                        var tmpkey = nurseList[0].E.substring(0, nurseList[0].E.indexOf("("));
                        if (nurseMap[tmpkey]) {
                            tmpObject["nurseTitle"] = nurseMap[tmpkey].Title;
                            for (var nur = 0; nur < nurseList2.length; nur++) {
                                tmpkey = nurseList2[nur].E.substring(0, nurseList2[nur].E.indexOf("("));
                                if (nurseMap[tmpkey]) {
                                    nurseList2[nur]["nurseTitle"] = nurseMap[tmpkey].Title;
                                }
                            }
                        }
                    } else {
                        tmpObject["nurseNum"] = 1;
                        tmpObject["nurse1Title"] = "";
                        tmpObject["nurse1Name"] = "";
                    }
                } else {
                    tmpObject["nurseNum"] = 1;
                    tmpObject["nurse1Title"] = "";
                    tmpObject["nurse1Name"] = "";
                }


                //資料整理
                if ("ＶＳ" == EmpType) { //主治醫師
                    tmpObject["VS_NAME"] = EmpName;
                    tmpObject["VS_GSMBrevity"] = GSMBrevity;
                } else if ("Ｒ" == EmpType) { //住院醫師
                    tmpObject["R_NAME"] = EmpName;
                    tmpObject["R_GSMBrevity"] = GSMBrevity;
                }
            }
        }
        callback(err, rtnResult);
    })
};


/**
 * 取得病房公告
 * */
exports.getAnnouncement = function (ward_zone_id, callback) {
    DBAgent.query("QRY_ANNOUNCEMENT", {"ward_zone_id": ward_zone_id}, function (err, rows) {

        if (err) {
            Logger.error(error);
            rows = [];
        }

        callback(rows);

    });
};


/**
 * 取得待辦事項資訊
 * */
exports.PatientTodoByWard = function (ward_zone_id,
                                      patient_todo_record_date,
                                      is_finish,
                                      callback) {

    if (is_finish != "") {
        //目前統一用bed撈
        DBAgent.query("QRY_PATIENT_TODO_RECORD_COUNT_BY_DATE", {
            nur_id: ward_zone_id,
            todo_date: patient_todo_record_date,
            is_finish: is_finish
        }, function (err, rows) {

            if (err) {
                Logger.error(err);
                callback(false, -9999);

            } else {

                callback(rows);

            }

        });

    } else {
        //目前統一用bed撈
        DBAgent.query("QRY_ALL_PATIENT_TODO_RECORD_GROUP_BY_BED", {
            ward_zone_id: ward_zone_id,
            patient_todo_record_date: patient_todo_record_date
        }, function (err, rows) {

            if (err) {
                Logger.error(err);
                callback(false, -9999);

            } else {

                callback(rows);

            }

        });
    }


};