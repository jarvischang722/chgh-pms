/**
 * Created by Ian on 2016/12/10.
 * * 執行Table [bit_pipe_class]的SQL 相關語法
 */
module.exports = {

    //找尋點滴輸液管種類
    "QRY_ALL_BIT_PIPE_CLASS":"SELECT bpc.* , bpc.weight + bpc.capacity_in_pipe as total_capacity_in_pipe FROM `bit_pipe_class` bpc;",

    //新增點滴輸液管種類
    "ADD_BIT_PIPE_CLASS":""
    + "INSERT INTO `bit_pipe_class` ( `name`, `weight`, `capacity_in_pipe`, `update_user`) "
    + " VALUES ( :bit_pipe_name, :weight, :capacity_in_pipe, :update_user);",

    //更新點滴輸液管種類
    "UPD_BIT_PIPE_CLASS":""
        + "UPDATE `bit_pipe_class` " +
        "SET " +
        "`name`=:bit_pipe_name," +
        "`weight`=:weight," +
        "`capacity_in_pipe`=:capacity_in_pipe," +
        "`update_user`=:update_user " +
        "WHERE id=:bit_pipe_id",

    //刪除點滴輸液管種類
    "DEL_BIT_PIPE_CLASS": "DELETE IGNORE FROM bit_pipe_class where id= :id "

};