/**
 * Created by Jun on 2016/12/12.
 */
var globalBitDeviceAssign = [];
var selectedBedId = "";
$(function(){
    initial();
    /** controller  **/
    $(document).on("click",".openEditDevice",openEditBitDevice);
    $(document).on("click","#editBitDevice",doEditBitDevice);
});

/** service  **/
function initial(){
    fetchBitDevice();
}

//抓取點滴裝置資訊
function fetchBitDevice(){
    site.showWaitingModal("請稍後...");
    $.post("/monitor/queryBitDeviceAssign",function(data){
        site.closeWaitingModal();
        if(data.success){
            globalBitDeviceAssign = data.result.bitDeviceList;
            showBitDeviceList();
        }
    })
}

//編輯
function openEditBitDevice(){
    selectedBedId = $(this).parents("li").data("bed_id");
    var deviceInfo = _.findWhere(globalBitDeviceAssign, {bed_id:selectedBedId});
    $("#ward_bed_name_span").text(deviceInfo.ward_bed_name);
    $("input[id^='bit_no']").val('');
    _.each(deviceInfo.bitNoList,function(device,dIdx){
         if(dIdx < 3)
           $("#bit_no"+(dIdx+1)).val(device.bit_no);
    });
    $("[data-remodal-id='edit_modal']").remodal().open();
}

/**
 * 儲存編輯裝置
 * **/
function doEditBitDevice(){
    var bitParam = [];
    site.showWaitingModal("請稍後...");
    $("form input[id^='bit_no']").each(function(){
        if(!_.isEmpty($(this).val())){
            bitParam.push({
                bed_id : selectedBedId,
                bit_no : $(this).val()
            });
        }
    })
    $.post("/monitor/saveBitDeviceAssign",{bed_id : selectedBedId,bitDeviceParam:bitParam},function(result){
        site.closeWaitingModal();
        if(result.success){
            $("[data-remodal-id='edit_modal']").remodal().close();
            fetchBitDevice();
        }else{
            alert(result.errorMsg);
        }
    })
 ;
}

/** views  **/

//顯示病床點滴分派資訊
function showBitDeviceList(){
    var bitDeviceTemplate = Handlebars.compile($("#bit_assign_record_template").html());
    $(".bit_assign_container").html(bitDeviceTemplate({bitDeviceList:globalBitDeviceAssign}));
}