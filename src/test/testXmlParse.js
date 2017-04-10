/**
 * Created by Jun on 2017/4/9.
 */
var fs = require("fs");
var parseString = require('xml2js').parseString;
var xml = "<root>Hello xml2js!</root>"
var svc  = require("../services/DashBoardWebService");
var request = require('request');
var config = require("../configs/SystemConfig");
// fs.readFile('../testData/InTranInData.xml', 'utf8', function(err, xmlData) {
//
//     parseString(xmlData, {trim: true,ignoreAttrs:true}, function (err, result) {
//         console.dir(JSON.parse(result.string));
//     });
//
// });
var formData = {
    StratDate: '20170301',
    EndDate:'20170301'
};
// request.post({url:config.web_service_url+"day_before_info", form: formData},function (error, response, body) {
//     console.log(error);
//     console.log(body);
// });



svc.getRetrieveVS(formData,function (err,data) {
    if(err)
        console.error(err);

    console.dir(data);
})