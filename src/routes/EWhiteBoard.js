/**
 * Created by Jun on 2016/10/1.
 */
var express = require('express');
var router = express.Router();
var EWhiteBoard = require('../controllers/EWhiteBoardController');
// var AuthMiddleware = require("../middlewares/AuthMiddleware");
var middleWares = [  ];


/* Setting Routes */
router.get('/bedStatus', middleWares ,EWhiteBoard.bedStatus);
router.get('/patientInfo', middleWares ,EWhiteBoard.patientInfo);
router.get('/surgeryInfo', middleWares ,EWhiteBoard.surgeryInfo);
router.get('/todoItem', middleWares ,EWhiteBoard.todoItem);
router.get('/in_out_info', middleWares ,EWhiteBoard.in_out_info);
router.get('/dischargeNote', middleWares ,EWhiteBoard.dischargeNote);
router.get('/nurseScheduling', middleWares ,EWhiteBoard.nurseScheduling);
router.get('/doctorInfo', middleWares ,EWhiteBoard.doctorInfo);
router.get('/announcement', middleWares ,EWhiteBoard.announcement);

/* Setting api */
//出院備註
router.get('/api/getDischargeNote/', middleWares ,EWhiteBoard.getDischargeNote);



module.exports = router;
