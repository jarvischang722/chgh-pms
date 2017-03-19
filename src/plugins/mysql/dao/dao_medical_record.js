/**
 * Created by Ian on 2016/10/26.
 * * 執行Table [medical_record]的SQL 相關語法
 */
module.exports = {
    // 病人的病歷資料
    "QRY_ALL_MEDICAL_RECORD" : "SELECT * FROM medical_record where 1=1 [and patient_person_id=:patient_person_id]",

    //出院備註項目
    "QRY_ALL_DISCHARGED_REMARK_ITEM" : "SELECT * FROM discharge_note_item",

    //取得特定日期出院的病患出院備註
    "QRY_ALL_DISCHARGED_REMARK_BY_DATE" :
        "SELECT "+
            "bed.name as bed_name, "+
            "patient.name as patient_name, "+
            "patient.sex as patient_sex, "+
            "patient.age as patient_age, "+
            "patient.birthday_date as patient_birthday_date, "+
            "medical_record.* "+
            "FROM `medical_record` "+
            "inner join patient on  medical_record.patient_id =  patient.id "+
            "inner join bed_record on  bed_record.patient_id =  patient.id "+
            "inner join bed on  bed_record.bed_id = bed.id " +
            "WHERE medical_record.discharged_remark != ''  " +
            "AND medical_record.expect_discharged_date = :expect_discharged_date "+
            "AND bed.ward_id = :ward_id "
    ,



    //取得所有病人出院備註資料
    "QRY_ALL_DISCHARGED_REMARK_WITH_NO_DISCHARGED" :
        "SELECT "+
            "bed.name as bed_name, "+
            "patient.name as patient_name, "+
            "patient.sex as patient_sex, "+
            "patient.age as patient_age, "+
            "patient.birthday_date as patient_birthday_date, "
            + "       ward.ward_name                AS ward_name, "
            + "       ward.id                       AS ward_id, "
            + "       ward_zone.ward_zone_name      AS ward_zone_name, "
            + "       ward_zone.id                  AS ward_zone_id , "+
            "medical_record.* "+
            "FROM `medical_record` "+
            "inner join patient on  medical_record.patient_person_id =  patient.person_id "+
            "inner join bed_record on  bed_record.patient_person_id =  patient.person_id "+
            "inner join bed on  bed_record.bed_id = bed.id " +
             "       LEFT JOIN ward "
            + "              ON ward.id = bed.ward_id "
            + "       LEFT JOIN ward_zone "
            + "              ON ward.ward_zone_id = ward_zone.id "+
            "WHERE medical_record.discharged_remark != ''  "
    ,



    //取得某日要出院的病人的出院備註資料
    "QRY_DISCHARGED_REMARK_WITH_NO_DISCHARGED_BY_DATE" :
        "SELECT "+
            "bed.name as bed_name, "+
            "patient.name as patient_name, "+
            "patient.sex as patient_sex, "+
            "patient.age as patient_age, "+
            "patient.birthday_date as patient_birthday_date, "+

            "ward.ward_name AS ward_name, " +
            "ward.id AS ward_id, " +
            "ward_zone.ward_zone_name AS ward_zone_name, " +
            "ward_zone.id AS ward_zone_id, " +

            "medical_record.* "+
            "FROM `medical_record` "+
            "LEFT join patient on  medical_record.patient_person_id =  patient.person_id "+
            "LEFT join bed_record on  bed_record.patient_person_id =  patient.person_id "+
            "LEFT join bed on  bed_record.bed_id = bed.id " +

            "LEFT join ward on ward.id = bed.ward_id " +
            "LEFT join ward_zone ON ward.ward_zone_id = ward_zone.id " +

            "WHERE 1=1 " +
            " [AND medical_record.expect_discharged_date = :expect_discharged_date]  " +
            " [AND ward_zone.id=:ward_zone_id] " +
            " AND medical_record.discharged_remark != ''"
    ,


    //取得病人出院備註資料，依特定的病歷id
    "QRY_DISCHARGED_REMARK_WITH_NO_DISCHARGED_BY_MEDICAL_RECORD_ID" :
        "SELECT "+
        "bed.name as bed_name, "+
        "patient.name as patient_name, "+
        "patient.sex as patient_sex, "+
        "patient.age as patient_age, "+
        "patient.birthday_date as patient_birthday_date, "+
        "max(medical_record.last_update_time) as medical_record_last_update_datetime, "+
        "max(medical_record.id) as medical_record_id, "+
             "       ward.ward_name                AS ward_name, "
            + "       ward.id                       AS ward_id, "
            + "       ward_zone.ward_zone_name      AS ward_zone_name, "
            + "       ward_zone.id                  AS ward_zone_id , "+
        "medical_record.* "+
        "FROM `medical_record` "+
        "inner join patient on  medical_record.patient_person_id =  patient.person_id "+
        "inner join bed_record on  bed_record.patient_person_id =  patient.person_id "+
        "inner join bed on  bed_record.bed_id = bed.id " +
            "       LEFT JOIN ward "
            + "              ON ward.id = bed.ward_id "
            + "       LEFT JOIN ward_zone "
            + "              ON ward.ward_zone_id = ward_zone.id "+
        "WHERE medical_record.discharged_remark !='' " +
        "AND medical_record.id=:medical_record_id " +
        "GROUP BY patient.person_id "

    ,

    //取得病人出院備註資料，依特定的病歷id
    "UPDATE_DISCHARGED_REMARK_BY_MEDICAL_RECORD_ID" :
        "UPDATE medical_record SET discharged_remark=:discharged_remark, update_user=:update_user " +
            "where id= :patient_medical_record_id"
    ,


    "oUPDATE_PATIENT_TODO_RECORD_STATUS" : "UPDATE patient_todo_record SET is_finish= :is_finish where id= :patient_todo_record_id",

    "oINS_PATIENT_TODO_RECORD" : "INSERT INTO patient_todo_record (medical_record_id,todo_id,todo_date, is_finish)  VALUES ?",

    "oDEL_PATIENT_TODO_RECORD" : "DELETE FROM patient_todo_record where id= :patient_todo_record_id",


    //取得出入院紀錄
    "QRY_IN_OUT_HOSPITAL" :
        "SELECT mr.`status`, mr.number mr_number, mr.in_out_datetime ,pt.`name`,pt.record_no, pt.`status` as diagnosis , pt.age, pt.sex, bd.`name` as bed_no , bd.bed_type, " +
        " CASE mr.status when 'in' THEN '入院' else '出院' end status_name " +
        "FROM medical_record mr " +
        "LEFT JOIN  patient pt  on  pt.person_id =  mr.patient_person_id "+
        "LEFT JOIN  bed_record br on br.patient_person_id = mr.patient_person_id "+
        "LEFT JOIN  bed  bd  on  bd.id = br.bed_id " +
        "where 1=1 [and bd.id=:bed_id][and in_out_datetime >= :searchStartDate and in_out_datetime <= :searchEndDate ] ",



    //更新病患病歷
    "UPD_MEDICAL_RECORD_BY_PATIENT_ID" : ""
        + "UPDATE `medical_record` "
        + "SET    "
        + "       [`number` = :number, ]"
        + "       [`doctor_no` = :doctor_no, ]"
        + "       [`discharged_remark` = :discharged_remark, ]"
        + "       [`status` = :status, ]"
        + "       [`expect_discharged_date` = :expect_discharged_date, ]"
        + "       [`in_out_datetime` = :in_out_datetime, ]"
        + "       `update_user` = :update_user "
        + "WHERE  `patient_person_id` = :patient_person_id",



    //插入病患病歷
    "INS_MEDICAL_RECORD" : ""
        + "INSERT INTO `medical_record` "
        + "            (`number`, "
        + "             `doctor_no`, "
        + "             `discharged_remark`, "
        + "             `status`, "
        + "             `expect_discharged_date`, "
        + "             `in_out_datetime`, "
        + "             `patient_person_id`, "
        + "             `update_user`) "
        + "VALUES      ( :number, "
        + "              :doctor_no, "
        + "              :discharged_remark, "
        + "              :status, "
        + "              :expect_discharged_date, "
        + "              :in_out_datetime, "
        + "              :patient_person_id, "
        + "              :update_user );"





};