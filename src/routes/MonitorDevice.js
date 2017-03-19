/**
 * Created by Jun on 2016/10/1.
 * 監控裝置相關
 */
var express = require('express');
var router = express.Router();
var MonitorDevice = require('../controllers/MonitorDeviceController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var middleWares = [ AuthMiddleware ,i18nMiddleware];



//點滴裝置分派
router.get('/bitDeviceAssign', middleWares ,MonitorDevice.bitDeviceAssign);
//點滴參數設定
router.get('/bitParamSet', middleWares ,MonitorDevice.bitParamSet);
//即時點滴數據查詢
router.get('/immediateBitData', middleWares ,MonitorDevice.immediateBitData);
//統計報表查詢
router.get('/statisticalReport', middleWares ,MonitorDevice.statisticalReport);

//取得點滴裝置分派API
router.post('/queryBitDeviceAssign' , MonitorDevice.queryBitDeviceAssign);

//儲存點滴裝置分派
router.post('/saveBitDeviceAssign' , MonitorDevice.saveBitDeviceAssign);

//點滴種類參數 清單  API
router.get('/queryBitClass', middleWares ,MonitorDevice.getBitClass);
//點滴種類參數 新增  API
router.post('/addBitClass', middleWares ,MonitorDevice.addBitClass);
//點滴種類參數 更新  API
router.post('/updateBitClass', middleWares ,MonitorDevice.updateBitClass);
//點滴種類參數 刪除  API
router.post('/deleteBitClass', middleWares ,MonitorDevice.deleteBitClass);


//點滴輸液管種類 清單  API
router.post('/queryBitPipeClass', MonitorDevice.queryBitPipeClass);
//點滴輸液管種類 新增  API
router.post('/addBitPipeClass', middleWares ,MonitorDevice.addBitPipeClass);
//點滴輸液管種類 更新  API
router.post('/updateBitPipeClass', middleWares ,MonitorDevice.updateBitPipeClass);
//點滴輸液管種類 刪除  API
router.post('/deleteBitPipeClass', middleWares ,MonitorDevice.deleteBitPipeClass);

//點滴參數設定檔
router.get('/api/getBitSet', middleWares ,MonitorDevice.getBitSet);
//修改點滴參數設定檔
router.post('/api/updateBitSet', middleWares ,MonitorDevice.updateBitSet);
//個別點滴參數設定檔
router.post('/api/getBitBedConfig', middleWares ,MonitorDevice.getBitBedConfig);

//修改個別點滴參數設定檔
router.post('/api/updateBitBedConfig', middleWares ,MonitorDevice.updateBitBedConfig);

module.exports = router;