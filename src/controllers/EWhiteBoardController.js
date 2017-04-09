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


/**
 * 電子白板模組->出院備註畫面API
 * **/
exports.getDischargeNote = function(req, res){
    //用get
    var ward_id = req.query.ward_id || 0;
    //預設今日
    var expect_discharged_date =
        req.query.expect_discharged_date
        || req.body["expect_discharged_date"]
        || moment().format("YYYYMMDD"); //moment().format("YYYY/MM/DD")

    expect_discharged_date = "20170405";
    console.log("ward_id-->"+ward_id);
    console.log("expect_discharged_date-->"+expect_discharged_date);

    request.post(
        'http://localhost:8889/EWhiteBoard/api/Out_TranOut_Data_api',
        { json: { Query_date: expect_discharged_date } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                parseString(body, function (err, result) {
                    var nowyear = moment().format("YYYY");
                    var array = JSON.parse(result.string._);
                    for(var i=0;i<array.length;i++){
                        var age = array[i].birthday.substr(0,4);
                        age = nowyear - age;
                        array[i].age = age;
                    }
                    res.json(tools.getReturnJSON(true,array));
                });
            }else{
                res.json(tools.getReturnJSON(false,[],9999,error))
            }
        }
    );

};


/**
 * 取得手術資訊
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