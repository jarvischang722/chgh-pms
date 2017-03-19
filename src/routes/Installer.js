/**
 * Created by Jun on 2016/10/1.
 */
var AES = require("crypto-js/aes");
var express = require('express');
var router = express.Router();
var Installer = require('../controllers/InstallerController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var middleWares = [ AuthMiddleware ];


/* Setting Routes */
router.get('/', middleWares ,Installer.index);
router.post('/installStep', middleWares ,Installer.installStep);
router.post('/checkKey', middleWares ,Installer.checkKey);
router.post('/installFunction', middleWares ,Installer.installFunction);

module.exports = router;
