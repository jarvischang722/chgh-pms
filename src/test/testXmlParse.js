/**
 * Created by Jun on 2017/4/9.
 */
var fs = require("fs");
var parseString = require('xml2js').parseString;
var xml = "<root>Hello xml2js!</root>"
var svc  = require("../services/DashBoardWebService");

// fs.readFile('../testData/InTranInData.xml', 'utf8', function(err, xmlData) {
//
//     parseString(xmlData, {trim: true,ignoreAttrs:true}, function (err, result) {
//         console.dir(JSON.parse(result.string));
//     });
//
// });
svc.getShiftCollectList({},function (err,data) {
    console.dir(data);
})