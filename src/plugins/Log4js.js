/**
 * Created by Jun on 2016/10/1.
 */
var log4jsConfig = require("../configs/log4js.json");
var log4js = require('log4js');
log4js.configure(log4jsConfig);


function LoggerTool() {}


LoggerTool.prototype.Logger  = function () {

    return  log4js.getLogger('access');
};

LoggerTool.prototype.LoggerError  = function () {

    return  log4js.getLogger('error');
};

module.exports = exports = new LoggerTool;