/**
 * Created by Ian on 2016/11/26.
 * 護理站(病房區)權限 ward_zone_privilege
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var request = require('request');
var parseString = require('xml2js').parseString;
var async = require("async");
var bedService= require("../services/bedService");
var _this=this;
/**
 * 取得權限資訊
 * **/
exports.getWardZonePrivilege = function(user_role_id,callback){





    async.series([function(callback){


        if(user_role_id==1){

            //系統理者登入時，
            //自動插入所有護理站的的權限
            _this.insertAllWardZonePrivilegeForAdmin(function(){
                console.log("insert wardzone for admin");
                callback(null);
            });

        }else{
            callback(null);
        }


    }],

     function(err,result){

         if(user_role_id!=0){

             DBAgent.query("QRY_ALL_WARD_ZONE_PRIVILEGE_BY_USER_ROLE_ID",
                 {user_role_id:user_role_id} , function(err , rows){

                     if(err){
                         Logger.error(err);
                         console.log(err);
                         callback(false,-9999);

                     }else{

                         callback(rows);

                     }


                 });


         }else{


             DBAgent.query("QRY_ALL_WARD_ZONE_PRIVILEGE",
                 {} , function(err , rows){

                     if(err){
                         Logger.error(err);
                         console.log(err);
                         callback(false,-9999);

                     }else{

                         callback(rows);

                     }


                 });


         }


     });




};


/**
 * 更新權限資訊
 * **/
exports.updateWardZonePrivilege = function(user_role_id,ward_zone_ids,update_user,callback){

    var doUpdateFuncs = [];

    if(user_role_id!=0 && (ward_zone_ids instanceof Array)){

        //開始插入資料庫
        async.series(
            [function(callback){
                //1.清掉舊的權限

                DBAgent.updateExecute("DEL_WARD_ZONE_PRIVILEGE_BY_USER_ROLE_ID", {user_role_id:user_role_id} , function(error , result){
                    if(error){
                        Logger.error(error);
                    }
                    callback(null);
                });


            },function(callback){
                //2.插入權限更新的函數清單

                _.each(ward_zone_ids , function(ward_zone_id){

                    doUpdateFuncs.push(

                        function (callback) {
                            //新增
                            DBAgent.updateExecute("INS_WARD_ZONE_PRIVILEGE",
                                {user_role_id:user_role_id,ward_zone_id:ward_zone_id,update_user:update_user },
                                function(err,result){
                                    callback(err,result)
                                });
                        }

                    );


                })

                callback(null);
            }]
            , function (err, results) {


                //開始插入新的權限
                async.parallel(doUpdateFuncs, function(err){
                    if(err){
                        callback(false,-9999);
                    }else{
                        callback(true);
                    }
                })



            });




    }else{
        //輸入型態有誤的話

       callback(false,-10);



    }




};

/**
 * 登入時，自動給系統管理者插入全部wardZone的權限
 * @param callback
 */
exports.insertAllWardZonePrivilegeForAdmin = function(callback){


    async.waterfall([

    function(callback){

        //1.get all wardzone id
        bedService.getAllWardZone(function(rows,errorCode){
            //轉成array才能做bulk insert

            if(!errorCode){
                //沒出錯，再執行

                var resultArray=[];

                for(var i=0;i<=rows.length;i++){

                    if(i==rows.length){
                        //長度相等時，代表已經處理完成
                        callback(null,resultArray);
                        break;

                    }else{

                        var row=rows[i];

                        try{

                            var tempArray=[
                                1,
                                row.id
                            ];

                            resultArray.push(tempArray);


                        }catch(e){

                            console.log(e);

                        }

                    }

                }

            }

        });


    }],function(err, result){

        if(err){

            Logger.error(err);
        }else{

            DBAgent.updateExecute("INS_WARD_ZONE_PRIVILEGE_FOR_SYSTEM_ADMIN", result , function(error , result){
                if(error){
                    Logger.error(error);
                }
                callback(null);
            });

        }

    });






};