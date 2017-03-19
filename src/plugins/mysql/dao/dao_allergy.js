/**
 * Created by Ian on 2016/11/05.
 * * 執行Table [allergy]的SQL 相關語法
 */
module.exports = {

    //依身份證找過敏資料
    "QRY_ALLERGY_BY_PATIENT_ID" : "SELECT * " +
        "FROM  `allergy`  " +
        "WHERE patient_person_id =:patient_person_id",





    //插入病患過敏資料
    "INS_PATIENT_ALLERGY" : ""
        + "INSERT INTO `allergy` "
        + "            (`drug_allergy`, "
        + "             `food_allergy`, "
        + "             `material_allergy`, "
        + "             `other_allergy`, "
        + "             `patient_person_id`, "
        + "             `last_update_time`, "
        + "             `update_user`) "
        + "VALUES      ( :drug_allergy, "
        + "              :food_allergy, "
        + "              :material_allergy, "
        + "              :other_allergy, "
        + "              :patient_person_id, "
        + "              :last_update_time, "
        + "              :update_user);",


    //更新病患過敏資料
    "UPD_PATIENT_ALLERGY_BY_PATIENT_ID" : ""
        + "UPDATE `allergy` "
        + "SET    "
        + "       [`drug_allergy` = :drug_allergy, ]"
        + "       [`food_allergy` = :food_allergy, ]"
        + "       [`material_allergy` = :material_allergy, ]"
        + "       [`other_allergy` = :other_allergy, ]"
        + "       `update_user` = :update_user "
        + "WHERE  `patient_person_id` = :patient_person_id"

};