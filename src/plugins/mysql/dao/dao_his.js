/**
 * Created by Jun on 2016/12/9.
 * HIS
 */
module.exports = {
    //更新HIS系統參數
    "UPD_HIS_PARAM":"INSERT INTO his_parameter (param_id, get_his_data_period, update_user)" +
                    "VALUES (:param_id, :get_his_data_period, :update_user ) "+
                    "ON DUPLICATE KEY UPDATE get_his_data_period=:get_his_data_period, update_user= :update_user",
    //取得HIS系統參數
    "QRY_HIS_PARAM":"SELECT * FROM his_parameter LIMIT 1",
};