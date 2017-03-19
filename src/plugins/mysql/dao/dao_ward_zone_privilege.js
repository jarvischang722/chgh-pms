/**
 * Created by Ian on 2016/11/26.
 * * 執行Table [ward_zone_privilege]的SQL 相關語法
 */
module.exports = {

    //取得所有護理站權限
    "QRY_ALL_WARD_ZONE_PRIVILEGE" :  ""
        + "SELECT * FROM `ward_zone_privilege` "
        + " "
        + "left join user_role on user_role.id = ward_zone_privilege.user_role_id "
        + " "
        + "left join ward_zone on ward_zone.id = ward_zone_privilege.ward_zone_id",

    //取得特定使用者角色的護理站權限
    "QRY_ALL_WARD_ZONE_PRIVILEGE_BY_USER_ROLE_ID" :  ""
        + "SELECT * FROM `ward_zone_privilege` "
        + " "
        + "left join user_role on user_role.id = ward_zone_privilege.user_role_id "
        + " "
        + "left join ward_zone on ward_zone.id = ward_zone_privilege.ward_zone_id"
        + " "
        + "where ward_zone_privilege.user_role_id=:user_role_id",



    //確認某使用者是否有權限看某護理站
    "QRY_WARD_ZONE_PRIVILEGE_BY_USER_ROLE_ID_AND_WARD_ZONE_ID" :  ""
        + "SELECT * FROM `ward_zone_privilege` "
        + " "
        + "left join user_role on user_role.id = ward_zone_privilege.user_role_id "
        + " "
        + "left join ward_zone on ward_zone.id = ward_zone_privilege.ward_zone_id"
        + " "
        + "where ward_zone_privilege.user_role_id=:user_role_id and ward_zone_privilege.ward_zone_id=:ward_zone_id",


    //刪除護理站by使用者角色id
    "DEL_WARD_ZONE_PRIVILEGE_BY_USER_ROLE_ID" :  ""
        + "DELETE  FROM `ward_zone_privilege` "
        + "where user_role_id=:user_role_id",



    //新增護理站權限
    "INS_WARD_ZONE_PRIVILEGE" : ""
        + "INSERT INTO ward_zone_privilege " +
        "(`user_role_id`, `ward_zone_id`,`update_user`) " +
        "VALUES (:user_role_id, :ward_zone_id, :update_user);",


    //新增系統管理者的護理站權限
    "INS_WARD_ZONE_PRIVILEGE_FOR_SYSTEM_ADMIN" : ""
        + "INSERT IGNORE INTO ward_zone_privilege " +
        "(`user_role_id`, `ward_zone_id`) " +
        "VALUES ?;"


};