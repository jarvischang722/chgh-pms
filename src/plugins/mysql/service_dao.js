/**
 * Created by Jun on 2016/10/1.
 * 彙整全部DAO
 */
var all_dao = {};
var fs = require("fs");
var commonTools = require("../../utils/commonTools");
var path = require('path');
var daoDirectory = __dirname+"/dao/";
var _ = require("underscore");
var _str = require("underscore.string");

fs.readdirSync(daoDirectory).filter(function(file) {

     all_dao =  _.extend(all_dao, require("./dao/" + file));

});

module.exports = all_dao;

