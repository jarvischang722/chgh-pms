/**
 * Created by Jun on 2017/4/16.
 */
var express = require('express');
var router = express.Router();
var EWhiteBoard = require('../controllers/EWhiteBoardController');
var Index = require('../controllers/IndexController');
// var AuthMiddleware = require("../middlewares/AuthMiddleware");
var middleWares = [  ];


/* Setting Routes */
router.get('/', middleWares ,EWhiteBoard.index);
router.get('/selectNurArea', EWhiteBoard.selectNurArea);




//enter Admin
router.get('/loginAdmin', Index.loginForm);

/* API */
router.post('/login', middleWares ,Index.login);


router.get('/reSelectNurArea', Index.reSelectNurArea);


module.exports = router;