/**
 * Created by Jun on 2017/4/16.
 */
var express = require('express');
var router = express.Router();
var EWhiteBoard = require('../controllers/EWhiteBoardController');
var Index = require('../controllers/IndexController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");

var AdminAuthMiddleware = require("../middlewares/AdminAuthMiddleware");

var middleWares = [AuthMiddleware];


/* Setting Routes */
router.get('/', middleWares ,EWhiteBoard.index);
router.get('/selectNurArea', EWhiteBoard.selectNurArea);


router.get('/enterAdminOrEWhiteBoard',middleWares, EWhiteBoard.enterAdminOrEWhiteBoard);



//enter Admin
router.get('/loginAdmin', Index.loginAdminForm);

/* API */
router.post('/login' ,Index.login);


//admin home page
router.get('/admin/admin_index',[AdminAuthMiddleware], Index.adminIndex);


router.get('/reSelectNurArea', Index.reSelectNurArea);




router.get('/logout', Index.logout);


module.exports = router;