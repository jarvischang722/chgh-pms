/**
 * Created by Eason on 2016/10/21.
 * * 執行Table [marquee]的SQL 相關語法
 */
module.exports = {

    "QRY_CURRENT_MARQUEE" : "SELECT * FROM marquee WHERE start_datetime <= CURRENT_TIMESTAMP and end_datetime >= CURRENT_TIMESTAMP",
    "QRY_ALL_MARQUEE" : "SELECT * FROM marquee ",
    "DEL_MARQUEE" : "DELETE  FROM marquee where id= :id ",
    "ADD_MARQUEE" : "INSERT INTO marquee SET ?",
    "UPDATE_MARQUEE" : "UPDATE marquee SET content= :content, font_color_hex= :font_color_hex, start_datetime= :start_datetime, end_datetime= :end_datetime" +
    ", last_update_time= :last_update_time, update_user= :update_user where id= :id"
};