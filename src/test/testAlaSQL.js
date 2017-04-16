/**
 * Created by Jun on 2017/4/16.
 */
var svc = require("../services/DashBoardWebService");
var alasql = require('alasql');
var config = require("../configs/SystemConfig");
var _ = require("underscore");
var moment = require("moment");
console.log(moment().diff(new Date("19900417"),"years"));
svc.getNurPatient({}, function (err, set1) {

    svc.getInTranInData({Query_date:20170415}, function (err, set2) {
        // console.log(_.difference(Object.keys(set1[0]),Object.keys(set2[0])));
        var res = alasql('SELECT set1.*, set2.*  FROM ? set1 JOIN ? set2 USING patient_id',[set1, set2]);
        // console.log(res);
    });

});