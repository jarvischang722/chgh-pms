/**
 * Created by Ian on 2016/12/18.
 * 與HIS的中繼API
 */

var express = require('express');
var router = express.Router();
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [ AuthMiddleware ,i18nMiddleware];

var Patient = require('../controllers/PatientController');
var MedicalRecord = require('../controllers/MedicalRecordController');
var BedRecord = require('../controllers/BedRecordController');

//取得病人資料
router.get('/queryPatient', middleWares ,Patient.queryPatient);
//插入病人資料
router.post('/insertPatient', middleWares ,Patient.addPatient);
//更新病人資料
router.post('/updatePatient', middleWares ,Patient.updatePatient);



//插入病患過敏資料
router.post('/insertPatientAllergy', middleWares ,Patient.addPatientAllergy);
//更新病患過敏資料
router.post('/updatePatientAllergy', middleWares ,Patient.updatePatientAllergy);


//插入病患醫囑資料
router.post('/insertPatientMedicalInformation', middleWares ,Patient.addPatientMedicalInformation);
//更新病患醫囑資料
router.post('/updatePatientMedicalInformation', middleWares ,Patient.updatePatientMedicalInformation);



//插入病患待辦資料
router.post('/insertPatientTodoInformation', middleWares ,Patient.addPatientTodo);
//更新病患待辦資料
router.post('/updatePatientTodoInformation', middleWares ,Patient.updatePatientTodo);


//取得病歷資料
router.get('/queryMedicalRecord', middleWares ,MedicalRecord.queryMedicalRecord);
//插入病歷資料
router.post('/insertMedicalRecord', middleWares ,MedicalRecord.addMedicalRecord);
//更新病歷資料
router.post('/updateMedicalRecord', middleWares ,MedicalRecord.updateMedicalRecord);

//新增病房轉床紀錄 EASONTODO
router.post('/insertBedChangeRecord', middleWares ,MedicalRecord.addBedChangeRecord);
//更新病房轉床紀錄 EASONTODO
router.post('/updateBedChangeRecord', middleWares ,MedicalRecord.updateBedChangeRecord);
//新增手術資料 EASONTODO
router.post('/insertSurgery', middleWares ,MedicalRecord.addSurgery);
//更新手術資料 EASONTODO
router.post('/updateSurgery', middleWares ,MedicalRecord.updateSurgery);


//插入病床紀錄資料
router.post('/insertBedRecord', middleWares ,BedRecord.addBedRecord);




module.exports = router;