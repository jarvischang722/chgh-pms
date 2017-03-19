/**
 * Created by Eason on 2016/10/21.
 */

var express = require('express');
var router = express.Router();
var marquee   = require('../controllers/MarqueeController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [ AuthMiddleware ,i18nMiddleware];

router.get('/', middleWares ,marquee.index);
router.post('/marqueeQuery', middleWares ,marquee.getMarquee);

//跑馬燈
router.get('/testInsert', middleWares ,marquee.insertMarquee); //TODO will change to post
router.get('/testDelete', middleWares ,marquee.deleteMarquee); //TODO will change to post
router.get('/testUpdate', middleWares ,marquee.updateMarquee); //TODO will change to post


module.exports = router;