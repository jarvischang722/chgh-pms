/**
 * Created by Jun on 2016/10/1.
 */
var express = require('express');
var router = express.Router();
var EWhiteBoard = require('../controllers/EWhiteBoardController');
// var AuthMiddleware = require("../middlewares/AuthMiddleware");
var middleWares = [  ];


/* Setting Routes */
//router.get('/bedStatus', middleWares ,EWhiteBoard.bedStatus);
router.get('/patientInfo', middleWares ,EWhiteBoard.patientInfo);
router.get('/surgeryInfo', middleWares ,EWhiteBoard.surgeryInfo);
router.get('/checkTreatment', middleWares ,EWhiteBoard.checkTreatment);
router.get('/todoItem', middleWares ,EWhiteBoard.todoItem);
router.get('/in_out_info', middleWares ,EWhiteBoard.in_out_info);
router.get('/dischargeNote', middleWares ,EWhiteBoard.dischargeNote);
router.get('/nurseScheduling', middleWares ,EWhiteBoard.nurseScheduling);
router.get('/doctorInfo', middleWares ,EWhiteBoard.doctorInfo);
router.get('/doctorOnDuty', middleWares ,EWhiteBoard.doctorOnDuty);
router.get('/announcement', middleWares ,EWhiteBoard.announcement);

/* Setting api */
//出院備註
router.get('/api/getDischargeNote/', middleWares ,EWhiteBoard.getDischargeNote);

//手術資訊
router.post('/api/qrySurgeryInfo/', middleWares ,EWhiteBoard.qrySurgeryInfo);

//護理師排班
router.get('/api/getNurseSche/', middleWares ,EWhiteBoard.getNurseSche);

//醫師值班
router.post('/api/getDoctorOnDuty/', middleWares ,EWhiteBoard.getDoctorOnDuty);

//病患資訊
router.post('/api/fetchAllPatientInfo/', middleWares ,EWhiteBoard.fetchAllPatientInfo);

//取得過敏資料
router.post('/api/fetchAllergyData/', middleWares ,EWhiteBoard.fetchAllergyData);

//取得單一病患資訊
router.post('/api/fetchSinglePatientInfo/', middleWares ,EWhiteBoard.fetchSinglePatientInfo);

//取得前一日動態表資料
router.post('/api/fetchDayBeforeInfo/', middleWares ,EWhiteBoard.fetchDayBeforeInfo);

//取得床位數資訊
router.post('/api/fetchNurBedInfo/', middleWares ,EWhiteBoard.fetchNurBedInfo);

//取得入院
router.post('/api/fetchInTranInfo/', middleWares ,EWhiteBoard.fetchInTranInfo);

//取得出院
router.post('/api/fetchOutTranInfo/', middleWares ,EWhiteBoard.fetchOutTranInfo);

//檢查治療
router.post('/api/fetchExamScheduleInfo/', middleWares ,EWhiteBoard.fetchExamScheduleInfo);

//醫師收治
router.post('/api/fetchDoctorInfo/', middleWares ,EWhiteBoard.fetchDoctorInfo);



module.exports = router;
