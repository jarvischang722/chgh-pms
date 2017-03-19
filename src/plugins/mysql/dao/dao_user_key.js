/**
 * Created by Jun on 2016/10/1.
 * 執行Table [user_key]的SQL 相關語法
 */
module.exports = {


    "QRY_KEY" : "SELECT `key` FROM `user_key` limit 1",
    "DEL_KEY" : "delete FROM `user_key`",
    "INS_KEY" : "INSERT INTO `user_key` SET ?"

};