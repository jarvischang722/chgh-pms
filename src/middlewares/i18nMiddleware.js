/**
 * Created by Jun on 2016/10/3.
 * 語系切換
 */
var _ = require("underscore");
var i18n = require("i18n");

module.exports = function (req, res, next) {

    if (!_.isEmpty(_v(req.query["locale"]))) {
        i18n.setLocale(req, req.query["locale"]);
        req.session.locale = _v(req.query["locale"]);
    } else if (!_.isEmpty(_v(req.session.locale))) {
        if (req.url.indexOf("?") > 1) {
            req.url = req.url + "&locale=" + req.session.locale;
        } else {
            req.url = req.url + "?locale=" + req.session.locale;
        }

        i18n.setLocale(req, req.query["locale"]);
    } else {
        req.session.locale = "zh_TW";
        if (req.url.indexOf("?") > 1) {
            req.url = req.url + "&locale=" + req.session.locale;
        } else {
            req.url = req.url + "?locale=" + req.session.locale;
        }
        i18n.setLocale(req, req.query["locale"]);

    }

    next();

}

function _v(value) {
    if (_.isUndefined(value) || _.isNull(value)) {
        return "";
    }
    return value;
}

