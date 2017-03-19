/**
 * Created by Ian on 2016/12/01.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var async = require("async");


/**
 * 取得所有點滴種類
 * */
exports.getAllBitClass = function (callback) {
    DBAgent.query("QRY_ALL_BIT_CLASS", {}, function (err, rows) {
        if (err) {
            Logger.error(err);
            rows = [];
        }
        callback(rows);
    });
};

/**
 * 取得點滴輸液管種類
 * */
exports.getAllBitPipeClass = function (callback) {
    DBAgent.query("QRY_ALL_BIT_PIPE_CLASS", {}, function (err, rows) {
        if (err) {
            Logger.error(err);
            rows = [];
        }
        callback(rows);
    });
};


/**
 * 新增點滴種類
 * */
exports.insertBitClass = function (parameter_object, callback) {


    if (validParameter(parameter_object)) {

        var bit_no = parameter_object['bit_no'] || "";
        var bit_class_name = parameter_object['bit_class_name'] || "";
        var bit_capacity = parameter_object['bit_capacity'] || "";
        var bit_name = parameter_object['bit_name'] || "";
        var bit_empty_weight = parameter_object['bit_empty_weight'] || "";
        var update_user = parameter_object['update_user'] || "";


        DBAgent.updateExecute("ADD_BIT_CLASS", {
            bit_no: bit_no, bit_class_name: bit_class_name,
            bit_capacity: bit_capacity, bit_name: bit_name,
            bit_empty_weight: bit_empty_weight, update_user: update_user

        }, function (error, result) {
            if (error) {
                Logger.error(error);
                console.log(error);
                callback(false, -9999);
            } else {
                callback(true);
            }
        });


    } else {

        callback(false, -10);

    }


};


/**
 * 更新點滴種類
 * */
exports.updateBitClass = function (parameter_object, callback) {


    if (validParameter(parameter_object)) {

        var id = parameter_object['id'] || "";
        var bit_no = parameter_object['bit_no'] || "";
        var bit_class_name = parameter_object['bit_class_name'] || "";
        var bit_capacity = parameter_object['bit_capacity'] || "";
        var bit_name = parameter_object['bit_name'] || "";
        var bit_empty_weight = parameter_object['bit_empty_weight'] || "";
        var update_user = parameter_object['update_user'] || "";


        DBAgent.updateExecute("UPD_BIT_CLASS", {
            id: id, bit_no: bit_no, bit_class_name: bit_class_name,
            bit_capacity: bit_capacity, bit_name: bit_name,
            bit_empty_weight: bit_empty_weight, update_user: update_user

        }, function (error, result) {
            if (error) {
                Logger.error(error);
                console.log(error);
                callback(false, -9999);
            } else {
                callback(true);
            }
        });


    } else {

        callback(false, -10);

    }


};


/**
 * 刪除點滴種類
 * */
exports.deleteBitClass = function (bit_class_ids, callback) {

    var deleteFuncsArray = Array();

    if (bit_class_ids instanceof Array) {

        _.each(bit_class_ids, function (bit_class_id) {

            if (!_.isUndefined(bit_class_id)) {

                deleteFuncsArray.push(
                    function (callback) {

                        DBAgent.updateExecute("DEL_BIT_CLASS", {id: bit_class_id}, function (err, result) {
                            callback(err, result)
                        })
                    }
                );
            }

        })

        async.parallel(deleteFuncsArray, function (err, result) {
            if (err) {

                callback(false, -9999);

            } else {

                callback(true);
            }

        })


    } else {

        callback(false, -10);
    }


};

/**
 * 搜尋點滴裝置分派資料
 * **/
exports.doFetchBitDeviceAssign = function (req, callback) {
    DBAgent.query("QRY_BIT_DISTRIBUTE_RECORD", {ward_zone_id:req.session.user.ward_zone_id}, function (err, rows) {
        var errorCode = null;
        var returnRows = [];
        if (err) {
            errorCode = '1000';
            Logger.error(err);
            rows = [];
        }
        var groupBitAssign = _.groupBy(rows, function (item) {
            return item.ward_name + "-" + item.bed_name
        });
        //returnRows = groupBitAssign;
        _.each(Object.keys(groupBitAssign), function (bitDeviceItem) {
            returnRows.push({
                ward_bed_name: bitDeviceItem,
                bed_id: groupBitAssign[bitDeviceItem][0].bed_id,
                bitNoList: _.sortBy(groupBitAssign[bitDeviceItem], "bit_no")
            });
        });
        callback(errorCode, returnRows);
    })
};


/***
 * 實作儲存點滴裝置
 * **/
exports.doSaveBitDeviceAssign = function (bed_id, bitDeviceAssignList, callback) {

    var filteredData = [];
    _.each(bitDeviceAssignList, function (bitItem) {
        if (!_.isUndefined(bitItem.bed_id) && !_.isEmpty(bitItem.bed_id)
            && !_.isUndefined(bitItem.bit_no) && !_.isEmpty(bitItem.bit_no)) {
            filteredData.push(bitItem);
        }
    });

    filteredData = _.uniq( _.collect( filteredData, function( data ){
        return JSON.stringify(data);
    }));
    _.each(filteredData,function(item,idx){
        filteredData[idx] = JSON.parse(item)
    });


    async.waterfall([
        function (callback) {
            DBAgent.updateExecute("DEL_BIT_DISTRIBUTE_RECORD", {bed_id: bed_id}, function (err, result) {
                callback(err, result)
            })
        }
    ], function (err, result) {
        if (!err && filteredData.length > 0) {
            DBAgent.updateBatchExecute("UPD_BIT_DISTRIBUTE_RECORD", filteredData, function (err) {
                callback(err)
            })
        } else {
            callback(err)
        }

    })

};

/**
 * 新增點滴輸液管種類
 * **/
exports.doAddBitPipeClass = function(params_obj , callback){
    if(validParameter(params_obj)){
        DBAgent.updateExecute("ADD_BIT_PIPE_CLASS", params_obj, function(err,result){
            if (err) {

                callback(false, -9999);

            } else {

                callback(true);
            }
        })
    }
};

/**
 * 更新點滴輸液管種類服務
 * **/
exports.doUpdateBitPipeClass = function(params_obj , callback){
    if(validParameter(params_obj)){
        DBAgent.updateExecute("UPD_BIT_PIPE_CLASS", params_obj, function(err,result){
            if (err) {

                callback(false, -9999);

            } else {

                callback(true);
            }
        })
    }
};


function validParameter(parameter_object) {
//驗證有沒有參數沒輸入到

    for (var property in parameter_object) {
        if (parameter_object.hasOwnProperty(property)) {

            if (parameter_object[property] == null || parameter_object[property] == "") {

                return false;
            }
        }
    }

    return true;

}
