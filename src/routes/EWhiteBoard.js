/**
 * Created by Jun on 2016/10/1.
 */
var express = require('express');
var router = express.Router();
var EWhiteBoard = require('../controllers/EWhiteBoardController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var middleWares = [ AuthMiddleware ];
var Patient= require('../controllers/PatientController');


/* Setting Routes */
router.get('/bedStatus', middleWares ,EWhiteBoard.bedStatus);
router.get('/patientInfo', middleWares ,EWhiteBoard.patientInfo);
router.get('/surgeryInfo', middleWares ,EWhiteBoard.surgeryInfo);
router.get('/todoItem', middleWares ,EWhiteBoard.todoItem);
router.get('/admissionDischarge', middleWares ,EWhiteBoard.admissionDischarge);
router.get('/dischargeNote', middleWares ,EWhiteBoard.dischargeNote);
router.get('/nurseScheduling', middleWares ,EWhiteBoard.nurseScheduling);
router.get('/doctorInfo', middleWares ,EWhiteBoard.doctorInfo);
router.get('/announcement', middleWares ,EWhiteBoard.announcement);


//病患資料畫面顯示
router.get('/api/Patient/', middleWares ,EWhiteBoard.patientInfo);

//病患資料
router.get('/api/BedWithPatientByWard/', middleWares ,EWhiteBoard.queryBedWithPatientByWard);

//待辦事項
router.get('/api/PatientTodoByWard/', middleWares ,EWhiteBoard.queryPatientTodoByWard);




//出院備註
router.get('/api/PatientDischargedRemark/', middleWares ,EWhiteBoard.queryPatientDischargedRemark);

//出入院紀錄
router.post('/api/InOutHospitalInfo', middleWares ,EWhiteBoard.InOutHospitalInfo);

//病房公告
router.get('/api/getAnnouncement', middleWares ,EWhiteBoard.getAnnouncement);

//取得護士排班
router.get('/api/getNurseSche', middleWares ,EWhiteBoard.getNurseSche);

//取得跑馬燈
router.get('/api/getMarquee', middleWares ,EWhiteBoard.getMarquee);


module.exports = router;
