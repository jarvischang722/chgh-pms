/**
 * Created by Eason on 2016/10/21.
 * * 執行Table [announcement]的SQL 相關語法
 */
module.exports = {
    "QRY_ALL_ANNOUNCEMENT" : "SELECT A.*, B.ward_zone_name FROM announcement A JOIN ward_zone B ON A.ward_zone_id = B.id  where 1=1 [AND ward_zone_id=:ward_zone_id]",
    "QRY_ANNOUNCEMENT" : "SELECT * FROM announcement WHERE start_datetime <= CURRENT_TIMESTAMP and end_datetime >= CURRENT_TIMESTAMP ",
    "DEL_ANNOUNCEMENT" : "DELETE  FROM announcement where id= :id ",
    "ADD_ANNOUNCEMENT" : "INSERT INTO announcement SET ? ",
    "UPDATE_ANNOUNCEMENT" : "UPDATE announcement SET content= :content, link= :link, start_datetime= :start_datetime, end_datetime= :end_datetime" +
    ", last_update_time= :last_update_time, update_user= :update_user where id= :id "
};