/**
 * Created by Ian on 2016/11/03.
 * * 執行Table [patient]的SQL 相關語法
 */
module.exports = {

    //取得病患資料by身份證或病歷號碼
    "QRY_PATIENT_BY_PERSON_ID" : "select * from patient where 1=1 [and person_id = :person_id]",
    "QRY_PATIENT_BY_PERSON_ID1" : "select * from patient where person_id = :patient_person_id",


    //插入病患資料
    "INS_PATIENT" : ""
        + "INSERT INTO `patient` "
        + "            (`name`, "
        + "             `sex`, "
        + "             `birthday_date`, "
        + "             `record_no`, "
        + "             `enter_date`, "
        + "             `person_id`, "
        + "             `age`, "
        + "             `emgy_name`, "
        + "             `emgy_phone`, "
        + "             `emgy_rel`, "
        + "             `home_tel`, "
        + "             `mobile`, "
        + "             `status`, "
        + "             `sick_level`, "
        + "             `last_update_time`, "
        + "             `update_user`) "
        + "VALUES      ( :name, "
        + "              :sex, "
        + "              :birthday_date, "
        + "              :record_no, "
        + "              :enter_date, "
        + "              :person_id, "
        + "              :age, "
        + "              :emgy_name, "
        + "              :emgy_phone, "
        + "              :emgy_rel, "
        + "              :home_tel, "
        + "              :mobile, "
        + "              :status, "
        + "              :sick_level, "
        + "              :last_update_time, "
        + "              :update_user );",


    //更新病患資料
    "UPD_PATIENT_BY_PATIENT_ID" : ""
        + "UPDATE `patient` "
        + "SET    "
        + "       [`name` = :name, ]"
        + "       [`sex` = :sex, ]"
        + "       [`birthday_date` = :birthday_date, ]"
        + "       [`record_no` = :record_no, ]"
        + "       [`enter_date` = :enter_date, ]"
        + "       [`age` = :age, ]"
        + "       [`status` = :status, ]"
        + "       [`sick_level` = :sick_level, ]"
        + "       `update_user` = :update_user "
        + "WHERE  `person_id` = :person_id"


};