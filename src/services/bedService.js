/**
 * Created by Ian on 2016/11/09.
 * 病床、病房、病房區相關的service
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require("async");
var moment = require("moment");
var doctorService = require("./doctorService");
var validate = require('validate.js');




/**
 * 取得護理站平面圖image
 * */
exports.getWardZoneFloorPlanImage = function(ward_zone_id, callback){

        DBAgent.query("QRY_WARD_ZONE_FLOOR_PLAN_IMAGE",{ward_zone_id:ward_zone_id} , function(err , rows){

            if(err){
                Logger.error(err);

                callback(false,-9999);

            }else{

                callback(rows);

            }



        });

};


/**
 * 更新護理站平面圖image
 * */
exports.updateWardZoneFloorPlanImage = function(ward_zone_id,ward_zone_gui_floor_plan,image_type,update_user, callback){

    if(ward_zone_gui_floor_plan!=""){

        DBAgent.query("UPDWARD_ZONE_FLOOR_PLAN_IMAGE",
            {ward_zone_id:ward_zone_id,ward_zone_gui_floor_plan:ward_zone_gui_floor_plan,ward_zone_gui_floor_plan_image_type:image_type,update_user:update_user } , function(err , rows){

            if(err){
                Logger.error(err);

                callback(false,-9999);

            }else{

                callback(rows);

            }



        });
    }else{

        Logger.info("無上傳護理站平面圖");
        console.log("無上傳護理站平面圖");


    }


};



/**
 * 取得所有病房區
 * */
exports.getAllWardZone = function(callback){
    DBAgent.query("QRY_ALL_WARD_ZONE",{} , function(err , rows){

        if(err){
            Logger.error(err);

            callback(false,-9999);

        }else{

            callback(rows);

        }



    });
};


/**
 * 取得所有病房
 * */
exports.getAllWard = function(ward_zone_id, callback){

    if(ward_zone_id!=0){

        DBAgent.query("QRY_WARD_WITH_BED_NUMBER_BY_WARDZONE",{ward_zone_id:ward_zone_id} , function(err , rows){

            if(err){
                Logger.error(err);

                callback(false,-9999);

            }else{

                callback(rows);

            }


        });


    }else{

        DBAgent.query("QRY_ALL_WARD_WITH_BED_NUMBER",{} , function(err , rows){

            if(err){
                Logger.error(err);

                callback(false,-9999);

            }else{

                callback(rows);

            }



        });

    }

};

/**
 * 取得所有病床資訊
 * **/
exports.getAllBedInfo = function(req,callback){
    var cond = { };
    cond["ward_zone_id"] = req.session.user.ward_zone_id

    if(!_.isUndefined(req.body.ward_id) && !_.isEmpty(req.body.ward_id)){
        cond["ward_id"] = req.body.ward_id
    }

    DBAgent.query("QRY_ALL_BED_WARD",cond , function(err , rows){

        if(err){
            Logger.error(err);
            callback(false,9999);

        }else{

            callback(rows);

        }



    });
};




/**
 * 用病床名稱改病床id
 * **/
exports.getBedIDBYName = function(bed_name,callback){

    DBAgent.query("QRY_BED_ID_BY_NAME",{bed_name:bed_name} , function(err , rows){

        if(err){
            Logger.error(err);
            callback(false,9999);

        }else{

            try{

                rows=rows[0];
                rows=rows['id'];
                callback(rows);

            }catch(e){

                Logger.error(err);
                callback(null);

            }


        }



    });
};


/**
 * 新增病床
 * */
exports.insertBed = function(bed_name, ward_name,gui_width,gui_height,gui_pos_x,gui_pos_y, ward_zone_id,update_user, callback){


    async.waterfall(
        [function(callback){
            //1.找尋ward_name對應的ward_id

            DBAgent.query("QRY_WARD_BY_NAME",{ward_name:ward_name, ward_zone_id:ward_zone_id} , function(err , rows){

                if(err){
                    Logger.error(err);

                    callback(null,0);

                }else{

                    if(rows.length==1){
                        //有取得資料的話
                        var row=rows[0];

                        callback(null,  row.id);

                    }else{
                        callback(null,0);

                    }

                }

            });


        },function(result,callback){
            //2.確認是不是有ward_id，沒有的話就插入並取得


            if(result==0){
                DBAgent.query("INS_WARD",{ward_name:ward_name, ward_zone_id:ward_zone_id,update_user:update_user} , function(err , rows){

                    if(err){
                        Logger.error(err);
                        callback(false,-9999);

                    }else{

                        callback(null, rows.insertId);

                    }


                });
            }else{

                callback(null,result);
            }



        }]
        , function (err, result) {

            if(err){
                //插入病房失敗
                Logger.error(err);
                callback(false,-9999);

            }else{


                if(gui_width!=0 && gui_height!=0 && gui_pos_x!=0 && gui_pos_y!=0){
                    //插入圖形化介面的病床

                    DBAgent.query("INS_BED_WITH_GUI",
                        {bed_name:bed_name,
                            ward_id:result,
                            gui_width:gui_width,
                            gui_height:gui_height,
                            gui_pos_x:gui_pos_x,
                            gui_pos_y:gui_pos_y,
                            update_user:update_user}
                        , function(err , rows){

                                if(err){
                                    Logger.error(err);
                                    callback(false,-9999);

                                }else{

                                    callback(true);

                                }

                    });

                }else{
                    //插入一般病床
                    DBAgent.query("INS_BED",{bed_name:bed_name, ward_id:result,update_user:update_user} , function(err , rows){

                        if(err){
                            Logger.error(err);
                            callback(false,-9999);

                        }else{

                            callback(true);

                        }


                    });

                }


            }

        })



};




/**
 * 更新病床
 * */
exports.updateBed = function(bed_name, ward_name, bed_id,gui_width,gui_height,gui_pos_x,gui_pos_y, ward_zone_id,update_user, callback){



    async.waterfall(
        [function(callback){
            //1.找尋ward_name對應的ward_id

            DBAgent.query("QRY_WARD_BY_NAME",{ward_name:ward_name, ward_zone_id:ward_zone_id} , function(err , rows){

                if(err){
                    Logger.error(err);

                    callback(null,0);

                }else{

                    if(rows.length==1){
                        //有取得資料的話
                        var row=rows[0];

                        callback(null,  row.id);

                    }else{
                        callback(null,0);

                    }

                }

            });


        },function(result,callback){
            //2.確認是不是有ward_id，沒有的話就插入並取得id


            if(result==0){
                DBAgent.query("INS_WARD",{ward_name:ward_name, ward_zone_id:ward_zone_id,update_user:update_user} , function(err , rows){

                    if(err){
                        Logger.error(err);
                        callback(false,-9999);

                    }else{

                        callback(null, rows.insertId);

                    }


                });
            }else{

                callback(null,result);
            }



        }]
        , function (err, result) {

            if(err){
                //插入病房失敗
                Logger.error(err);
                callback(false,-9999);

            }else{

                if(gui_width!=0 && gui_height!=0 && gui_pos_x!=0 && gui_pos_y!=0){
                    //插入圖形化介面的病床

                    DBAgent.query("UPD_BED_WITH_GUI",
                        {   bed_name:bed_name,
                            ward_id:result,
                            bed_id:bed_id,
                            gui_width:gui_width,
                            gui_height:gui_height,
                            gui_pos_x:gui_pos_x,
                            gui_pos_y:gui_pos_y,
                            update_user:update_user}
                        , function(err , rows){

                            if(err){
                                Logger.error(err);
                                callback(false,-9999);

                            }else{

                                callback(true);

                            }

                        });

                }else{

                    DBAgent.query("UPD_BED",{bed_name:bed_name, ward_id:result, bed_id:bed_id,update_user:update_user} , function(err , rows){

                        if(err){
                            Logger.error(err);
                            callback(false,-9999);

                        }else{

                            callback(true);

                        }


                    });

                }




            }

        })



};



/**
 * 新增病房
 * */
exports.insertWard = function(ward_name, ward_zone_id,update_user, callback){

    DBAgent.query("INS_WARD",{ward_name:ward_name, ward_zone_id:ward_zone_id,update_user:update_user} , function(err , rows){

        if(err){
            Logger.error(err);
            callback(false,-9999);

        }else{

            callback(rows);

        }


    });
};


/**
 * 刪除病床
 * */
exports.deleteBed = function(bed_ids, callback){


    if(bed_ids instanceof Array){

        async.each(bed_ids, function(bed_id, callback){

            DBAgent.query("DEL_BED",{bed_id:bed_id} , function(err , rows){

                if(err){
                    Logger.error(err);
                    console.log(err);
                    callback(false,-9999);

                }else{

                    callback(null);

                }



            });


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


/***
 * 查詢病床醫生排班狀態
 * **/
exports.doQueryBedSchedulingForDoctor = function(req ,callback){
    var ward_id = req.body["ward_id"];
    var bedDoctorSchedulingList = [];
    var doctorSchedulingList = [];
    var schedule_date = req.body["schedule_date"] || moment().format("YYYY/MM/DD");
    async.parallel([
        function(callback){
            DBAgent.query("QRY_ALL_BED_WARD" ,{ward_zone_id : req.session.user.ward_zone_id} , function (err , bedList) {
                bedDoctorSchedulingList = bedList;
                callback(err , bedList)
            })
        },
        function(callback){
            req.body["scheduling_start_date"] = schedule_date;
            req.body["scheduling_end_date"] = schedule_date;
            doctorService.getAllDoctorScheduling(req, function(err , AllDoctorSchedulingList){
                doctorSchedulingList = AllDoctorSchedulingList;
                callback(err, AllDoctorSchedulingList)
            })
        }
    ],function(err , result){
        _.each(bedDoctorSchedulingList , function(bedInfo, bedIdx){

            //console.log(bedInfo.bed_id);
            //console.log(_.findWhere(doctorSchedulingList, {doctor_class:'專科護理師', bed_id: bedInfo.bed_id}));
            bedDoctorSchedulingList[bedIdx]["schedule_date"] = req.body["scheduling_start_date"];
            bedDoctorSchedulingList[bedIdx]["resident_name"] =
                _.findWhere(doctorSchedulingList, {doctor_class_name:'住院醫師', bed_id: String(bedInfo.bed_id) })
                ? _.findWhere(doctorSchedulingList, {doctor_class_name:'住院醫師', bed_id: String(bedInfo.bed_id)}).doctor_name  : "";
            bedDoctorSchedulingList[bedIdx]["intern_name"]   =
                _.findWhere(doctorSchedulingList, {doctor_class_name:'實習醫師', bed_id:  String(bedInfo.bed_id)})
                ? _.findWhere(doctorSchedulingList, {doctor_class_name:'實習醫師', bed_id:  String(bedInfo.bed_id)}).doctor_name  : "";
            bedDoctorSchedulingList[bedIdx]["specialist_nurse_name"] =
                _.findWhere(doctorSchedulingList, {doctor_class_name:'專科護理師', bed_id:  String(bedInfo.bed_id)})
                ? _.findWhere(doctorSchedulingList, {doctor_class_name:'專科護理師', bed_id:  String(bedInfo.bed_id)}).doctor_name : "";
            bedDoctorSchedulingList[bedIdx]["trainee_name"] =
                _.findWhere(doctorSchedulingList, {doctor_class_name:'見習醫師', bed_id:  String(bedInfo.bed_id)})
                ? _.findWhere(doctorSchedulingList, {doctor_class_name:'見習醫師', bed_id:  String(bedInfo.bed_id)}).doctor_name  : "";
        })
        callback(err , bedDoctorSchedulingList)
    })

};



/**
 * 刪除病房
 * */
exports.deleteWard = function(ward_id, callback){

    DBAgent.query("DEL_WARD",{ ward_id:ward_id} , function(err , rows){

        if(err){
            Logger.error(err);

            callback(false,-9999);

        }else{

            callback(rows);

        }



    });
};

var validator={
    isString:function(input){
        if(typeof input === 'string' && input!="" ){
            return input;
        }
        return null;
    },
    isNumber:function(input){
        if(!isNaN(input)  && input!="0" || input!=0){
            return input;
        }
        return null;
    },
    isPersonID:function(input) {
        tab = "ABCDEFGHJKLMNPQRSTUVXYWZIO"
        A1 = new Array (1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3 );
        A2 = new Array (0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5 );
        Mx = new Array (9,8,7,6,5,4,3,2,1,1);
        if ( !input || input.length != 10 ) return null;
        i = tab.indexOf( input.charAt(0) );
        if ( i == -1 ) return null;
        sum = A1[i] + A2[i]*9;
        for ( i=1; i<10; i++ ) {
            v = parseInt( input.charAt(i) );
            if ( isNaN(v) ) return null;
            sum = sum + v * Mx[i];
        }
        if ( sum % 10 != 0 ) return null;
        return input;
    }
}

function checkErrorInput(requiredValues,record){
    var resultMsg="";
    for(var key in requiredValues){
        var check  = validate.isEmpty(record[key]);
        if(check){
            resultMsg += requiredValues[key]+"必須輸入值!\n"
        }
    }
    return resultMsg;
}

var checkBedChangeRecordKey={
    "patient_person_id":"病患身分証",
    "change_datetime":"換病房的時間",
    "new_bed_name":"新病床名稱",
    "old_bed_name":"病床名稱",
    "old_ward_name":"病房名稱",
    "new_ward_name":"新病房名稱",
};

/**
 * 新增病房轉床紀錄 validate
 * */
exports.addBedChangeRecord = function(reqs,last_update_info,callback){

    for(var i=0;i<reqs.length;i++){
        thisreq = reqs[i];
        thisreq.last_update_time = last_update_info.last_update_time;
        thisreq.update_user = last_update_info.update_user;
    }
    console.log("===req===");
    console.log(reqs);

    var resultMsg=""; //準備回傳的訊息，公用變數
    var insertFuncsArray=Array();

    _.each(reqs, function(req){
        if(!_.isUndefined(req)) {
                insertFuncsArray.push(function (callback) {
                    var person_id = req["patient_person_id"];
                    var validResult = validator.isPersonID(person_id);
                    if(validResult) {
                        var new_bed_id;
                        var bed_id;
                        async.series([
                                function(callback) { //檢核資料是否存在
                                    var msg = checkErrorInput(checkBedChangeRecordKey,req);
                                    if(msg!=""){
                                        callback("CHECK_INPUT_ERROR",msg);
                                    }else{
                                        callback(null,null);
                                    }
                                },
                                function(callback) {
                                    DBAgent.query("QRY_PATIENT_BY_PERSON_ID1", req , function(error , result){ //檢查病人id是否存在
                                        if(error){
                                            Logger.error(error);
                                            console.error(error);
                                            error.code ? callback(error.code,null) : callback("9999",null);
                                        }else{
                                            if(result && result.length<1){
                                                callback("DATA_NOT_FOUND");
                                            }else{
                                                callback(null,result);
                                            }
                                        }
                                    });
                                },
                                function(callback) { //取得新病床id
                                    var thisreq = {"bed_name":req['new_bed_name'],"ward_name":req['new_ward_name']};
                                    DBAgent.query("GET_BED_ID", thisreq , function(error , result){ //檢查病床是否存在
                                        if(error){
                                            Logger.error(error);
                                            console.error(error);
                                            error.code ? callback(error.code,null) : callback("9999",null);
                                        }else{
                                            if(result && result.length<1){
                                                callback("BED_NOT_FOUND",thisreq);
                                            }else{
                                                new_bed_id = result[0]["id"];
                                                callback(null,result);
                                            }
                                        }
                                    });
                                }
                                ,function(callback) { //取得舊病床id
                                    var thisreq = {"bed_name":req['old_bed_name'],"ward_name":req['old_ward_name']};
                                    DBAgent.query("GET_BED_ID", thisreq , function(error , result){ //檢查病床是否存在
                                        if(error){
                                            Logger.error(error);
                                            console.error(error);
                                            error.code ? callback(error.code,null) : callback("9999",null);
                                        }else{
                                            if(result && result.length<1){
                                                callback("BED_NOT_FOUND",thisreq);
                                            }else{
                                                bed_id = result[0]["id"];
                                                callback(null,result);
                                            }
                                        }
                                    });
                                }
                                ,function(callback) {
                                    req["bed_id"] = bed_id;
                                    req["new_bed_id"] = new_bed_id;
                                    delete req.new_bed_name;
                                    delete req.new_ward_name;
                                    delete req.old_bed_name;
                                    delete req.old_ward_name;
                                    async.series([
                                        function(callback) {
                                            DBAgent.updateBatchExecute("ADD_BED_CHANGE_RECORD", [req], function(error , result){
                                                if(error){
                                                    callback(error);
                                                }else{
                                                    callback(null,result);
                                                }
                                            });
                                        }
                                    ],
                                    // optional callback
                                    function(error, results) {
                                        callback(error,results);
                                    });
                                }
                            ],
                            // optional callback
                            function(error, results) {
                                console.log("===error===");
                                console.log(error);
                                console.log("===results===");
                                console.log(results);

                                if(error){
                                    if(error=="DATA_NOT_FOUND"){
                                        resultMsg += "身份證字號:"+person_id+"不存在!\n"
                                    }else if(error=="CHECK_INPUT_ERROR"){
                                        resultMsg += results+"\n";
                                    }else if(error=="BED_NOT_FOUND"){
                                        resultMsg += "病床名稱:"+results[2]["bed_name"]+"&病房名稱:"+results[2]["ward_name"]+"不存在!\n"
                                    }else{
                                        resultMsg += "身份證字號驗證失敗!\n"
                                    }
                                    Logger.error(error);
                                    callback(null);
                                }else{
                                    callback(null);
                                }
                            });
                    }else{
                        resultMsg+= "身份證字號:"+person_id+" 不為合法的身份證格式\n";
                        callback(null);
                    }
                });
        }
    });

    async.parallel(insertFuncsArray,function(error, results) {
            console.log("===parallel resultMsg===");
            console.log(resultMsg);
            if(error){
                console.log("===resultMsg 1===");
                console.log(error);
            }

            callback(resultMsg);
    });
};

/**
 * 更新病房轉床紀錄
 * */
exports.updateBedChangeRecord = function(reqs,last_update_info,callback){

    for(var i=0;i<reqs.length;i++){
        thisreq = reqs[i];
        thisreq.last_update_time = last_update_info.last_update_time;
        thisreq.update_user = last_update_info.update_user;
    }
    console.log("===req===");
    console.log(reqs);

    var resultMsg=""; //準備回傳的訊息，公用變數
    var insertFuncsArray=Array();

    _.each(reqs, function(req){
        if(!_.isUndefined(req)) {
            insertFuncsArray.push(function (callback) {
                var person_id = req["patient_person_id"];
                var validResult = validator.isPersonID(person_id);
                if(validResult) {
                    var new_bed_id;
                    var bed_id;
                    async.series([
                            function(callback) { //檢核資料是否存在
                                var msg = checkErrorInput(checkBedChangeRecordKey,req);
                                if(msg!=""){
                                    callback("CHECK_INPUT_ERROR",msg);
                                }else{
                                    callback(null,null);
                                }
                            },
                            function(callback) {
                                DBAgent.query("QRY_PATIENT_BY_PERSON_ID1", req , function(error , result){ //檢查病人id是否存在
                                    if(error){
                                        Logger.error(error);
                                        console.error(error);
                                        error.code ? callback(error.code,null) : callback("9999",null);
                                    }else{
                                        if(result && result.length<1){
                                            callback("DATA_NOT_FOUND");
                                        }else{
                                            callback(null,result);
                                        }
                                    }
                                });
                            },
                            function(callback) { //取得新病床id
                                var thisreq = {"bed_name":req['new_bed_name'],"ward_name":req['new_ward_name']};
                                DBAgent.query("GET_BED_ID", thisreq , function(error , result){ //檢查病床是否存在
                                    if(error){
                                        Logger.error(error);
                                        console.error(error);
                                        error.code ? callback(error.code,null) : callback("9999",null);
                                    }else{
                                        if(result && result.length<1){
                                            callback("BED_NOT_FOUND",thisreq);
                                        }else{
                                            new_bed_id = result[0]["id"];
                                            callback(null,result);
                                        }
                                    }
                                });
                            }
                            ,function(callback) { //取得舊病床id
                                var thisreq = {"bed_name":req['old_bed_name'],"ward_name":req['old_ward_name']};
                                DBAgent.query("GET_BED_ID", thisreq , function(error , result){ //檢查病床是否存在
                                    if(error){
                                        Logger.error(error);
                                        console.error(error);
                                        error.code ? callback(error.code,null) : callback("9999",null);
                                    }else{
                                        if(result && result.length<1){
                                            callback("BED_NOT_FOUND",thisreq);
                                        }else{
                                            bed_id = result[0]["id"];
                                            callback(null,result);
                                        }
                                    }
                                });
                            }
                            ,function(callback) {
                                req["bed_id"] = bed_id;
                                req["new_bed_id"] = new_bed_id;
                                delete req.new_bed_name;
                                delete req.new_ward_name;
                                delete req.old_bed_name;
                                delete req.old_ward_name;
                                async.series([
                                        function(callback) {
                                            DBAgent.updateBatchExecute("UPDATE_BED_CHANGE_RECORD", [req], function(error , result){
                                                if(error){
                                                    callback(error);
                                                }else{
                                                    callback(null,result);
                                                }
                                            });
                                        }
                                    ],
                                    // optional callback
                                    function(error, results) {
                                        callback(error,results);
                                    });
                            }
                        ],
                        // optional callback
                        function(error, results) {
                            console.log("===error===");
                            console.log(error);
                            console.log("===results===");
                            console.log(results);

                            if(error){
                                if(error=="DATA_NOT_FOUND"){
                                    resultMsg += "身份證字號:"+person_id+"不存在!\n"
                                }else if(error=="CHECK_INPUT_ERROR"){
                                    resultMsg += results+"\n";
                                }else if(error=="BED_NOT_FOUND"){
                                    resultMsg += "病床名稱:"+results[1]["bed_name"]+"&病房名稱:"+results[1]["ward_name"]+"不存在!\n"
                                }else{
                                    resultMsg += "身份證字號驗證失敗!\n"
                                }
                                Logger.error(error);
                                callback(null);
                            }else{
                                callback(null);
                            }
                        });
                }else{
                    resultMsg+= "身份證字號:"+person_id+" 不為合法的身份證格式\n";
                    callback(null);
                }
            });
        }
    });

    async.parallel(insertFuncsArray,function(error, results) {
        console.log("===parallel resultMsg===");
        console.log(resultMsg);
        if(error){
            console.log("===resultMsg 1===");
            console.log(error);
        }

        callback(resultMsg);
    });
};


