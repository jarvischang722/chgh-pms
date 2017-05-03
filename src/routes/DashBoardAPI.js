/**
 * Created by Jun on 2017/4/11.
 */
var express = require('express');
var router = express.Router();
var dashboard = require("../controllers/DashBoardAPIController");

router.post('/day_before_info' ,dashboard.day_before_info);
router.post('/exam_schedule_info' ,dashboard.exam_schedule_info);
router.post('/Get_Allergy_Data' ,dashboard.Get_Allergy_Data);
router.post('/Get_nur_Patient' ,dashboard.Get_nur_Patient);
router.post('/In_TranIn_Data' ,dashboard.In_TranIn_Data);
router.post('/nis_duty_schedule' ,dashboard.nis_duty_schedule);
router.post('/nur_bed_info' ,dashboard.nur_bed_info);
router.post('/op_schedule_info' ,dashboard.op_schedule_info);
router.post('/Out_TranOut_Data' ,dashboard.Out_TranOut_Data);
router.post('/RetrieveVS' ,dashboard.RetrieveVS);
router.post('/ShiftCollectList' ,dashboard.ShiftCollectList);
router.post('/Get_empty_bedno' ,dashboard.Get_empty_bedno);


module.exports = router;