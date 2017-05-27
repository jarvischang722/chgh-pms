/**
 * Created by Jun on 2016/10/16.
 */
var express = require('express');
var router = express.Router();
var other_func   = require('../controllers/OtherFuncController');
var AuthMiddleware = require("../middlewares/AuthMiddleware");
var i18nMiddleware = require("../middlewares/i18nMiddleware");
var todoController  = require('../controllers/TodoController');
var announcementController   = require('../controllers/AnnouncementController');
var marqueeController   = require('../controllers/MarqueeController');
var middleWares = [ AuthMiddleware ,i18nMiddleware];

var SIPDistributeController   = require('../controllers/SIPDistributeController');
var timePeriodController   = require('../controllers/timePeriodController');
var firemissionController   = require('../controllers/firemissionController');

/*** 畫面 ***/
//代辦事項片語管理
router.get('/todoPhrase', middleWares ,other_func.todoPhrase);
//病房公告維護
router.get('/bedAnnounceMaintain', middleWares ,other_func.bedAnnounceMaintain);
//跑馬燈訊息維護
router.get('/marqueeMsgMaintain', middleWares ,other_func.marqueeMsgMaintain);
//班別時段設定
router.get('/shiftTimePeriodSet', middleWares ,other_func.shiftTimePeriodSet);
//醫師別維護
router.get('/doctorClassMaintain', middleWares ,other_func.doctorClassMaintain);
//通聯記錄查詢
router.get('/communiRecord', middleWares ,other_func.communiRecord);
//消防任務維護
router.get('/firemissionMaintain', middleWares ,other_func.firemissionMaintain);



/*** 代辦事項片語管理 ***/
//取得所有片語
router.get('/api/getAllTodo', middleWares ,todoController.getAllTodo);  //API SPEC DONE
//更新片語
router.post('/api/updateTodo', middleWares ,todoController.updateTodo); //API SPEC DONE
//刪除片語
router.post('/api/deleteTodo', middleWares ,todoController.deleteTodo); //API SPEC DONE
//新增片語
router.post('/api/insertTodo', middleWares ,todoController.insertTodo); //API SPEC DONE
//取得所有片語類別
router.get('/api/getTodoClass', middleWares ,todoController.getTodoClass);  //API SPEC DONE
//更新片語類別
router.post('/api/updateTodoClass', middleWares ,todoController.updateTodoClass);   //API SPEC DONE
//刪除片語類別
router.post('/api/deleteTodoClass', middleWares ,todoController.deleteTodoClass);   //API SPEC DONE
//新增片語類別
router.post('/api/insertTodoClass', middleWares ,todoController.insertTodoClass);   //API SPEC DONE

/*** 病房公告管理 ***/
router.get('/api/getAllAnnouncement', middleWares ,announcementController.getAllAnnouncement);  //API SPEC DONE
router.post('/api/insertAnnouncement', middleWares ,announcementController.insertAnnouncement); //API SPEC DONE
router.post('/api/deleteAnnouncement', middleWares ,announcementController.deleteAnnouncement); //API SPEC DONE
router.post('/api/updateAnnouncement', middleWares ,announcementController.updateAnnouncement); //API SPEC DONE

/*** 跑馬燈維護 ***/
router.get('/api/getAllMarquee', middleWares ,marqueeController.getAllMarquee);  //API SPEC DONE
router.post('/api/insertMarquee', middleWares ,marqueeController.insertMarquee); //API SPEC DONE
router.post('/api/deleteMarquee', middleWares ,marqueeController.deleteMarquee); //API SPEC DONE
router.post('/api/updateMarquee', middleWares ,marqueeController.updateMarquee); //API SPEC DONE



/*** 時段 ***/
router.get('/api/getAllTimePeriod', middleWares ,timePeriodController.getAllTimePeriod); //API SPEC DONE
router.post('/api/insertTimePeriod', middleWares ,timePeriodController.insertTimePeriod); //API SPEC DONE
router.post('/api/deleteTimePeriod', middleWares ,timePeriodController.deleteTimePeriod); //API SPEC DONE
router.post('/api/updateTimePeriod', middleWares ,timePeriodController.updateTimePeriod); //API SPEC DONE

/*** 消防/任務分組***/
router.post('/api/getAllFireMission', middleWares ,firemissionController.getAllFireMission); //API SPEC DONE
router.post('/api/insertFireMission', middleWares ,firemissionController.insertFireMission); //API SPEC DONE
router.post('/api/deleteFireMission', middleWares ,firemissionController.deleteFireMission); //API SPEC DONE
router.post('/api/updateFireMission', middleWares ,firemissionController.updateFireMission); //API SPEC DONE



/*** 通聯紀錄查詢 ***/
router.get('/api/getAllSIPRecord', middleWares ,SIPDistributeController.getAllSIPRecord);



module.exports = router;