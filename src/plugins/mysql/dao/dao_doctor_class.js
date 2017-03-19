/**
 * Created by Jun on 2016/12/4.
 * 醫師類別相關資料表
 */

module.exports = {
    /** 抓取醫生類別 **/
    "QRY_DOCTOR_CLASS" : "SELECT dc.* FROM doctor_class dc ",

    /** 異動醫師類別 **/
    "INS_DOCTOR_CLASS" : "INSERT INTO  doctor_class (id,doctor_class_name,update_user) " +
                         "VALUES (:doctor_class_id , :doctor_class_name, :update_user  ) "+
                         "ON DUPLICATE KEY UPDATE `doctor_class_name` = :doctor_class_name , update_user= :update_user" ,

    /** 刪除醫生類別 **/
    "DEL_DOCTOR_CLASS" : "DELETE FROM doctor_class  WHERE  id in(:doctor_class_no_list)   ",
};