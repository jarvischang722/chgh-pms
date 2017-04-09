/**
 * Created by Jun on 2017/4/5.
 */
var _ = require("underscore");
var async = require("async");
var DashBoardWebSvc = require("./DashBoardWebService");
var Logger = require("../plugins/Log4js").Logger();
var moment = require("moment");
var request = require('request');
var parseString = require('xml2js').parseString;


exports.handleSurgeryInfo  = function(postData,callback){

    async.parallel({
        surgeryInfo: function(callback) {
            DashBoardWebSvc.getOpScheduleInfo(postData,function(err , opScheduleInfo){
                callback(err, opScheduleInfo);
            })
        },
        patientInfo: function(callback) {
            DashBoardWebSvc.getNurPatient(postData,function(err,NurPatient){
                callback(err, NurPatient);
            })
        }
    }, function(err, results) {
        if(err){
            return callback(err,[]);
        }
        var  surgeryInfo = results.surgeryInfo;
        var  patientInfo = results.patientInfo;

        callback(null,surgeryInfo);
    });

};
/**
 * 取得所有護理師-病床排班資料
 * ward 病房{id, district_id, ward_name}
 * bed 病床{id, bed_name, ward_id}
 * nurse_bed_assignment 護理師病床分派{id, nurse_id, bed_id, class, assign_date}
 * nurse 護士
 * */
exports.getNurseSche = function(req,callback){

    request.post(
        'http://localhost:8889/EWhiteBoard/api/nis_duty_schedule_api',
        { json: { Query_date: expect_discharged_date } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                parseString(body, function (err, result) {
                    var result = JSON.parse(result.string._);
                    var classBedObj={};
                    console.log(result);
                    if(result!=null && result.length>0){
                        for(var i=0;i<result.length;i++){
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
                            if(class_id in classBedObj){
                                //依班別->病房顯示
                                thisClassObjByNurse = classBedObj[class_id]['ward'];
                                wardObj=thisClassObjByNurse['wardObj'];
                                wardList=thisClassObjByNurse['wardList'];
                                //依班別->護理師顯示
                                thisClassObjByNurse = classBedObj[class_id]['nurse'];
                                nurseObj=thisClassObjByNurse['nurseObj'];
                                nurseList=thisClassObjByNurse['nurseList'];
                            }else{
                                //依班別->病房顯示
                                wardObj={};
                                wardList = [];
                                thisClassObjByWard = {'class_id':class_id,'wardObj':wardObj,'wardList':wardList};
                                //依班別->護理師顯示
                                nurseObj={};
                                nurseList = [];
                                thisClassObjByNurse = {'class_id':class_id,'nurseObj':nurseObj,'nurseList':nurseList};
                                classBedObj[class_id] = {'ward':thisClassObjByWard,'nurse':thisClassObjByNurse};
                            }
                            //依班別->病房顯示
                            if(ward_id in wardObj){
                                var thisWardObj = wardObj[ward_id];
                                var this_wardList = thisWardObj['this_wardList'];
                            }else{
                                var this_wardList = [];
                                var thisWardObj = {'ward_id':ward_id,'this_wardList':this_wardList};
                                wardList.push(thisWardObj);
                                wardObj[ward_id] = thisWardObj;
                            }
                            var tmpWardObj={'bed_name':bed_name,'nurse_name':nurse_name,
                                'fire_control_group_name':fire_control_group_name,
                                'mission_group_name':mission_group_name};
                            this_wardList.push(tmpWardObj);
                            //依班別->護理師顯示
                            if(nurse_no in nurseObj){
                                var thisNurseObj = nurseObj[nurse_no];
                                var this_bedList = thisNurseObj['this_bedList'];
                            }else{
                                var this_bedList = [];
                                var thisNurseObj = {'nurse_no':nurse_no,'nurse_name':nurse_name,'fire_control_group_name':fire_control_group_name
                                    ,'mission_group_name':mission_group_name,'this_bedList':this_bedList};
                                nurseList.push(thisNurseObj);
                                nurseObj[nurse_no] = thisNurseObj;
                            }
                            var tmpNurseObj={'ward-bed':ward_id+"-"+bed_name};
                            this_bedList.push(tmpNurseObj);
                        }
                    }
                    callback(classBedObj);
                });
            }else{
                callback(false,"9999");
            }
        }
    );
};