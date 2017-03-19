/**
 * Created by Jun on 2016/10/1.
 * 權限驗證中繼器
 */
var cookieFuncs = require("../utils/cookieFuncs");
var tools = require("../utils/commonTools");


module.exports = function(req,res,next){

    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var url = req.originalUrl;


    //for develop use
    // req.session.user={};
    // req.session.user.no= 'T0001',
    // req.session.user.name= '管理者',
    // req.session.user.account= 'test',
    // req.session.user.sex= 'm',
    // req.session.user.expired_date= '2016-12-31T00=00=00.000Z',
    // req.session.user.is_enable= 'Y',
    // req.session.user.user_role_id= 1,
    // req.session.user.user_role_name= '系統管理員',
    // req.session.user.admin_role_name= null,
    // req.session.user.system_type= 'pms',
    // req.session.user.ward_zone_id= '1',
    // req.session.user.ward_zone_name= '5A',
    // req.session.user.module_eng_name= 'Bit',
    // req.session.user.login_time= '2016/11/29 PM 11:09:49'

    if(!req.cookies){
        cookieFuncs.updateReqCookie(req);
    }

    if((req.session.user== undefined || req.session.user == null ) && req.cookies.user != undefined){
        req.session.user = req.cookies.user;
    }


    if(url=="/login" ||  req.session.user){

        next();

    }else if(url.includes("/middleAPI") &&  !req.session.user){
        //HIS中繼API的部份，未登入時要回傳JSON的提示文字，而不是導到HTML頁面

        res.json(tools.getReturnJSON(false,[],"-9100"));


    }
    else{
        res.redirect("/login")
    }

}