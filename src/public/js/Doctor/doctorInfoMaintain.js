/**
 * Created by Jun on 2016/11/27.
 */

var globalDoctorList = [];
var inst_doctor_modal = $('[data-remodal-id=doctorInfo_modal]').remodal();
$(function () {

    initial();

    //監聽編輯醫師按鈕
    $(document).on("click",".editDoctor",function(event){
        event.preventDefault();
        $(".create-btn").hide();
        $(".update-btn").show();
        $("#doctorForm")[0].reset();
        $("#doctorForm2")[0].reset();
        var doctor_no = String($(this).parents("tr").data("doctor_no")) || "";

        if(!_.isEmpty(doctor_no)){
            site.showWaitingModal();
            $.post("/doctor/doctorQuery",{doctor_no:doctor_no},function(result){
                site.closeWaitingModal();
                var doctorInfo = result.doctorList.length > 0 ? result.doctorList[0] : {};

                if(_.size(doctorInfo) > 0){
                    _.each(Object.keys(doctorInfo) , function(doctorkey){
                          $("#"+doctorkey).val(doctorInfo[doctorkey]);
                    });
                    $("#doctor_class").val(doctorInfo["doctor_class_id"]||"");
                    $("input:radio[name='enabled']").filter("[value='"+doctorInfo.enabled+"']").prop('checked', true);

                    inst_doctor_modal.open();
                }else{
                    alert("找醫師無資訊!");
                }

            })

        }else{
            alert("system error!");
        }

    })

    //監聽新增醫師按鈕
    $(document).on("click","#addDoctor",function(event){
        event.preventDefault();
        $(".create-btn").show();
        $(".update-btn").hide();
        $("#doctorForm")[0].reset();
        $("#doctorForm2")[0].reset();
        inst_doctor_modal.open();
    })

});

//初始化
function initial(){
    fetchDoctorList();
    fetchDoctorClass();
    fetchWardZone();
}

//抓取醫師
function fetchDoctorList(){
    site.showWaitingModal();
    $.post("/doctor/doctorQuery",function(doctorData){
        site.closeWaitingModal();
        if(doctorData.success){
            globalDoctorList = doctorData.doctorList;
        }
        showDoctorList();

    })
}

//抓取醫師別
function fetchDoctorClass(){
    $.post("/doctor/getDoctorClass",function(result){
        if(result.success){
            var classRows = result.classRows;
            var classContentHtml = "";
            _.each(classRows, function(row){
                classContentHtml += "<option value='"+row.id+"'>"+row.doctor_class_name+"</option>"
            });
            $("#doctor_class").append(classContentHtml);
            $("#doctor_class_sel").append(classContentHtml);
        }

    })
}

//抓取病房資訊
function fetchWardZone(){
    $.get("/bed/getAllWardZone",function(data){
        if(data.success){
            var wardZoneList = data.result;
            var wardZoneContent = "";
            _.each(wardZoneList, function(wz){
                wardZoneContent += "<option value='"+wz.id+"'>"+wz.ward_zone_name+"</option>"
            })

            $("#ward_zone_sel").append(wardZoneContent);

        }

    })
}

//顯示醫生清單
function showDoctorList(){
    var showDoctorList = filterDoctor(globalDoctorList);
    var doctor_tmpl = Handlebars.compile($("#doctor_list_template").html());
    $("#doctorTotalNum").text(showDoctorList.length);  //顯示數量
    $("#doctorTable tbody").html(doctor_tmpl({doctorList: showDoctorList}));
}

//過濾醫師條件
function filterDoctor(doctorList){

    var ward_zone_sel = $("#ward_zone_sel").val();
    var doctor_class_sel = $("#doctor_class_sel").val();
    if(!_.isEqual(ward_zone_sel, "0")){
        doctorList=_.filter(doctorList, function(drItem){  return  _.isEqual(drItem.ward_zone_id , ward_zone_sel) })
    }

    if(!_.isEqual(doctor_class_sel, "0")){
        doctorList=_.filter(doctorList, function(drItem){  return  _.isEqual(drItem.doctor_class_id, doctor_class_sel) })
    }

    return doctorList;

}

//刪除醫師
function doDelDoctor(){
    var doctor_checkbox = [];
    var doctor_no_list = [];
    $("input[name='doctor_checkbox']:checked").each(function () {
        doctor_no_list.push($(this).val());
    })

    if (doctor_no_list.length > 0) {

        confirm("確定刪除嗎? ", function(result){
            if (result){
                $.post('/doctor/delectDoctor', {doctor_no_list: doctor_no_list}, function (data) {
                    if(data.success){
                        fetchDoctorList();
                    }else{
                        alert("系統刪除失敗");
                    }
                })
            }
        })



    } else {
        alert("請勾選要刪除的醫師");
    }
}

//儲存新增醫師
function doCreatDoctor(){
    $.post("/doctor/updateDoctor",{doctorInfoObj:getDoctorFieldObject('add') , update_kind:'add'} , function(result){

        if(result.success){
            fetchDoctorList();
            inst_doctor_modal.close();
        }else{
            alert(result.errorMsg);
        }

    })

}

//儲存修改醫師
function doUpdateDoctor(){

    $.post("/doctor/updateDoctor",{doctorInfoObj:getDoctorFieldObject('update') , update_kind:'update'} , function(result){
        if(result.success){
            fetchDoctorList();
            inst_doctor_modal.close();
        }else{
            alert(result.errorMsg);
        }

    })

}

//取資料
function getDoctorFieldObject(update_kind){
    var doctorObj = {};
    $('form :input').each(function() {
        doctorObj[this.name] = $(this).val();
        if(!_.isUndefined(doctorObj["doctor_class"])){
            doctorObj["doctor_class_id"] = doctorObj["doctor_class"];
        }

    })

    delete doctorObj["doctor_class"];

    doctorObj["enabled"] = $("input[name='enabled']:checked").val();

    return doctorObj;
}