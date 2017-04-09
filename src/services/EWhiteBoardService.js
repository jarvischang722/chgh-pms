/**
 * Created by Jun on 2017/4/5.
 */
var _ = require("underscore");
var async = require("async");
var DashBoardWebSvc = require("./DashBoardWebService");


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