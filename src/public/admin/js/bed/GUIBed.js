//暫存用的病床物件
var g_tempBedObjs=[];

var g_color_saved="#278ad8";

//用來標記未儲存的病床資料的class
var g_unsaved_class="unsaved";

$(function() {

    $(".zone").hide();

    //1.載入平面圖，如果沒有就顯示上傳的modal
    loadFloorPlan();




    //for css problems
    $(".fileinput-button")
        .css("overflow","inherit");


    $(".ward_zone_gui_floor_plan")
        .css("width",$(".fileinput-button").outerWidth())
        .css("height",$(".fileinput-button").outerHeight())
        .fileupload({
        url: '/Bed/updateWardZoneFloorPlanImage',
        add: function (e, data) {
            console.log("上傳中");
            data.submit();
            site.showWaitingModal("上傳中");
            console.log(e);
        },
        done: function (e, data) {
            //上傳完成後
            console.log("上傳完成");
            site.showWaitingModal("載入平面圖中");
            loadFloorPlan();
            console.log(e);

        }
    });


    $("#saveAllBtn").click(saveAllUnsavedBed);


});

var loadFloorPlan=function(){


    //更新病床資料
    $.ajax({
        url: "/Bed/getWardZoneFloorPlanImage",
        type: "get",
        data: {},
        success:function(data) {

            site.closeWaitingModal();

            if(data.success){


                try{

                    var result = data.result;
                    result=result[0];
                    var ward_zone_gui_floor_plan=result.ward_zone_gui_floor_plan;

                    var ward_zone_gui_floor_plan_image_type=result.ward_zone_gui_floor_plan_image_type;

                    if(ward_zone_gui_floor_plan!=""){
                        //有圖片
                        loadImageDIV(ward_zone_gui_floor_plan,ward_zone_gui_floor_plan_image_type);

                    }else{
                        //沒圖片
                        loadAddForm();
                    }

                }catch(e){
                    console.log(e);
                    loadAddForm();
                }


            }else{

                console.log(data.errorMsg);
            }

        }

    });


    //沒有平面圖，顯示上傳form
    var loadAddForm=function(){

        $("#add-floor-plan-div").show();
        $("#show-floor-plan-div").hide();
        $(".ope_list_search").hide();


    };


    //有平面圖，顯示div
    var loadImageDIV=function(ward_zone_gui_floor_plan,ward_zone_gui_floor_plan_image_type){

        $("#show-floor-plan-div").css("background-image", "url('data:"+ward_zone_gui_floor_plan_image_type+";base64," + ward_zone_gui_floor_plan + "')").show();
        $(".ope_list_search").show();
        $("#add-floor-plan-div").hide();


        //載入病床資料
        loadGuiBed();


    };


};

//2
var setModalFunc=function(){
//點擊時，會設定Modal的功能

    $(document).on("click",".gen_box",function(){

        var outer=$(this);

        var width=$(this).outerWidth();
        var height=$(this).outerHeight();
        var pos_x=$(this).position().left;
        var pos_y=$(this).position().top;

        var ward_name=$(this).find("#ward_name").html();
        var bed_name=$(this).find("#bed_name").html();
        var bed_id=$(this).data("bed-id");

        $("#deleteBtn").unbind("click").on("click",function(){
            //刪除病床資料

            if(outer.data("bed-id")){

                guiDeleteBed(outer.data("bed-id"),function(){

                    outer.remove();

                });


            }else{

                outer.remove();
            }


        });


        $("#addBtn").unbind("click").on("click",function(){

            outer.find("#ward_name").html($("#add_ward_name").val());

            outer.find("#bed_name").html($("#add_bed_name").val());

            modifyGUIBed(function(){

                //更新完之後，把未儲存的class拿掉
                outer.removeClass(g_unsaved_class);

            });

        });


        $("#add_bed_id").val(bed_id);
        $("#add_ward_name").val(ward_name);
        $("#add_bed_name").val(bed_name);
        $("#add_bed_gui_width").val(width);
        $("#add_bed_gui_height").val(height);
        $("#add_bed_gui_pos_x").val(pos_x);
        $("#add_bed_gui_pos_y").val(pos_y);

    });




};


//1.
var initBedGenerateGUIJS=function(next_index){
//產生拉圖片的效果

    var welcome_area = $('.inner_col_two'),
        main_content = $('.col_two'),
        css_module = $('.inner_col_one'),
        gen_box = null,
        i = next_index;

    //make .col_two selectable and...
    main_content.selectable({
        start: function(e) {

            //get the mouse position on start
            x_begin = e.pageX;
            y_begin = e.pageY;

        },
        stop: function(e) {

            //get the mouse position on stop
            x_end = e.pageX;
            y_end = e.pageY;

            /***  if dragging mouse to the right direction, calcuate width/height  ***/

            if (x_end - x_begin >= 1) {
                width = x_end - x_begin;
                height = y_end - y_begin;

                /***  if dragging mouse to the left direction, calcuate width/height (only change is x) ***/

            } else {

                width = x_begin - x_end,
                height = y_end - y_begin;
                var drag_left = true;
            }

            //append a new div and increment the class and turn it into jquery selector
            $(this).append('<a href="#add_modal" class="gen_box zone_item gen_box_' + i + '">' +
                '<div class="room_cond"><span id="ward_name"></span>-<span id="bed_name"></span></div></div><p></p></a>');

            gen_box = $('.gen_box_' + i);


            //加入未儲存的class
            $(gen_box)
                .addClass(g_unsaved_class)
                .css({
                'width': width,
                'height': height,
                'position': 'absolute',
                'left': x_begin,
                'top': y_begin })
                .resizable({
                    stop: resizeAction
                })
                .draggable({
                    grid: [1, 1],
                    containment: ".zone",
                    stop: dragAction
                });

            //if the mouse was dragged left, offset the gen_box position
            drag_left ? $(gen_box).offset({
                left: x_end,
                top: y_begin
            }) : false;
            //console.log('width: ' + width + 'px');
            //console.log('height: ' + height + 'px');
            //add thr styles of generated div into .inner_col_one
            i++;
        }
    });

};



var loadGuiBed=function(){

    $.ajax({
        url: "/Bed/getAllWard",
        type: "get",
        data: {},
        success:function(data) {

            //清掉舊的
            $("#show-floor-plan-div").html("");

            if(data.success){

                var rows=data.result;

                for(var i=0;i<rows.length;i++){

                    var row = rows[i];
                    row.index=i;

                    //render格子
                    var source   = $("#gui-bed-template").html();
                    var template = Handlebars.compile(source);
                    var html    = template(row);


                    $("#show-floor-plan-div").append(html);




                    //讓載入的格子加入被控制的js
                    $(".gen_box_"+i)
                        .css("background-color",g_color_saved)
                        .resizable({
                            stop: resizeAction
                        })
                        .draggable({
                            grid: [1, 1],
                            containment: ".zone",
                            stop: dragAction
                        });

                }


                initBedGenerateGUIJS(rows.length);

                setModalFunc();

                //saveAllBed();


            }else{

            }

        }

    });

};


var modifyGUIBed=function(callback){

    //event.preventDefault();//不關掉彈跳視窗

    var ward_name=$("#add_ward_name").val() || "";
    var bed_name=$("#add_bed_name").val() || "";


    var gui_width=$("#add_bed_gui_width").val() || 0;
    var gui_height=$("#add_bed_gui_height").val() || 0;
    var gui_pos_x=$("#add_bed_gui_pos_x").val() || 0;
    var gui_pos_y=$("#add_bed_gui_pos_y").val() || 0;

    //病床id
    var gui_bed_id=$("#add_bed_id").val() || 0;

    var url="";
    var successMsg="";

    if(gui_bed_id!=0){

        url="/Bed/updateBed";
        successMsg="更新病床成功";

    }else{
        url="/Bed/insertBed";
        successMsg="加入病床成功";

    }

    //更新病床資料
    $.ajax({
        url: url,
        type: "post",
        data: {bed_id:gui_bed_id,bed_name:bed_name,ward_name:ward_name,gui_width:gui_width,gui_height:gui_height,gui_pos_x:gui_pos_x,gui_pos_y:gui_pos_y},
        success:function(data) {

            if(data.success){

                //alert(successMsg);

                //loadAllbed();

            }else{

                console.log(data.errorMsg);
            }

            callback();

        }

    });


};


var saveAllUnsavedBed=function(){
//儲存畫面上，未儲存的病床資料

    var totalCount=$(".gen_box.unsaved").length;

    if(totalCount>0){

        site.showWaitingModal("儲存所有修改過的病床資料中...");

        $(".gen_box.unsaved").each(function(index) {

            var bed=$(this);

            //1.get value from box
            var ward_name=bed.find("#ward_name").html() || "";
            var bed_name=bed.find("#bed_name").html() || "";
            var gui_width=bed.outerWidth() || 0;
            var gui_height=bed.outerHeight() || 0;
            var gui_pos_x=bed.position().left || 0;
            var gui_pos_y=bed.position().top || 0;
            var gui_bed_id=bed.data("bed-id") || 0;

            //console.log(ward_name+"-"+bed_name+" is starting saving, index="+index);

            //2.set value
            $("#add_ward_name").val(ward_name);
            $("#add_bed_name").val(bed_name);
            $("#add_bed_gui_width").val(gui_width);
            $("#add_bed_gui_height").val(gui_height);
            $("#add_bed_gui_pos_x").val(gui_pos_x);
            $("#add_bed_gui_pos_y").val(gui_pos_y);
            $("#add_bed_id").val(gui_bed_id);


            //3 start save
            modifyGUIBed(function(){

                bed.removeClass(g_unsaved_class);

                //console.log(ward_name+"-"+bed_name+" is end saving");

                if(index == totalCount-1){
                    //完成最後一個修改時，關閉loading bar
                    site.closeWaitingModal();

                }
            });

        });

    }else{

        alert("目前無修改過的病床資料");

    }



};


var guiDeleteBed=function(bed_id,callback){
//刪除病床資料

        confirm("確定刪除嗎? ", function(result){

            if (result && bed_id){

                var bed_ids=Array();

                bed_ids.push(bed_id);

                $.ajax({
                    type: "post",
                    url: "/Bed/deleteBed",
                    data:{bed_ids:bed_ids},
                    success: function(data) {

                        //loadGuiBed();
                        callback(true);
                    }


                });

            }else{

                callback(true);

            }
        })


};



var dragAction=function( event, ui ) {

    //改成未儲存
    ui.helper[0].classList.add(g_unsaved_class);

};


var resizeAction=function( event, ui ) {

    //改成未儲存
    ui.element[0].classList.add(g_unsaved_class);


}