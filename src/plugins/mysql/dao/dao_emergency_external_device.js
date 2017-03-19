/**
 * Created by Ian on 2016/11/03.
 * * 執行Table [bed]的SQL 相關語法
 */
module.exports = {



    //更新sip裝置資料
    "UPD_SIP_DISTRIBUTE_REMOTE" :"UPDATE phone " +
        "SET  passwd='Miko66'," +
        "transno=   :transno," +
        "monitor=   1," +
        "da=        :da," +
        "realname=  :realname," +
        "comments=  :comments " +
        "WHERE  phoneno =  :phoneno",


    //插入sip裝置資料
    "INS_SIP_DISTRIBUTE_REMOTE" :"INSERT INTO  `voip`.`emer_callGroup` " +
        "(`CallType` ,`SickbedGroup` ,`SickbedGroupName` ,`NurseGroup` ,`RingTimer` ,`RingType` ,`StartTime` ,`EndTime` ) " +
        "VALUES " +
        "(  '0',  '9011',  '王X明',  '686,687',  '20',  '0',  '2016-10-23 08:34:47',  '2016-10-24 22:34:47');",



    //取得緊急外部裝置清單 依病房(暫不做)
    "QRY_EMERGENCY_EXTERNAL_DEVICE_BY_BED" : "SELECT * FROM `emer_extdevice` ",

    //取得緊急外部裝置清單 依種類
    "QRY_EMERGENCY_EXTERNAL_DEVICE_BY_CLASS" : "SELECT * FROM `emer_extdevice` " +
        "where da = :emergency_external_device_class_no",

    //取得緊急外部裝置清單 全部
    "QRY_EMERGENCY_EXTERNAL_DEVICE" : "SELECT *, emer_extdevice.id AS emer_extdevice_id FROM `emer_extdevice` where ipaddress !=''",

    //取得緊急外部裝置種類清單
    "QRY_EMERGENCY_EXTERNAL_DEVICE_CLASS" : "SELECT * FROM `emergency_external_device_class`",


    //插入緊急外部裝置
    "INS_EMERGENCY_EXTERNAL_DEVICE" :"INSERT INTO  `emer_extdevice` ("
        + "da, "
        + "comments, "
        + "ipaddress"
        + ") "
        + "VALUES ( :device_class_no,  :comments,  :device_IP );",

    //更新緊急外部裝置
    "UPD_EMERGENCY_EXTERNAL_DEVICE" :"UPDATE emer_extdevice " +
        "SET  " +
        "da=          :device_class_no," +
        "comments=    :comments," +
        "ipaddress=   :device_IP " +
        "where id=:emergency_external_device_id",


    //刪除緊急外部裝置(目前沒有刪除權限，所以改成全部更新為空值)
    //"DEL_EMERGENCY_EXTERNAL_DEVICE" :"DELETE  FROM `emer_extdevice` where id=:emergency_external_device_id;"


    //刪除緊急外部裝置(目前沒有刪除權限，所以改成全部更新為空值)
    "DEL_EMERGENCY_EXTERNAL_DEVICE" :"UPDATE emer_extdevice " +
        "SET  " +
        "da=          ''," +
        "comments=    ''," +
        "ipaddress=   '' " +
        "where id=:emergency_external_device_id",

};