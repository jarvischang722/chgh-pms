/**
 * Created by Jun on 2016/10/1.
 * 醫師模組
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var doctorService = require("../services/doctorService");
var DBAgent = require("../plugins/mysql/DBAgent");
var mysql = require("mysql");

/**
 * 獲取醫生資訊
 * **/
exports.doctorQuery = function (req, res) {

    doctorService.queryDoctor(req, function (err, doctorRows) {
        var success = true;
        var errorCode = "";
        var errorMsg = "";
        if (err) {
            success = false;
            errorCode = "0000";
            errorMsg = err;
            doctorRows = [];
        }

        res.json({success: success, errorCode: errorCode, errorMsg: errorMsg, doctorList: doctorRows})
    })
};

/**
 * 刪除醫師資料
 * **/
exports.delectDoctor = function(req, res){
    var doctor_no_list = req.body["doctor_no_list"] || "";
    if(_.isEmpty(doctor_no_list)){
        res.json({success:false, errorCode:'1000' , errorMsg:'無刪除醫師的編號'});
        return;
    }
    doctorService.doDelectDoctor(doctor_no_list,function(err , result){
        if(err){
            res.json({success:false, errorCode:'1000' , errorMsg:''});
        }else{
            res.json({success:true});
        }
    })
};

/**
 * 更新醫師資料
 * **/
exports.updateDoctor = function(req, res){
    var update_kind = req.body["update_kind"] || "add";
    var doctorInfoObj = req.body["doctorInfoObj"] || {};
    doctorInfoObj["update_user"] = req.session.user.name;
    if(_.size(doctorInfoObj)){
        if(_.isEqual(update_kind, "add")){
            doctorService.doCreateDoctor(doctorInfoObj,function(err , result){
                if(err){
                    res.json({success:false, errorCode:'1000' , errorMsg:err.message});
                }else{
                    res.json({success:true});
                }
            })
        }else{
            doctorService.doUpdateDoctor(doctorInfoObj,function(err , result){
                if(err){
                    res.json({success:false, errorCode:'1000' , errorMsg:err.message});
                }else{
                    res.json({success:true});
                }
            })
        }

    }else{
        res.json({success:false, errorCode:'1000' , errorMsg:'資料缺少'});
    }
};



/***
 * 醫生資料維護
 * **/
exports. doctorInfoMaintain = function (req, res) {



    res.render("Doctor/doctorInfoMaintain");
};

/**
 *醫師排班設定頁面
 * **/
exports.doctorSchedulingSet = function (req, res) {
    res.render("Doctor/doctorSchedulingSet");
};

/**
 *醫師排班查詢頁面
 * **/
exports.doctorSchedulingQuery = function (req, res) {
    res.render("Doctor/doctorSchedulingQuery");
};


/**
 * 查詢醫師排班API
 * **/
exports.queryDoctorScheduling = function (req, res) {
    doctorService.getAllDoctorScheduling(req, function (err, AllDoctorSchedulingList) {
        if (err) {
            res.json({success: false, errorCode: '', errorMsg: ''});
        } else {
            res.json({success: true, AllDoctorSchedulingList: AllDoctorSchedulingList});
        }
    })
};

/***
 * 儲存醫師排班API
 * */
exports.saveDoctorScheduling = function(req, res){
    doctorService.doSaveDoctorScheduling(req, function(success, errorMsg){
        if (success) {
            res.json({success: true });
        } else {
            res.json({success: false, errorCode: '', errorMsg: errorMsg});
        }
    })
}


/**
 * 取醫師類別
 * **/
exports.getDoctorClass = function(req, res){
    DBAgent.query("QRY_DOCTOR_CLASS", {} , function(err, classRows){
        if(err ){
            res.json({success:false,errorCode:'', errorMsg:err })
        }else{
            res.json({success:true,classRows:classRows })
        }
    })
};

/**
 * 新增醫師類別
 * **/
exports.addDoctorClass = function(req, res){
    if(_.isUndefined(req.body["doctor_class_name"])){
        res.json({success:false,errorCode:'', errorMsg:'無醫師類別名稱' });
        return;
    }
    var params = {
        doctor_class_id:req.body["doctor_class_id"] ,
        doctor_class_name:req.body["doctor_class_name"],
        update_user : req.session.user.name
    };
    DBAgent.query("INS_DOCTOR_CLASS", params, function(err, classRows){
        if(err ){
            res.json({success:false,errorCode:'', errorMsg:err.message })
        }else{
            res.json({success:true })
        }
    })
};


/**
 * 刪除醫師類別
 * **/
exports.deleteDoctorClass = function(req, res){
    var doctor_class_no_list = req.body["doctor_class_no_list"] || [];
    if(doctor_class_no_list.length == 0) {
        res.json({success:false,errorCode:'', errorMsg:'請選取要刪除的醫師類別' })
        return;
    }
    DBAgent.query("DEL_DOCTOR_CLASS", {doctor_class_no_list:doctor_class_no_list} , function(err, classRows){
        if(err ){
            res.json({success:false,errorCode:'', errorMsg:err })
        }else{
            res.json({success:true,classRows:classRows })
        }
    })
};