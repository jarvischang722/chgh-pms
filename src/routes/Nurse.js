/**
 * Created by Eason on 2016/10/26.
 */

var express = require('express');
var router = express.Router();
var nurseController  = require('../controllers/NurseController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [ AuthMiddleware ,i18nMiddleware];

/*** 畫面 ***/
router.get('/nurse_index', middleWares ,nurseController.nurseIndex); //護理師資料維護
router.get('/nurseInfoMaintain', middleWares ,nurseController.nurseInfoMaintain); //護理師資料維護
router.get('/dailyBedAssign', middleWares ,nurseController.dailyBedAssign);    //每日病房分派
router.get('/batchBedAssign', middleWares ,nurseController.batchBedAssign);    //批次病房分派
router.get('/schedulingQuery', middleWares ,nurseController.schedulingQuery);   //排班

//護士
router.get('/api/getAllNurse', middleWares ,nurseController.getAllNurse); //取得所有護理師
router.get('/api/getAllNurse2', middleWares ,nurseController.getAllNurse2); //取得所有護理師詳細資料
router.post('/api/insertNurse', middleWares ,nurseController.insertNurse); //新增護理師
router.post('/api/updateNurse', middleWares ,nurseController.updateNurseById); //編輯護理師
router.post('/api/deleteNurse', middleWares ,nurseController.deleteNurseById); //刪除護理師
router.get('/api/testSIP', middleWares ,nurseController.SIPTEST); //TODO will change to post
router.post('/api/updateNurseGroup', middleWares ,nurseController.updateNurseGroup); //更新護理師群組

//班表
router.post('/api/queryNurseSche', middleWares ,nurseController.getNurseScheByRange);
router.post('/api/getThisNurseSche', middleWares ,nurseController.getThisNurseSche);

//病房出入院記錄
router.post('/api/getMedicalRecord', middleWares ,nurseController.getMedicalRecord);

//所有病床
router.get('/api/getAllBed', middleWares ,nurseController.getAllBed);
//依病房取得所有病床 病房-病床-護理師
router.get('/api/getAllBedByWard', middleWares ,nurseController.getAllBedByWard);


//批次排班
router.post('/api/insertScheBatch', middleWares ,nurseController.insertScheBatch);

//取得編組
router.get('/api/getAllMissionGroup', middleWares ,nurseController.getAllMissionGroup);
router.get('/api/getAllFireGroup', middleWares ,nurseController.getAllFireGroup);

//跑馬燈
var EWhiteBoard = require('../controllers/EWhiteBoardController');
router.get('/api/getMarquee', middleWares ,EWhiteBoard.getMarquee);

//多DB異動test  http://localhost:8888/nurse/api/updateMultiTest
router.get('/api/updateMultiTest', middleWares ,nurseController.updateMultiTest);
//多DB異動test  http://localhost:8888/nurse/api/updateMultiTest2
router.get('/api/updateMultiTest2', middleWares ,nurseController.updateMultiTest2);

//動態建立sip連線test
router.get('/api/dcrestesip', middleWares ,nurseController.dcrestesip);

module.exports = router;