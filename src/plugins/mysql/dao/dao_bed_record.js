/**
 * Created by Ian-PC on 2016/12/22.
 * 執行Table [todo_information]的SQL 相關語法
 */


module.exports = {

    //依身份證找該病患在哪個床上
    "QRY_BED_RECORD_BY_PATIENT_ID" : "SELECT * " +
        "FROM  `bed_record`  " +
        "WHERE 1=1 [ AND patient_person_id =:patient_person_id]",


    //看當前病床是否有住人
    "QRY_BED_IS_HAVE_PATIENT" : "SELECT * " +
        "FROM  `bed_record`  " +
        "left join  `medical_record` on  `bed_record`.`patient_person_id` = `medical_record`.`patient_person_id` " +
        "WHERE 1=1 [ AND bed_record.bed_id =:bed_id] " +
        "order by  `bed_record`.`last_update_time` desc " +
        "limit 1",


    //插入病床紀錄
    "INS_BED_RECORD" : ""
        + "INSERT INTO `bed_record` "
        + "            (`patient_person_id`, "
        + "             `bed_id`, "
        + "             `update_user`) "
        + "VALUES      ( :patient_person_id, "
        + "              :bed_id, "
        + "              :update_user);",


    //更新病床紀錄
    "UPD_BED_RECORD_BY_PATIENT_ID" : ""
        + "UPDATE `bed_record` "
        + "SET    "
        + "       [`bed_id` = :bed_id, ]"
        + "       `update_user` = :update_user "
        + "WHERE  `patient_person_id` = :patient_person_id"



}
