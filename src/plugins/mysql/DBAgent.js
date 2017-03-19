/**
 * Created by Jun on 2016/10/1.
 */

var async = require('async');
var DBAgent = require("./DB");
var _ = require("underscore");
var service_dao = require("./service_dao");

var getFromBetween = {
    results: [],
    string: "",
    getFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1) + sub1.length;
        var string1 = this.string.substr(0, SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP, TP);
    },
    removeFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
        this.string = this.string.replace(removal, "");
    },
    getAllResults: function (sub1, sub2) {
        // first check to see if we do have both substrings
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1, sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1, sub2);

        // if there's more substrings
        if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1, sub2);
        }
        else return;
    },
    get: function (string, sub1, sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1, sub2);
        return this.results;
    }
};

/**
 * 查詢資料庫
 * @parma dao_name {String} :　DAO名稱
 * @parma params {JSON} :　參數
 * @return (error , rows(Array))
 * **/
exports.query = function (dao_name, params, callback, useConnection) {
    console.log("=== Execute Dao name ===");
    console.log(dao_name);
    if (_.isUndefined(service_dao[dao_name])) {
        callback("找不到指定DAO", []);
        return;
    }

    DBAgent.setPool(useConnection); //設定使用哪條連線

    async.waterfall(
        [
            function (callback) {
                DBAgent.getConnection(function (err, connection) {
                    connection.config.queryFormat = function (query, values) {
                        console.log("=== queryFormat query ===");
                        console.log(query);
                        console.log("=== queryFormat values ===");
                        console.log(values);
                        if (!values) return query;
                        return query.replace(/\:(\w+)/g, function (txt, key) {
                            if (values.hasOwnProperty(key)) {
                                return this.escape(values[key]);
                                //return this.escape(values[key]).replace(/\,/g,"','");
                            }
                            return txt;
                        }.bind(this));
                    };
                    callback(err, connection);
                })
            },
            function (connection, callback) {

                //optional 條件分析
                var sql = service_dao[dao_name];
                var optionalCon = getFromBetween.get(sql, "[", "]");
                if (optionalCon && optionalCon.length > 0) {
                    optionalCon.forEach(function (item, index) {
                        var thisOptional = item;
                        var thiskey_array = thisOptional.match(/:\w*/g)
                        var openThisOptional = true;
                        thiskey_array.forEach(function (item2, index2) {
                            var thiskey = item2.substring(item2.lastIndexOf(":") + 1)
                            if (!(thiskey in params && params[thiskey] != null)) {
                                openThisOptional = false;
                                return false;//如果任一key值不存在或為null 直接return false終止迴圈
                            }
                        })
                        if (!openThisOptional) { //如果[]中任一key值不存在或為null 關閉optional條件
                            sql = sql.replace(thisOptional, "");
                        }
                    })
                    //拿掉所有[]
                    sql = sql.split("[").join("").split("]").join("");
                }

                var sqlOptions = {
                    sql: sql,
                    timeout: 40000 // 40s
                };


                console.log("== values ==");
                console.dir(params);

                var query = connection.query(sqlOptions, params, function (err, rows, fields) {
                    connection.destroy();
                    callback(err, rows);
                });

                console.log("== EXEC SQL STATEMENT ==");
                console.log(query.sql);
            }
        ], function (error, rows) {
            callback(error, rows);
        })

};

/**
 * 更新資料(新增修改刪除)
 * @parma dao_name {String} :　DAO名稱
 * @parma values {JSON | Array} :　插入值
 * @return (error , result)
 * **/
exports.updateExecute = function (dao_name, values, callback, useConnection) {
    if(isMultiTranaction){
        callback("已啟用多DB異動交易控制服務，請用updateMultiDBBatchExecute執行DB異動", []);
        return;
    }
    console.log("=== Execute Dao name ===");
    console.log(dao_name);
    if (_.isUndefined(service_dao[dao_name])) {
        callback("找不到指定DAO", []);
        return;
    }

    DBAgent.setPool(useConnection); //設定使用哪條連線
    try {


        async.waterfall([
            // 1) start transaction
            function (callback) {

                DBAgent.startTransaction(function (agent) {
                    callback(null, agent.connection);
                })
            },
            // 2) execute insert sql stament
            function (connection, callback) {

                if (!_.isArray(values) && service_dao[dao_name].indexOf("?") == -1) {

                    //Value type is Object
                    connection.config.queryFormat = function (query, values) {
                        if (!values) return query;
                        return query.replace(/\:(\w+)/g, function (txt, key) {
                            if (values.hasOwnProperty(key)) {
                                return this.escape(values[key]);
                            }
                            return txt;
                        }.bind(this));
                    };

                } else if (_.isArray(values)) {
                    //value type is Array
                    values = [values];
                }
                try {
                    console.log("== values ==");
                    console.dir(values);

                    var sqlStament = connection.query(service_dao[dao_name], values, function (err, result) {
                        callback(err, result);
                        //connection.destroy();
                    });

                    console.log("== EXEC SQL STATEMENT ==");
                    console.log(sqlStament.sql);
                } catch (ex) {
                    console.error(ex.message);
                    callback(ex.message, null);
                }
            }

        ], function (error, result) {
            if (error) {
                DBAgent.error = error;
            } else {
                DBAgent.error = null;
            }
            // 3)  end transaction
            DBAgent.endTransaction(function (success) {
                callback(DBAgent.error, result);
            })
        })
    } catch (ex) {
        // 3)  end transaction
        DBAgent.endTransaction(function (success) {
            callback(DBAgent.error, result);
        })
        console.error(ex)
    }

};

/**
 * 批次更新資料(新增修改刪除)
 * @parma dao_name {String} :　DAO名稱
 * @parma values {JSON | Array} :　插入值
 * @return (error , result)
 * **/
exports.updateBatchExecute = function (dao_name, datas, callback, useConnection, customConnection) {
    if(isMultiTranaction){
        callback("已啟用多DB異動交易控制服務，請用updateMultiDBBatchExecute執行DB異動", []);
        return;
    }
    console.log("=== Execute Dao name ===");
    console.log(dao_name);
    if (_.isUndefined(service_dao[dao_name])) {
        callback("找不到指定DAO", []);
        return;
    }

    DBAgent.setPool(useConnection); //設定使用哪條連線
    if(customConnection){
        console.log("=== put customConnection ===");
        DBAgent.setcustomPool(customConnection);
    }

    try {
        async.waterfall([
            // 1) start transaction
            function (callback) {

                DBAgent.startTransaction(function (agent) {
                    callback(null, agent.connection);
                })
            },
            // 2) execute insert sql stament
            function (connection, callback) {
                async.each(datas, function (values, callback) {
                    if (!_.isArray(values) && service_dao[dao_name].indexOf("?") == -1) {

                        //Value type is Object
                        connection.config.queryFormat = function (query, values) {
                            if (!values) return query;
                            return query.replace(/\:(\w+)/g, function (txt, key) {
                                if (values.hasOwnProperty(key)) {
                                    return this.escape(values[key]);
                                }
                                return txt;
                            }.bind(this));
                        };

                    } else if (_.isArray(values)) {
                        //value type is Array
                        values = [values];
                    }
                    console.log("== values ==");
                    console.dir(values);

                    var sqlStament = connection.query(service_dao[dao_name], values, function (err, result) {
                        if (err) {
                            return callback(err, null);
                        }
                        console.log("== EXEC SQL STATEMENT ==");
                        console.log(sqlStament.sql);
                        //callback(err, result);
                        callback(null, null);
                    });
                }, function (error, result) {
                    callback(error, result);
                });
            }

        ], function (error, result) {
            console.log("===end tranaction====");
            if (error) {
                DBAgent.error = error;
            } else {
                DBAgent.error = null;
            }

            // 3)  end transaction
            DBAgent.endTransaction(function (success) {
                callback(DBAgent.error, result);
            })
        })
    }catch (ex){
        // 3)  end transaction
        DBAgent.endTransaction(function (success) {
            callback(DBAgent.error, result);
        })
        console.error(ex);

    }

};

exports.MultiTranaction = function(process,callback){
    async.series([
            function(callback) { //啟動多DB異動交易控制服務 必要!
                exports.beginMultiTransaction(function(error, results) {
                    callback(error,results);
                });
            },
            function(callback) {//執行多DB異動交易控制服務 必要!
                exports.doMultiTransaction(process,function(error, results) {
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
                //Transaction rollback
                console.log("===Transaction rollback DBAgentPool:====");
                console.log(DBAgentPool);
                Object.keys(DBAgentPool).forEach(function(key) {
                    var thisDBAgent = DBAgentPool[key];
                    thisDBAgent.connection.rollback(function (err, info) {
                        thisDBAgent.connection.destroy();
                    });
                });
                error.code ? callback(false,error.code) : callback(false,"9999");
            }else{
                //Transaction commit
                console.log("===Transaction commit==== DBAgentPool:");
                console.log(DBAgentPool);
                //console.log(DBAgentPool);
                Object.keys(DBAgentPool).forEach(function(key) {
                    var thisDBAgent = DBAgentPool[key];
                    console.log("===Transaction commit==== thisDBAgent:");
                    console.log(key);
                    console.log(thisDBAgent);
                    thisDBAgent.connection.commit(function (err, info) {
                        thisDBAgent.connection.destroy();
                    });
                });
                isMultiTranaction = false;
                DBAgentPool = {};
                console.log("===Transaction commit==== callback");
                callback(null,null);
            }
        });
}

var isMultiTranaction = false;
var DBAgentPool = {};
exports.beginMultiTransaction = function(callback){
    isMultiTranaction = true;
    DBAgentPool = {};
    callback(null,null);
}

exports.doMultiTransaction = function(functions,callback){
    async.series(functions,function(error, results) {
        callback(error,results);
    });
}

//
exports.endMultiTransaction = function(DBAgentPool,callback){
    Object.keys(DBAgentPool).forEach(function(key) {
        var thisDBAgent = DBAgentPool[key];
        thisDBAgent.connection.commit(function (err) {
            thisDBAgent.connection.destroy();
        });
    });
    isMultiTranaction = false;
    DBAgentPool = {};
    callback(null,null);
}

/**
 * 批次更新資料(新增修改刪除) 多交易的情況下
 * @parma dao_name {String} :　DAO名稱
 * @parma values {JSON | Array} :　插入值
 * @return (error , result)
 * **/
exports.updateMultiDBBatchExecute = function (dao_name, datas, callback, useConnection) {
    if(!isMultiTranaction){
        callback("尚未呼叫beginMultiTranaction 無法啟用多DB異動交易控制服務。", []);
        return;
    }
    console.log("=== Execute Dao name ===");
    console.log(dao_name);
    if (_.isUndefined(service_dao[dao_name])) {
        callback("找不到指定DAO", []);
        return;
    }

    var thisDBAgent;
    async.waterfall([
        function (callback) {
            //init connection
            if(!useConnection){
                useConnection = "PMS";
            }
            if(useConnection in DBAgentPool){
                thisDBAgent = DBAgentPool[useConnection];
                callback(null, thisDBAgent.connection);
            }else{
                DBAgent.newDBAgent;
                thisDBAgent = DBAgent;
                DBAgentPool[useConnection] = thisDBAgent;
                thisDBAgent.setPool(useConnection); //設定使用哪條連線
                thisDBAgent.startTransaction(function (agent) {
                    callback(null, agent.connection);
                });
            }
        },
        // 2) execute update sql stament
        function (connection, callback) {
            //do connection
            async.each(datas, function (values, callback) {
                if (!_.isArray(values) && service_dao[dao_name].indexOf("?") == -1) {
                    //Value type is Object
                    connection.config.queryFormat = function (query, values) {
                        if (!values) return query;
                        return query.replace(/\:(\w+)/g, function (txt, key) {
                            if (values.hasOwnProperty(key)) {
                                return this.escape(values[key]);
                            }
                            return txt;
                        }.bind(this));
                    };

                } else if (_.isArray(values)) {
                    //value type is Array
                    values = [values];
                }
                console.log("== values ==");
                console.dir(values);

                var sqlStament = connection.query(service_dao[dao_name], values, function (err, result) {
                    console.log("== EXEC SQL STATEMENT ==");
                    console.log(sqlStament.sql);
                    if (err) {
                        return callback(err, null);
                    }
                    callback(null, result);
                });
            }, function (error, result) {
                callback(error, result);
            });
        }
    ], function (error, result) {
        callback(error, result);
    })
}





