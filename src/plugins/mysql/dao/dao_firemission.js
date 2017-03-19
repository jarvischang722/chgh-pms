/**
 * Created by Eason on 2016/10/21.
 * * 執行Table [marquee]的SQL 相關語法
 */
module.exports = {

    "QRY_ALL_GROUP" : "select id, group_name, group_sname, 'F' type from  fire_control_group" +
    " union" +
    " select id, group_name, group_sname, 'M' type from  mission_group where 1=1",
    "QRY_F_GROUP" : "select id, group_name, group_sname, 'F' type from  fire_control_group",
    "QRY_M_GROUP" : "select id, group_name, group_sname, 'M' type from  mission_group",
    "DEL_FIRE" : "DELETE  FROM fire_control_group where id= :id ",
    "DEL_MISSION" : "DELETE  FROM mission_group where id= :id "
    ,"ADD_FIRE" : "INSERT INTO fire_control_group SET ?"
    ,"ADD_MISSION" : "INSERT INTO mission_group SET ?"
    ,"UPDATE_FIRE" : "UPDATE fire_control_group SET group_name= :group_name, group_sname= :group_sname" +
    ", last_update_time= :last_update_time, update_user= :update_user where id= :id"
    ,"UPDATE_MISSION" : "UPDATE mission_group SET group_name= :group_name, group_sname= :group_sname" +
    ", last_update_time= :last_update_time, update_user= :update_user where id= :id"
};