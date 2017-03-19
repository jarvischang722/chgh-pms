/**
 * Created by Jun on 2016/11/13.
 * 使用者權限服務
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var async = require("async");
var DBAgent = require("../plugins/mysql/DBAgent");

/***
 * 取得所有角色權限
 * @return
 * **/
exports.doQueryUserRolePermissions = function (callback) {
    DBAgent.query("QRY_USER_ROLE_FUNCS_PERMISN", function (err, funcsPermList) {
        var userRolePermissionList = [];
        funcsPermList = _.groupBy(funcsPermList, 'user_role_id');
        _.each(Object.keys(funcsPermList), function (userRole) {
            var user_role_funcList = [];

            var model_group = _.groupBy(funcsPermList[userRole], 'function_model_id');
            _.each(Object.keys(model_group), function (module) {
                user_role_funcList.push({
                    module_id: model_group[module][0].function_model_id,
                    module_name: model_group[module][0].model_name,
                    subModuleist: model_group[module]
                })
            })
            userRolePermissionList.push({
                user_role_id: userRole,
                user_role_name: funcsPermList[userRole][0].user_role_name,
                user_role_funcList: user_role_funcList
            });
        })
        callback(err, userRolePermissionList);
    })
};


/***
 * 實做更新使用者角色權限
 * @param userRolePermissionList {Array} : 要改變權限的資料
 * **/
exports.doUpdateUserRolePermissions = function (req, callback) {
    /**
     * userRolePermissionList:
     * [
     *  {userRoleId:角色id , function_sub_id : 子功能id , create_sta:Y , read_sta: Y , update_sta: Y : delete_sta:Y }
     *  {userRoleId:1 , function_sub_id : 2 , create_sta:Y , read_sta: Y , update_sta: Y : delete_sta:Y }
     *  {userRoleId:2 , function_sub_id : 3 , create_sta:N , read_sta: N , update_sta: N : delete_sta:N }
     * ]
     * **/

    var userRolePermissionList = req.body["userRolePermissionList"] || [];
    var updateFuncsArray = [];
    var resultData = {
        success: true,
        errorCode:"",
        errorMsg:""
    };

    _.each(userRolePermissionList, function(userPermisn){
        if(!_.isUndefined(userPermisn.userRoleId) && !_.isUndefined(userPermisn.userRoleId)) {
            updateFuncsArray.push(
                function (callback) {
                    var updateDate = {
                        user_role_id: userPermisn.userRoleId,
                        function_sub_id: userPermisn.function_sub_id,
                        create_sta: userPermisn.create_sta,
                        read_sta: userPermisn.read_sta,
                        update_sta: userPermisn.update_sta,
                        delete_sta: userPermisn.delete_sta,
                        update_user: req.session.user ? req.session.user.name : "系統管理員"
                    };

                    DBAgent.updateExecute("UPD_USER_ROLE_FUNCS_PERMISN" , updateDate , function(err , result){
                        callback(err,result)
                    })
                }
            );
        }
    })

    async.parallel(updateFuncsArray , function(err, result){
        if(err){
            resultData.success =  false;
            resultData.errorCode =  "0000";
            resultData.errorMsg =  "更新失敗";
        }

        callback(resultData);
    })


};


/**
 * 新增使用者角色
 *
 *
 * */
exports.createUserRole = function(user_role_name,update_user,callback){

    if(user_role_name!="" && user_role_name!="系統管理員")
    {
        DBAgent.updateExecute("INS_ROLE_NAME", {user_role_name:user_role_name,update_user:update_user}, function (error , result) {
            if(error){
                callback(false, -9999);
            }else{
                callback(true);
            }

        })

    }else{

        callback(false, -10);

    }

};


/**
 * 更新使用者角色名稱
 * @param user_role_name(String) : 使用者角色名稱
 * @param user_role_id(INT) : 使用者角色ID
 * */
exports.updateUserRole = function(user_role_name,user_role_id,update_user,callback){

    if(user_role_name!="" && user_role_name!="系統管理員")
    {
        DBAgent.updateExecute("UPD_ROLE_NAME", {user_role_name:user_role_name,user_role_id:user_role_id,update_user:update_user }, function (error , result) {
            if(error){
                callback(false, -9999);
            }else{
                callback(true);
            }

        })

    }else{

        callback(false, -10);

    }

};


/**
 * 刪除使用者角色名稱
 * @param user_role_ids(array) : 使用者角色ID
 * */
exports.deleteUserRole = function(user_role_ids,callback){


    if(user_role_ids instanceof Array){

        async.each(user_role_ids, function(user_role_id, callback){

            if(user_role_id!=0 && user_role_id!=1){

                DBAgent.query("DEL_ROLE_NAME",{user_role_id:user_role_id} , function(err , rows){

                    if(err){
                        Logger.error(err);
                        console.log(err);
                        callback(false,-9999);

                    }else{

                        callback(null);

                    }

                });

            }else{
                callback(null);
            }

        }, function(err) {

            if( err ) {
                console.log(err);
                callback(false, -9999);

            } else {

                callback(true);
            }

        });



    }else{

        callback(false,-10);

    }




};