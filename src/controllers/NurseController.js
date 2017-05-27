/**
 * Created by Eason on 2016/10/26.
 * 跑馬燈
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var nurseService = require("../services/nurseService");
var tools = require("../utils/commonTools");
var validate = require("validate.js");
var moment = require("moment");

function addLastInfo(element,now,user) {
    element.last_update_time = now;
    element.update_user = user;
}
//data validate define
var constraints = {
    employee_no: {
        presence: {
            message: "員工編號不可為空"
        }
    },
    name: {
        presence: {
            message: "姓名不可為空"
        }
    },
    tel: {
        presence: {
            message: "分機不可為空"
        }
    },
    agent1_nurse_id: {
        presence: {
            message: "代理人01不可為空"
        }
        // ,length: function(value, attributes, attributeName, options, constraints) {
        //     if (value.length < 1) {
        //          return {
        //             presence: {message: "代理人011不可為空"},
        //         };
        //     }
        // }
    }
};

var constraints2 = {
    agent1_nurse_id: {
        presence: {
            message: "代理人01不可為空"
        }
    }
};

/**
 * Ian ->病患資訊用
 * 依時間，取得現在是早、小夜、大夜班
 * **/
exports.getClassFromTime = function(req, res){

    var time =
        req.query.time
            || req.body["time"]
            || 0;


    //res.render("Marquee/index");
    nurseService.getClassFromTime(time, function(result){
        res.json({success:true , msg:'' , result:result})
    })
};

/**
 * 護理師首頁
 * **/
exports.nurseIndex = function(req, res){
    res.render("Nurse/nurse_index");
};

/**
 * 護理師資料維護頁面
 * **/
exports.nurseInfoMaintain = function(req, res){
    res.render("Nurse/nurseInfoMaintain");
};

/**
 * 護理師批次病房分派畫面
 * **/
exports.batchBedAssign = function(req, res){
    res.render("Nurse/batchBedAssign");
};

/**
 * 護理師每日病房分派畫面
 * **/
exports.dailyBedAssign = function(req, res){
    res.render("Nurse/dailyBedAssign");
};

/**
 * 護理師班表資料查詢畫面
 * **/
exports.schedulingQuery = function(req, res){
    res.render("Nurse/schedulingQuery");
};


/**
 * 取得護士資訊
 * **/
exports.getAllNurse = function(req, res){

    //res.render("Marquee/index");
    nurseService.getAllNurse(function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 取得護士資訊詳細資料
 * **/
exports.getAllNurse2 = function(req, res){
    //res.render("Marquee/index");
    nurseService.getAllNurse2(function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 新增護士
 * **/
exports.insertNurse = function(req, res){
    var data = req.body
    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    nurseService.insertNurse(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })

};

/**
 * 修改護士 BY ID
 * **/
exports.updateNurseById = function(req, res){
    var data = req.body
    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    nurseService.updateNurseById(data, function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};



/**
 * 更新護理師群組 by no
 * **/
exports.updateNurseGroup = function(req, res){
    var updateNurse = req.body.updateNurse
    var updateNurseSche = req.body.updateNurseSche

    var now = moment().format("YYYY/MM/DD HH:mm:ss");
    var user = req.session.user.account;
    var ischeck = true;
    var validate_error="";
    if(updateNurse){
        updateNurse.forEach(function(element, index, array){
            addLastInfo(element,now,user);
            //資料檢核
            validate_error = validate(element, constraints2, {fullMessages: false});
            if(validate_error){
                ischeck = false;
            }
        });
    }
    if(!ischeck){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }
    console.log("=====updateNurse======");
    console.log(updateNurse);

    if(updateNurseSche){
        updateNurseSche.forEach(function(element, index, array){
            addLastInfo(element,now,user);
        });
    }

    nurseService.updateNurseGroup(updateNurse, updateNurseSche, function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 刪除護士 BY ID
 * **/
exports.deleteNurseById = function(req, res){
    nurseService.deleteNurseById(req.body.nurses, function(result){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 依護理師取得所有護理師-病床排班資料(電子白板系統)
 * **/
exports.getNurseScheByNurse = function(req, res){
    nurseService.getNurseSche(function(result){
        var rtnJson;
        if(result.length>0){
            for(var i=0;i<result.length;i++){

            }
        }
        res.json({success:true , msg:'' , result:result})
    })
};

/**
 * 取得護理師月班表(病房分派畫面)
 * **/
exports.getNurseMonthlySche = function(req, res){

};

/**
 * 取得護理師日班表 input:日期、班別(病房分派畫面)
 * **/
exports.getNurseDailySche = function(req, res){

};

/**
 * 依照日期區間、班別、員工編號取得護理師班表 (病房分派畫面)
 * **/
exports.getNurseScheByRange = function(req, res){
    var ward_zone_id = req.session.user.ward_zone_id;
    nurseService.getNurseSche(req.body,ward_zone_id,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 依照日期區間、班別、員工編號取得護理師班表 (病房分派畫面)
 * **/
exports.getThisNurseSche = function(req, res){
    var ward_zone_id = req.session.user.ward_zone_id;
    nurseService.getThisNurseSche(req.body,ward_zone_id,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 取得病房出入院記錄
 * **/
exports.getMedicalRecord = function(req, res){
    nurseService.getMedicalRecord(req.body,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 取得所有病床
 * **/
exports.getAllBed = function(req, res){
    var ward_zone_id = req.session.user.ward_zone_id;
    nurseService.getAllBed(req.body,ward_zone_id,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 取得所有病床by病房排序&病人
 * **/
exports.getAllBedByWard = function(req, res){
    var ward_zone_id = req.session.user.ward_zone_id;
    nurseService.getAllBedByWard(req.body,ward_zone_id,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 取得所有任務、消防編組
 * **/
exports.getAllMissionGroup = function(req, res){
    nurseService.getAllMissionGroup(req.body,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

exports.getAllFireGroup = function(req, res){
    nurseService.getAllFireGroup(req.body,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 批次排班
 * **/
exports.insertScheBatch = function(req, res){

    var data = req.body;
    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;

    nurseService.insertScheBatch(data,function(result,errorCode,existed_data){
        if(result){
            res.json(tools.getReturnJSON(true,existed_data))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * SIP TEST
 * **/
exports.SIPTEST = function(req, res){
    console.log("SIPTEST");
    var request = require("request");
    var utf8 = require('utf8');
    var reqbody = '<SipEmerData>'
        +'<action>GetData</action>'
        +'<type>CallGroup</type>'
        +'<date>2015/08/29<date>'
        +'</SipEmerData>';

    request.post({
            url:"http://125.227.227.13", //http://125.227.227.13/MikoAPI.php
            port: 80,
            method:"POST",
            headers:{
                'Content-Type': 'application/xml',
            },
            body: reqbody
        },
        function(error, response, body){
            console.log(response.statusCode);
            console.log(response);
            //console.log(body);
            //console.log(error);
        });
};

/**
 * updateMultiTest
 * **/
exports.updateMultiTest = function(req, res){
    nurseService.updateMultiTest(function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
}

exports.updateMultiTest2 = function(req, res){
    nurseService.updateMultiTest2(function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
}

exports.dcrestesip = function(req, res){
    nurseService.dcrestesip(function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
}
