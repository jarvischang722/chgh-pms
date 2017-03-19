/**
 * Created by Jun on 2016/10/1.
 * 系統維護
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var employeeService = require("../services/employeeService");
var installerService = require("../services/installerService");
var userRoleService = require("../services/userRoleService");
var sipIPService = require("../services/sipIPService");
var wardZonePrivilegeService = require("../services/wardZonePrivilegeService");

var wardZoneModuleService = require("../services/wardZoneModuleService");


var ErrorCodeList = require("../configs/ErrorCode");
var SystemConfig = require("../configs/SystemConfig");
var tools = require("../utils/commonTools");

var sha1 = require("sha1");
var async = require("async");



//定時抓排程資料的主程式
var cronSchedule =require('../services/cronService');
/**
 * 人員基本資料管理
 * **/
exports.employeeManage = function (req, res) {
    res.render("SystemMaintain/employeeManage");
};


/**
 * 獲取員工資料
 * **/
exports.employeeQuery = function (req, res) {

    var employee_no = req.body["employee_no"] || "";
    if (!_.isEmpty(employee_no)) {
        //只找一筆
        employeeService.getEmployeeByNo(employee_no, function (employeeInfo) {
            res.json({success: true, msg: '', employeeInfo: employeeInfo})
        })
    } else {
        employeeService.getAllEmployee(function (employeeList) {
            res.json({success: true, msg: '', employeeList: employeeList})
        })
    }


};


/**
 * 刪除員工
 * **/
exports.employeeDelete = function (req, res) {
    var employee_no_list = req.body["employee_no_list"] || '';
    employeeService.delEmployee(employee_no_list, function (error, result) {
        if (error) {
            res.json({success: false, errorMsg: error.message, errorCode: '1111'})
        } else {
            res.json({success: true})
        }

    });
};

/**
 * 新增員工
 * **/
exports.employeeCreate = function (req, res) {
    var employeeInfo = req.body["employeeInfo"] || {};
    employeeInfo["update_user"] = req.session.user.name;
    employeeService.createEmployee(employeeInfo, function (success, msg) {
        res.json({success: success, errorMsg: msg, errorCode: '1111'})
    })
};

/**
 * 更新員工
 * **/
exports.employeeUpdate = function (req, res) {
    var employeeInfo = req.body["employeeInfo"] || {};
    employeeInfo["update_user"] = req.session.user.name;
    employeeService.updateEmployee(employeeInfo, function (success, msg) {
        res.json({success: success, errorMsg: msg, errorCode: '1111'})
    })
};

/**
 * 獲取使用者角色
 * **/
exports.userRoleQuery = function (req, res) {
    DBAgent.query("QRY_USER_ROLE", {}, function (error, rows) {
        res.json({user_role_list: rows});
    })
};


/**
 * 獲取管理者角色
 * **/
exports.adminRoleQuery = function (req, res) {
    DBAgent.query("QRY_ADMIN_ROLE", {}, function (error, rows) {
        res.json({admin_role_list: rows});
    })
};

/****
 * 獲取使用者角色權限
 * **/
exports.queryUserRolePermissions = function (req, res) {
    userRoleService.doQueryUserRolePermissions(function (err, userRolePermissionList) {
        if (err) {
            res.json({success: false, errorCode: '0001', errorMsg: '', userRolePermissionList: []})
        }
        res.json({success: true, userRolePermissionList: userRolePermissionList})
    });
};

/****
 * 更新使用者角色權限
 * **/
exports.updateUserRolePermissions = function (req, res) {
    userRoleService.doUpdateUserRolePermissions(req, function (resultData) {
        if (resultData.success) {
            res.json({success: false, errorCode: resultData.errorCode, errorMsg: resultData.errorMsg})
        } else {
            res.json({success: true})
        }
    });
};

/**
 * 登入資訊
 * **/
exports.productInformation = function (req, res) {


    installerService.getKeyAndMaxUser(function (result, errorCode) {

        if (result) {

            res.json(tools.getReturnJSON(true, result))

        } else {

            res.json(tools.getReturnJSON(false, [], errorCode))
        }


    });


};


/**
 * 護理站權限部份
 * **/
exports.getWardZonePrivilege = function (req, res) {


    var user_role_id = req.body["user_role_id"] || req.query["user_role_id"] || req.session.user.user_role_id || 0;

    wardZonePrivilegeService.getWardZonePrivilege(user_role_id, function (result, errorCode) {

        if (result) {

            res.json(tools.getReturnJSON(true, result))

        } else {

            res.json(tools.getReturnJSON(false, [], errorCode))
        }


    });


};

/**
 * 護理站權限部份
 * **/
exports.updateWardZonePrivilege = function (req, res) {

    var user_role_id = req.body["user_role_id"] || req.query["user_role_id"] || 0;

    var ward_zone_ids = req.body["ward_zone_ids"] || req.query["ward_zone_ids"] || 0;

    var update_user=req.session.user.account || "";

    wardZonePrivilegeService.updateWardZonePrivilege(user_role_id, ward_zone_ids,update_user, function (result, errorCode) {

        if (result) {

            res.json(tools.getReturnJSON(true, result))

        } else {

            res.json(tools.getReturnJSON(false, [], errorCode))
        }


    });


};

/**
 * 加入使用者角色
 * **/
exports.addUserRole = function (req, res) {

    var user_role_name = req.body["user_role_name"] || req.query["user_role_name"] || 0;

    var update_user=req.session.user.account || "";

    userRoleService.createUserRole(user_role_name,update_user, function (result, errorCode) {

        if (result) {

            res.json(tools.getReturnJSON(true, result))

        } else {

            res.json(tools.getReturnJSON(false, [], errorCode))
        }


    });


};

/**
 * 更新使用者角色
 * **/
exports.updateUserRole = function (req, res) {

    var user_role_name = req.body["user_role_name"] || req.query["user_role_name"] || "";
    var user_role_id = req.body["user_role_id"] || req.query["user_role_id"] || 0;
    var update_user=req.session.user.account || "";

    userRoleService.updateUserRole(user_role_name, user_role_id,update_user, function (result, errorCode) {

        if (result) {

            res.json(tools.getReturnJSON(true, result))

        } else {

            res.json(tools.getReturnJSON(false, [], errorCode))
        }


    });


};

/**
 * 刪除使用者角色
 * **/
exports.deleteUserRole = function (req, res) {


    var user_role_ids = req.body["user_role_ids"] || req.query["user_role_ids"] || 0;

    userRoleService.deleteUserRole(user_role_ids, function (result, errorCode) {

        if (result) {

            res.json(tools.getReturnJSON(true, result))

        } else {

            res.json(tools.getReturnJSON(false, [], errorCode))
        }


    });


};


/**
 * 權限設定
 * **/
exports.privilegeSet = function (req, res) {
    res.render("SystemMaintain/privilegeManage");
};


/**
 * 登入資訊
 * **/
exports.loginInfo = function (req, res) {
    res.render("SystemMaintain/loginInfo");
};

/**
 * 系統參數設定頁面
 * **/
exports.systemParamSet = function (req, res) {
    console.log("=== Execute systemParamSet===");
    var sipparam = {
        param_id: '1',
        ring_last_time: '20',
        ring_type: '2',
        debug_time: '5',
        get_call_record_time: '12:30',
        ntp_adjust: '13:50',
        ntp_server_path: 'D://logs/path',
        sip_server_database_ip: '192.168.1.5'
    };
    var hisParam = {
        param_id: '1',
        get_his_data_period: '50'
    };
    var bitParam = {
        param_id: '1',
        weight_detect_count: '5',
        rate_count: '15',
        default_left_weight: '5088',
        sampling_day: '88'

    }
    var sip_params = {};
    var bit_params = {};
    var his_params = {};
    async.parallel([
        //取得SIP參數
        function (callback) {
            DBAgent.query("QRY_SIP_PARAM", {}, function (err, sipRows) {
                if (!err && !_.isUndefined(sipRows) && sipRows.length > 0) {
                    sip_params = sipRows[0];
                }
                callback(err, sipRows);
            })
        },
        //取得點滴參數
        function (callback) {
            DBAgent.query("QRY_BIT_PARAM", {}, function (err, bitRows) {
                if (!err && !_.isUndefined(bitRows) && bitRows.length > 0) {
                    bit_params = bitRows[0];
                }
                callback(err, bitRows);
            })
        },
        //取得HIS參數
        function (callback) {
            DBAgent.query("QRY_HIS_PARAM", {}, function (err, hisRows) {
                if (!err && !_.isUndefined(hisRows) && hisRows.length > 0) {
                    his_params = hisRows[0];
                }
                callback(err, hisRows);
            })
        }

    ], function (err, result) {
        res.render("SystemMaintain/systemParamSet", {
            sip_params: sip_params,
            bit_params: bit_params,
            his_params: his_params
        });
    });

};


/**
 * 更新SIP系統參數
 * **/
exports.updateSIPParam = function (req, res) {
    req.body["update_user"] = req.session.user.name;
    DBAgent.updateExecute("UPD_SIP_PARAM", req.body, function (err, result) {
        if (err)
            res.json({success: false, errorCode: '9999', errorMsg: err.message});
        else{
            //開新的排程
            cronSchedule.SIPRecordStart();
            res.json({success: true});
        }

    })
};

/**
 * 更新HIS系統參數
 * **/
exports.updateHISParam = function (req, res) {
    req.body["update_user"] = req.session.user.name;
    DBAgent.updateExecute("UPD_HIS_PARAM", req.body, function (err, result) {
        if (err)
            res.json({success: false, errorCode: '9999', errorMsg: err.message});
        else
            res.json({success: true});
    })
};

/**
 * 更新點滴系統參數
 * **/
exports.updateBitParam = function (req, res) {
    req.body["update_user"] = req.session.user.name;
    DBAgent.updateExecute("UPD_BIT_PARAM", req.body, function (err, result) {
        if (err)
            res.json({success: false, errorCode: '9999', errorMsg: err.message});
        else
            res.json({success: true});
    })
};

/**
 * 統計報表列印
 * **/
exports.statisticalReportPrint = function (req, res) {
    res.render("SystemMaintain/statisticalReportPrint");
};

/**
 * 緊急外部裝置設定
 * **/
exports.emergencyExternalSet = function (req, res) {
    res.render("SystemMaintain/emergencyExternalSet");
};

/**
 * 護理站建立
 * **/
exports.nursingStationEstablish = function (req, res) {
    res.render("SystemMaintain/nursingStationEstablish");
};

/**
 * SIP IP 建立
 * **/
exports.sipEstablish = function (req, res) {

    //先插入沒有SIP IP的護理站

    sipIPService.insertNonIPWardzone(function(result){

        res.render("SystemMaintain/sipEstablish");

    })


};



/**
 * 取得檢查SIP的區間時間API
 * @param req
 * @param res
 */
exports.SIPGetCheckInterval = function(req, res){


    sipIPService.SIPGetCheckInterval(function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    });

};



/**
 * 確認SIP是否異常的API
 * @param req
 * @param res
 */
exports.SIPCheckIsOnline = function(req, res){


    sipIPService.SIPCheckIsOnline(function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    });

};


/**
 * 搜尋SIPIP
 * **/
exports.getSIPIP = function(req, res){

    //護理站id
    try{
        var ward_zone_id = req.query["ward_zone_id"] || req.session.user.ward_zone_id || 0;
    }catch(e){
        var ward_zone_id=-1;
    }



    //傳-1代表要搜尋全部護理站的sip ip
    if(ward_zone_id==-1){

        sipIPService.getAllSIPIP(function(result,errorCode){

            if(result){

                res.json(tools.getReturnJSON(true,result))

            }else{

                res.json(tools.getReturnJSON(false,[],errorCode))
            }


        });

    }else{

        sipIPService.getSIPIPByWardzoneID(ward_zone_id, function(result,errorCode){

            if(result){

                res.json(tools.getReturnJSON(true,result))

            }else{

                res.json(tools.getReturnJSON(false,[],errorCode))
            }


        });
    }



};

/**
 * 加入SIPIP
 * **/
exports.addSIPIP = function(req, res){

    var sip_ip = req.body["sip_ip"] || req.query["sip_ip"] || "";
    var DBAccount = req.body["DBAccount"] || req.query["DBAccount"] || "";
    var DBPassword = req.body["DBPassword"] || req.query["DBPassword"] || "";
    var DBPort = req.body["DBPort"] || req.query["DBPort"] || "";
    var DBName = req.body["DBName"] || req.query["DBName"] || "";

    //護理站id
    var ward_zone_id = req.body["ward_zone_id"] || 0;

    //登入者
    try{
        var updater = req.session.user.account || "";
    }catch(e){
        var updater="";
    };



    var sipIPObject={
        sip_ip:sip_ip,
        DBAccount:DBAccount,
        DBPassword:DBPassword,
        DBPort:DBPort,
        DBName:DBName,
        ward_zone_id:ward_zone_id,
        updater:updater
    };



    sipIPService.insertSIPIP(sipIPObject,function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });


};

/**
 * 更新SIPIP
 * **/
exports.updateSIPIP = function(req, res){

    var sip_ip_id = req.body["sip_ip_id"] || 0;
    var sip_ip = req.body["sip_ip"] || "";
    var DBAccount = req.body["DBAccount"] || req.query["DBAccount"] || "";
    var DBPassword = req.body["DBPassword"] || req.query["DBPassword"] || "";
    var DBPort = req.body["DBPort"] || req.query["DBPort"] || "";
    var DBName = req.body["DBName"] || req.query["DBName"] || "";


    //登入者
    try{
        var update_user = req.session.user.account || "";
    }catch(e){
        var update_user="";
    };



    var sipIPObject={
        sip_ip_id:sip_ip_id,
        sip_ip:sip_ip,
        DBAccount:DBAccount,
        DBPassword:DBPassword,
        DBPort:DBPort,
        DBName:DBName,
        update_user:update_user
    };



    sipIPService.updateSIPIP(sipIPObject, function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });


};

/**
 * 刪除SIPIP
 * **/
exports.deleteSIPIP = function(req, res){


    var sip_ip_ids = req.body["sip_ip_ids"] || "";

    sipIPService.deleteSIPIP(sip_ip_ids, function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });


};



/**
 * 取得版本資訊資料
 * **/
exports.logInfoGet = function(req, res){



    async.parallel([

        function(callback){

            tools.getKey(function(result){

                callback(null,result);

            });

        }
    ],function (err, results) {


        if(err){

            Logger.error(err);
            res.json(tools.getReturnJSON(false,[],-9999));

        }else{

            var result={
                key:results[0],
                version:SystemConfig["version"]
            }

            res.json(tools.getReturnJSON(true,result))
        }


    });




};


/**
 * 護理站，取得開放的模組及最大使用人數清單  API
 * @param req
 * @param res
 */
exports.wardZoneInfoGet = function(req, res){


    var ward_zone_id= req.query.ward_zone_id || 0;


    wardZoneModuleService.wardZoneInfoGet(ward_zone_id,function(result){

        if(result!=null){

            res.json(result);

        }else{

            res.json(tools.getReturnJSON(false,[],-9999));

        }


    });


};




/**
 * 插入護理站
 * @param req
 * @param res
 */
exports.wardZoneInsert = function(req, res){

    var data = req.body

    wardZoneModuleService.insertWardZoneModulesInfomation(data,function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    });

};


/**
 * 護理站，取得開放的模組及最大使用人數清單  API
 * @param req
 * @param res
 */
exports.wardZoneInfoUpdate = function(req, res){

    var data = req.body

            wardZoneModuleService.updateWardZoneModulesInfomation(data,function(result,errorCode){

                if(result){

                    res.json(tools.getReturnJSON(true,result))

                }else{

                    res.json(tools.getReturnJSON(false,[],errorCode))
                }
            });

};


/**
 * 護理站，更新護理站病床上限  API
 * @param req
 * @param res
 */
exports.wardZoneBedInfoUpdate = function(req, res){

    var data = req.body

    wardZoneModuleService.updateWardZoneBedInfoUpdate(data,function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    });

};


/**
 * 護理站，更新護理站開放模組  API
 * @param req
 * @param res
 */
exports.wardZoneModuleInfoUpdate = function(req, res){

    var data = req.body

    wardZoneModuleService.updateWardZoneModuleInfoUpdate(data,function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    });

};



/**
 * 護理站，刪除護理站API
 * @param req
 * @param res
 */
exports.wardZoneModuleInfoDelete = function(req, res){

    var ward_zone_ids = req.body["ward_zone_ids"];

    wardZoneModuleService.deleteWardZoneModulesInfomation(ward_zone_ids,function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    });

};



