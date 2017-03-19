/**
 * Created by Iab on 2016/10/29.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var moment = require("moment");
var async = require("async");
//待辦事項
var patientTodoRecordService = require("../services/patientTodoRecordService");
var nurseService = require("../services/nurseService");

var Doctor = require('../controllers/DoctorController');


/**
 * 取得出院備註畫面
 * */
exports.PatientDischargedRemark = function(ward_id,
                                           expect_discharged_date,
                                            callback){

    //目前統一用bed撈
    DBAgent.query("QRY_ALL_DISCHARGED_REMARK_BY_DATE",{ward_id:ward_id, expect_discharged_date:expect_discharged_date} , function(err , rows){

        if(err){
            Logger.error(err);
            callback(false,-9999);

        }else{

            callback(rows);

        }

    });




};



/**
 * 取得待辦事項資訊
 * */
exports.PatientTodoByWard = function(ward_zone_id,
                                     patient_todo_record_date,
                                     is_finish,
                                     callback){

    if(is_finish!=""){
        //目前統一用bed撈
        DBAgent.query("QRY_ALL_PATIENT_TODO_RECORD_GROUP_BY_BED_AND_FINISH",{ward_zone_id:ward_zone_id, patient_todo_record_date:patient_todo_record_date,is_finish:is_finish} , function(err , rows){

            if(err){
                Logger.error(err);
                callback(false,-9999);

            }else{

                callback(rows);

            }

        });

    }else{
        //目前統一用bed撈
        DBAgent.query("QRY_ALL_PATIENT_TODO_RECORD_GROUP_BY_BED",{ward_zone_id:ward_zone_id, patient_todo_record_date:patient_todo_record_date} , function(err , rows){

            if(err){
                Logger.error(err);
                callback(false,-9999);

            }else{

                callback(rows);

            }

        });
    }





};


/**
 * 取得病患資訊
 * */
exports.BedWithPatientByWard = function(ward_zone_id,
                                        current_datetime,
                                        callback){

    //分割成date及time
    var res = current_datetime.split(" ");


    //date
    var curDate=res[0];

    //time
    var curTime=res[1];


    //開始插入資料庫
    async.parallel(
        [function(callback){
            //1.先依當前時間，取得護士的班別是哪個(早、小夜、大夜)

            nurseService.getClassFromTime(curTime, function(result){

                var resultTemp=result[0];

                if(resultTemp["class_name"] != null){

                    callback(null,resultTemp["class_id"]);

                }else{

                    callback(null,"03");

                }


            })


        },
        function(callback){
                //2.取得所有醫生別

            DBAgent.query("QRY_DOCTOR_CLASS", {} , function(err, classRows){
                if(err){
                    console.log(err);
                    callback(err,"");
                }else{

                    callback(null,classRows);
                }
            })


        },
            function(callback){
                //3.取得病床的醫生排班資料

                DBAgent.query("QRY_BED_AND_DOCTOR_SCHEDULE_WITH_PATIENT_BY_WARD",
                    {ward_zone_id:ward_zone_id,current_date:curDate} , function(err, classRows){
                    if(err){
                        console.log(err);
                        callback(err,"");

                    }else{

                        callback(null,classRows);
                    }
                })


            }

        ]
        , function (err,results) {


            if(err){

                Logger.error(err);
                console.log(err);
                callback(false,-9999);

            }else{

                var nurse_class_id=results[0];

                //醫生類別資料
                var doctor_classes=results[1];

                //醫生排班資料
                var doctor_schedules=results[2];

                //醫生別的物件
                var doctor_class_object={};

                for(var Ri=0 ; Ri<doctor_classes.length; Ri++){

                       var doctor_class = doctor_classes[Ri];

                    // FOR debug
                    // doctor_class_object[doctor_classe.id]=doctor_classe.doctor_class_name;

                    //doctor_class_name為這醫生類別的名稱
                    //scheduling_doctor_name為值班醫生的名稱
                    doctor_class_object[doctor_class.id]=
                    {doctor_class_name:doctor_class['doctor_class_name'],
                     scheduling_doctor_name:""};
                }



                DBAgent.query("QRY_BED_WITH_PATIENT_BY_WARD",{ward_zone_id:ward_zone_id,current_date:curDate,nurse_class:nurse_class_id} , function(err , rows){

                    if(err){
                        Logger.error(err);
                        console.log(err);
                        callback(false,-9999);

                    }else{


                        for(var Ri=0 ; Ri<rows.length; Ri++){
                            //分派一個新的醫生別物件
                            var new_doctor_class_object = JSON.parse(JSON.stringify(doctor_class_object));

                            rows[Ri]['doctors']=new_doctor_class_object;

                            for(var Ci=0 ; Ci<doctor_schedules.length; Ci++){

                                var doctor_schedule=doctor_schedules[Ci];

                                //這筆資料是哪個醫生類別的id
                                var scheduling_doctor_class_id=doctor_schedule['scheduling_doctor_class_id'];

                                //醫生名稱
                                var scheduling_doctor_name=doctor_schedule['scheduling_doctor_name'];

                                //找到同床的排班資料
                                if( rows[Ri]['bed_id'] == doctor_schedule['bed_id']
                                    && scheduling_doctor_class_id!=null
                                    && scheduling_doctor_name!=null){

                                    //把某類別的排班醫生，指給某病床
                                    rows[Ri]['doctors'][scheduling_doctor_class_id]["scheduling_doctor_name"]=scheduling_doctor_name;

                                }

                            }


                        }

                        callback(rows);

                    }

                });

            }



        });


};



/**
 * 取得出入院資訊
 * **/
exports.getInOutHospital = function(condtion , callback){
    var InOutList = [];
    var ResrvTurnBedList = [];
    var resultData = {};
    if(!_.isUndefined(condtion["searchDate"])){
        condtion["searchStartDate"] = condtion["searchDate"]+" 00:00:00";
        condtion["searchEndDate"] = condtion["searchDate"]+" 23:59:59";
    }

    async.parallel([
        function(callback){
            DBAgent.query("QRY_IN_OUT_HOSPITAL" ,condtion, function(err , data){
                InOutList = data;
                callback(err,data);
            })
        },
        function(callback){
            DBAgent.query("QRY_BED_CHANGE_RECORD" ,condtion, function(err , data){
                ResrvTurnBedList = data;
                callback(err,data);
            })
        }
    ],function(err , result){
        resultData = {
            InOutList:InOutList,
            ResrvTurnBedList:ResrvTurnBedList
        };
        callback(err , resultData)
    })

};


/**
 * 取得病房公告
 * */
exports.getAnnouncement = function(ward_zone_id,callback){
    DBAgent.query("QRY_ALL_ANNOUNCEMENT",{"ward_zone_id":ward_zone_id} , function(err , rows){

        if(err){
            Logger.error(error);
            rows = [];
        }

        callback(rows);

    });
};

/**
 * 取得所有護理師-病床排班資料
 * ward 病房{id, district_id, ward_name}
 * bed 病床{id, bed_name, ward_id}
 * nurse_bed_assignment 護理師病床分派{id, nurse_id, bed_id, class, assign_date}
 * nurse 護士
 * */
exports.getNurseSche = function(ward_zone_id,callback){
    var cond = {
        today : moment().format("YYYY/MM/DD") //EASONTODO
        ,ward_zone_id:ward_zone_id
    };

    DBAgent.query("QRY_SCHE_TODAY",cond , function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            var classBedObj={};
            console.log(result);
            if(result!=null && result.length>0){
                for(var i=0;i<result.length;i++){
                    var nurse_no = result[i].nurse_no;
                    var nurse_name = result[i].nurse_name;
                    var ward_id = result[i].ward_id;
                    var ward_name = result[i].ward_name;
                    var bed_name = result[i].bed_name;
                    var fire_control_group_name = result[i].fire_control_group_name;
                    var mission_group_name = result[i].mission_group_name;
                    var class_id = result[i].class_id; //早班 中班 晚班
                    var class_name = result[i].class_name; //早班 中班 晚班

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
                        thisClassObjByWard = {'class_id':class_id,'class_name':class_name,'wardObj':wardObj,'wardList':wardList};
                        //依班別->護理師顯示
                        nurseObj={};
                        nurseList = [];
                        thisClassObjByNurse = {'class_id':class_id,'class_name':class_name,'nurseObj':nurseObj,'nurseList':nurseList};
                        classBedObj[class_id] = {'ward':thisClassObjByWard,'nurse':thisClassObjByNurse};
                    }
                    //依班別->病房顯示
                    if(ward_id in wardObj){
                        var thisWardObj = wardObj[ward_id];
                        var this_wardList = thisWardObj['this_wardList'];
                    }else{
                        var this_wardList = [];
                        var thisWardObj = {'ward_id':ward_id,'ward_name':ward_name,'this_wardList':this_wardList};
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
                    var tmpNurseObj={'ward-bed':ward_name+"-"+bed_name};
                    this_bedList.push(tmpNurseObj);
                }
            }

            //var rtnJson = {};
            //rtnJson['scheByNurse'] = classBedObj;

            callback(classBedObj);
        }
    });
};

/**
 * 取得跑馬燈
 * */
exports.getMarquee = function(callback){
    DBAgent.query("QRY_CURRENT_MARQUEE",{} , function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            callback(result);
        }
    });
};
