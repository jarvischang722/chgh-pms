/**
 * Created by Ian on 2016/11/05.
 * * 執行Table [medical_information]的SQL 相關語法
 */
module.exports = {

    //依身份證找醫囑資料
    "QRY_MEDICAL_INFORMATION_BY_PATIENT_ID" : "SELECT * " +
        "FROM  `medical_information`  " +
        "WHERE patient_person_id =:patient_person_id",


    //插入病患醫囑資料
    "INS_MEDICAL_INFORMATION" : ""
        + "INSERT INTO `medical_information` "
        + "            (`medical_code`, "
        + "             `medical_name`, "
        + "             `expected_start_date`, "
        + "             `life_signs`, "
        + "             `treatment`, "
        + "             `nursing_care`, "
        + "             `piping`, "
        + "             `change_drug`, "
        + "             `other_medical_advice`, "
        + "             `ct_mri`, "
        + "             `patient_person_id`, "
        + "             `emergency_lab`, "
        + "             `update_user`) "
        + "VALUES      ( :medical_code, "
        + "              :medical_name, "
        + "              :expected_start_date, "
        + "              :life_signs, "
        + "              :treatment, "
        + "              :nursing_care, "
        + "              :piping, "
        + "              :change_drug, "
        + "              :other_medical_advice, "
        + "              :ct_mri, "
        + "              :patient_person_id, "
        + "              :emergency_lab, "
        + "              :update_user);",


    //更新病患醫囑資料
    "UPD_PATIENT_MEDICAL_INFORMATION_BY_PATIENT_ID" : ""
        + "UPDATE `medical_information` "
        + "SET    "
        + "       [`medical_code` = :medical_code, ]"
        + "       [`medical_name` = :medical_name, ]"
        + "       [`expected_start_date` = :expected_start_date, ]"
        + "       [`life_signs` = :life_signs, ]"
        + "       [`treatment` = :treatment, ]"
        + "       [`nursing_care` = :nursing_care, ]"
        + "       [`piping` = :piping, ]"
        + "       [`change_drug` = :change_drug, ]"
        + "       [`other_medical_advice` = :other_medical_advice, ]"
        + "       [`ct_mri` = :ct_mri, ]"
        + "       [`emergency_lab` = :emergency_lab, ]"
        + "       `update_user` = :update_user "
        + "WHERE  `patient_person_id` = :patient_person_id"

};