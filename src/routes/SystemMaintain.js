/**
 * Created by Jun on 2016/10/1.
 */

var express = require('express');
var router = express.Router();
var sys_maintain   = require('../controllers/SystemMaintainController');
var SIPDistributeController   = require('../controllers/SIPDistributeController');
var EmergencyExternalDeviceController   = require('../controllers/EmergencyExternalDeviceController');

var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [ AuthMiddleware ,i18nMiddleware];
var BedController = require('../controllers/BedController');
var WardZoneController   = require('../controllers/wardZoneController');

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
router.get('/employeeManage', middleWares ,sys_maintain.employeeManage);
//權限管理頁面
router.get('/privilegeSet', middleWares ,sys_maintain.privilegeSet);
//登入資訊
router.get('/loginInfo', middleWares ,sys_maintain.loginInfo);
//系統參數設定
router.get('/systemParamSet', middleWares ,sys_maintain.systemParamSet);
//統計報表列印
router.get('/statisticalReportPrint', middleWares ,sys_maintain.statisticalReportPrint);
//sip裝置分派頁面
router.get('/SIPSet', middleWares ,SIPDistributeController.SIPSet);


//病房建立(一般grid)
router.get('/bedSet', middleWares ,BedController.bedSet);


//病房建立(圖形化)
router.get('/GUIBedSet', middleWares ,BedController.GUIBedSet);


//緊急外部裝置設定
router.get('/emergencyExternalSet', middleWares ,sys_maintain.emergencyExternalSet);
//護理站建立
router.get('/nursingStationEstablish', middleWares ,sys_maintain.nursingStationEstablish);
//SIP IP 建立表單
router.get('/sipEstablish', middleWares ,sys_maintain.sipEstablish);
//緊急外部裝置分派頁面
router.get('/EmergencyExternalDeviceSet', middleWares ,EmergencyExternalDeviceController.EmergencyExternalDeviceSet);




//系統版本資訊
router.get('/logInfoGet', middleWares ,sys_maintain.logInfoGet);

//產品資訊
router.get('/productInformation', middleWares ,sys_maintain.productInformation);





//取得檢查SIP的時間區間 API
router.get('/SIPGetCheckInterval', middleWares ,sys_maintain.SIPGetCheckInterval);

//確認SIP是否異常的API
router.get('/SIPCheckIsOnline', middleWares ,sys_maintain.SIPCheckIsOnline);

//sip裝置分派
router.get('/SIPDeviceDistribute', middleWares ,SIPDistributeController.querySIPDeviceDistribute);
//取得sip裝置類別API
router.get('/SIPDeviceClass', middleWares ,SIPDistributeController.querySIPDeviceClass);
//插入sip裝置分派API
router.post('/updateSIPDeviceDistribute', middleWares ,SIPDistributeController.updateSIPDeviceDistribute);
//刪除sip裝置分派API
router.post('/deleteSIPDeviceDistribute', middleWares ,SIPDistributeController.deleteSIPDeviceDistribute);




//取得緊急外部裝置種種類清單API
router.get('/EmergencyExternalDeviceClass', middleWares ,EmergencyExternalDeviceController.queryEmergencyExternalDeviceClass);

//取得緊急外部裝置API
router.get('/EmergencyExternalDevice', middleWares ,EmergencyExternalDeviceController.queryEmergencyExternalDevice);
//插入緊急外部裝置API
router.post('/insertEmergencyExternalDevice', middleWares ,EmergencyExternalDeviceController.insertEmergencyExternalDevice);
//更新緊急外部裝置API
router.post('/updateEmergencyExternalDevice', middleWares ,EmergencyExternalDeviceController.updateEmergencyExternalDevice);
//刪除緊急外部裝置API
router.post('/deleteEmergencyExternalDevice', middleWares ,EmergencyExternalDeviceController.deleteEmergencyExternalDevice);


//取得使用者角色的護理站權限
router.get('/getWardZonePrivilege', middleWares ,sys_maintain.getWardZonePrivilege);
//更新使用者角色的護理站權限
router.post('/updateWardZonePrivilege', middleWares ,sys_maintain.updateWardZonePrivilege);

//加入使用者角色API
router.post('/addUserRole', middleWares ,sys_maintain.addUserRole);
//編輯使用者角色API
router.post('/updateUserRole', middleWares ,sys_maintain.updateUserRole);
//刪除使用者角色API
router.post('/deleteUserRole', middleWares ,sys_maintain.deleteUserRole);

//更新SIP系統參數

router.post('/updateSIPParam', middleWares ,sys_maintain.updateSIPParam);
//更新HIS系統參數
router.post('/updateHISParam', middleWares ,sys_maintain.updateHISParam);
//更新點滴系統參數
router.post('/updateBitParam', middleWares ,sys_maintain.updateBitParam);



//SIP IP 清單  API
router.get('/SIPIP', middleWares ,sys_maintain.getSIPIP);
//SIP IP 新增  API
router.post('/addSIPIP', middleWares ,sys_maintain.addSIPIP);
//SIP IP 更新  API
router.post('/updateSIPIP', middleWares ,sys_maintain.updateSIPIP);
//SIP IP 刪除  API
router.post('/deleteSIPIP', middleWares ,sys_maintain.deleteSIPIP);



//護理站 清單  API
router.get('/getAllWardzone', middleWares ,WardZoneController.getAllWardzoneWithNumberAndModule);
//護理站 新增  API
//router.post('/addSIPIP', middleWares ,WardZoneController.addSIPIP);
//護理站 更新  API
router.post('/updateWardzone', middleWares ,WardZoneController.updateWardzone);
//護理站 刪除  API
router.post('/deleteWardzone', middleWares ,WardZoneController.deleteWardzone);





//護理站，取得開放的模組及最大使用人數清單  API
router.get('/wardZoneInfoGet', sys_maintain.wardZoneInfoGet);

//護理站，更新開放的模組及最大使用人數清單  API，先不給用
//router.post('/wardZoneInfoUpdate', middleWares ,sys_maintain.wardZoneInfoUpdate);


//護理站，插入護理站
router.post('/wardZoneInsert', sys_maintain.wardZoneInsert);


//護理站，更新護理站病床上限  API
router.post('/wardZoneBedInfoUpdate',sys_maintain.wardZoneBedInfoUpdate);

//護理站，更新護理站開放模組  API
router.post('/wardZoneModuleInfoUpdate', sys_maintain.wardZoneModuleInfoUpdate);

//護理站，刪除護理站API
router.post('/wardZoneModuleInfoDelete',sys_maintain.wardZoneModuleInfoDelete);

module.exports = router;