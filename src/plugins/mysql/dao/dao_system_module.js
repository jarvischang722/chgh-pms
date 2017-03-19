/**
 * Created by Ian on 2016/12/27.
 * * 執行Table [system_module]的SQL 相關語法
 */
module.exports = {


    //抓全部的模組名稱
    "QRY_SYSTEM_MODULE" : "SELECT * " +
        "FROM  `system_module`  ",


    //找模組名稱
    "QRY_SYSTEM_MODULE_BY_ID" : "SELECT * " +
        "FROM  `system_module`  " +
        "WHERE id =:id",

    //找模組名稱
    "QRY_WARD_ZONE_MODULE" : "SELECT value " +
        "FROM  `ward_zone_module_new` " +
        "order by id desc limit 1 ",


    //更新護理站啟用模組及資料
    "UPD_WARD_ZONE_MODULE" :""+
        "UPDATE `ward_zone_module_new` " +
        "SET `value`=:value"

};