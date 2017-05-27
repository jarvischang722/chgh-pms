/**
 * Created by Jun on 2016/12/4.
 */
var globalDrClassList = [];
var globalDrClassId = null;
$(function () {

    initial();


    //Listening 刪除事件
    $("#delClass-btn").click(function () {
        doDeleteDoctorClass();
    });
    //Listening 新增按鈕打開
    $(document).on("click", ".addClass-btn", function (event) {
        event.preventDefault();
        globalDrClassId = null;
        addDoctorClass();
    });
    //Listening 編輯按鈕打開
    $(document).on("click", ".editDrClass-btn", function (event) {
        event.preventDefault();
        var dr_class_id = $(this).parents("tr").data("doctor_class_id");    //取得編輯類別ID
        globalDrClassId = dr_class_id;
        $("#update_dr_class_name").val(_.findWhere(globalDrClassList, {id: dr_class_id}).doctor_class_name); //匯入資料
        $("[data-remodal-id='edit_dr_class_modal']").remodal().open();
    });
});

//初始化
function initial() {
    fetchDoctorClass();
}

//取醫師別
function fetchDoctorClass() {
    site.showWaitingModal("資料讀取中..");
    $.post("/doctor/getDoctorClass", function (result) {
        site.closeWaitingModal();
        if (result.success) {
            globalDrClassList = result.classRows;
            createDoctorClassListTemplate(globalDrClassList);
        }
    })
}


//刪除醫師名稱
function doDeleteDoctorClass() {

    var doctor_class_no_list = [];
    $("input[name='doctor_class_checkbox']:checked").each(function () {
        doctor_class_no_list.push($(this).val());
    });
    if (doctor_class_no_list.length == 0) {
        alert("請選擇欲刪除的醫師類別");
        return;
    }


    confirm("確定要刪除選取的類別?", function (result) {
        if (result) {
            site.showWaitingModal("請稍後..");
            $.post("/doctor/deleteDoctorClass", {doctor_class_no_list: doctor_class_no_list}, function (result) {
                site.closeWaitingModal();
                if (result.success) {
                    fetchDoctorClass();
                } else {
                    alert("刪除失敗:" + result.errorMsg);
                }
            })
        }
    })


}

//顯示醫師類別清單
function createDoctorClassListTemplate(DrClassList) {
    var doctor_Class_list_tmp = Handlebars.compile($("#doctor_class_list_template").html());
    $("#drClassTable tbody").html(doctor_Class_list_tmp({doctorClassList: DrClassList}));
}

//新增
function addDoctorClass() {
    var doctor_class_name = $("#dr_class_name").val().trim();
    if (_.isEmpty(doctor_class_name)) {
        alert("請輸入醫師類別");
        return;
    } else {
        site.showWaitingModal("請稍後");
        $.post("/doctor/addDoctorClass", { doctor_class_name: doctor_class_name}, function (result) {
            if(result){
                site.closeWaitingModal();
                fetchDoctorClass();
                $("#dr_class_name").val('');
            }else{
                alert(result.errorMsg);
            }

        })
    }
}

//更新
function updateDoctorClass() {
    var doctor_class_id = _.isNull(globalDrClassId) ? undefined : globalDrClassId;
    var doctor_class_name = $("#update_dr_class_name").val().trim();
    if (_.isEmpty(doctor_class_name)) {
        alert("請輸入醫師類別");
        return;
    } else {
        site.showWaitingModal("請稍後");
        $.post("/doctor/addDoctorClass", {doctor_class_id: doctor_class_id, doctor_class_name: doctor_class_name}, function (result) {
            site.closeWaitingModal();
            if(result.success) {
                fetchDoctorClass();
                $("#update_dr_class_name").val('');
                $("[data-remodal-id='edit_dr_class_modal']").remodal().close();
            }else{
                alert(result.errorMsg);
            }
        })
    }
}
