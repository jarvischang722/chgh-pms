/**
 * Created by Eason on 2016/10/21.
 * * 執行Table [marquee]的SQL 相關語法
 */
module.exports = {

    "QRY_ALL_PERIOD" : "SELECT * FROM nurse_sche_class ",
    "QRY_MAX_PERIOD" : "SELECT * FROM nurse_sche_class order by id desc limit 1",
    "DEL_PERIOD" : "DELETE  FROM nurse_sche_class where id= :id ",
    "ADD_PERIOD" : "INSERT INTO nurse_sche_class SET ?"
    ,"UPDATE_PERIOD" : "UPDATE nurse_sche_class SET class_name= :class_name, start_time= :start_time, end_time= :end_time" +
    ", last_update_time= :last_update_time, update_user= :update_user where id= :id"
};