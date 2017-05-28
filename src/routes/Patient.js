/**
 * Created by Ian on 2016/10/25.
 */

var express = require('express');
var router = express.Router();
var Patient= require('../controllers/PatientController');

var AdminAuthMiddleware = require("../middlewares/AdminAuthMiddleware");


var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [ AuthMiddleware ,i18nMiddleware];


/**
 *
 * Ian Does
 */
//病人待辦事項
router.get('/PatientTodoRecord/', middleWares ,Patient.queryPatientTodoRecord);
router.post('/PatientTodoRecord/add', middleWares ,Patient.addPatientTodoRecord);
router.put('/PatientTodoRecord/update', middleWares ,Patient.updatePatientTodoRecordStatus);
router.delete('/PatientTodoRecord/delete', middleWares ,Patient.deletePatientTodoRecord);


//病人出院備註
router.get('/PatientDischargedRemark/', middleWares ,Patient.queryPatientDischargedRemark);
router.put('/PatientDischargedRemark/update', middleWares ,Patient.updatePatientDischargedRemark);
router.delete('/PatientDischargedRemark/delete', middleWares ,Patient.deletePatientDischargedRemark);

//病人出院備註項目
router.get('/PatientDischargedRemarkItems/', middleWares ,Patient.queryPatientDischargedRemarkItems);


/**
 * 電子白板的病床那頁會用到
 */

//病人醫囑資料
router.get('/PatientMedicalInformation/', middleWares ,Patient.queryPatientMedicalInformation);

//病人過敏資料
router.get('/PatientAllergy/', middleWares ,Patient.queryPatientAllergy);

//病人待辦資料
router.get('/PatientTodoInformation/', middleWares ,Patient.queryPatientTodo);


/**
 * 下面兩個是電子白板用
 */

//統計當日所有病人的待辦事項資訊
router.get('/allPatientTodoItemCount', middleWares ,Patient.queryPatientTodoCountRecord);

//統計特定時間，特定病人的待辦事項資訊
router.get('/patientTodoItemCount', middleWares ,Patient.queryPatientTodoCount);



/**
 * Views
 */
router.get('/patientTodoItem', [AdminAuthMiddleware] ,Patient.patientTodoItem);


/**
 * Eason does
 *
 */
//待辦事項類別
router.get('/patientAllTodoItemClass', middleWares ,Patient.queryPatientTodoClass);

//待辦事項項目
router.get('/patientAllTodoItem', middleWares ,Patient.queryPatientTodoItem);


//api用，插入/更新病人資料
//router.get('/employeeManage', middleWares ,sys_maintain.employeeManage);
//router.post('/employeeQuery', middleWares ,sys_maintain.employeeQuery);
//router.post('/employeeDelete', middleWares ,sys_maintain.employeeDelete);
//router.post('/employeeCreate', middleWares ,sys_maintain.employeeCreate);
//router.post('/employeeUpdate', middleWares ,sys_maintain.employeeUpdate);
//router.post('/userRoleQuery', middleWares ,sys_maintain.userRoleQuery);
//router.post('/adminRoleQuery', middleWares ,sys_maintain.adminRoleQuery);

module.exports = router;