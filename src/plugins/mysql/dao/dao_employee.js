/**
 * Created by Jun on 2016/10/16.
 * * 執行Table [employee]的SQL 相關語法
 */
module.exports = {

    "QRY_ALL_EMPLOYEE" : "SELECT e.*,u.user_role_name,a.admin_role_name FROM employee  e "+
                         "LEFT JOIN admin_role a on a.id = e.admin_role_id "+
                         "LEFT JOIN user_role u on u.id  = e.user_role_id",

    "QRY_EMPLOYEE_BY_NO" : "SELECT e.*,u.user_role_name,a.admin_role_name FROM employee  e "+
                            "LEFT JOIN admin_role a on a.id = e.admin_role_id "+
                            "LEFT JOIN user_role u on u.id  = e.user_role_id "+
                            "where e.no = :employee_no ",

    "DEL_EMPLOYEE_BY_NO" :  "DELETE from employee  where no in(:employee_no_list) ",

    "INS_EMPLOYEE" : "INSERT INTO employee SET ? ",

    "UPD_EMPLOYEE" : "UPDATE employee set name= :name,sex = :sex,user_role_id = :user_role_id,admin_role_id= :admin_role_id," +
                     "expired_date= :expired_date,is_enable = :is_enable , update_user= :update_user where  no = :employee_no  ",

    "QRY_ADMIN_ROLE" : "SELECT * FROM admin_role ",

    "QRY_USER_ROLE"  : "SELECT * FROM user_role order by id asc",

    "QRY_EMPLOYEE_BY_ACCOUNT_AND_PASSWORD" : "SELECT e.no, e.name, e.account, e.sex, e.expired_date, e.is_enable" +
    ",u.user_role_name,a.admin_role_name FROM employee e "+
    "LEFT JOIN admin_role a on a.id = e.admin_role_id "+
    "LEFT JOIN user_role u on u.id  = e.user_role_id "+
    "where e.account = :employee_account and e.password = :employee_password"

};