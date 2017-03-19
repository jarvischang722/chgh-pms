/**
 * Created by Ian on 2016/11/09.
 * 病床、病房、病房區相關的route
 */
var express = require('express');
var router = express.Router();
var BedController = require('../controllers/BedController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [AuthMiddleware, i18nMiddleware];

/* Setting Routes */

//病床管理頁面
router.get('/bedSet', middleWares ,BedController.bedSet);
//
router.get('/getAllWardZone', middleWares, BedController.getAllWardZone);
/* 取得所有病房 */
router.get('/getAllWard', middleWares, BedController.getAllWard);
/* 取得所有病房資訊 */
router.post('/queryAllBedInfo', middleWares, BedController.queryAllBedInfo);


/* 插入病房API，目前被病床api取代 */
router.post('/insertWard', middleWares ,BedController.insertWard);



/* 插入病床API */
router.post('/insertBed', middleWares, BedController.insertBed);
/* 更新病床API */
router.post('/updateBed', middleWares, BedController.updateBed);
/* 刪除病床API */
router.post('/deleteBed', middleWares, BedController.deleteBed);
/* 取得病床醫生排班狀態API */
router.post('/queryBedSchedulingForDoctor', middleWares, BedController.queryBedSchedulingForDoctor);
/* 刪除病房API */
router.post('/deleteWard', middleWares ,BedController.deleteWard);



/*  取得護理站平面圖image */
router.get('/getWardZoneFloorPlanImage', middleWares, BedController.getWardZoneFloorPlanImage);

/*  取得護理站平面圖image */
router.post('/updateWardZoneFloorPlanImage', middleWares, BedController.updateWardZoneFloorPlanImage);


module.exports = router;
