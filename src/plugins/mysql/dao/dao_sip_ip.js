/**
 * Created by Ian on 2016/12/01.
 * * 執行Table [sip_ip]的SQL 相關語法
 */
module.exports = {

    "INS_NON_EXIST_SIP_IP": ""
        + "INSERT IGNORE INTO sip_ip (ward_zone_id) "
            + "SELECT id FROM ward_zone;",


    "QRY_ALL_SIP_IP": "SELECT *, sip_ip.id as sip_ip_id FROM sip_ip left join ward_zone on ward_zone.id = sip_ip.ward_zone_id " +
        "order by ward_zone.ward_zone_name asc, sip_ip.id  asc",

    "QRY_SIP_IP_BY_WARDZONE_ID": "SELECT *, sip_ip.id as sip_ip_id FROM sip_ip " +
        "left join ward_zone on ward_zone.id = sip_ip.ward_zone_id WHERE ward_zone_id = :ward_zone_id" +
        " order by ward_zone.ward_zone_name asc, sip_ip.id  asc",





    "DEL_SIP_IP": "DELETE IGNORE FROM sip_ip where id= :id ",

    "ADD_SIP_IP": "INSERT IGNORE INTO sip_ip " +
        "(ward_zone_id, sip_ip,DBAccount,DBPassword,DBPort,DBName, update_user) values " +
        "(:ward_zone_id,:sip_ip,:DBAccount,:DBPassword,:DBPort,:DBName,:updater) ",


    "UPDATE_SIP_IP": ""
        + "UPDATE  `sip_ip` SET  " +
        "  `sip_ip` =  :sip_ip, "
        + "`DBAccount` =  :DBAccount, "
        + "`DBPassword` =  :DBPassword, "
        + "`DBPort` =  :DBPort, "
        + "`DBName` =  :DBName, "
        + "`update_user` =  :update_user  "
        + "WHERE  `id` =:sip_ip_id;",

    "QRY_SIP_IP_BY_WARDZONE_ID2": "SELECT * FROM sip_ip " +
    " WHERE ward_zone_id = :ward_zone_id"
};