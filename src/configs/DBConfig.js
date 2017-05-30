/**
 * Created by Jun on 2016/9/30.
 * 資料庫設定檔
 */
var options = {
    /**PMS 資料庫設定**/
    PMS: {
        host :'door.cctech-support.com',
        user :'cctech',
        password :'C0ncept!',
        database :'pms_chgh',
        port :'15128',
        timezone :'utc',
        isenabled:true //若資料庫連線有問題或暫不使用可設為false
    },
    /**SIP 資料庫設定**/
    SIP: {
        host :'125.227.227.13',
        user :'mikotek',
        password :'mikotek5973',
        database :'voip',
        port :'3306',
        timezone :'utc',
        isenabled:true //若資料庫連線有問題或暫不使用可設為false
    },
    /**PMS local資料庫設定**/
    // PMS: {
    //     host :'127.0.0.1',
    //     user :'root',
    //     password :'123456',
    //     database :'pms',
    //     port :'3306',
    //     timezone :'utc',
    //     isenabled:true //若資料庫連線有問題或暫不使用可設為false
    // },
};

module.exports = options;