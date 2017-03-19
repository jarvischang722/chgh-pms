/**
 * Created by Ian on 2016/11/09.
 * * 執行Table [ward_zone]的SQL 相關語法
 */
module.exports = {

    //刪除護理站資料
    "DEL_WARD_ZONE":""+
        "delete from  `ward_zone` WHERE id=:id",

    //插入護理站資料
    "INS_WARD_ZONE":""+
        "INSERT INTO ward_zone (district_id,ward_zone_name) values (:district_id,:ward_zone_name) ",

    //更新護理站資料
    "UPD_ALL_WARD_ZONE":""+
        "UPDATE `ward_zone` " +
        "SET `ward_zone_name`=:ward_zone_name," +
        "`ward_zone_description`=:ward_zone_description," +
        "`update_user`=:update_user WHERE id=:id",


    //加上護理站的授權人數及開放模組
    "QRY_ALL_WARD_ZONE_WITH_LIMIT_AND_MODULE" : ""
        + "SELECT * ,`ward_zone`.`id` as `id` ,"
        + " "
        + "group_concat(ward_zone_module.system_module_id separator ',')  as system_module_list, "
        + " "
        + "`ward_zone`.`id` as `ward_zone_id` "
        + " FROM `ward_zone` "
        + " "
        + " left join `ward_zone_module` on `ward_zone`.`id` = `ward_zone_module`.`ward_zone_id` "
        + " "
        + " group by `ward_zone`.`id`",


    //取得護理站平面圖 in base64 string
    "QRY_WARD_ZONE_FLOOR_PLAN_IMAGE" : "SELECT ward_zone_gui_floor_plan,ward_zone_gui_floor_plan_image_type FROM ward_zone where id = :ward_zone_id limit 1",

    //更新護理站平面圖 in base64 string
    "UPDWARD_ZONE_FLOOR_PLAN_IMAGE" :
        "UPDATE ward_zone " +
            "SET " +
            "ward_zone_gui_floor_plan=:ward_zone_gui_floor_plan," +
            "ward_zone_gui_floor_plan_image_type=:ward_zone_gui_floor_plan_image_type," +
            "update_user=:update_user " +
            "WHERE  id =  :ward_zone_id",



    "QRY_ALL_WARD_ZONE" : "SELECT * FROM ward_zone",

    "QRY_WARD_ZONE_BY_ID" : "SELECT * FROM ward_zone where id=:ward_zone_id limit 1",


    "QRY_WARD_WITH_BED_NUMBER_BY_WARDZONE" :
        "select *,ward.id as ward_id , ward.ward_name as ward_name, " +
            "bed.id as bed_id, bed.name as bed_name, ward.ward_zone_id as ward_zone_id"
            + " "
            + "from ward "
            + "  "
            + "left join bed on ward.id = bed.ward_id "
            + " "
            + "where  ward.ward_zone_id=:ward_zone_id AND bed.id IS NOT NULL " +
            " order by ward_name asc , bed_name asc",


    "QRY_ALL_WARD_WITH_BED_NUMBER" :

        "select ward.id as ward_id , ward.ward_name as ward_name, " +
            "bed.id as bed_id, bed.name as bed_name, ward.ward_zone_id as ward_zone_id"
        + " "
        + "from ward "
        + "  "
        + "left join bed on ward.id = bed.ward_id ",


    "INS_BED_WITH_GUI" :
        "INSERT INTO bed (name, ward_id, gui_width,gui_height,gui_pos_x,gui_pos_y, update_user) "
            + "SELECT * FROM (SELECT :bed_name, :ward_id, :gui_width, :gui_height, :gui_pos_x, :gui_pos_y, :update_user) AS tmp "
            + "WHERE NOT EXISTS ( "
            + "    SELECT name FROM bed WHERE name = :bed_name "
            + "    and ward_id=:ward_id "
            + "    and gui_width=:gui_width "
            + "    and gui_height=:gui_height "
            + "    and gui_pos_x=:gui_pos_x "
            + "    and gui_pos_y=:gui_pos_y "
            + "    and update_user=:update_user "
            + ") LIMIT 1;",


    "INS_BED" :
        "INSERT INTO bed (name, ward_id, update_user) "
            + "SELECT * FROM (SELECT :bed_name, :ward_id,:update_user) AS tmp "
            + "WHERE NOT EXISTS ( "
            + "    SELECT name FROM bed WHERE name = :bed_name "
            + "    and ward_id=:ward_id "
            + "    and update_user=:update_user "
            + ") LIMIT 1;",

    "UPD_BED_WITH_GUI" :
        "UPDATE bed " +
            "SET " +
            "ward_id=:ward_id," +
            "gui_width=:gui_width," +
            "gui_height=:gui_height," +
            "gui_pos_x=:gui_pos_x," +
            "gui_pos_y=:gui_pos_y," +
            "name=:bed_name," +
            "update_user=:update_user " +
            "WHERE  id =  :bed_id",


    "UPD_BED" :
        "UPDATE bed " +
            "SET " +
            "ward_id=:ward_id," +
            "name=:bed_name," +
            "update_user=:update_user " +
            "WHERE  id =  :bed_id",


    "INS_WARD" :""
    + "INSERT INTO ward (`ward_name`,`ward_zone_id`,`update_user`) "
    + "SELECT * FROM (SELECT :ward_name, :ward_zone_id,:update_user) AS tmp "
    + "WHERE NOT EXISTS ( "
    + "    SELECT `ward_name`  FROM ward WHERE ward_name = :ward_name and `ward_zone_id`=:ward_zone_id and `update_user`=:update_user "
    + ") LIMIT 1;",


    "QRY_WARD_BY_NAME" :
        "select * "
            + " from ward"
            + " where ward_name = :ward_name "
            + " and ward_zone_id=:ward_zone_id",


    "DEL_BED":
        "delete from bed "
        + " "
        + "where id=:bed_id",


    "DEL_WARD": "delete bed,ward from bed "
        + "            INNER join ward on ward.id = bed.ward_id "
        + "            where bed.ward_id=:ward_id"

};