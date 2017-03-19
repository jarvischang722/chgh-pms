/**
 * Created by Jun on 2016/11/19.
 * 醫師排班用
 */
var globalData = $("div")[0]
var doctorInfo = {};  //被選擇的醫師
var globalSelDoctorInfoList = [];  //批次被選擇的醫師
var willDoSchedulingData = [];  //排班資料
/** willDoSchedulingData 資料結構
 [
 {doctor_no:'xxx', 'doctor_class_id'='5' , ward_id='123', bed_id='5555', schedule_date='2016/11/29'},
 {doctor_no:'xxx', 'doctor_class_id'='5' , ward_id='123', bed_id='5555', schedule_date='2016/11/29'},
 {doctor_no:'xxx', 'doctor_class_id'='5' , ward_id='123', bed_id='5555', schedule_date='2016/11/29'},
 ]
 * **/
$(function () {
    initialize();

    //病房排班
    $(document).on("click", ".ward_sel", function () {
        if (!checkDoctorSel()) return;
        var selWardID = $(this).parents("tr").data("ward_id");
        $(this).parents("tbody").find(" tr[data-ward_id='" + selWardID + "']").each(function () {
            var ori_doctor = $(this).find("." +  tranDoctorClassId(doctorInfo.doctor_class_name)).html().trim();  //要排班的那個病房目前的人員 沒有則為空
            $(this).find("." +  tranDoctorClassId(doctorInfo.doctor_class_name)).html(doctorInfo.doctor_name); //顯示
            willDoSchedulingData.push({
                doctor_no: doctorInfo.doctor_no,
                doctor_class_id: doctorInfo.doctor_class_id,
                bed_id: $(this).data("bed_id"),
                schedule_date: $("#doctorScheduleDateDiv").text()
            });
        })
    });
    /***
     * 醫生排班單日設定Modal
     * **/
    $('#day_room_select').datepicker({
        minDate: new Date(),
        dateFormat: 'yyyy/mm/dd',
        onSelect: function (dateText, date) {
            if (!_.isEmpty(dateText)) {
                $("#doctorScheduleDateDiv").html(dateText);
            }
            appendBedSchedulingStatus();
            var inst = $('[data-remodal-id=day_room_select_modal]').remodal();
            inst.open();
        }
    });


    //病床排班
    $(document).on("click", ".bed_sel", function () {
        if (!checkDoctorSel()) return;
        var selBedID = $(this).parents("tr").data("bed_id");
        var ori_doctor = $(this).parent().siblings("." + tranDoctorClassId(doctorInfo.doctor_class_name)).html().trim();  //要排班的那個病房目前的人員 沒有則為空
        if (!_.isEmpty(ori_doctor) && !_.isEqual(ori_doctor, doctorInfo.doctor_name)) {
            //判斷在暫存檔中有無相同一天和同病床的醫師
            var haveSelectedDoctorIdx = _.findIndex(willDoSchedulingData,
                {   bed_id: selBedID,
                    schedule_date: $("#doctorScheduleDateDiv").text()
                });
            if(haveSelectedDoctorIdx > -1){
                willDoSchedulingData.splice(haveSelectedDoctorIdx,1);
            }
        }

        $(this).parent().siblings("." + tranDoctorClassId(doctorInfo.doctor_class_name)).html(doctorInfo.doctor_name); //顯示
        willDoSchedulingData.push({
            doctor_no: doctorInfo.doctor_no,
            doctor_class_id: doctorInfo.doctor_class_id,
            bed_id: selBedID,
            schedule_date: $("#doctorScheduleDateDiv").text()
        });

    });

    //儲存排班
    $(document).on("click", "#saveDoctorSchedule", function (event) {
        event.preventDefault();
        $("[data-remodal-id='day_room_select_modal']").remodal().close();
        doSaveScheduling(function (success) {
            if (success) {
                willDoSchedulingData = [];
                appendBedSchedulingStatus();
                $("[data-remodal-id='day_room_select_modal']").remodal().open();
            }
        })

    })

    //儲存批次排班資料
    $(document).on("click", "#saveBatchScheduling", function () {
        /**
         * 1) 檢查資料有無未填
         * 2) 組合資料
         * 3) 儲存排班資料
         * **/
        if (globalSelDoctorInfoList.length <= 0) {
            alert("請選擇欲排班的醫師!");
            return;
        }
        if ($(".select_bed_checkbox:checked").length <= 0) {
            alert("請選擇欲排班的病床!");
            return;
        }
        if ($(".select_batch_date_checkbox:checked").length <= 0) {
            alert("請選擇欲排班的日期!");
            return;
        }

        $(".select_batch_date_checkbox:checked").each(function () {
            var theDate = this.value;
            $(".select_bed_checkbox:checked").each(function () {
                var theBed = this.value;
                _.each(globalSelDoctorInfoList, function (doctor) {
                    willDoSchedulingData.push({doctor_no: doctor.doctor_no,
                                               doctor_class_id: doctor.doctor_class_id,
                                               bed_id: theBed,
                                               schedule_date: theDate});
                })

            })
        });
        $("[data-remodal-id='setting_modal']").remodal().close();
        doSaveScheduling(function (success) {
            if (success) {
                /**  初始化批次設定視窗 ***/
                globalSelDoctorInfoList = [];
                $('.doctor_radio_pool').html('');
                $('.date_checklist_pool').html('');
                $("input[name='doctor_no_batch_sel']").attr("checked", false);
                $(".select_bed_checkbox").attr("checked", false);
                $(".select_batch_date_checkbox").attr("checked", false);
               // $("[data-remodal-id='setting_modal']").remodal().open();
            }
        })


    })

    //批次選擇醫生
    $(document).on("click", "input[name=doctor_no_batch_sel]", function () {
        var doctor = _.findWhere($.data(globalData, "doctorList"), {doctor_no: this.value}) || {};
        // 1) 檢查有無此醫生
        // 2) 檢查globalSelDoctorInfoList 有無此醫師類別 四個醫師類別只能各選一個醫師進行批次排班
        // 3) 更新畫面顯示被選到的醫師
        if (_.size(doctor) > 0) {

            var theClassDoctorIdx = _.findIndex(globalSelDoctorInfoList, {doctor_class_id: doctor["doctor_class_id"]})

            if (theClassDoctorIdx != -1) {
                globalSelDoctorInfoList[theClassDoctorIdx] = doctor;
            } else {
                globalSelDoctorInfoList.push(doctor);
            }

            var batchDoctorHtml = "<div>";
            _.each(globalSelDoctorInfoList, function (doctor) {
                batchDoctorHtml += doctor.doctor_name + " <span class='ban'>" + doctor.doctor_no + "</span>,  "
            })
            batchDoctorHtml += "</div>";
            $('.doctor_radio_pool').html(batchDoctorHtml);
        } else {
            alert("請選擇醫師");
        }

    });


})

//INIT
function initialize() {
    fetchDoctorList();
    fetchBedList();
    fetchDoctorClass();
}

//取醫師別
function fetchDoctorClass(){
    $.post("/doctor/getDoctorClass",function(result){
        if(result.success){
            var classRows = result.classRows;
            var classContentHtml = "";
            _.each(classRows, function(row){
                if(_.isEqual(row.doctor_class_name , "住院醫師") || _.isEqual(row.doctor_class_name , "實習醫師") ||
                    _.isEqual(row.doctor_class_name , "專科護理師") || _.isEqual(row.doctor_class_name , "見習醫師")
                ){

                    classContentHtml += "<option value='"+row.id+"'>"+row.doctor_class_name+"</option>"
                }

            });

            $("#doctor_class").append(classContentHtml);
            $("#doctor_class_batch").append(classContentHtml);
            filterShowDoctor();
        }

    })
}
//儲存
function doSaveScheduling(callback) {
    site.showWaitingModal("排班資料儲存中..");
    $.post("/doctor/saveDoctorScheduling", {schedulingDataList: willDoSchedulingData}, function (data) {
        site.closeWaitingModal();
        if (data.success) {
            willDoSchedulingData = [];
        }
        callback(data.success);
    })
}

//醫生列表
function fetchDoctorList() {
    $.post("/doctor/doctorQuery", function (result) {
        if (result.success) {
            $.data(globalData, "doctorList", result.doctorList);
            filterShowDoctor();
        }
    })
}

//顯示排班列表
function fetchBedList() {
    $.post("/Bed/queryAllBedInfo", function (data) {
        if (data.success) {
            showBedList(data.result.bedList);
        }
    })
}

//畫面顯示病床資訊
function showBedList(bedList) {
    var bedHtml = "";
    _.each(bedList, function (bed) {
        bedHtml += "<label>";
        bedHtml += "<input type='checkbox' value='" + bed.bed_id + "' class='option-input checkbox select_all_check_check select_bed_checkbox' /> " + bed.ward_name + "-" + bed.bed_name;
        bedHtml += "</label>";
    })

    $("#bedListDiv").html(bedHtml);
}

//打開單日排班更新modal 病床資料
function appendBedSchedulingStatus() {
    doctorInfo = {};                                            //初始化選擇的醫師
    willDoSchedulingData = [];                                  //初始化要儲存的排班資料
    $("input[name='doctor_no_radio']").prop('checked', false);  //初始化醫師選擇

    var schedule_date = $("#doctorScheduleDateDiv").html().trim();
    site.showWaitingModal();
    //病房排班狀態列表
    $.post("/Bed/queryBedSchedulingForDoctor", {schedule_date: schedule_date}, function (data) {
        site.closeWaitingModal();
        if (data.success) {
            createBedScheduleListTemplate(data.result)
        }
    })
}

//醫生選單更新
function filterShowDoctor() {
    doctorInfo = {};
    var doctor_class = $("#doctor_class").val();
    var doctor_class_batch = $("#doctor_class_batch").val();
    var doctorList = $.data(globalData, "doctorList");
    createDoctorListTemplate(_.where(doctorList, {doctor_class_id: doctor_class}) || []);
    createBatchDoctorListTemplate(_.where(doctorList, {doctor_class_id: doctor_class_batch}) || []);
}

//顯示醫生選單
function createDoctorListTemplate(doctorList) {
    var doctor_list_tmp = Handlebars.compile($("#doctor_list_template").html());
    $("#doctorListDiv").html(doctor_list_tmp({doctorList: doctorList}));
}

//顯示批次排班醫生選單
function createBatchDoctorListTemplate(doctorList) {
    var doctor_list_tmp = Handlebars.compile($("#doctor_list_batch_template").html());
    $("#batchDoctorListDiv").html(doctor_list_tmp({doctorList: doctorList}));
}


//顯示病床值班醫師選單
function createBedScheduleListTemplate(result) {
    var bed_list_tmp = Handlebars.compile($("#bed_doctor_scheduling_list_tr_template").html());
    $("#bedSchedulingDoctorTable tbody").html(bed_list_tmp(result));
}

//指定醫生排班
function selDoctor() {
    var doctorList = $.data(globalData, "doctorList");
    doctorInfo = _.findWhere(doctorList, {doctor_no: $("input[name='doctor_no_radio']:checked").val()}) || {};
}

//醫師類別轉換ID
function tranDoctorClassId(doctor_class) {
    var doctor_class_id = "";
    switch (doctor_class) {
        case '住院醫師':
            doctor_class_id = "resident";
            break;
        case '實習醫師':
            doctor_class_id = "intern";
            break;
        case '專科護理師':
            doctor_class_id = "specialist_nurse";
            break;
        case '見習醫師':
            doctor_class_id = "trainee";
            break;
    }

    return doctor_class_id;
}

//檢查有無選擇醫生
function checkDoctorSel() {
    if (_.size(doctorInfo) <= 0) {
        alert("請先選擇欲排班的醫師");
        return false;
    }
    return true;
}