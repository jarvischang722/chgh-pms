/**
 * Created by Ian-PC on 2016/12/22.
 * 執行Table [todo_information]的SQL 相關語法
 */


module.exports = {

    //依身份證找待辦事項資料
    "QRY_TODO_BY_PATIENT_ID" : "SELECT * " +
        "FROM  `todo_information`  " +
        "WHERE patient_person_id =:patient_person_id",



    //插入病患醫囑資料
    "INS_todo_information" : ""
        + "INSERT INTO `todo_information` "
        + "            (`todo_content`, "
        + "             `patient_person_id`, "
        + "             `update_user`) "
        + "VALUES      ( :todo_content, "
        + "              :patient_person_id, "
        + "              :update_user);",


    //更新病患醫囑資料
    "UPD_PATIENT_todo_information_BY_PATIENT_ID" : ""
        + "UPDATE `todo_information` "
        + "SET    "
        + "       [`todo_content` = :todo_content, ]"
        + "       `update_user` = :update_user "
        + "WHERE  `patient_person_id` = :patient_person_id"



}
