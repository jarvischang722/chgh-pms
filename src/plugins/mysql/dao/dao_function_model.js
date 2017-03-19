/**
 * Created by Jun on 2016/10/1.
 * 執行Table [user_key]的SQL 相關語法
 */
module.exports = {

    "INS_FUNCTION" : "INSERT INTO function_model (model_name,model_english_name,isEnable)  VALUES ?" ,

    "QRY_USER_ROLE_FUNCS_PERMISN" : "select  ur.id as user_role_id , user_role_name ,fm.id as function_model_id , fm.model_name , fm.model_english_name ," +
                                     "fs.id as function_sub_id,  fs.function_sub_name  ,  fp.`read` ,fp.`create` , fp.`delete` , fp.`update` "+
                                    "from  function_sub fs "+
                                    "INNER JOIN function_model fm  on fm.id = fs.function_model_id "+
                                    "INNER JOIN function_privilege fp on fp.function_sub_id = fs.id "+
                                    "INNER JOIN user_role ur on ur.id = fp.user_role_id "+
                                    "ORDER BY user_role_name , function_sub_id ",

    "UPD_USER_ROLE_FUNCS_PERMISN" :  "UPDATE function_privilege " +
                                     "SET create_sta = :create_sta, read_sta = :read_sta, update_sta = :update_sta, " +
                                          "delete_sta = :delete_sta  , update_user = :update_user " +
                                     "where user_role_id= :user_role_id  and function_sub_id = :function_sub_id "
};