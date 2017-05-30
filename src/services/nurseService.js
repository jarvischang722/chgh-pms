/**
 * Created by Eason on 2016/10/26.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require('async');
var moment = require('moment');


/**
 * Ian ->病患資訊用
 * 依時間，取得現在是早、小夜、大夜班
 * **/
exports.getClassFromTime = function (time, callback) {


    var cond = {
        time: time
    };

    DBAgent.query("QRY_CLASS_NAME_BY_TIME", cond, function (err, rows) {
        if (err) {
            Logger.error(err);
            rows = [];
        }

        if (rows.length == 0) {
            //如果沒找到的話，預設回傳大夜的值，
            //因為大夜傳的時間會是23:00:00，而這筆資料無法被sql正確的query出來
            callback(Array({"class_id": "03", "class_name": "大夜"}))

        } else {

            callback(rows);

        }

    });
};


/**
 * 取得所有護士
 * */
exports.getAllNurse = function (callback) {
    var cond = {};
    DBAgent.query("QRY_ALL", cond, function (error, result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            callback(result);
        }
    });
};

/**
 * 取得所有護士詳細資料
 * */
exports.getAllNurse2 = function (callback) {
    var cond = {};
    DBAgent.query("QRY_ALL_NURSE", cond, function (error, result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            callback(result);
        }
    });
};

/**
 * 取得護士 BY ID
 * */
exports.getNurseById = function (callback) {
    var cond = {
        id: '1',
    };
    DBAgent.query("QRY_BY_ID", cond, function (err, rows) {
        if (err) {
            Logger.error(error);
            rows = [];
        }
        callback(rows);
    });
};

/**
 * 取得護士 By EMPLOYEE_NO
 * */
exports.getNurseByEmployeeNo = function (callback) {
    var cond = {
        employee_no: '1',
    };
    DBAgent.query("QRY_BY_EMPLOYEE_NO", cond, function (err, rows) {
        if (err) {
            Logger.error(error);
            rows = [];
        }
        callback(rows);
    });
};

/**
 * 新增護士
 * */
exports.insertNurse = function (req, callback) {
    /*
     var cond = {
     employee_no:req.employee_no,
     name:req.name,
     tel:req.tel,
     agent1_nurse_id:req.agent1_nurse_id,
     agent2_nurse_id:req.agent2_nurse_id,
     agent3_nurse_id:req.agent3_nurse_id,
     fire_control_group_id:'',
     mission_group_id:'',
     remark:req.remark
     };*/
    DBAgent.updateExecute("ADD", req, function (error, result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            callback(result);
        }
    });
};

/**
 * 修改護士 BY ID
 * */
exports.updateNurseById = function (req, callback) {
    DBAgent.updateExecute("UPDATE_BY_EMPLOYEE_NO", req, function (error, result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            callback(result);
        }
    });
};

/**
 * 更新SIP裝置
 * @param param1
 * @param callback
 */
function updateSIP(nursesches, assign_date_str, callback) {
    console.log("=== Execute updateSIP===");
    if (nursesches instanceof Array) {
        assign_date_str = assign_date_str.substring(1);
        console.log("===assign_date_str===");
        console.log(assign_date_str);
        var SIP_DATA = [];
        var SIP_PAR = {};
        async.series([
                function (callback) { //先取得sip參數設定
                    DBAgent.query("QRY_SIP_PARAMETER", {}, function (err, rows) {
                        if (err) {
                            Logger.error(err);
                            rows = [];
                            callback(err, null);
                            return;
                        }
                        SIP_PAR = rows[0];
                        console.log("===SIP_PAR===");
                        console.log(SIP_PAR);
                        callback(null, null);
                    });
                }
                // ,function(callback) { //EASONTODO
                //     DBAgent.query("QRY_ASSIGN_FOR_SIP", {assign_date_str:assign_date_str}, function(err , rows){
                //         if(err){
                //             Logger.error(err);
                //             rows = [];
                //             callback(err, null);
                //             return;
                //         }
                //         SIP_DATA = rows;
                //         for (var i = SIP_DATA.length; i--; ) {
                //             var thisobj = SIP_DATA[i];
                //             thisobj.RingTimer = SIP_PAR.ring_last_time;
                //             thisobj.RingType = SIP_PAR.ring_type;
                //         }
                //         console.log("===SIP_DATA===");
                //         console.log(SIP_DATA);
                //         callback(null,null);
                //     });
                // }
                , function (callback) {
                    DBAgent.query("QRY_ASSIGN_FOR_SIP", {assign_date_str: assign_date_str}, function (err, rows) {
                        if (err) {
                            Logger.error(err);
                            rows = [];
                            callback(err, null);
                            return;
                        }
                        console.log("===QRY_ASSIGN_FOR_SIP rows====");
                        console.log(rows);
                        SIP_DATA = rows;
                        for (var i = SIP_DATA.length; i--;) {
                            var thisobj = SIP_DATA[i];
                            thisobj.RingTimer = SIP_PAR.ring_last_time;
                            thisobj.RingType = SIP_PAR.ring_type;
                        }
                        console.log("===SIP_DATA===");
                        console.log(SIP_DATA);
                        callback(null, null);
                    });

                }
                , function (callback) {
                    if (SIP_DATA instanceof Array) {
                        var currentindex = 0;
                        async.each(SIP_DATA,
                            function (item, innercallback) {
                                DBAgent.query("QRY_SIP_DISTRIBUTE_BY_CLASS_REMOTE", {
                                    wid: item.wid,
                                    sip_device_class_id: 9,
                                    start: 0,
                                    per_page: 1
                                }, function (err, rows) {
                                    if (err) {
                                        Logger.error(err);
                                        rows = [];
                                        callback(err, null);
                                        return;
                                    } else {
                                        if (rows && rows.length > 0) {
                                            console.log("===QRY_SIP_DISTRIBUTE_BY_CLASS_REMOTE rows===");
                                            console.log(rows[0]);
                                            item.SickbedGroup = rows[0].phoneno;
                                        }
                                        console.log("===QRY_SIP_DISTRIBUTE_BY_CLASS_REMOTE item===");
                                        console.log(item);
                                    }
                                    delete item.wid;

                                    if (currentindex == (SIP_DATA.length - 1)) {
                                        callback(null, null);
                                    } else {
                                        currentindex++;
                                    }


                                }, "SIP");

                            },
                            function (err) {
                                innercallback(err, null);
                            }
                        );

                    } else {
                        callback(null, null);
                    }
                }
                , function (callback) {
                    console.log("===ADD_emer_callGroup SIP_DATA===");
                    console.log(SIP_DATA);
                    if (SIP_DATA instanceof Array) {
                        DBAgent.updateBatchExecute("ADD_emer_callGroup", SIP_DATA, function (error, result) {
                            if (error) {
                                callback(error, null);
                            } else {
                                if (result && result.length < 1) {
                                    callback({code: -1}, null);
                                } else {
                                    callback(null, null);
                                }
                            }
                        }, "SIP");
                    } else {
                        callback(null, null);
                    }
                }
            ],
            // optional callback
            function (error, results) {
                callback(error, results);
            });
    } else {
        callback(null, null);
    }
}

/**
 * 更新護理師群組
 * */
exports.updateNurseGroup = function (nurses, nursesches, callback) {
    console.log("===nurses===");
    console.log(nurses);
    console.log("===nursesches===");
    console.log(nursesches);
    //同時更新護士資料與排班資料
    var assign_date_str = "";
    var assign_date_obj = {};

    async.series([
            function (callback) {
                if (nurses instanceof Array) {
                    DBAgent.updateBatchExecute("UPDATE_GROUP_BY_NURSE_NO", nurses, function (error, result) {
                        if (error) {
                            callback(error, null);
                        } else {
                            if (result && result.length < 1) {
                                callback({code: -1}, null);
                            } else {
                                callback(null, null);
                            }
                        }
                    });
                } else {
                    callback(null, null);
                }
            }
            , function (callback) {
                if (nursesches instanceof Array) {
                    DBAgent.updateBatchExecute("DELETE_BEDASSIGN", nursesches, function (error, result) {
                        if (error) {
                            callback(error, null);
                        } else {
                            if (result && result.length < 1) {
                                callback({code: -1}, null);
                            } else {
                                callback(null, null);
                            }
                        }
                    });
                } else {
                    callback(null, null);
                }
            }

            , function (callback) {
                if (nursesches instanceof Array) {
                    //整理排班資料
                    for (var i = 0; i < nursesches.length; i++) {
                        delete nursesches[i].ischanged;
                        if (!(nursesches[i].assign_date in assign_date_obj)) {
                            assign_date_obj[nursesches[i].assign_date] = nursesches[i].assign_date;
                            assign_date_str = assign_date_str + "," + nursesches[i].assign_date;
                        }
                    }
                    //新增排班資料
                    console.log("====ADD_BED_ASSIGN====");
                    console.log(nursesches);
                    DBAgent.updateBatchExecute("ADD_BED_ASSIGN", nursesches, function (error, result) {
                        if (error) {
                            callback(error, null);
                        } else {
                            if (result && result.length < 1) {
                                callback({code: -1}, null);
                            } else {
                                callback(null, null);
                            }
                        }
                    });
                } else {
                    callback(null, null);
                }
            }
            , function (callback) { //更新SIP裝置
                updateSIP(nursesches, assign_date_str, callback);
            }
        ],
        // optional callback
        function (error, results) {
            callback(results, error);
        });

    /*
     //DB異動流程
     var process = [
     function(callback) {
     if (nurses instanceof Array) {
     DBAgent.updateBatchExecute("UPDATE_GROUP_BY_NURSE_NO", nurses, function (error, result) {
     if (error) {
     callback(error, null);
     } else {
     if (result && result.length < 1) {
     callback({code:-1}, null);
     } else {
     callback(null,null);
     }
     }
     });
     }else{
     callback(null,null);
     }
     }
     ,function(callback) {
     if (nursesches instanceof Array) {
     DBAgent.updateBatchExecute("DELETE_BEDASSIGN", nursesches, function (error, result) {
     if (error) {
     callback(error, null);
     } else {
     if (result && result.length < 1) {
     callback({code:-1}, null);
     } else {
     callback(null,null);
     }
     }
     });
     }else{
     callback(null,null);
     }
     }
     ,function(callback) {
     if (nursesches instanceof Array) {
     //整理排班資料
     for (var i = 0; i < nursesches.length; i++) {
     delete nursesches[i].ischanged;
     if(!(nursesches[i].assign_date in assign_date_obj)){
     assign_date_obj[nursesches[i].assign_date] = nursesches[i].assign_date;
     assign_date_str = assign_date_str + "," + nursesches[i].assign_date;
     }
     }
     //新增排班資料
     console.log("====ADD_BED_ASSIGN====");
     console.log(nursesches);
     DBAgent.updateBatchExecute("ADD_BED_ASSIGN", nursesches, function (error, result) {
     if (error) {
     callback(error, null);
     } else {
     if (result && result.length < 1) {
     callback({code:-1}, null);
     } else {
     callback(null,null);
     }
     }
     });
     }else{
     callback(null,null);
     }
     }
     ,function(callback) { //更新SIP裝置
     //updateSIP(nursesches,assign_date_str, callback);
     }
     ];*/

    /*
     DBAgent.MultiTranaction(process,function(results,error) {
     callback(results,error);
     })
     */
};

/**
 * 批次排班
 * */
exports.insertScheBatch = function (cond, callback) {
    var insrtobjs = [];
    var dates = cond.dates;
    var beds = cond.beds;
    var nurse_no = cond.nurse_no;
    for (var i = 0; i < dates.length; i++) {
        for (var j = 0; j < beds.length; j++) {
            var thisobj = {
                nurse_no: nurse_no,
                bed_id: beds[j].bed_id,
                class: beds[j].class_type,
                assign_date: dates[i].thisdate,
                last_update_time: cond.last_update_time,
                update_user: cond.update_user
            };
            insrtobjs.push(thisobj);
        }
    }
    //整理排班資料
    var assign_date_str = "";
    var assign_date_obj = {};
    for (var i = 0; i < insrtobjs.length; i++) {
        if (!(insrtobjs[i].assign_date in assign_date_obj)) {
            assign_date_obj[insrtobjs[i].assign_date] = insrtobjs[i].assign_date;
            assign_date_str = assign_date_str + "," + insrtobjs[i].assign_date;
        }
    }

    console.log("====insertScheBatch===");
    var existed_data=[];
    async.series([
            //檢查重複排班資料
            function (callback) {
                async.each(insrtobjs, function (values, callback1) {
                    DBAgent.query("QRY_nurse_bed_assignment_BY_CONDITION",
                        values, function (error, row) {
                            if (error) {
                                Logger.error(error);
                            }
                            if(typeof row[0] !== "undefined"){
                                existed_data.push(row[0]);
                            }
                            callback1(error, row);
                        });

                }, function (error, result) {
                    callback(error, result);
                });
            },
            //新增排班資料
            function (callback) {
                DBAgent.updateBatchExecute("ADD_BED_ASSIGN",
                    insrtobjs, function (error, result) {
                        if (error) {
                            console.log("====ADD_BED_ASSIGN error===");
                            Logger.error(error);
                            console.error(error);
                            error.code ? callback(false, error.code) : callback(false, "9999");
                        } else {
                            if (result && result.length < 1) {
                                callback(false, "-1");
                            } else {
                                callback(null, null);
                            }
                        }
                    });
            },
            //更新SIP裝置
            function (callback) {
                updateSIP(insrtobjs, assign_date_str, callback);
                //callback(null, null);
            }
        ],
        // optional callback
        function (error, results) {
            console.log("===error===");
            console.log(error);
            console.log("===results===");
            console.log(results);
            console.log("===QRY_nurse_bed_assignment_BY_CONDITION existed_data===");
            console.log(existed_data);

            if (error) {
                Logger.error(error);
                console.error(error);
                error.code ? callback(false, error.code,existed_data) : callback(false, "9999",existed_data);
            } else {
                callback(true,null,existed_data);
            }
        });
    // //DB異動流程
    // var process = [
    //     function(callback) {
    //         DBAgent.updateMultiDBBatchExecute("ADD_BED_ASSIGN",
    //             insrtobjs, function (error , result) {
    //                 if(error){
    //                     Logger.error(error);
    //                     console.error(error);
    //                     error.code ? callback(false,error.code) : callback(false,"9999");
    //                 }else{
    //                     if(result && result.length<1){
    //                         callback(false,"-1");
    //                     }else{
    //                         callback(null,null);
    //                     }
    //                 }
    //             });
    //     }
    //     ,function(callback) { //更新SIP裝置
    //         updateSIP(insrtobjs,assign_date_str, callback);
    //         //callback(null,null);
    //     }
    // ];
    //
    // DBAgent.MultiTranaction(process,function(results,error) {
    //     callback(results,error);
    // })
};


/**
 * updateMultiTest
 * */
exports.updateMultiTest = function (callback) {
    var newtodo = [{
        todo_name: 'mtest'
        , todo_class_id: '1'
        , last_update_time: '2016/12/19 01:34:46'
        , update_user: 'test'
    }];
    var newtodo_class = [{
        todo_class_name: 'mtest'
        , last_update_time: '2016/12/19 01:34:46'
        , update_user: 'test'
    }];
    var ward = [{  //這步讓他出錯
        ward_zone_id: 'test'
        , ward_name: 'mtest'
        , last_update_time: 'test'
    }];

    //DB異動流程
    var process = [
        function (callback) {
            DBAgent.updateMultiDBBatchExecute("ADD_MTEST01", newtodo, function (error, result) { //updateBatchExecute updateMultiDBBatchExecute
                if (error) {
                    callback(error, null);
                } else {
                    if (result && result.length < 1) {
                        callback({code: -1}, null);
                    } else {
                        callback(null, null);
                    }
                }
            });
        }
        , function (callback) {
            DBAgent.updateMultiDBBatchExecute("ADD_MTEST02", newtodo_class, function (error, result) {
                if (error) {
                    callback(error, null);
                } else {
                    if (result && result.length < 1) {
                        callback({code: -1}, null);
                    } else {
                        callback(null, null);
                    }
                }
            });
        }
        , function (callback) {
            //新增排班資料
            DBAgent.updateMultiDBBatchExecute("ADD_MTEST03", ward, function (error, result) {
                if (error) {
                    callback(error, null);
                } else {
                    if (result && result.length < 1) {
                        callback({code: -1}, null);
                    } else {
                        callback(null, null);
                    }
                }
            });
        }
    ];

    DBAgent.MultiTranaction(process, function (results, error) {
        callback(results, error);
    })
};

exports.updateMultiTest2 = function (callback) {
    var newtodo = [{
        todo_name: 'mtest'
        , todo_class_id: '1'
        , last_update_time: '2016/12/19 01:34:46'
        , update_user: 'test'
    }];
    var newtodo_class = [{
        todo_class_name: 'mtest'
        , last_update_time: '2016/12/19 01:34:46'
        , update_user: 'test'
    }];
    var ward = [{  //這步讓他出錯
        ward_zone_id: 'test'
        , ward_name: 'mtest'
        , last_update_time: 'test'
    }];

    async.series([
            function (callback) {
                DBAgent.updateBatchExecute("ADD_MTEST01", newtodo, function (error, result) {
                    if (error) {
                        callback(error, null);
                    } else {
                        if (result && result.length < 1) {
                            callback({code: -1}, null);
                        } else {
                            callback(null, null);
                        }
                    }
                });
            }
            , function (callback) {
                DBAgent.updateBatchExecute("ADD_MTEST02", newtodo_class, function (error, result) {
                    if (error) {
                        callback(error, null);
                    } else {
                        if (result && result.length < 1) {
                            callback({code: -1}, null);
                        } else {
                            callback(null, null);
                        }
                    }
                });
            }
            , function (callback) {
                DBAgent.updateBatchExecute("ADD_MTEST03", ward, function (error, result) {
                    if (error) {
                        callback(error, null);
                    } else {
                        if (result && result.length < 1) {
                            callback({code: -1}, null);
                        } else {
                            callback(null, null);
                        }
                    }
                });
            }
        ],
        // optional callback
        function (error, results) {
            console.log("===error===");
            console.log(error);
            console.log("===results===");
            console.log(results);

            if (error) {
                Logger.error(error);
                console.error(error);
                error.code ? callback(false, error.code) : callback(false, "9999");
            } else {
                callback(true);
            }
        });
};

/**
 * 刪除護士 BY ID
 * */
exports.deleteNurseById = function (nurses, callback) {
    if (nurses instanceof Array) {
        DBAgent.updateBatchExecute("DEL_BY_ID", nurses, function (error, result) {
            if (error) {
                Logger.error(error);
                console.error(error);
                error.code ? callback(false, error.code) : callback(false, "9999");
            } else {
                if (result && result.length < 1) {
                    callback(false, "-1");
                } else {
                    callback(true);
                }
            }
        });
    } else {
        //輸入格式錯誤
        callback(false, -10);
    }
};

/**
 * 取得所有護理師-病床排班資料
 * ward 病房{id, district_id, ward_name}
 * bed 病床{id, bed_name, ward_id}
 * nurse_bed_assignment 護理師病床分派{id, nurse_id, bed_id, class, assign_date}
 * nurse 護士
 * */
exports.getNurseSche = function (cond, ward_zone_id, callback) {
    cond.ward_zone_id = ward_zone_id;
    console.log(cond);
    for (conkey in cond) {
        if (cond[conkey] == '') {
            cond[conkey] = null;
        } else if (cond['ope_range'] && cond['ope_range'] != '') { //查詢日起迄
            var date_se = cond['ope_range'].trim().split("~");
            var start_date = date_se[0] ? date_se[0] : null;
            var end_date = date_se[1] ? date_se[1] : start_date;
            cond['start_date'] = start_date;
            cond['end_date'] = end_date;
        }
    }

    DBAgent.query("QRY_SCHE_BY_CONDITION", cond, function (error, result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            if (result.length < 1) {
                callback(false, "-1");
            } else {
                callback(result);
            }

        }
    });
};

/**
 * 取該護理師-月份排班資料
 * */
exports.getThisNurseSche = function (cond, ward_zone_id, callback) {
    cond.start_date = cond.year + "/" + cond.month + "/" + "01";
    cond.end_date = cond.year + "/" + cond.month + "/" + "31";
    cond.ward_zone_id = ward_zone_id;
    DBAgent.query("QRY_SCHE_BY_CONDITION", cond, function (error, result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            if (result.length < 1) {
                callback(false, "-1");
            } else {
                var reponse;
                var sche_obj = {};
                for (var i = 0; i < result.length; i++) {
                    var thisobj = result[i];
                    var assign_date = "date-" + moment(thisobj.assign_date).format("DD"); //排班日期
                    var class_id = thisobj.class_id; //班別
                    var class_id_key = "class-" + class_id;
                    var class_name = thisobj.class_name; //班別名稱
                    if (assign_date in sche_obj) {
                        var tmp_obj = sche_obj[assign_date];
                    } else {
                        var tmp_obj = {};
                        sche_obj[assign_date] = tmp_obj;
                    }

                    var tmp_class;
                    if (class_id_key in tmp_obj) {
                        tmp_class = tmp_obj[class_id_key];
                        tmp_class.num = tmp_class.num + 1;
                    } else {
                        tmp_class = {};
                        tmp_class.class_id = class_id;
                        tmp_class.class_name = class_name;
                        tmp_class.num = 1;
                        tmp_obj[class_id_key] = tmp_class;
                    }
                }
                callback(sche_obj);
            }
        }
    });
};

/**
 * 取得病房出入院記錄
 * */
exports.getMedicalRecord = function (cond, callback) {
    DBAgent.query("QRY_IN_OUT_HOSPITAL", cond, function (error, result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            if (result.length < 1) {
                callback(false, "-1");
            } else {
                callback(result);
            }
        }
    });
};

/**
 * 取得所有病床
 * */
exports.getAllBed = function (cond, ward_zone_id, callback) {
    cond.ward_zone_id = ward_zone_id;

    DBAgent.query("QRY_ALL_BED", cond, function (error, result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            if (result.length < 1) {
                callback(false, "-1");
            } else {
                callback(result);
            }
        }
    });
};

/**
 * 取得所有病床by病房&病人
 * */
exports.getAllBedByWard = function (cond, ward_zone_id, callback) {
    cond.ward_zone_id = ward_zone_id;
    DBAgent.query("QRY_ALL_BED_BY_WARD", cond, function (error, result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            if (result.length < 1) {
                callback(false, "-1");
            } else {
                //callback(result);
                var ward_obj = {};
                var wardList = [];
                if (result && result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        var thisobj = result[i];
                        var ward_id = thisobj.ward_id;
                        var ward_name = thisobj.ward_name;

                        var bed_list;
                        if (ward_id in ward_obj) {
                            thisward_obj = ward_obj[ward_id];
                            bed_list = thisward_obj.bed_list;
                        } else {
                            bed_list = [];
                            var thisward_obj = {
                                ward_id: ward_id
                                , ward_name: ward_name
                                , bed_list: bed_list
                            }
                            wardList.push(thisward_obj);
                            ward_obj[ward_id] = thisward_obj;
                        }
                        var bedobj = {
                            bed_id: thisobj.bed_id
                            , bed_name: thisobj.bed_name
                            , patient_person_id: thisobj.patient_person_id
                            , patient_name: thisobj.patient_name
                            , sex: thisobj.sex
                            , ward_id: ward_id
                            , ward_name: ward_name
                        };
                        bed_list.push(bedobj);
                    }
                }
                callback(wardList);
            }
        }
    });
};

/**
 * 取得所有任務、消防編組
 * */
exports.getAllMissionGroup = function (cond, callback) {
    console.log("cond--->");
    console.log(cond);
    DBAgent.query("QRY_ALL_MISSION_GROUP", cond, function (error, result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            if (result.length < 1) {
                callback(false, "-1");
            } else {
                callback(result);
            }
        }
    });
};

exports.getAllFireGroup = function (cond, callback) {
    DBAgent.query("QRY_ALL_FIRE_CONTROL_GROUP", cond, function (error, result) {
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            if (result.length < 1) {
                callback(false, "-1");
            } else {
                callback(result);
            }
        }
    });
};

/**
 * 修改護士 BY EMPLOYEE_NO
 * */
exports.updateNurseByEmployeeNo = function (callback) {
    var cond = {
        id: '1',
        employee_no: 'TEST',
        tel: '099999999',
        agent1_nurse_id: '1',
        agent2_nurse_id: '1',
        agent3_nurse_id: '1',
        fire_control_group_id: '1',
        mission_group_id: '1',
        remark: '1'
    };

    DBAgent.updateExecute("UPDATE_BY_EMPLOYEE_NO", cond, function (error, result) {
        if (error)
            console.error(error);
        callback(result);
    });
};

/**
 * 刪除護士 BY EMPLOYEE_NO
 * */
exports.deleteNurseByEmployeeNo = function (callback) {
    var cond = {
        employee_no: 'TEST'
    };

    DBAgent.updateExecute("DEL_BY_EMPLOYEE_NO", cond, function (error, result) {
        if (error)
            console.error(error);
        callback(result);
    });
};

//動態建立sip連線test
var mysql = require('mysql');
exports.dcrestesip = function (callback) {
    var newtodo_class = [{
        todo_class_name: 'mtest'
        , last_update_time: '2017/2/23 01:34:46'
        , update_user: 'test'
    }];

    var ward_zone_id = "2"; //EASONTODO

    async.waterfall([
        _function1, //取得連線資訊
        _function2, //建立連線
        _function3, //異動資料
        _function4 //關閉連線
    ], function (error, success) {
        console.log("===error===");
        console.log(error);
        console.log("===success===");
        console.log(success);
        if (error) {
            Logger.error(error);
            console.error(error);
            error.code ? callback(false, error.code) : callback(false, "9999");
        } else {
            callback(true);
        }
    });

    function _function1(callback) { //取得連線資訊
        DBAgent.query("QRY_SIP_IP_BY_WARDZONE_ID2", {ward_zone_id: ward_zone_id}, function (error, result) {
            if (error) {
                Logger.error(error);
                console.error(error);
                error.code ? callback(error.code, false) : callback("9999", false);
            } else {
                if (result.length < 1) {
                    callback("-1", null);
                } else {
                    var this_con_config = {};
                    this_con_config.host = result[0].sip_ip;
                    this_con_config.user = result[0].DBAccount;
                    this_con_config.password = result[0].DBPassword;
                    this_con_config.database = result[0].DBName;
                    this_con_config.port = result[0].DBPort;
                    this_con_config.timezone = "utc";
                    callback(null, this_con_config);
                }
            }
        });
    }

    function _function2(this_con_config, callback) { //建立連線
        var thisconnection = mysql.createPool({
            host: this_con_config.host,
            port: this_con_config.port,
            user: this_con_config.user,
            password: this_con_config.password,
            database: this_con_config.database,
            timezone: this_con_config.timezone
        });
        thisconnection.getConnection(function (err, connection) {
            if(err){
                console.error(err);
                callback(err, null);
            }

        });
        callback(null, thisconnection);
    }

    function _function3(thisconnection, callback) { //
        DBAgent.updateBatchExecute("ADD_MTEST02", newtodo_class, function (error, result) {
            if (error) {
                callback(error, null);
            } else {
                if (result && result.length < 1) {
                    callback("-1", null);
                } else {
                    callback(null, result, thisconnection);
                }
            }
        },null,thisconnection);
    }

    function _function4(result, connection, callback) { //關閉連線
        connection.end();
        connection = null;
        callback(null, result);
    }
};