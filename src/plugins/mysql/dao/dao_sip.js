/**
 * Created by Ian on 2016/11/03.
 * * 執行Table [bed]的SQL 相關語法
 */
module.exports = {



    "QRY_OFFLINE_SIP_IP": "select phoneno, passwd,transno,monitor,realname,comments,da,regstatus from phone where monitor=1 and regstatus=0",


    //刪除sip裝置資料
    "DEL_SIP_DISTRIBUTE_REMOTE" :"UPDATE phone " +
        "SET " +
        "transno=   ''," +
        "monitor=   0," +
        "da=        0," +
        "realname=  ''," +
        "comments=  '', " +
        "monitor=   0 " +
        "WHERE  phoneno =  :phoneno",


    //更新sip裝置資料
    "UPD_SIP_DISTRIBUTE_REMOTE" :"UPDATE phone " +
        "SET " +
        "transno=   :transno," +
        "monitor=   0," +
        "da=        :da," +
        "realname=  :realname," +
        "comments=  :comments, " +
        "monitor=  :monitor " +
        "WHERE  phoneno =  :phoneno",


    //插入sip裝置資料
    "INS_SIP_DISTRIBUTE_REMOTE" :"INSERT INTO  `voip`.`emer_callGroup` " +
        "(`CallType` ,`SickbedGroup` ,`SickbedGroupName` ,`NurseGroup` ,`RingTimer` ,`RingType` ,`StartTime` ,`EndTime` ) " +
        "VALUES " +
        "(  '0',  '9011',  '王X明',  '686,687',  '20',  '0',  '2016-10-23 08:34:47',  '2016-10-24 22:34:47');",
    //新增護士排班資料
    "ADD_emer_callGroup" : "INSERT INTO emer_callGroup SET ? ",

    //取得sip裝置資料(依類型)
    "QRY_SIP_DISTRIBUTE_BY_CLASS_REMOTE" : "SELECT phoneno, passwd,transno,monitor,realname,comments,da FROM `phone` " +
        " where (da=9 or da=11) [ and comments=:wid] limit :start, :per_page ",

    //取得sip裝置資料(全部類型)，不含未被指派過的
    "QRY_SIP_DISTRIBUTE_REMOTE" : "SELECT phoneno, passwd,transno,monitor,realname,comments,da FROM `phone` " +
        " where  transno!=  '' || realname!=  '' ||  comments!=  ''",

    //取得sip裝置資料(全部類型)，不含已被分過的
    "QRY_SIP_DISTRIBUTE_REMOTE_NO_ASSIGN" : "SELECT phoneno, passwd,transno,monitor,realname,comments,da FROM `phone` " +
        " where  (transno='' or transno is null)  and (realname='' or realname is null)  and  (comments='' or comments is null)",


    //取得sip裝置資料(全部類型)，有分頁功能
    "QRY_SIP_DISTRIBUTE_REMOTE_PAGE" : "SELECT phoneno, passwd,transno,monitor,realname,comments,da FROM `phone` " +
        "limit :start, :per_page",

    "QRY_SIP_DISTRIBUTE" : "SELECT * FROM `sip_device_distribute`   " +
        "left join ward on ward.id=sip_device_distribute.ward_id  " +
        "" +
        "left join bed on bed.id=sip_device_distribute.bed_id  " +
        "" +
        "left join sip_device_class on sip_device_class.no =sip_device_distribute.device_class_no ",

    //依照SIP的裝置類型ID，得取SIP裝置的分派
    "QRY_SIP_DISTRIBUTE_BY_DEVICE_CLASS_ID" : "SELECT * FROM `sip_device_distribute`   " +
        "left join ward on ward.id=sip_device_distribute.ward_id  " +
        "" +
        "left join bed on bed.id=sip_device_distribute.bed_id  " +
        "" +
        "left join sip_device_class on sip_device_class.no =sip_device_distribute.device_class_no " +
        "" +
        "where sip_device_distribute.device_class_no =:sip_device_class_id ",

    //取得sip裝置型態清單
    "QRY_SIP_DEVICE_CLASS" : "SELECT * FROM `sip_device_class`",

    //取得SIP IP通話紀錄
    "QRY_SIP_CDR":"select id,clid, dstchannel,start,answer,end,duration,billsec, disposition,type, emercanceltime  from sip_phone_call_history" +
        " where 1=1 " +
        "[and type=:type] " +
        "[and duration >= :second_start ] " +
        "[and duration <= :second_end ] " +
        "and DATE(start) between :start_date and :end_date " +
        " order by start desc",
    
    
    //更新sip系統參數
    "UPD_SIP_PARAM":"INSERT INTO sip_parameter (param_id, ring_last_time, ring_type, debug_time, get_call_record_time," +
                                                "ntp_adjust, ntp_server_path, sip_server_database_ip, update_user) "+
                    "VALUES (:param_id, :ring_last_time ,:ring_type, :debug_time, :get_call_record_time,  "+
                            ":ntp_adjust, :ntp_server_path, :sip_server_database_ip, :update_user) "+
                    "ON DUPLICATE KEY UPDATE ring_last_time=:ring_last_time, ring_type=:ring_type, debug_time=:debug_time," +
                    "get_call_record_time=:get_call_record_time, ntp_adjust=:ntp_adjust," +
                    "ntp_server_path=:ntp_server_path ,sip_server_database_ip=:sip_server_database_ip , update_user=:update_user",

    //取得sip系統參數
    "QRY_SIP_PARAM":"SELECT * FROM sip_parameter LIMIT 1",

    //取得sip裝置定時除錯偵測時間(分鐘)
    "QRY_SIP_CHECK_INTERVAL_ONLY_PARAM":"SELECT debug_time FROM sip_parameter LIMIT 1",


    //刪除SIP通訊紀錄
    "DEL_SIP_RECORD":"delete from `sip_phone_call_history` where 1=1 and start >=:StartDateTime",


    //插入sip通訊紀錄
    "ADD_SIP_RECORD":""
        + "INSERT INTO `sip_phone_call_history` "
        + "            (clid, "
        + "             dstchannel, "
        + "             start, "
        + "             answer, "
        + "             end, "
        + "             duration, "
        + "             billsec, "
        + "             disposition, "
        + "             type, "
        + "             emercanceltime, "
        + "             ward_zone_id) "
        + "VALUES      ? "
    
    
};