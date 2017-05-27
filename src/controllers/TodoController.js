/**
 * Created by Eason on 2016/10/21.
 * 跑馬燈
 */
var Logger = require("../plugins/Log4js").Logger;
var LoggerError = require("../plugins/Log4js").LoggerError;
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var todoService = require("../services/todoService");
var tools = require("../utils/commonTools");
var validate = require("validate.js");
var moment = require("moment");

function addLastInfo(element,now,user) {
    element.last_update_time = now;
    element.update_user = user;
}

//data validate define
var constraints = {
    todo_name: {
        presence: {
            message: "待辦事項名稱不可為空"
        }
    },
    todo_class_id: {
        presence: {
            message: "必須選擇待辦事項類別"
        }
    }
};

var constraints_update = {
    name: {
        presence: {
            message: "待辦事項名稱不可為空"
        }
    }
};

var constraints_class = {
    todo_class_name: {
        presence: {
            message: "待辦事項類別名稱不可為空"
        }
    }
};

var constraints_class2 = {
    name: {
        presence: {
            message: "待辦事項類別名稱不可為空"
        }
    }
};

/**
 * 取得所有待辦事項
 * **/
exports.getAllTodo = function(req, res){
    todoService.getAllTodo(function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 新增待辦事項
 * **/
exports.insertTodo = function(req, res){
    var data = req.body

    //資料檢核
    var validate_error = validate(data, constraints, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    todoService.insertTodo(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 修改待辦事項
 * **/
exports.updateTodo = function(req, res){
    var data = req.body
    console.log(data);
    //資料檢核
    var validate_error = validate(data, constraints_update, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }
    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    todoService.updateTodo(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 刪除待辦事項
 * **/
exports.deleteTodo = function(req, res){
    todoService.deleteTodo(req.body.todos,function(result){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 取得待辦事項類別
 * **/
exports.getTodoClass = function(req, res){

    //res.render("Marquee/index");
    todoService.getTodoClass(function(result){
        res.json({success:true , msg:'' , result:result})
    })
};

/**
 * 新增待辦事項類別
 * **/
exports.insertTodoClass = function(req, res){
    var data = req.body

    //資料檢核
    var validate_error = validate(data, constraints_class, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    todoService.insertTodoClass(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 修改待辦事項類別
 * **/
exports.updateTodoClass = function(req, res){
    var data = req.body

    //資料檢核
    var validate_error = validate(data, constraints_class2, {fullMessages: false});
    if(validate_error){
        res.json(tools.getReturnJSON(false,[],"-11",validate_error))
        return;
    }

    data.last_update_time = moment().format("YYYY/MM/DD HH:mm:ss");
    data.update_user = req.session.user.account;
    todoService.updateTodoClass(data,function(result,errorCode){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};

/**
 * 刪除待辦事項類別
 * **/
exports.deleteTodoClass = function(req, res){
    todoService.deleteTodoClass(req.body.todoclasses,function(result){
        if(result){
            res.json(tools.getReturnJSON(true,result))
        }else{
            res.json(tools.getReturnJSON(false,[],errorCode))
        }
    })
};