/**
 * Created by Jun on 2016/10/1.
 * 權限驗證中繼器
 */
var cookieFuncs = require("../utils/cookieFuncs");
var tools = require("../utils/commonTools");


module.exports = function(req,res,next){

    //for develop use
     req.session.user={};
     req.session.user.no= 'T0001';
     req.session.user.name= '管理者';
     req.session.user.account= 'test';
     req.session.user.sex= 'm';
     req.session.user.expired_date= '2016-12-31T00=00=00.000Z';
     req.session.user.is_enable= 'Y';
     req.session.user.user_role_id= 1;
     req.session.user.user_role_name= '系統管理員';
     req.session.user.admin_role_name= null;
     req.session.user.system_type= 'pms';
     req.session.user.module_eng_name= 'Bit';
     req.session.user.login_time= '2016/11/29 PM 11:09:49';


     req.session.nur_id = "101";

    //origin PMS is called ward_zone_id, but in chgh PMS need to call nur_id
    req.session.user.ward_zone_id = req.session.nur_id;
    req.session.user.ward_zone_name = req.session.nur_id;


    if(req.session.nur_id == undefined){
        return res.redirect("/selectNurArea");
    }
    
    
    //req.session.nur_id = "101";  //TODO 因為還沒有護理站選擇界面 先寫死93
    next();

};