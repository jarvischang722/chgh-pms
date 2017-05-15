/**
 * Created by Jun on 2016/10/1.
 */
var mysql = require('mysql');
var DBConfig = require('../../configs/DBConfig');
var moment = require('moment');
var randomstring = require('randomstring');
var pool, poolObj={};

function DBAgent(){
    this.id = moment().format("YYYY/MM/DD HH:mm:ss") + randomstring.generate(4);
    this.data = {};
    this.connection = null;
    this.trans = null;
    this.queue = null;
    this.error = false;
}

DBAgent.prototype.create = function create(){
    Object.keys(DBConfig).forEach(function(key) {
        var db_setting = DBConfig[key];
        if(db_setting.isenabled==true){
            var thispool = mysql.createPool({
                host: db_setting.host,
                port: db_setting.port,
                user: db_setting.user,
                password: db_setting.password,
                database: db_setting.database,
                timezone: db_setting.timezone
            });
            thispool.getConnection(function (err, connection) {
                if(err)
                    console.error(err);
            });
            poolObj[key] = thispool;
            console.log("====DBAgent createPool:"+key+" success!===");
        }
    });
};

DBAgent.prototype.setPool = function setPool(changepool,cb){
    console.log("====DBAgent setPool===");
    if(changepool in poolObj){
        pool = poolObj[changepool];
    }else if(!changepool){ //沒有傳值，預設為PMS
        pool = poolObj["PMS"];
    }else{  //找不到，預設為PMS EASONTODO
        pool = poolObj["PMS"];
    }
}

DBAgent.prototype.setcustomPool = function setcustomPool(changepool,cb){
    console.log("====DBAgent setcustomPool===");
    pool = changepool;
}

DBAgent.prototype.getConnection = function getConnection(cb) {
    console.log("====getConnection pool===");
    //console.log(pool);
    var ag = this;
    if (pool == null) {
        console.log('wait pool init');
        setTimeout(function () {
            getConnection(cb);
        }, 100);
        return;
    }

    pool.getConnection(function (err, connection) {

        cb(err, connection);
    });
};

DBAgent.prototype.startTransaction = function (cb) {
    var ag = this;

    this.getConnection(function (err, connection) {
        console.log("=== getConnection 2 ===");

        ag.connection = connection;
        connection.beginTransaction(function (err) {

            ag.error = false;
            cb(ag);
        });
    });
};

DBAgent.prototype.endTransaction = function (cb) {
    var ag = this;
    if (ag.error) {
        this.connection.rollback(function (err, info) {
            //ag.connection.release();
            console.log("===connection rollback====");
            ag.connection.destroy();
            cb(ag.error == false);
        });
    } else {
        this.connection.commit(function (err, info) {
           // ag.connection.release();
            console.log("===connection commit====");
            ag.connection.destroy();
            cb(ag.error == false && err == null);
        });
    }
};


DBAgent.prototype.close = function (connection) {
    connection.end();
};

DBAgent.prototype.execute = function (connection) {
    connection.execute();
};

DBAgent.prototype.newDBAgent = function () {
    module.exports =  exports = new DBAgent;
};

function newDBAgent(){
    module.exports =  exports = new DBAgent;
}

module.exports =  exports = new DBAgent;