/**
 * Created by Eason on 2016/10/21.
 */

var express = require('express');
var router = express.Router();
var announcement   = require('../controllers/AnnouncementController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [ AuthMiddleware ,i18nMiddleware];

//病床公告
router.get('/testInsert', middleWares ,announcement.insertAnnouncement); //TODO will change to post
router.get('/testDelete', middleWares ,announcement.deleteAnnouncement); //TODO will change to post
router.get('/testUpdate', middleWares ,announcement.updateAnnouncement); //TODO will change to post


module.exports = router;