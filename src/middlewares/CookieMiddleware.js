/**
 * Created by Jun on 2016/12/25.
 * cookie相關中繼器
 */
var cookieFuncs = require("../utils/cookieFuncs");

module.exports = function(req,res,next){

    cookieFuncs.updateReqCookie(req);
    next();
};
