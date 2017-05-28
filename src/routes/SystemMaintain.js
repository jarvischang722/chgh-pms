/**
 * Created by Jun on 2016/10/1.
 */

var express = require('express');
var router = express.Router();
var sys_maintain   = require('../controllers/SystemMaintainController');
//var SIPDistributeController   = require('../controllers/SIPDistributeController');
//var EmergencyExternalDeviceController   = require('../controllers/EmergencyExternalDeviceController');

var AdminAuthMiddleware = require("../middlewares/AdminAuthMiddleware");

var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [ AuthMiddleware ,i18nMiddleware];
//var BedController = require('../controllers/BedController');
//var WardZoneController   = require('../controllers/wardZoneController');


//人員查詢API
router.post('/employeeQuery', middleWares ,sys_maintain.employeeQuery);
//刪除人員API
router.post('/employeeDelete', middleWares ,sys_maintain.employeeDelete);
//新增人員API
router.post('/employeeCreate', middleWares ,sys_maintain.employeeCreate);
//更新人員API
router.post('/employeeUpdate', middleWares ,sys_maintain.employeeUpdate);
//角色查詢API
router.post('/userRoleQuery', middleWares ,sys_maintain.userRoleQuery);
//獲取使用者角色權限API
router.post('/queryUserRolePermissions', middleWares ,sys_maintain.queryUserRolePermissions);
//更新使用者角色權限API
router.post('/updateUserRolePermissions', middleWares ,sys_maintain.updateUserRolePermissions);
//更新使用者角色權限API
router.post('/adminRoleQuery', middleWares ,sys_maintain.adminRoleQuery);

/**--------頁面------------**/
//人員管理頁面
router.get('/employeeManage', [AdminAuthMiddleware] ,sys_maintain.employeeManage);


module.exports = router;