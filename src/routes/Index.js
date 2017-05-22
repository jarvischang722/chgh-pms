/**
 * Created by Jun on 2017/4/16.
 */
var express = require('express');
var router = express.Router();
var EWhiteBoard = require('../controllers/EWhiteBoardController');
// var AuthMiddleware = require("../middlewares/AuthMiddleware");
var middleWares = [  ];


/* Setting Routes */
router.get('/', middleWares ,EWhiteBoard.index);
router.get('/selectNurArea', EWhiteBoard.selectNurArea);

module.exports = router;