/**
 * Created by Jun on 2017/4/5.
 */
var _ = require("underscore");
var async = require("async");
var DashBoardWebSvc = require("./DashBoardWebService");
var moment = require("moment");
var request = require('request');
var parseString = require('xml2js').parseString;
var alasql = require('alasql');

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
        var surgeryInfo = alasql('SELECT si.*, pi.*  FROM ? si INNER JOIN ? pi USING patient_id', [results.surgeryInfo, results.patientInfo]);
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

    async.parallel({
        patientInfo: function (callback) {
            DashBoardWebSvc.getNurPatient(postData, function (err, NurPatient) {
                callback(err, NurPatient);
            })
        },
        emptyBedNoList : function(callback){
            DashBoardWebSvc.getEmptyBedNo(postData, function (err, emptyBedNoList) {
                    callback(err, emptyBedNoList);
            })
        }
    }, function (err, results) {
        if (err) {
            return callback(err, []);
        }

        var allpatientInfo = results.patientInfo;
        var emptyBedNoList = results.emptyBedNoList;
        var nur_id = results.patientInfo.length > 0 ? results.patientInfo[0].nur_id : '';
            //塞入空房
        _.each(emptyBedNoList , function(emptyBedInfo){
            if(emptyBedInfo.nur_id == nur_id && _.findIndex(allpatientInfo,{bed_no:emptyBedInfo.bed_no}) == -1){
                allpatientInfo.push(emptyBedInfo);
            }
        });
        allpatientInfo = _.sortBy(allpatientInfo,"bed_no");
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
        patientInfo: function (callback) {
            DashBoardWebSvc.getNurPatient(postData, function (err, NurPatient) {
                patientInfo = _.findWhere(NurPatient, {nur_id: nur_id, patient_id: patient_id}) || {};
                callback(err, patientInfo);
            })
        }
    }, function (err, results) {
        if (err) {
            return callback(err, []);
        }

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

            bed_name = bed_name.substr(0, bed_name.length - 1).replace(" ", "-"); //病房名稱格式化
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
        retrieveVSMap={};
        for(var i=0;i<retrieveVS.length;i++){
            var thisItem = retrieveVS[i];
            var physician_id = thisItem.physician_id;
            var AgentList = thisItem.AgentList||[];
            var bed_no = thisItem.bed_no;
            var employee_name = thisItem.employee_name;
            var gsm_brevity_code = thisItem.gsm_brevity_code;

            var tmpList;
            var tmpMap;
            var nurseMap;
            if(physician_id in retrieveVSMap){
                tmpMap = retrieveVSMap[physician_id];
                tmpList = tmpMap["palist"]||[];
                nurseMap = tmpMap["nursemap"]||{};
            }else{
                tmpList = [];
                tmpMap = {};
                nurseMap = {};
                tmpMap["palist"] = tmpList;
                tmpMap["nursemap"] = nurseMap;
                retrieveVSMap[physician_id] = tmpMap;
            }

            for(var j=0;j<AgentList.length;j++){
                var C = AgentList[j].C;
                var E = AgentList[j].E;
                if(C=="PA") {
                    if(!(nurseMap.hasOwnProperty(E))){
                        var padata = {"E": E,"bed_no":bed_no,"employee_name":employee_name,"gsm_brevity_code":gsm_brevity_code};
                        nurseMap[E] = E;
                        tmpList.push(padata);
                    }
                }
            }
        }

        var rtnResult={};
        if (shiftCollectList) {
            var ShiftCollect = shiftCollectList.ShiftCollect;
            var ShiftCollectMap={};
            for(var i=0;i<ShiftCollect.length;i++){
                var thisItem = ShiftCollect[i];
                if(!(thisItem.ShiftDataID in ShiftCollectMap)){
                    ShiftCollectMap[thisItem.ShiftDataID] = thisItem.ShiftDataName;
                }
            }
            var NusBoard = shiftCollectList.NusBoard;
            for(var i=0;i<NusBoard.length;i++){
                var ShiftDataID = NusBoard[i].ShiftDataID;
                var ShiftDataName = ShiftCollectMap[ShiftDataID];
                var Title = NusBoard[i].Title; //值班時段
                var EmpType = NusBoard[i].EmpType;
                var EmpName = NusBoard[i].EmpName;
                var GSMBrevity = NusBoard[i].GSMBrevity;
                var physician_id = NusBoard[i].physician_id;
                var ShiftDataList;
                var tmpObject = {};
                var nurseList=[];

                if (ShiftDataID in rtnResult) {
                    tmpObject = rtnResult[ShiftDataID];
                    ShiftDataList = tmpObject["dataList"];
                }else{
                    ShiftDataList = [];
                    tmpObject = {};
                    tmpObject["ShiftDataID"] = ShiftDataID;
                    tmpObject["ShiftDataName"] = ShiftDataName;
                    tmpObject["physician_id"] = physician_id;
                    tmpObject["dataList"] = ShiftDataList;
                    tmpObject["Title"] = Title;
                    if(EmpType!=""){
                        rtnResult[ShiftDataID] = tmpObject;
                    }

                    if(physician_id in retrieveVSMap){
                        nurseList = retrieveVSMap[physician_id]["palist"]||[];
                        if(nurseList && nurseList.length>0){
                            var nurseList2 = nurseList.slice(1);
                            tmpObject["nurseList"] = nurseList2;
                            tmpObject["nurse1Name"] = nurseList[0].E;
                            tmpObject["nurseNum"] = nurseList.length;
                        }else{
                            tmpObject["nurseNum"] = 0;
                            tmpObject["nurse1Title"] = "";
                            tmpObject["nurse1Name"] = "";
                        }
                    }else{
                        tmpObject["nurseNum"] = 0;
                        tmpObject["nurse1Title"] = "";
                        tmpObject["nurse1Name"] = "";
                    }
                }


                //資料整理
                if("ＶＳ"==EmpType){ //主治醫師
                    tmpObject["VS_NAME"] =EmpName;
                    tmpObject["VS_GSMBrevity"] =GSMBrevity;
                }else if("Ｒ"==EmpType){ //住院醫師
                    tmpObject["R_NAME"] =EmpName;
                    tmpObject["R_GSMBrevity"] =GSMBrevity;
                }else if(""==EmpType){ //護理師
                    for(var k=0;k<nurseList.length;k++){
                        var thisnurse = nurseList[k];
                        if(thisnurse.E==(EmpName+GSMBrevity)){
                            if(k==0){
                                tmpObject["nurse1Title"] = Title;
                            }else{
                                thisnurse["Title"] = Title;
                            }

                        }
                    }
                }
            }
        }

        callback(err, rtnResult);
    })
};