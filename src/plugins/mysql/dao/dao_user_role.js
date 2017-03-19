/**
 * Created by Ian on 2016/11/27.
 * * 執行Table [user_role]的SQL 相關語法
 */
module.exports = {

    "INS_ROLE_NAME" : ""
        + "INSERT INTO  `user_role` ( "
        + "`user_role_name` ,"
        + "`update_user` "
        + ") "
        + "VALUES ( "
        + ":user_role_name,"
        + ":update_user"
        + ");",


    "UPD_ROLE_NAME" : ""
        + "UPDATE  `user_role` SET  `user_role_name` =  :user_role_name, update_user=:update_user  WHERE  `user_role`.`id` =:user_role_id;",


    "DEL_ROLE_NAME" : ""
        + "DELETE FROM `user_role` WHERE `user_role`.`id` = :user_role_id"



}
;