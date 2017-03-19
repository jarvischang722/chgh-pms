/**
 * Created by Jun on 2016/12/9.
 * 點滴Table
 */
module.exports = {
    //更新點滴系統參數
    "UPD_BIT_PARAM":"INSERT INTO bit_paramter (param_id, repeat_detect_count, rate_count, default_left_weight, sampling_day, update_user)" +
    "VALUES (:param_id,:repeat_detect_count ,:rate_count,:default_left_weight,:sampling_day, :update_user) "+
    "ON DUPLICATE KEY UPDATE param_id=:param_id, repeat_detect_count=:repeat_detect_count, rate_count=:rate_count," +
    "default_left_weight=:default_left_weight, sampling_day=:sampling_day, update_user= :update_user",


    //取得點滴系統參數
    "QRY_BIT_PARAM":"SELECT * FROM bit_paramter LIMIT 1",


    //取得點滴裝置分派資料
    "QRY_BIT_DISTRIBUTE_RECORD": "SELECT bd.* ,wd.ward_name , bd.`name` as bed_name ,bdr.bit_no,bd.id as bed_id "+
                                 "from bed bd  "+
                                 "LEFT JOIN  ward wd on wd.id = bd.ward_id "+
                                 "LEFT JOIN `bit_distribute_record` bdr  on bdr.bed_id = bd.id "+
                                 "WHERE 1=1  [and wd.ward_zone_id = :ward_zone_id ] " +
                                 "ORDER  BY bed_name ASC, ward_name ASC  ",

    //儲存點滴裝置分派資料
    "UPD_BIT_DISTRIBUTE_RECORD": "INSERT INTO bit_distribute_record (bed_id, bit_no) "+
                                 "VALUES (:bed_id, :bit_no) "+
                                 "ON DUPLICATE KEY UPDATE bed_id=:bed_id, bit_no=:bit_no ",

    //刪除點滴裝置分派資料
    "DEL_BIT_DISTRIBUTE_RECORD":"DELETE FROM  bit_distribute_record WHERE bed_id = :bed_id "

    //取得共用點滴系統參數
    ,"QRY_BIT_COMMON_CONFIG":"SELECT * FROM bit_common_config LIMIT 1"
    //修改共用點滴系統參數
    ,"UPDATE_BIT_COMMON_CONFIG" : "UPDATE bit_common_config SET measure_method= :measure_method, monitor_time= :monitor_time" +
    ", statistic_time= :statistic_time, alarm_time= :alarm_time, alert_time= :alert_time, adjust_weight= :adjust_weight, auto_adjust_weight= :auto_adjust_weight" +
    ", last_update_time= :last_update_time, update_user= :update_user where id= 1"

    //刪除個別點滴系統參數
    ,"DEL_BIT_BED_CONFIG" :"delete from bit_bed_config where bit_distribute_record_id not in(select id from bit_distribute_record)"
    //搜尋待新增的個別點滴系統參數
    ,"QRY_ADD_BIT_BED_CONFIG" :"select * from bit_distribute_record where id  not in(select bit_distribute_record_id from bit_bed_config)"
    //新增的個別點滴系統參數
    ,"ADD_BIT_BED_CONFIG" : "INSERT INTO bit_bed_config SET ? "
    //取得個別點滴參數
    ,"QRY_BIT_BED_CONFIG":"SELECT bbc.*, bdr.bit_no, bed.name as bedname, ward.id ward_id, ward.ward_name" +
    "  ,pt.name patient_name, bc.bit_name bit_class_name, bpc.name bit_pipe_class_name  FROM bit_bed_config bbc" +
    " LEFT JOIN bit_distribute_record bdr on bbc.bit_distribute_record_id = bdr.id" +
    " LEFT JOIN bed bed on bdr.bed_id = bed.id" +
    " LEFT JOIN ward ward on bed.ward_id = ward.id" +
    " LEFT JOIN bed_record br on bed.id = br.bed_id" +
    " LEFT JOIN patient pt on br.patient_person_id = pt.person_id" +
    " LEFT JOIN bit_class bc on bbc.bit_class_no = bc.bit_no" +
    " LEFT JOIN bit_pipe_class bpc on bbc.bit_pipe_class_id = bpc.id" +
    " WHERE 1=1 [AND bed.name like :bed] [AND pt.name like :patient]"
    //修改個別點滴系統參數
    ,"UPDATE_BIT_BED_CONFIG" : "UPDATE bit_bed_config SET monitor_time= :monitor_time, statistic_time= :statistic_time" +
    ", alarm_time= :alarm_time, alert_time= :alert_time, bit_class_no= :bit_class_no, bit_pipe_class_id= :bit_pipe_class_id, adjust_weight= :adjust_weight" +
    ", auto_adjust_weight= :auto_adjust_weight, sampling_count= :sampling_count" +
    ", last_update_time= :last_update_time, update_user= :update_user where id= :id"
};