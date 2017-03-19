/**
 * Created by Jun on 2016/11/2.
 */

var express = require('express');
var router = express.Router();
var Surgery = require('../controllers/SurgeryController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [ AuthMiddleware ,i18nMiddleware];

/* Setting Routes */
router.post('/surgeryQuery', middleWares ,Surgery.surgeryQuery);

module.exports = router;
