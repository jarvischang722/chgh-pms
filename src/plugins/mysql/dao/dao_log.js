/**
 * Created by Eason on 2016/10/21.
 * * 執行Table [bed]的SQL 相關語法
 */
module.exports = {


    //新增登入紀錄
    "INS_LOG_HISTORY" : ""
        + "INSERT INTO  `pms`.`log_history` ( "
        + "`account` , "
        + "`ward_zone_id` , "
        + "`log_system_type`, "
        + "`log_type` "
        + ") "
        + "VALUES ( "
        + ":account , "
        + ":ward_zone_id , "
        + ":log_system_type,"
        + ":log_type"
        + ");",


    "CHECK_VALID_USER_DATA" : "SELECT e.no, e.name, e.account, e.sex, e.expired_date, e.is_enable" +
        ",u.id as user_role_id ,u.user_role_name,a.admin_role_name FROM employee e "+
        "LEFT JOIN admin_role a on a.id = e.admin_role_id "+
        "LEFT JOIN user_role u on u.id  = e.user_role_id "+
        "where e.account = :employee_account " +
        "and e.password = :employee_password and is_enable='Y' " +
        "and e.expired_date <= :current_date"


}
;