/**
 * Created by Jun on 2016/10/1.
 */
var express = require('express');
var router = express.Router();
var Doctor = require('../controllers/DoctorController');
var Index = require('../controllers/IndexController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var EWhiteBoard = require('../controllers/EWhiteBoardController');

var middleWares = [AuthMiddleware ,i18nMiddleware];


/* View */
router.get('/login', middleWares ,Index.loginForm);
router.get('/selectWardzone', middleWares ,Index.selectWardZoneForm);
//更換護理站
router.get('/changeWardZone', middleWares ,Index.changeWardZone);
router.get('/', middleWares ,Index.index);




/* API */
router.post('/login', middleWares ,Index.login);

//登出
router.get('/logout', middleWares ,Index.logout);

//輸入選擇的病房區，並轉址至登入所選的要進入的系統
router.post('/selectWardzone', middleWares ,Index.selectWardZone);

//取得跑馬燈
router.get('/api/getMarquee', middleWares ,EWhiteBoard.getMarquee);



module.exports = router;
