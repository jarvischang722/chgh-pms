/**
 * Created by Ian on 2016/11/09.
 * 病房管理
 */
var Logger = require("../plugins/Log4js").Logger();
var _ = require("underscore");
var DBAgent = require("../plugins/mysql/DBAgent");
var mysql =require("mysql");
var tools = require("../utils/commonTools");
var bedService = require("../services/bedService");
var commonTools = require("../utils/commonTools");

//for parse file from http request
var formidable = require('formidable');


var fs = require('fs');


/**
 * 病床建立頁面
 * **/
exports.bedSet = function(req, res, next){
    res.render("SystemMaintain/bedManage");
};


/**
 * 病床建立頁面(圖形化)
 * **/
exports.GUIBedSet = function(req, res, next){


    if(commonTools.checkWardZoneHasModulePrivilege(req,"GUI_BED")){

    }else{

    }
    res.render("SystemMaintain/GUIBedManage");


};


/**
 *  取得護理站平面圖 in base64 string
 * **/
exports.getWardZoneFloorPlanImage = function(req, res, next){

    var ward_zone_id = req.session.user.ward_zone_id  || 0;

    bedService.getWardZoneFloorPlanImage(ward_zone_id,function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });

};



/**
 *  更新護理站平面圖 in base64 string
 * **/
exports.updateWardZoneFloorPlanImage = function(req, res, next){


    var base64str="";
    var image_type="";

    new formidable.IncomingForm().parse(req)
        .on('file', function(name, file) {

            //console.log('Got file:', name);

            base64str=base64_encode(file.path);
            image_type=file.type;
            console.log('Got base64 image:', base64_encode(file.path));
        })
        .on('error', function(error) { // I thought this would handle the upload error

            console.log(error);

            res.json(tools.getReturnJSON(false,[],-9499));

        })
        .on('end', function() {

            var ward_zone_id = req.body["ward_zone_id"] || req.session.user.ward_zone_id ||  0;

            var ward_zone_gui_floor_plan = base64str || "";

            var update_user=req.session.user.name || "";

            bedService.updateWardZoneFloorPlanImage(ward_zone_id,ward_zone_gui_floor_plan,image_type,update_user,function(result,errorCode){

                if(result){

                    res.json(tools.getReturnJSON(true,result))

                }else{

                    res.json(tools.getReturnJSON(false,[],errorCode))
                }


            });

        });


};


/**
 * 把檔案轉成png格式後，再轉成base64 str，存db使用
 * @param file
 * @returns {*}
 */
function base64_encode(file) {

    try{

        var bitmap = fs.readFileSync(file);

        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');

    }catch(e){

        console.log(e);
        Logger.error(e);

        return "";
    }

}


/**
 * 取得所有病房區
 * **/
exports.getAllWardZone = function(req, res, next){

    bedService.getAllWardZone(function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });

};

/**
 * 取得所有病房
 * **/
exports.getAllWard = function(req, res, next){

    var ward_zone_id = req.session.user.ward_zone_id  || 0;

    bedService.getAllWard(ward_zone_id, function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });

};

/**
 * 取得所有病房資訊
 * **/
exports.queryAllBedInfo = function(req, res){
    bedService.getAllBedInfo(req,function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,{bedList : result}))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });
};

/**
 * 插入病床
 * **/
exports.insertBed = function(req, res, next){

    var ward_zone_id = req.session.user.ward_zone_id || 0;
    var ward_zone_bed_max = req.session.user.ward_zone_bed_max || 0;

    //1.確認當前護理站的病床上限
    bedService.getAllWard(ward_zone_id, function(result,errorCode){

        if(result==undefined){result=[];}

        if(result){
            //有資料的話，判斷是否能插入新病床

            if( (result.length) < ward_zone_bed_max ) {
                //2.數量還夠的話，插入病床


                var bed_name = req.body["bed_name"] ||  req.query.bed_name  || "";

                var ward_name = req.body["ward_name"] || req.query.ward_id || "";


                //圖形化病房才有有這些欄位，不然就插0
                var gui_width = req.body["gui_width"] || req.query.gui_width || 0;

                var gui_height = req.body["gui_height"] || req.query.gui_height || 0;

                var gui_pos_x = req.body["gui_pos_x"] || req.query.gui_pos_x || 0;

                var gui_pos_y = req.body["gui_pos_y"] || req.query.gui_pos_y || 0;


                var update_user=req.session.user.account || "";


                bedService.insertBed(bed_name,ward_name, gui_width,gui_height,gui_pos_x,gui_pos_y,ward_zone_id,update_user,function(result,errorCode){

                    if(result){

                        res.json(tools.getReturnJSON(true,result));

                    }else{

                        res.json(tools.getReturnJSON(false,[],errorCode));
                    }

                });


            }else{

                //數量不夠
                res.json(tools.getReturnJSON(false,[],-9300,"上限的病床數為:"+ward_zone_bed_max+"床"));

            }


        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });




};



/**
 * 更新病床
 * **/
exports.updateBed = function(req, res, next){


    var bed_name = req.body["bed_name"] ||  req.query.bed_name  || "";

    var ward_name = req.body["ward_name"] || req.query.ward_id || "";

    var bed_id = req.body["bed_id"] || req.query.bed_id || "";

    var ward_zone_id = req.session.user.ward_zone_id || "";

    var update_user=req.session.user.account || "";



    //圖形化病房才有有這些欄位，不然就插0
    var gui_width = req.body["gui_width"] || req.query.gui_width || 0;

    var gui_height = req.body["gui_height"] || req.query.gui_height || 0;

    var gui_pos_x = req.body["gui_pos_x"] || req.query.gui_pos_x || 0;

    var gui_pos_y = req.body["gui_pos_y"] || req.query.gui_pos_y || 0;


    bedService.updateBed(bed_name, ward_name, bed_id,gui_width,gui_height,gui_pos_x,gui_pos_y, ward_zone_id,update_user,function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });

};



/**
 * 插入病房
 * **/
exports.insertWard = function(req, res, next){


    var ward_name = req.body["ward_name"] ||  req.query.ward_name  || "";

    var ward_zone_id = req.session.user.ward_zone_id || "";

    var update_user=req.session.user.account || "";

    bedService.insertWard(ward_name, ward_zone_id,update_user, function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });

};


/**
 * 刪除病床
 * **/
exports.deleteBed = function(req, res, next){


    //病床ids
    var bed_ids = req.body["bed_ids"] ||  req.query.bed_ids  || "";



    bedService.deleteBed(bed_ids,function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });

};



/**
 * 刪除病房
 * **/
exports.deleteWard = function(req, res, next){


    var ward_id = req.body["ward_id"] || req.query.ward_id || "";


    bedService.deleteWard(ward_id,function(result,errorCode){

        if(result){

            res.json(tools.getReturnJSON(true,result))

        }else{

            res.json(tools.getReturnJSON(false,[],errorCode))
        }


    });

};


/***
 * 查詢病床對應醫生排班資料
 * **/
exports.queryBedSchedulingForDoctor = function(req, res){

    bedService.doQueryBedSchedulingForDoctor(req,function(err,bedStaList){
        var success = true;
        var errorCode = "";

        if (err) {
            success = false;
        }

        res.json(commonTools.getReturnJSON(success  , {bedStaList: bedStaList} ,errorCode ))
    })
};

