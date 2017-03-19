/**
 * Created by Eason on 2016/10/26.
 * * 執行Table ["+table+"]的SQL 相關語法
 */
var table = "nurse";
var updateField = " name= :name, tel= :tel, agent1_nurse_id= :agent1_nurse_id, agent2_nurse_id= :agent2_nurse_id, agent3_nurse_id= :agent3_nurse_id" +
    ", remark= :remark, last_update_time= :last_update_time , update_user= :update_user  ";
module.exports = {
    //C
    "ADD" : "INSERT INTO "+table+" SET ? ",
    //新增排班資料
    //新增排班資料 批次排班
    "ADD_BED_ASSIGN" : "INSERT INTO nurse_bed_assignment SET ? ",
    //R
    "QRY_ALL" : "SELECT * FROM "+table,

    "QRY_BY_ID" : "SELECT * FROM "+table+" WHERE id = :id ",

    "QRY_BY_EMPLOYEE_NO" : "SELECT * FROM "+table+" WHERE employee_no = :employee_no ",

    "QRY_nurse_bed_assignment_BY_CONDITION" : "SELECT nbs.bed_id, b.name bed_name, b.ward_id, w.ward_name, nbs.nurse_no, n.name nurse_name, " +
    "nbs.class class_id, nsc.class_name, nbs.assign_date "
    +" FROM nurse_bed_assignment nbs "
    +" LEFT JOIN bed b ON nbs.bed_id = b.id"
    +" LEFT JOIN ward w ON b.ward_id = w.id"
    +" LEFT JOIN nurse n ON nbs.nurse_no = n.employee_no"
    +" LEFT JOIN nurse_sche_class nsc ON nbs.class = nsc.class_id"
    +" WHERE 1=1 "
    +"[ AND assign_date = :assign_date ] [ AND bed_id = :bed_id ] [ AND class = :class ] ",

    "QRY_SCHE_TODAY" : "SELECT nbs.bed_id, b.name bed_name, b.ward_id, w.ward_name, nbs.nurse_no, n.name nurse_name, " +
    "nbs.class class_id, nsc.class_name, fcg.group_sname fire_control_group_name, mg.group_sname mission_group_name "
    +" FROM nurse_bed_assignment nbs "
    +" LEFT JOIN bed b ON nbs.bed_id = b.id"
    +" LEFT JOIN ward w ON b.ward_id = w.id"
    +" LEFT JOIN nurse n ON nbs.nurse_no = n.employee_no"
    +" LEFT JOIN nurse_sche_class nsc ON nbs.class = nsc.class_id"
    +" LEFT JOIN fire_control_group fcg ON n.fire_control_group_id = fcg.id"
    +" LEFT JOIN mission_group mg ON n.mission_group_id = mg.id"
    +" WHERE nbs.assign_date = :today [AND w.ward_zone_id =:ward_zone_id]",

    "QRY_SCHE_BY_CONDITION" : "SELECT nbs.assign_date, nbs.bed_id, b.name bed_name, b.ward_id, w.ward_name, nbs.nurse_no, n.name nurse_name, " +
    "nbs.class class_id, nsc.class_name, n.agent1_nurse_id, n.agent2_nurse_id, n.agent3_nurse_id, n.fire_control_group_id, fcg.group_sname fire_control_group_name, n.mission_group_id, mg.group_sname mission_group_name, w.ward_zone_id, wz.ward_zone_name, n.tel "
    +" FROM nurse_bed_assignment nbs "
    +" LEFT JOIN bed b ON nbs.bed_id = b.id"
    +" LEFT JOIN ward w ON b.ward_id = w.id"
    +" LEFT JOIN ward_zone wz ON w.ward_zone_id = wz.id"
    +"  JOIN nurse n ON nbs.nurse_no = n.employee_no"
    +" LEFT JOIN nurse_sche_class nsc ON nbs.class = nsc.class_id"
    +" LEFT JOIN fire_control_group fcg ON n.fire_control_group_id = fcg.id"
    +" LEFT JOIN mission_group mg ON n.mission_group_id = mg.id"
    +" WHERE 1=1 [and nbs.assign_date = :start_date1 ] [and nbs.assign_date >= :start_date and nbs.assign_date <= :end_date] " +
    "[and nbs.nurse_no = :nurse_no] [and nbs.class = :sche_class] [and (nbs.nurse_no = :nurse_id_name or n.name = :nurse_id_name)] " +
    "[ AND w.ward_zone_id =:ward_zone_id]" +
    " ORDER BY nbs.assign_date, nbs.class, nbs.nurse_no, nbs.nurse_no, nbs.bed_id",

    "QRY_ALL_NURSE" : "SELECT n1.id, n1.employee_no, n1.name, n1.tel, " +
    "n1.agent1_nurse_id, n1.agent2_nurse_id, n1.agent3_nurse_id, n2.name agent1_name, n3.name agent2_name, n4.name agent3_name," +
    " n1.fire_control_group_id, n1.mission_group_id, fcg.group_sname fire_control_group_name, mg.group_sname mission_group_name," +
    " n1.remark FROM nurse n1"
    +" LEFT JOIN nurse n2 ON n1.agent1_nurse_id = n2.id"
    +" LEFT JOIN nurse n3 ON n1.agent2_nurse_id = n3.id"
    +" LEFT JOIN nurse n4 ON n1.agent3_nurse_id = n4.id"
    +" LEFT JOIN fire_control_group fcg ON n1.fire_control_group_id = fcg.id"
    +" LEFT JOIN mission_group mg ON n1.mission_group_id = mg.id",

    //要新增/修改到SIP的資料 CONCAT_WS('',w.ward_zone_id,b.ward_id,nbs.bed_id) as SickbedGroup '0' as RingTimer, '20' as RingType,
    "QRY_ASSIGN_FOR_SIP":"SELECT" +
    " '0' as CallType, w.ward_name  wid, '' SickbedGroup, COALESCE(pt.name,'') as SickbedGroupName, n.tel as NurseGroup," +
    "  CONCAT_WS(' ',nbs.assign_date,nsc.start_time) as StartTime, CONCAT_WS(' ',nbs.assign_date,nsc.end_time) as EndTime" +
    " FROM nurse_bed_assignment nbs" +
    " LEFT JOIN bed b ON nbs.bed_id = b.id" +
    " LEFT JOIN ward w ON b.ward_id = w.id" +
    " LEFT JOIN ward_zone wz ON w.ward_zone_id = wz.id" +
    " JOIN nurse n ON nbs.nurse_no = n.employee_no" +
    " LEFT JOIN nurse_sche_class nsc ON nbs.class = nsc.class_id " +
    " LEFT JOIN (select * from bed_record where last_update_time in (select max(last_update_time) last_update_time from bed_record group by bed_id)) br " +
    " on b.id = br.bed_id" +
    " LEFT JOIN patient pt on br.patient_person_id = pt.person_id " +
    " WHERE 1=1 and assign_date in(:assign_date_str)",

    //SIP參數設定
    "QRY_SIP_PARAMETER":"SELECT ring_last_time, ring_type FROM sip_parameter LIMIT 1",


    //取得所有任務編組
    "QRY_ALL_MISSION_GROUP":"SELECT * FROM mission_group WHERE 1=1",
    //取得所有消防編組
    "QRY_ALL_FIRE_CONTROL_GROUP":"SELECT * FROM fire_control_group WHERE 1=1",

    //U
    "UPDATE_BY_ID" : "UPDATE "+table+" SET " + updateField + " WHERE id= :id ",

    "UPDATE_BY_EMPLOYEE_NO" : "UPDATE "+table+" SET " + updateField + " WHERE employee_no= :employee_no ",
    //更新任務 消防群組
    "UPDATE_GROUP_BY_NURSE_NO" : "UPDATE "+table+" SET agent1_nurse_id=:agent1_nurse_id,agent2_nurse_id=:agent2_nurse_id,agent3_nurse_id=:agent3_nurse_id,fire_control_group_id=:fire_control_group_id, mission_group_id=:mission_group_id, last_update_time=:last_update_time, update_user=:update_user WHERE employee_no= :nurse_no ",
    //更新排班資料 by bed_id and assign_date and class
    "UPDATE_BEDASSIGN" : "UPDATE nurse_bed_assignment SET nurse_no=:nurse_no " +
    "WHERE bed_id= :bed_id and class= :class and assign_date= :assign_date ",
    //D
    "DEL_BY_ID" : "DELETE  FROM "+table+" WHERE id= :id ",

    "DEL_BY_EMPLOYEE_NO" : "DELETE  FROM "+table+" WHERE employee_no= :employee_no "
    //刪除排班資料 by bed_id and assign_date and class
    ,"DELETE_BEDASSIGN" : "DELETE FROM nurse_bed_assignment " +
    "WHERE bed_id= :bed_id and class= :class and assign_date= :assign_date "

    ,"ADD_MTEST01" : "INSERT INTO todo SET ? "
    ,"ADD_MTEST02" : "INSERT INTO todo_class SET ? "
    ,"ADD_MTEST03" : "INSERT INTO ward SET ? "
};