/**
 * Created by Jun on 2016/10/1.
 * 權限驗證中繼器
 */
var cookieFuncs = require("../utils/cookieFuncs");
var tools = require("../utils/commonTools");


module.exports = function(req,res,next){

    req.session.nur_id = "101";  //TODO 因為還沒有護理站選擇界面 先寫死93
    next();

};