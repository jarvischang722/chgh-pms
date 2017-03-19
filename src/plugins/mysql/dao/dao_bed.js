/**
 * Created by Eason on 2016/10/21.
 * * 執行Table [bed]的SQL 相關語法
 */
module.exports = {

    //抓取護師排班的時間
    "QRY_CLASS_NAME_BY_TIME": ""
        + "SELECT * "
        + "FROM  `nurse_sche_class` "
        + "WHERE  CAST(  :time AS TIME ) "
        + "BETWEEN  `start_time` AND `end_time`"
        + "limit 1"
    ,


    //依病房顯示所有病床資料，及病床的醫生排班資料
    "QRY_BED_AND_DOCTOR_SCHEDULE_WITH_PATIENT_BY_WARD":""
        + "SELECT     bed.id                            AS bed_id, "
        + "           bed.name                          AS bed_name, "
        + "           ward.ward_name                    AS ward_name, "
        + "           ward.id                           AS ward_id, "
        + "           ward_zone.ward_zone_name          AS ward_zone_name, "
        + "           ward_zone.id                      AS ward_zone_id, "
        + "           patient.name                      AS patient_name, "
        + "           patient.record_no                 AS patient_record_no, "
        + "           patient.age                       AS patient_age, "
        + "           patient.id                        AS patient_id, "
        + "           patient.sex                       AS patient_sex, "
        + "           patient.status                    AS patient_status, "
        + "           patient.person_id                 AS patient_person_id, "
        + "           patient.sick_level                AS patient_sick_level, "
        + "           medical_record.id                 AS medical_record_id, "
        + "           medical_record.number             AS medical_record_number, "
        + "           medical_record.discharged_remark  AS medical_record_discharged_remark, "
        + "           doctor.doctor_name                AS doctor_name, "
        + "           doctor_scheduling.schedule_date   AS doctor_scheduling_schedule_date, "
        + "           doctor_scheduling.doctor_class_id AS scheduling_doctor_class_id, "
        + "           doctor_scheduling.doctor_no       AS scheduling_doctor_no, "
        + "           d2.doctor_name                    AS scheduling_doctor_name, "
        + "           dc2.doctor_class_name             AS scheduling_doctor_class_name "
        + "FROM       `bed` "
        + "LEFT JOIN  ward "
        + "ON         ward.id = bed.ward_id "
        + "LEFT JOIN  ward_zone "
        + "ON         ward.ward_zone_id = ward_zone.id "
        + "LEFT JOIN  bed_record "
        + "ON         bed.id = bed_record.bed_id "
        + "LEFT JOIN  patient "
        + "ON         bed_record.patient_person_id = patient.person_id "
        + "LEFT JOIN  medical_record "
        + "ON         medical_record.patient_person_id = patient.person_id "
        + "AND        medical_record.status = 'in' "
        + "LEFT JOIN  doctor "
        + "ON         medical_record.doctor_no = doctor.doctor_no "
        + "LEFT JOIN  doctor_class "
        + "ON         doctor_class.id = doctor.doctor_class_id "
        + "LEFT JOIN  doctor_scheduling "
        + "ON         doctor_scheduling.bed_id = bed.id "
        + "AND        doctor_scheduling.schedule_date = :current_date "
        + "LEFT JOIN  doctor d2 "
        + "ON         doctor_scheduling.doctor_no = d2.doctor_no "
        + "LEFT JOIN  doctor_class dc2 "
        + "ON         d2.doctor_class_id = dc2.id "
        + " "
        + "WHERE      ward_zone.id = :ward_zone_id "
        + "ORDER BY   bed_name ASC, "
        + "           ward_name ASC",


    //依病房顯示所有病床資料，及在上面的病患資料
    "QRY_BED_WITH_PATIENT_BY_WARD":""
        + "SELECT bed.id                           AS bed_id, "
        + "       bed.name                         AS bed_name, "
        + "       ward.ward_name                   AS ward_name, "
        + "       ward.id                          AS ward_id, "
        + "       ward_zone.ward_zone_name         AS ward_zone_name, "
        + "       ward_zone.id                     AS ward_zone_id, "
        + "       patient.name                     AS patient_name, "
        + "       patient.record_no                AS patient_record_no, "
        + "       patient.age                      AS patient_age, "
        + "       patient.id                       AS patient_id, "
        + "       patient.sex                      AS patient_sex, "
        + "       patient.status                   AS patient_status, "
        + "       patient.person_id                AS patient_person_id, "
        + "       patient.sick_level               AS patient_sick_level, "
        + "       medical_record.id                AS medical_record_id, "
        + "       medical_record.number            AS medical_record_number, "
        + "       medical_record.discharged_remark AS medical_record_discharged_remark, "
        + "       doctor.doctor_name               AS main_doctor_name, "
        + "       nurse.name                       AS scheduling_nurse_name, "
        + "       nurse_bed_assignment.assign_date AS nurse_bed_assignment_assign_date, "
        + "       nurse_bed_assignment.class       AS nurse_bed_assignment_class, "
        + "       surgery.surgery_name             AS surgery_name "
        + "FROM   `bed` "
        + "       LEFT JOIN ward "
        + "              ON ward.id = bed.ward_id "
        + "       LEFT JOIN ward_zone "
        + "              ON ward.ward_zone_id = ward_zone.id "
        + "       LEFT JOIN bed_record "
        + "              ON bed.id = bed_record.bed_id "
        + "       LEFT JOIN patient "
        + "              ON bed_record.patient_person_id = patient.person_id "
        + "       LEFT JOIN medical_record "
        + "              ON medical_record.patient_person_id = patient.person_id  and medical_record.status='in'"
        + "       LEFT JOIN doctor "
        + "              ON medical_record.doctor_no = doctor.doctor_no "
        + "       LEFT JOIN doctor_class "
        + "              ON doctor_class.id = doctor.doctor_class_id "
        + "       LEFT JOIN nurse_bed_assignment "
        + "              ON nurse_bed_assignment.bed_id = bed.id "
        + "                 AND nurse_bed_assignment.assign_date = :current_date "
        + "                 AND class = :nurse_class "
        + "       LEFT JOIN nurse "
        + "              ON nurse.employee_no = nurse_bed_assignment.nurse_no "
        + "       LEFT JOIN surgery "
        + "              ON surgery.medical_record_number = medical_record.number "
        + "WHERE  ward_zone.id = :ward_zone_id  "
        + "Group by bed_id "
        + "ORDER  BY bed_name ASC, "
        + "          ward_name ASC",


    //依病房顯示所有病床資料，及在上面的病患資料(因為醫生資料改版，所以這邊也做修正)
    "QRY_BED_WITH_PATIENT_BY_WARD_OLD":""
        + "SELECT bed.id                           AS bed_id, "
        + "       bed.name                         AS bed_name, "
        + "       ward.ward_name                   AS ward_name, "
        + "       ward.id                          AS ward_id, "
        + "       ward_zone.ward_zone_name         AS ward_zone_name, "
        + "       ward_zone.id                     AS ward_zone_id, "
        + "       patient.name                     AS patient_name, "
        + "       patient.record_no                AS patient_record_no, "
        + "       patient.age                      AS patient_age, "
        + "       patient.id                       AS patient_id, "
        + "       patient.sex                      AS patient_sex, "
        + "       patient.status                   AS patient_status, "
        + "       patient.person_id                AS patient_person_id, "
        + "       patient.sick_level               AS patient_sick_level, "
        + "       medical_record.id                AS medical_record_id, "
        + "       medical_record.number            AS medical_record_number, "
        + "       medical_record.discharged_remark AS medical_record_discharged_remark, "
        + "       doctor.doctor_name               AS doctor_name, "
        + "       nurse.name                       AS scheduling_nurse_name, "
        + "        "
        + "        "
        + "  max(case when d1.doctor_class='住院醫師' then d1.doctor_name end) resident_name, "
        + "  max(case when d2.doctor_class='實習醫師' then d2.doctor_name end) intern_name, "
        + "  max(case when d3.doctor_class='專科護理師' then d3.doctor_name end) main_nurse_name, "
        + "  max(case when d4.doctor_class='見習醫師' then d4.doctor_name end) trainee_name, "
        + "        "
        + "        "
        + "        "
        + "       doctor_scheduling.schedule_date  AS doctor_scheduling_schedule_date, "
        + "       nurse_bed_assignment.assign_date AS nurse_bed_assignment_assign_date, "
        + "       nurse_bed_assignment.class       AS nurse_bed_assignment_class, "
        + "       surgery.surgery_name             AS surgery_name "
        + "FROM   `bed` "
        + "       LEFT JOIN ward "
        + "              ON ward.id = bed.ward_id "
        + "       LEFT JOIN ward_zone "
        + "              ON ward.ward_zone_id = ward_zone.id "
        + "       LEFT JOIN bed_record "
        + "              ON bed.id = bed_record.bed_id "
        + "       LEFT JOIN patient "
        + "              ON bed_record.patient_person_id = patient.person_id "
        + "       LEFT JOIN medical_record "
        + "              ON medical_record.patient_person_id = patient.person_id  and medical_record.status='in'"
        + "       LEFT JOIN doctor "
        + "              ON medical_record.doctor_no = doctor.doctor_no "
        + "       LEFT JOIN doctor_class "
        + "              ON doctor_class.id = doctor.doctor_class_id "
        + "       LEFT JOIN doctor_scheduling "
        + "              ON doctor_scheduling.bed_id = bed.id "
        + "                 AND doctor_scheduling.schedule_date = :current_date "
        + "       LEFT JOIN nurse_bed_assignment "
        + "              ON nurse_bed_assignment.bed_id = bed.id "
        + "                 AND nurse_bed_assignment.assign_date = :current_date "
        + "                 AND class = :nurse_class "
        + "       LEFT JOIN nurse "
        + "              ON nurse.employee_no = nurse_bed_assignment.nurse_no "
        + "       LEFT JOIN doctor d1 "
        + "              ON doctor_scheduling.doctor_no = d1.doctor_no and d1.doctor_class='住院醫師' "
        + "       LEFT JOIN doctor d2 "
        + "              ON doctor_scheduling.doctor_no = d2.doctor_no and d2.doctor_class='實習醫師' "
        + "       LEFT JOIN doctor d3 "
        + "              ON doctor_scheduling.doctor_no = d3.doctor_no and d3.doctor_class='專科護理師' "
        + "       LEFT JOIN doctor d4 "
        + "              ON doctor_scheduling.doctor_no = d4.doctor_no and d4.doctor_class='見習醫師' "
        + "       LEFT JOIN surgery "
        + "              ON surgery.medical_record_number = medical_record.number "
        + "WHERE  ward_zone.id = :ward_zone_id  "
        + "Group by bed_id "
        + "ORDER  BY bed_name ASC, "
        + "          ward_name ASC",

    //醫生資訊　病房資訊
    "QRY_WARD_BED_FOR_DOCTOR": "SELECT  ds.* , bd.`name` as bed_name , wd.ward_name  " +
        "FROM doctor_scheduling  ds  " +
        "INNER JOIN bed bd on bd.id = ds.bed_id " +
        "INNER JOIN ward wd on wd.id = bd.ward_id "+
        "WHERE   ds.schedule_date >= CURDATE()  [ and ward_zone_id = :ward_zone_id ]",

    //預約轉床
    "QRY_BED_CHANGE_RECORD": "SELECT pt.`name` as patient_name ,   bd.bed_type ,pt.age , pt.sex ,bcr.change_datetime  , " +
        "wd.ward_name , bd.`name` as bed_name " +
        "from bed_change_record  bcr " +
        "INNER JOIN patient pt on pt.person_id = bcr.patient_person_id " +
        "INNER JOIN bed bd on bd.id = bcr.new_bed_id " +
        "INNER JOIN ward wd on wd.id = bd.ward_id " +
        "WHERE bcr.change_datetime  >=  :searchStartDate and bcr.change_datetime  <= :searchEndDate ",
    //依病房顯示所有病床資料
    "QRY_ALL_BED": "select b.id bed_id, b.name bed_name, b.bed_type, w.id ward_id, w.ward_zone_id, w.ward_name," +
        " wz.id ward_zone_id, wz.district_id, wz.ward_zone_name, d.district_name" +
        " from bed b" +
        " join ward w on b.ward_id = w.id" +
        " join ward_zone wz on w.ward_zone_id = wz.id" +
        " join district d on wz.district_id = d.id" +
        " WHERE 1=1 [bcr.change_datetime  >=  :searchStartDate bcr.change_datetime  <= :searchEndDate] [AND w.ward_zone_id =:ward_zone_id] " +
        " order by d.id, wz.id, w.id, b.id",


    "QRY_ALL_BED_WARD": "SELECT  bd.id as bed_id , bd.name as bed_name  ,  wd.id as ward_id ,wd.ward_name   " +
        "FROM `bed` bd " +
        "INNER JOIN  ward wd on wd.id  = bd.ward_id " +
        "WHERE 1=1 [and wd.id = :ward_id ] [and ward_zone_id = :ward_zone_id ] " +
        "order by   ward_name asc,  bd.name asc ",

    //取得所有病床by病房&病人
    "QRY_ALL_BED_BY_WARD": "select b.id bed_id, b.name bed_name, b.bed_type, w.id ward_id, w.ward_zone_id, w.ward_name," +
        "wz.id ward_zone_id, wz.district_id, wz.ward_zone_name, d.district_name, br.patient_person_id," +
        " pt.name patient_name, pt.sex" +
        " from bed b" +
        " join ward w on b.ward_id = w.id" +
        " join ward_zone wz on w.ward_zone_id = wz.id" +
        " join district d on wz.district_id = d.id" +
        " left join bed_record br on b.id = br.bed_id " +
        " left join patient pt on br.patient_person_id = pt.person_id " +
        " where 1=1 [AND w.ward_zone_id =:ward_zone_id]" +
        " order by d.id, wz.id, w.id, b.id"

    //新增病房轉床記錄
    ,"ADD_BED_CHANGE_RECORD" : "INSERT INTO bed_change_record SET ? "
    //更新病房轉床記錄
    ,"UPDATE_BED_CHANGE_RECORD" : "UPDATE bed_change_record SET patient_person_id=:patient_person_id,bed_id=:bed_id,new_bed_id=:new_bed_id,change_datetime=:change_datetime," +
    " last_update_time=:last_update_time, update_user=:update_user " +
    " WHERE id= :id "
    //取得病床id
    ,"GET_BED_ID" : " select b.id id from bed b join ward w on b.ward_id = w.id where 1=1 [ AND b.name=:bed_name and w.ward_name=:ward_name ]"

    ,"QRY_BED_ID_BY_NAME": "SELECT id " +
        "FROM `bed` " +
        "WHERE 1=1 [and name=:name ]  [and ward_id=:ward_id ]" +
        "limit 1",


    "QRY_WARD_ID_BY_NAME": "SELECT id " +
        "FROM `ward` " +
        "WHERE 1=1 [and ward_name=:ward_name ] " +
        "limit 1"

}
;