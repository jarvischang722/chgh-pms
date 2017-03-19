/**
 * Created by Jun on 2016/10/1.
 */
var express = require('express');
var router = express.Router();
var Doctor = require('../controllers/DoctorController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [ AuthMiddleware ,i18nMiddleware];

/* Setting Routes */
router.post('/doctorQuery', middleWares ,Doctor.doctorQuery);
router.post('/delectDoctor', middleWares ,Doctor.delectDoctor);
router.post('/updateDoctor', middleWares ,Doctor.updateDoctor);
router.get('/doctorInfoMaintain', middleWares ,Doctor.doctorInfoMaintain);
router.get('/doctorSchedulingQuery', middleWares ,Doctor.doctorSchedulingQuery);
router.get('/doctorSchedulingSet', middleWares ,Doctor.doctorSchedulingSet);
router.post('/queryDoctorScheduling', middleWares ,Doctor.queryDoctorScheduling);
router.post('/saveDoctorScheduling', middleWares ,Doctor.saveDoctorScheduling);
router.post('/getDoctorClass', middleWares ,Doctor.getDoctorClass);   //取醫師類別
router.post('/addDoctorClass', middleWares ,Doctor.addDoctorClass);   //新增醫師類別
router.post('/deleteDoctorClass', middleWares ,Doctor.deleteDoctorClass); //刪除醫師類別



module.exports = router;
