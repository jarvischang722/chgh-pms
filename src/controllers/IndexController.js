/**
 * Created by Jun on 2016/10/1.
 * 醫師模組
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var mysql =require("mysql");
var tools = require("../utils/commonTools");
var loginService = require("../services/loginService");
var sha1 = require("sha1");
var moment = require("moment");
var cookie = require('cookie');
var cookieFuncs = require('../utils/cookieFuncs');
var EWhiteBoard = require('./EWhiteBoardController');

/***
 * 醫護系統首頁
 * **/
exports.index = function(req, res){

    res.render("Nurse/nurse_index");
};



/**
 * 登入
 * **/
exports.login = function(req, res, next){

    //console.log(req.body);
    var employee_account=req.body["employee_account"] || "";
    var employee_password=req.body["employee_password"] || "";
    var ward_zone_id=req.body["ward_zone_id"] || "";

    //登入系統必為pms
    system_type='pms';


    // 上次登入的病房
    // if(req.cookies.ward_id){
    //     console.log("cookie:"+req.cookies.ward_id);
    // }



//    if(req.session.ward_zone_ids){
//        console.log("session 病房區id:");
//        console.log(req.session.ward_zone_ids);
//
//    }
//
//    if(req.session.user){
//         console.log("session 使用者資訊:");
//         console.log(req.session.user);
//    }


    var login_data ={
        "employee_account":employee_account,
        "employee_password":sha1(employee_password),
        "system_type":system_type,
        "ward_zone_id":ward_zone_id

    };

    //console.log(login_data);

    loginService.login(
        login_data,
        function(result,errorCode){

            console.log(result);

            if(result){
                //登入成功，在伺服器session紀錄使用者資料
                req.session.user= JSON.parse(JSON.stringify(result[0]));

                req.session.login_time=moment().format("YYYY/MM/DD HH:mm:ss");


                res.cookie('user', req.session.user , { expires: new Date(Date.now() + 900000) });
                cookieFuncs.updateReqCookie(req);
                res.json(tools.getReturnJSON(true,result))

            }else{
                res.json(tools.getReturnJSON(false,[],errorCode))
            }

        })

};



/**
 * 登出
 * **/
exports.logout = function(req, res, next){

    if(req.session.user != null){


        //將登入的病房區資料存在session
        var ward_zone_id = req.session.user.ward_zone_id;

        var system_type=req.session.user.system_type || "pms";

        var account=req.session.user.account;

        var user_role_id=req.session.user.user_role_id;


        loginService.insertLeaveLog(
            account,system_type,ward_zone_id,user_role_id,
            function(result,errorCode){


                //清掉session
                req.session.user=null;

                //清coockie
                res.clearCookie("user");
                cookieFuncs.updateReqCookie(req);


                res.redirect("/login");

            })


    }else{

        res.redirect("/login");

    }



};



/**
 * 登入表單
 * **/
exports.loginForm = function(req, res, next){

    //clear session
    req.session.nur_id=null;

    res.render('login');

};




/**
 *
 * **/
exports.reSelectNurArea = function(req, res, next){

    //clear session
    req.session.nur_id=null;

    EWhiteBoard.selectNurArea(req, res, next);

};


/**
 * 選擇病房區表單
 * **/
exports.selectWardZoneForm = function(req, res, next){

    res.render('login/room_select');

};



/**
 * 選擇病房區
 * **/
exports.selectWardZone = function(req, res, next){


    var ward_zone_id=req.body["ward_zone_id"] || 0;
    var ward_zone_name=req.body["ward_zone_name"] || "";



    if(req.session.user != null){

        //把login時，存到sesion的資訊，去判斷有沒有權限登入該病房區
        var system_type=req.session.user.system_type || "pms";
        var account=req.session.user.account;
        var user_role_id=req.session.user.user_role_id;



        //console.log(req.session.user);

        loginService.checkAllowLoginWardZone(
            account,system_type,ward_zone_id,user_role_id,
            function(result,errorCode){

                if(result){
                    //有權限登入


                    //找到該護理站的開放權限(SIP、點滴、電子白板)
                    wardZoneModuleService.wardZoneInfoGet(ward_zone_id,function(result){

                        //將登入的病房區資料存在session
                        req.session.user.ward_zone_id=ward_zone_id;
                        req.session.user.ward_zone_name=ward_zone_name;


                        //該病床區可用的模組及最大病床人數
                        try{

                            req.session.user.module_eng_name=result["result"][0]["module_eng_name"];
                            req.session.user.ward_zone_bed_max=result["result"][0]["ward_zone_bed_max"];

                        }catch(e){
                            //都沒有權限的話，至少留一個電子白板，然後病床人數0人
                            req.session.user.module_eng_name=["EWhiteBoard"];
                            req.session.user.ward_zone_bed_max=0;

                        }

                        //登入時間
                        var date = moment(new Date());
                        req.session.user.login_time=date.format('YYYY/MM/DD A hh:mm:ss');



                        //更新User Cookie
                        res.cookie('user', req.session.user , { expires: new Date(Date.now() + 900000) });
                        cookieFuncs.updateReqCookie(req);


                        console.log(req.session.user);
                        //回傳
                        res.json(tools.getReturnJSON(true,{system_type:system_type}));

                    });




                }else{
                    //無權限登入
                    res.json(tools.getReturnJSON(false,[],errorCode))

                }



            })


    }else{
        //session沒有使用者的資料的話，回傳尚未登入的代碼
        res.json(tools.getReturnJSON(false,[],-9100));
    }


};



/**
 * 更換病房區
 * **/
exports.changeWardZone = function(req, res, next){

    if(req.session.user != null){
        //將登入的病房區資料存在session
        var ward_zone_id = req.session.user.ward_zone_id;

        var system_type=req.session.user.system_type || "pms";

        var account=req.session.user.account;

        var user_role_id=req.session.user.user_role_id;


        loginService.insertLeaveLog(
            account,system_type,ward_zone_id,user_role_id,
            function(result,errorCode){


                //清掉原本進入的護理站id
                req.session.user.ward_zone_id=null;

                res.redirect("/selectWardzone");

            })


    }else{

        res.redirect("/selectWardzone");

    }



};