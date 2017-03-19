/**
 * Created by Jun on 2016/10/1.
 * 電子白板模組
 */
 
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var tools = require("../utils/commonTools");
var moment = require("moment");


//待辦事項
var EWhiteBoardService = require("../services/EWhiteBoardService");

var moment = require("moment");

exports.index = function(req, res, next){

    res.render('EWhiteBoard/index', { title: '電子白板' });

};


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
 * 代辦事項
 * **/
exports.todoItem = function(req, res, next){
    res.render('EWhiteBoard/todoItem' );
};

/**
 * 出入院
 * **/
exports.admissionDischarge = function(req, res, next){
    res.render('EWhiteBoard/admissionDischarge' );
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
 * 醫師資訊
 * **/
exports.doctorInfo = function(req, res, next){
    res.render('EWhiteBoard/doctorInfo' );
};

/**
 * 病床公告
 * **/
exports.announcement = function(req, res, next){
    res.render('EWhiteBoard/announcement' );
};





//以下API區


/**
 * 電子白板模組->病患資訊畫面API
 * **/
exports.PatientForm = function(req, res){

    res.render('EWhiteBoard/patient_information');

};

/**
 * 電子白板模組->病患資訊API
 * **/
exports.queryBedWithPatientByWard = function(req, res){

    //用get
    var ward_zone_id = req.session.user.ward_zone_id || 0;

    var current_datetime = req.query.current_datetime || moment().format("YYYY-MM-DD HH:mm:ss");


    EWhiteBoardService.BedWithPatientByWard(
        ward_zone_id,current_datetime,
        function(result,errorCode){

            if(result){

                res.json(tools.getReturnJSON(true,result))

            }else{

                res.json(tools.getReturnJSON(false,[],errorCode))
            }


        });


};


/**
 * 電子白板模組->待辦事項API
 * **/
exports.queryPatientTodoByWard = function(req, res){

    //用get
    var ward_zone_id = req.session.user.ward_zone_id || 0;

    var patient_todo_record_date =
        req.query.patient_todo_record_date
            || req.body["patient_todo_record_date"]
            || moment().format("YYYY/MM/DD");


    var is_finish =
        req.query.is_finish
            || req.body["is_finish"]
            || "";


    EWhiteBoardService.PatientTodoByWard(
        ward_zone_id,patient_todo_record_date,is_finish,
        function(result,errorCode){

            if(result){

                res.json(tools.getReturnJSON(true,result))

            }else{

                res.json(tools.getReturnJSON(false,[],errorCode))
            }


        });

}

/**
 * 電子白板模組->出院備註畫面API
 * **/

exports.queryPatientDischargedRemark = function(req, res){

    //用get
    var ward_id = req.query.ward_id || 0;

    //預設今日
    var expect_discharged_date =
        req.query.expect_discharged_date
            || req.body["expect_discharged_date"]
            || moment().format("YYYY/MM/DD");


    EWhiteBoardService.PatientDischargedRemark(
        ward_id,expect_discharged_date,
        function(result,errorCode){

            if(result){

                res.json(tools.getReturnJSON(true,result))

            }else{

                res.json(tools.getReturnJSON(false,[],errorCode))
            }


        });

}

/**
 * 出入院資料
 * ***/
exports.InOutHospitalInfo = function(req, res){
        EWhiteBoardService.getInOutHospital(req.body , function(err, resultData){
            if(err){
                res.json({success:false , msg :err });
                return;
            }
            res.json({success:true  , InOutList : resultData.InOutList , ResrvTurnBedList:resultData.ResrvTurnBedList})
        })
};

/**
 * 電子白板模組->病房公告
 * **/
exports.getAnnouncement = function(req, res){
    var ward_zone_id = req.session.user.ward_zone_id;
    //res.render("Marquee/index");
    EWhiteBoardService.getAnnouncement(ward_zone_id,function(result){
        res.json({success:true , msg:'' , result:result});
    })
};

/**
 * 依病床取得所有護理師-病床排班資料(電子白板系統)
 * **/
exports.getNurseSche = function(req, res){
    var ward_zone_id = req.session.user.ward_zone_id;
    EWhiteBoardService.getNurseSche(ward_zone_id,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 取得跑馬燈(電子白板系統)
 * **/
exports.getMarquee = function(req, res){
    EWhiteBoardService.getMarquee(function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};
