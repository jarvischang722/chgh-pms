/**
 * Created by Jun on 2016/11/1.
 */
var DBAgent = require("../plugins/mysql/DBAgent");
var _ = require("underscore");
var _s = require("underscore.string");
var async = require("async");
var moment = require("moment");

/**
 * 抓取醫生資訊
 * @parma req : 參數
 * @return err , doctorRow
 * **/
exports.queryDoctor = function(req,callback){
    var params ={};
    if(req.body["doctor_no"]){
        params["doctor_no"] = req.body["doctor_no"];
    }
    params["ward_zone_id"] = req.session.user.ward_zone_id || "";
    async.parallel([
        // 1) 醫生資訊
        function(callback){
            DBAgent.query("QRY_ALL_DOCTOR" , params  ,function(err , doctorRow){
                callback(err , doctorRow);
            })
        },
        // 2) 病房資訊
        function(callback){
            DBAgent.query("QRY_WARD_BED_FOR_DOCTOR" , {ward_zone_id:req.session.user.ward_zone_id}  ,function(err , bedRow){
                callback(err , bedRow);
            })
        },
    ],function(error, data){
            var doctorList = data[0];
            var bedList = data[1];
            _.each(bedList , function(bedObj){
                bedObj["bedInfo"] = bedObj.ward_name+"-"+bedObj.bed_name;
                var existDoctorIdx = _.findIndex(doctorList , {doctor_no : bedObj.doctor_no}) ;
                if(existDoctorIdx > -1 ){
                    if(_.isUndefined(doctorList[existDoctorIdx]["bed_list"])){
                        doctorList[existDoctorIdx]["bed_list"] = [];
                    }
                    doctorList[existDoctorIdx]["bed_list"].push(bedObj);
                }
            })

             //去重複化的病床，並排序
            _.each(doctorList, function(doctor, dIdx){
                doctorList[dIdx]["bed_list"] = _.sortBy(_.uniq(doctor.bed_list ,
                    function(bed){ return bed.bedInfo }),
                    function(obj) { return obj.bedInfo})

            })
            callback(null , doctorList);
    })

};

/***
 * 刪除醫師
 * **/
exports.doDelectDoctor = function(doctor_no_list, callback){
    if(!_.isArray(doctor_no_list)){
        //代表只有一筆
        doctor_no_list = [doctor_no_list];
    }
    doctor_no_list = _s.words(doctor_no_list,",");
    DBAgent.updateExecute("DEL_DOCTOR_BY_NO", {doctor_no_list: doctor_no_list},callback )
};



/**
 * 編輯醫師
 * */
exports.doUpdateDoctor = function(doctorInfoObj,callback ){
    DBAgent.updateExecute("UPD_DOCTOR", doctorInfoObj , function(err,result){
        callback(err,result)
    })
};

/**
 *新增醫師
 * */
exports.doCreateDoctor = function(doctorInfoObj,callback ){
    doctorInfoObj["ward_zone_id"] =  doctorInfoObj["ward_zone"];
    delete doctorInfoObj["ward_zone"];
    DBAgent.updateExecute("INS_DOCTOR", doctorInfoObj , function(err,result){
        callback(err,result)
    })
};


/***
 * 醫師排班查詢
 * **/
exports.getAllDoctorScheduling = function(req,callback){
    var AllDoctorSchedulingList = [];
    var scheduling_start_date = req.body["scheduling_start_date"]  || moment().format("YYYY/MM/DD");
    var scheduling_end_date = req.body["scheduling_end_date"]  || moment(new Date(scheduling_start_date)).add(6 ,"month").format("YYYY/MM/DD");
    var cond = {
        scheduling_start_date:scheduling_start_date,
        scheduling_end_date:scheduling_end_date,
        ward_zone_id : req.session.user.ward_zone_id
    };

    DBAgent.query("QRY_ALL_DOCTOR_SCHEDULING" ,cond, function (err, schedulingData) {
        if(schedulingData.length > 0){
            AllDoctorSchedulingList = schedulingData ;
        }
        callback(err , AllDoctorSchedulingList);
    })
};


/***
 * 儲存醫生排班
 * @param req {JSON}
 * @return  callback(true|false , errorMsg);
 * **/
exports.doSaveDoctorScheduling = function(req,callback){
    /** schedulingDataList 資料結構
     [
     {doctor_no:'xxx', 'doctor_class_id'='5' , ward_id='123', bed_id='5555', schedule_date='2016/11/29'},
     {doctor_no:'xxx', 'doctor_class_id'='5' , ward_id='123', bed_id='5555', schedule_date='2016/11/29'},
     {doctor_no:'xxx', 'doctor_class_id'='5' , ward_id='123', bed_id='5555', schedule_date='2016/11/29'},
     ]
     * **/
    var schedulingDataList = req.body["schedulingDataList"] || [];

    if(_.isArray(schedulingDataList)){
        _.each(schedulingDataList, function(schd_data,sIdx){
            schedulingDataList[sIdx]["update_user"] = req.session.user.name;
        });
        DBAgent.updateBatchExecute("INS_DOCTOR_SCHEDULING",schedulingDataList,function(err,result){
            if(err){
                callback(false,err);
            }else{
                callback(true,'');
            }
        })
    }else{
        schedulingDataList["update_user"] =  req.session.user.name;
        DBAgent.updateExecute("INS_DOCTOR_SCHEDULING",schedulingDataList,function(err,result){
            if(err){
                callback(false,err);
            }else{
                callback(true,'');
            }
        })
    }
};