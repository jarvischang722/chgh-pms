/**
 * Created by Jun on 2016/10/1.
 * 權限驗證中繼器
 */
var cookieFuncs = require("../utils/cookieFuncs");
var tools = require("../utils/commonTools");
var _ = require("underscore");

module.exports = function (req, res, next) {

    if (!_.isUndefined(req.query["nur_id"]) && !_.isEmpty(req.query["nur_id"])) {
        req.session.nur_id = req.query["nur_id"];
    } else {
        if (_.isUndefined(req.session.nur_id) || _.isEmpty(req.session.nur_id)) {
            return res.redirect("/selectNurArea");
        }
    }

    next();

};