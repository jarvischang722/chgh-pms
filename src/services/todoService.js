/**
 * Created by Eason on 2016/10/23.
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");


/**
 * 取得所有待辦事項
 * */
exports.getAllTodo = function(callback){
    DBAgent.query("QRY_ALL_TODO",{} , function(err , rows){
        if(err){
            Logger.error(error);
            rows = [];
        }
         callback(rows);
    });
};

/**
 * 根據待辦事項類別取得待辦事項
 * */
exports.getTodoByClassId = function(callback){
    var cond = {
        todo_class_id:'1',
    };
    DBAgent.query("QRY_TODO_BY_CLASS",cond , function(err , rows){

        if(err){
            Logger.error(error);
            rows = [];
        }

        callback(rows);

    });
};

/**
 * 新增待辦事項
 * */
exports.insertTodo = function(req, callback){
    DBAgent.updateExecute("ADD_TODO", req , function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            callback(result);
        }
    });
};

/**
 * 刪除待辦事項
 * */
exports.deleteTodo = function(todos,callback){
    if(todos instanceof Array){
        DBAgent.updateBatchExecute("DEL_TODO",todos, function (error , result) {
            if(error){
                Logger.error(error);
                console.error(error);
                error.code ? callback(false,error.code) : callback(false,"9999");
            }else{
                if(result && result.length<1){
                    callback(false,"-1");
                }else{
                    callback(true);
                }
            }
        });
    }else{
        //輸入格式錯誤
        callback(false,-10);
    }
};

/**
 * 修改待辦事項
 * */
exports.updateTodo = function(req,callback){
    console.log("===req===");
    console.log(req);
    DBAgent.updateExecute("UPDATE_TODO", req, function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            callback(result);
        }
    });
};

/**
 * 取得所有待辦事項類別
 * */
exports.getTodoClass = function(callback){
    DBAgent.query("QRY_TODO_CLASS",{} , function(err , rows){

        if(err){
            Logger.error(error);
            rows = [];
        }

        callback(rows);

    });
};

/**
 * 新增待辦事項類別
 * */
exports.insertTodoClass = function(req, callback){
    DBAgent.updateExecute("ADD_TODO_CLASS", req , function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            callback(result);
        }
    });
};

/**
 * 刪除待辦事項類別
 * */
exports.deleteTodoClass = function(todoclasses,callback){
    if(todoclasses instanceof Array){
        DBAgent.updateBatchExecute("DEL_TODO_CLASS",todoclasses, function (error , result) {
            if(error){
                Logger.error(error);
                console.error(error);
                error.code ? callback(false,error.code) : callback(false,"9999");
            }else{
                if(result && result.length<1){
                    callback(false,"-1");
                }else{
                    callback(true);
                }
            }
        });
    }else{
        //輸入格式錯誤
        callback(false,-10);
    }
};

/**
 * 修改待辦事項類別
 * */
exports.updateTodoClass = function(req,callback){
    console.log("===req===");
    console.log(req);
    DBAgent.updateExecute("UPDATE_TODO_CLASS", req, function(error , result){
        if(error){
            Logger.error(error);
            console.error(error);
            error.code ? callback(false,error.code) : callback(false,"9999");
        }else{
            callback(result);
        }
    });
};