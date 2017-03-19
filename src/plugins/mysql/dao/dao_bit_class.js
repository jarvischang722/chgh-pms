/**
 * Created by Ian on 2016/12/10.
 * * 執行Table [bit_class]的SQL 相關語法
 */
module.exports = {



//    "QRY_ALL_SIP_IP": "SELECT *, sip_ip.id as sip_ip_id FROM sip_ip left join ward_zone on ward_zone.id = sip_ip.ward_zone_id " +
//        "order by ward_zone.ward_zone_name asc, sip_ip.id  asc",
//
//    "QRY_SIP_IP_BY_WARDZONE_ID": "SELECT *, sip_ip.id as sip_ip_id FROM sip_ip " +
//        "left join ward_zone on ward_zone.id = sip_ip.ward_zone_id WHERE ward_zone_id = :ward_zone_id" +
//        " order by ward_zone.ward_zone_name asc, sip_ip.id  asc",
//
//    "DEL_SIP_IP": "DELETE IGNORE FROM sip_ip where id= :id ",

    "QRY_ALL_BIT_CLASS":"select * from `bit_class`",

    "ADD_BIT_CLASS":""
    + "INSERT INTO `bit_class` (`bit_no`, `bit_class_name`, `bit_capacity`, `bit_name`, `bit_empty_weight`,`update_user`) "
    + " VALUES (:bit_no, :bit_class_name, :bit_capacity, :bit_name, :bit_empty_weight, :update_user);",


    "UPD_BIT_CLASS":""
        + "UPDATE `bit_class` " +
        "SET " +
        "`bit_no`=:bit_no," +
        "`bit_class_name`=:bit_class_name," +
        "`bit_capacity`=:bit_capacity," +
        "`bit_name`=:bit_name," +
        "`bit_empty_weight`=:bit_empty_weight," +
        "`update_user`=:update_user " +
        "WHERE id=:id",

    "DEL_BIT_CLASS": "DELETE IGNORE FROM bit_class where id= :id "

//    "UPDATE_SIP_IP": "UPDATE sip_ip SET sip_ip= :ip where id= :sip_ip_id "
//


};