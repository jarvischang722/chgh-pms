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
var DashBoardWebService  = require("../services/DashBoardWebService");

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
 * 檢查治療
 * **/
exports.checkTreatment = function(req, res, next){
    res.render('EWhiteBoard/checkTreatment' );
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
 * 醫師收治
 * **/
exports.doctorInfo = function(req, res, next){
    res.render('EWhiteBoard/doctorInfo' );
};

/**
 * 醫師值班
 * **/
exports.doctorOnDuty = function(req, res, next){
    res.render('EWhiteBoard/doctorOnDuty' );
};

/**
 * 病床公告
 * **/
exports.announcement = function(req, res, next){
    res.render('EWhiteBoard/announcement' );
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

    var data = {"Query_date": expect_discharged_date};

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
exports.qrySurgeryInfo = function(req, res){
    EWhiteBoardService.handleSurgeryInfo(req.body,function(err,surgeryInfoList){
        if(err){
            res.json(tools.getReturnJSON(false,{surgeryInfoList:[]},9999,err));
        }else{
            res.json(tools.getReturnJSON(true,{surgeryInfoList:surgeryInfoList}));
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

    //expect_discharged_date = "20170405";

    var data = {"Query_date": expect_discharged_date};

    DashBoardWebService.processNurseSche(data,function(err,result){
        if(result){
            //res.json(tools.getReturnJSON(false,{surgeryInfoList:[]},9999,err));
            res.json(tools.getReturnJSON(true, result));
        }else{
            //res.json(tools.getReturnJSON(true,{surgeryInfoList:surgeryInfoList}));
            res.json(tools.getReturnJSON(false, [], [], err));
        }
    })


    // DashBoardWebService.getNisDutySchedule(data, function (errorCode, result) {
    //     if (result) {
    //         var classBedObj = {};
    //         for (var i = 0; i < result.length; i++) {
    //             var nurse_no = result[i].employee_id;
    //             var nurse_name = result[i].employee_name;
    //             var ward_id = result[i].bed_no; //病房
    //             var bed_name = result[i].bed_no; //病床
    //             var fire_control_group_name = result[i].group_name;
    //             var mission_group_name = result[i].group_name;
    //             var class_id = result[i].schedule_type; //早班 中班 晚班
    //
    //             var thisClassObjByWard; //依班別->病房顯示
    //             var wardObj;
    //             var wardList;
    //             var thisClassObjByNurse; //依班別->護理師顯示
    //             var nurseObj;
    //             var nurseList;
    //             if (class_id in classBedObj) {
    //                 //依班別->病房顯示
    //                 thisClassObjByNurse = classBedObj[class_id]['ward'];
    //                 wardObj = thisClassObjByNurse['wardObj'];
    //                 wardList = thisClassObjByNurse['wardList'];
    //                 //依班別->護理師顯示
    //                 thisClassObjByNurse = classBedObj[class_id]['nurse'];
    //                 nurseObj = thisClassObjByNurse['nurseObj'];
    //                 nurseList = thisClassObjByNurse['nurseList'];
    //             } else {
    //                 //依班別->病房顯示
    //                 wardObj = {};
    //                 wardList = [];
    //                 thisClassObjByWard = {'class_id': class_id, 'wardObj': wardObj, 'wardList': wardList};
    //                 //依班別->護理師顯示
    //                 nurseObj = {};
    //                 nurseList = [];
    //                 thisClassObjByNurse = {'class_id': class_id, 'nurseObj': nurseObj, 'nurseList': nurseList};
    //                 classBedObj[class_id] = {'ward': thisClassObjByWard, 'nurse': thisClassObjByNurse};
    //             }
    //             //依班別->病房顯示
    //             if (ward_id in wardObj) {
    //                 var thisWardObj = wardObj[ward_id];
    //                 var this_wardList = thisWardObj['this_wardList'];
    //             } else {
    //                 var this_wardList = [];
    //                 var thisWardObj = {'ward_id': ward_id, 'this_wardList': this_wardList};
    //                 wardList.push(thisWardObj);
    //                 wardObj[ward_id] = thisWardObj;
    //             }
    //             var tmpWardObj = {
    //                 'bed_name': bed_name, 'nurse_name': nurse_name,
    //                 'fire_control_group_name': fire_control_group_name,
    //                 'mission_group_name': mission_group_name
    //             };
    //             this_wardList.push(tmpWardObj);
    //             //依班別->護理師顯示
    //             if (nurse_no in nurseObj) {
    //                 var thisNurseObj = nurseObj[nurse_no];
    //                 var this_bedList = thisNurseObj['this_bedList'];
    //             } else {
    //                 var this_bedList = [];
    //                 var thisNurseObj = {
    //                     'nurse_no': nurse_no,
    //                     'nurse_name': nurse_name,
    //                     'fire_control_group_name': fire_control_group_name
    //                     ,
    //                     'mission_group_name': mission_group_name,
    //                     'this_bedList': this_bedList
    //                 };
    //                 nurseList.push(thisNurseObj);
    //                 nurseObj[nurse_no] = thisNurseObj;
    //             }
    //             //var tmpNurseObj = {'ward-bed': ward_id + "-" + bed_name};
    //             var tmpNurseObj = {'wardbed': bed_name};
    //             this_bedList.push(tmpNurseObj);
    //         }
    //         res.json(tools.getReturnJSON(true, classBedObj))
    //     } else {
    //         res.json(tools.getReturnJSON(false, [], [], errorCode))
    //     }
    // })

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

    querydate="2015/09/07"; //EASONTODO

    var data = {"_ShiftDate": querydate, "_id": "Mikotek", "_pwd": "Dashboard", "_nurid": ""};
    DashBoardWebService.getShiftCollectList(data, function (errorCode, result) {
        if (result) {
            var NusBoard = result.NusBoard;
            var rtnResult={};
            for(var i=0;i<NusBoard.length;i++){
                var ShiftDataID = NusBoard[i].ShiftDataID;
                var ShiftDataName = NusBoard[i].ShiftDataName;
                var Title = NusBoard[i].Title; //值班時段
                var EmpType = NusBoard[i].EmpType;
                var EmpName = NusBoard[i].EmpName;
                var GSMBrevity = NusBoard[i].GSMBrevity;
                var ShiftDataList;
                var tmpObject = {};
                if (ShiftDataID in rtnResult) {
                    tmpObject = rtnResult[ShiftDataID];
                    ShiftDataList = tmpObject["dataList"];
                }else{
                    ShiftDataList = [];
                    tmpObject = {};
                    tmpObject["ShiftDataID"] = ShiftDataID;
                    tmpObject["ShiftDataName"] = ShiftDataName;
                    tmpObject["dataList"] = ShiftDataList;
                    rtnResult[ShiftDataID] = tmpObject;
                }

                //資料整理
                if("ＶＳ"==EmpType){ //主治醫師
                    tmpObject["VS_NAME"] =EmpName;
                    tmpObject["VS_GSMBrevity"] =GSMBrevity;
                }else if("Ｒ"==EmpType){ //住院醫師
                    tmpObject["R_NAME"] =EmpName;
                    tmpObject["R_GSMBrevity"] =GSMBrevity;
                }else{ //護理師 TODO?
                    ShiftDataList.push(NusBoard[i]);
                }
            }
            res.json(tools.getReturnJSON(true, rtnResult))
        } else {
            res.json(tools.getReturnJSON(false, [], [], errorCode))
        }
    })
}



