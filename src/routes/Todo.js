/**
 * Created by Eason on 2016/10/21.
 */

var express = require('express');
var router = express.Router();
var todoController  = require('../controllers/TodoController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [ AuthMiddleware ,i18nMiddleware];

//待辦事項
router.get('/api/getAllTodo', middleWares ,todoController.getAllTodo);

router.get('/testInsert', middleWares ,todoController.insertTodo); //TODO will change to post
router.get('/testDelete', middleWares ,todoController.deleteTodo); //TODO will change to post
router.get('/testUpdate', middleWares ,todoController.updateTodo); //TODO will change to post

//待辦事項類別
router.get('/todoclass', middleWares ,todoController.getTodoClass);

router.get('/testInsertClass', middleWares ,todoController.insertTodoClass); //TODO will change to post
router.get('/testDeleteClass', middleWares ,todoController.deleteTodoClass); //TODO will change to post
router.get('/testUpdateClass', middleWares ,todoController.updateTodoClass); //TODO will change to post


module.exports = router;