/**
 * Created by Jun on 2016/10/16.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var sha1 = require("sha1");
var DBAgent = require("../plugins/mysql/DBAgent");
var _s = require("underscore.string");

/**
 * 取得所有員工資料
 * */
exports.getAllEmployee = function(callback){
    DBAgent.query("QRY_ALL_EMPLOYEE",{} , function(err , rows){

        if(err){
            Logger.error(error);
            rows = [];
        }

         callback(rows);

    });
};


/**
 * 取得一個員工的資料
 * */
exports.getEmployeeByNo = function(employee_no,callback){
    var condition = {
        employee_no:employee_no
    };
    DBAgent.query("QRY_EMPLOYEE_BY_NO", condition , function(err , e_info){

        if(err){
            Logger.error(error);
            e_info = {};
        }
        if(e_info.length < 1){
            e_info = {};
        }else{
            e_info = e_info[0];
        }
        callback(e_info);

    });
};


/**
 * 刪除員工資料
 * @param employee_no_list(Array || String) : 員工編號
 * */
exports.delEmployee = function(employee_no_list,callback){

    if(!_.isArray(employee_no_list)){
        //代表只有一筆
        employee_no_list = [employee_no_list];
    }
    employee_no_list = _s.words(employee_no_list,",");
    DBAgent.updateExecute("DEL_EMPLOYEE_BY_NO", {employee_no_list: employee_no_list},callback )

};

/**
 * 新增員工資料
 * @param employeeInfo(JSON) : 員工資料
 * */
exports.createEmployee = function(employeeInfo,callback){
    var checkEmployee  = checkEmployeeInfo(employeeInfo);
    if(checkEmployee.error){
        callback(false, checkEmployee.msg);
        return;
    }
    employeeInfo["password"] = sha1(employeeInfo["password"]);

    DBAgent.updateExecute("INS_EMPLOYEE", employeeInfo, function (error , result) {
        if(error){
            callback(false, error.message);
        }else{
            callback(true, "");
        }

    })

};

/**
 * 修改員工資料
 * @param employeeInfo(JSON) : 員工資料
 * */
exports.updateEmployee = function (employeeInfo, callback) {
    var http = require("http");
    DBAgent.updateExecute("UPD_EMPLOYEE", employeeInfo, function (error , result) {
        if(error){
            callback(false, error.message);
        }else{
            callback(true, "");
        }

    })
};

/*** Functions   **/
function checkEmployeeInfo(employeeInfo){
    var error = true ;
    var msg = "" ;

    if(_.size(employeeInfo) < 1){
        msg = "資料異常";
    }else{
        if(!isVaild(employeeInfo["no"])){
            msg = "員工編號未填";
        }else if(!isVaild(employeeInfo["account"])){
            msg = "員工帳號未輸入";
        }else if(!isVaild(employeeInfo["password"])){
            msg = "密碼未填";
        }else if(!isVaild(employeeInfo["sex"])){
            msg = "員工性別選擇";
        }else if(!isVaild(employeeInfo["user_role_id"])){
            msg = "員工使用者角色未選擇";
        }else if(!isVaild(employeeInfo["admin_role_id"])){
            msg = "員工主管角色未選擇";
        }else if(!isVaild(employeeInfo["expired_date"])){
            msg = "員工到職日期須填寫";
        }else if(!isVaild(employeeInfo["is_enable"])){
            msg = "是否啟用資料遺失";
        }else{
            error = false ;
        }
    }


    return {error: error ,msg:msg } ;

}

function isVaild(value){
    if(_.isUndefined(value) ||_.isEmpty(value) ){
        return false;
    }
    return true;
}