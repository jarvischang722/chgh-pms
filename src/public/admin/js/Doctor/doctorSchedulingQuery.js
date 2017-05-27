/**
 * Created by Jun on 2016/11/18.
 */
var global_AllDoctorSchedulingList = [];
$(function () {
    initialize(); //初始執行
    $("#search").click(function (event) {
        event.preventDefault();
        updateAllDoctorScheduling();
    })

});

function initialize() {
    updateAllDoctorScheduling();
    fetchDoctorClass();
}



//更新顯示資料
function updateAllDoctorScheduling() {
    var conditions = {};
    $.post("/doctor/queryDoctorScheduling", conditions, function (result) {
        global_AllDoctorSchedulingList = groupSchedulingData(result.AllDoctorSchedulingList);
        if (result.success) {
            var SchedulingList = filterSchedulingData();
            console.log(SchedulingList);
            createDoctorSchedulingTemplate(SchedulingList);
        }

    })
}

//取醫師別
function fetchDoctorClass(){
    $.post("/doctor/getDoctorClass",function(result){
        if(result.success){
            var classRows = result.classRows;
            var classContentHtml = "";
            _.each(classRows, function(row){
                classContentHtml += "<option value='"+row.id+"'>"+row.doctor_class_name+"</option>"
            });
            $("#doctor_class").append(classContentHtml);
        }

    })
}

//分組
function groupSchedulingData(AllDoctorSchedulingList) {

    var groups = _.groupBy(AllDoctorSchedulingList, function (value) {
        return value.doctor_no + '#' + value.schedule_date;
    });
    //console.log(groups);
    var data = _.map(groups, function (group) {
        var bed_list = [];
        _.each(group, function(bedItem){
            bed_list.push(bedItem.district_name+"-"+bedItem.ward_zone_name+"-"+bedItem.ward_name+"-"+bedItem.bed_name);
        })

        return {
            doctor_no: group[0].doctor_no,
            doctor_name: group[0].doctor_name,
            doctor_class_id: group[0].doctor_class_id,
            doctor_class_name: group[0].doctor_class_name,
            schedule_date: group[0].schedule_date,
            bed_list: _.sortBy(bed_list)
        }
    });
    return data;

}

//過濾資料
function filterSchedulingData() {
    var schedulingList = global_AllDoctorSchedulingList;
    var doctor_class = $("#doctor_class").val();  //醫師別
    var ope_range = $("#ope_range").val();     //區間
    var doctor_name = $("#doctor_name").val();   //醫師姓名
    if (!_.isEqual(doctor_class, "0")) {
        schedulingList = _.filter(schedulingList, function (s_item) {
            return _.isEqual(s_item.doctor_class_id, doctor_class);
        })
    }

    if (!_.isEmpty(ope_range)) {


        var start_date = s.words(ope_range, "~")[0];
        var end_date = s.words(ope_range, "~")[1];
        schedulingList = _.filter(schedulingList, function (s_item) {

            return moment(new Date(s_item.schedule_date)).diff(new Date(start_date), "days") >= 0;
        })

        if (!_.isUndefined(end_date)) {

            schedulingList = _.filter(schedulingList, function (s_item) {
                return moment(new Date(end_date)).diff(new Date(s_item.schedule_date), "days") >= 0;
            })
        }

    }

    if (!_.isEmpty(doctor_name)) {
        schedulingList = _.filter(schedulingList, function (s_item) {
            return s.include(s_item.doctor_name, doctor_name)
        })
    }

    return schedulingList;
}


//將資料寫入modal
function appendBedList(doctor_no, schedule_date) {
    var bed_list_info = _.findWhere(global_AllDoctorSchedulingList, {
        doctor_no: doctor_no,
        schedule_date: schedule_date
    });
    createBedListTemplate(bed_list_info);
}


//顯示排班清單
function createDoctorSchedulingTemplate(SchedulingList) {
    var doctor_tmp = Handlebars.compile($("#doctor_show_scheduling_list_tbody_template").html());
    $("#doctorSchedulingTable tbody").html(doctor_tmp({AllDoctorSchedulingList: SchedulingList}));
}

//顯示床位
function createBedListTemplate(bed_list_info) {
    var bed_tmp = Handlebars.compile($("#doctor_bed_list_template").html());
    $("#bed_list_modal").html(bed_tmp(bed_list_info));
}