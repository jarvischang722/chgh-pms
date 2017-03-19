/**
 * Created by Jun on 2016/10/1.
 * 執行Table [doctor]的SQL 相關語法
 */
module.exports = {
    /***/
    "QRY_DOCTOR_BY_EMPLOYEE" : "SELECT * FROM doctor where doctor_no= :doctor_no ",

    /** 抓取醫生資訊 **/
    "QRY_ALL_DOCTOR" : "SELECT dr.*,dc.doctor_class_name , wz.ward_zone_name FROM doctor dr " +
        "LEFT JOIN doctor_class dc on dc.id = dr.doctor_class_id  "+
        "LEFT JOIN ward_zone  wz on wz.id = dr.ward_zone_id "+
        "where 1=1 [and dr.doctor_no= :doctor_no] [and dr.ward_zone_id = :ward_zone_id]",


    /** 新增醫生資訊 **/
    "INS_DOCTOR" : "INSERT INTO doctor SET ?",

    /** 更新醫生資訊 **/
    "UPD_DOCTOR" : "UPDATE doctor set doctor_name= :doctor_name, doctor_class_id = :doctor_class_id , enabled = :enabled, " +
        "doctor_phone = :doctor_phone , doctor_phone2 = :doctor_phone2 , doctor_phone3 = :doctor_phone3 , " +
        "doctor_home_tel = :doctor_home_tel , doctor_home_tel2 = :doctor_home_tel2 ,  " +
        "doctor_ext = :doctor_ext , remark = :remark , update_user= :update_user " +
        "Where doctor_no =:doctor_no ",

    /** 刪除醫師 **/
    "DEL_DOCTOR_BY_NO" :  "DELETE from doctor where doctor_no in(:doctor_no_list) ",

    /** **/
    "INS_DOCTOR2" : "INSERT INTO doctor (doctor_no, doctor_name, doctor_phone ,doctor_ext, doctor_class_id, update_user) VALUES ?",

    /** 醫師排班資訊 **/
    "QRY_ALL_DOCTOR_SCHEDULING" : "SELECT  ds.doctor_no , dt.doctor_name  , dt.doctor_class_id  , dc.doctor_class_name, "+
        "dst.district_name , wz.ward_zone_name  ,  wd.ward_name,   " +
        "ds.bed_id,  bd.`name` as bed_name,ds.schedule_date   "+
        "FROM `doctor_scheduling` ds "+
        "LEFT JOIN  doctor dt on dt.doctor_no = ds.doctor_no "+
        "LEFT JOIN doctor_class dc on dc.id = dt.doctor_class_id  "+
        "INNER JOIN bed  bd on  bd.id = ds.bed_id "+
        "LEFT JOIN ward wd  on  wd.id = bd.ward_id  "+
        "LEFT JOIN ward_zone wz on wz.id =  wd.ward_zone_id  "+
        "LEFT JOIN district dst on  dst.id =  wz.district_id " +
        "WHERE 1=1  [ and wz.id = :ward_zone_id] [ and schedule_date BETWEEN  :scheduling_start_date and :scheduling_end_date ] "+
        "ORDER BY schedule_date desc",

    /** 插入醫師排班資訊 **/
    "INS_DOCTOR_SCHEDULING": "INSERT INTO doctor_scheduling  (doctor_no, doctor_class_id ,bed_id ,schedule_date, update_user )   " +
        "VALUES (:doctor_no , :doctor_class_id , :bed_id ,  :schedule_date , :update_user ) "+
        "ON DUPLICATE KEY UPDATE `doctor_no` = :doctor_no , update_user=:update_user " ,

    /** 更新醫師排班資訊  **/
    "UPD_DOCTOR_SCHEDULING" : "UPDATE doctor_scheduling set doctor_no = :doctor_no  , update_user= :update_user " +
        "WHERE bed_id = :bed_id and  schedule_date = :schedule_date ",

    /** **/
    "QRY_DOCTOR_SCHEDULING_BY_ONE" : "SELECT * FROM doctor_scheduling " +
        "WHERE    bed_id = :bed_id  AND  schedule_date = :schedule_date "
};