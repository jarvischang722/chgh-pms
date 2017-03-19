//畫面變數
var mission_group = [], fire_group = [];
var thisyear, thismonth, thisday;
var nurse_no, nurse_name, sche_class, thisdate;
var class_name;
var selected_nurse={};
var nurseList = [];
var agents={};
$(function () {
    initialize(); //初始執行

    //dom event
    $("#submit_btn").click(sumbitData);
    $("#addnurse_btn").click(addNurse);
    $("#check_btn").click(addNurseToList);

    //日期 click event
    $(document).on('click', '.datepicker--cell-day', function () {
        //參數初始化
        nurse_no = null;
        nurse_name = null;
        selected_nurse={};

        var data = $(this);
        showDetail(data.data());
    });

    //班別 change event
    $(document).on('click', '.pws_tab_active', function () {
        sche_class = $(this).find("i:first").attr("scheclass");
        class_name = $(this).find("i:first").attr("schename");
        var data = {sche_class: sche_class, year: thisyear, month: thismonth, date: thisdate};
        setNurseSche(data);
    });

    //護理師 tr click event
    $(document).on('click', '.nurse_tr', function () {
        nurse_no = $(this).data().nurse_no;
        nurse_name = $(this).data().nurse_name;
        //變更底色
        $('.nurse_tr').removeClass("backgroundcolor01");
        $(this).addClass("backgroundcolor01");
    });

    //全部護理師 tr click event
    $(document).on('click', '.select_nurse', function () {
        //變更底色
        $(this).toggleClass("backgroundcolor01");

        if($(this).attr("data-selected")=="Y"){
            $(this).attr("data-selected","N");
        }else{
            $(this).attr("data-selected","Y");
        }
    });

    //病床 click event
    $(document).on('click', '.bed_btn', function () {
        event.preventDefault();
        if (nurse_no) {
            //變更病床數量
            console.log("bed_btn->");
            console.log($(this).data());
            var pre_nurse_no = $(this).data().nurse_no;
            if(pre_nurse_no!=nurse_no){
                var new_bednum = parseInt($('#bed_num_'+nurse_no).html());
                $('#bed_num_'+nurse_no).html(new_bednum+1);
                var old_bednum = parseInt($('#bed_num_'+pre_nurse_no).html());
                $('#bed_num_'+pre_nurse_no).html(old_bednum-1);
            }else{
                alert("此班別已是您目前所選擇的護理師值班");
            }

            $(this).data({"nurse_no":nurse_no,"class":sche_class,"assign_date":thisdate,"ischanged":"Y"})
            //$(this).attr("data-nurse_no", nurse_no);
            //$(this).attr("data-class", sche_class);
            //$(this).attr("data-assign_date", thisdate);
            //$(this).attr("ischanged", "Y");
            $(this).parent().find(".doctor").html(nurse_name);
        } else {
            alert("請先選擇護理師");
        }
    });
});
/**
 *
 */
function initialize() {
    //取得所有編組
    mission_group = [];
    fire_group = [];
    $.ajax({
        method: "GET",
        url: "api/getAllMissionGroup",
        //data: $( "#form1" ).serialize()
        //data: {}
    }).done(function (response) {
        showAjaxResponeMsg(this.url,response);
        if (response.success) {
            mission_group = response.result;
        } else {
            e_alertMsg(response);
        }
    });
    $.ajax({
        method: "GET",
        url: "api/getAllFireGroup",
        //data: $( "#form1" ).serialize()
        //data: {}
    }).done(function (response) {
        showAjaxResponeMsg(this.url,response);
        if (response.success) {
            fire_group = response.result;
        } else {
            e_alertMsg(response);
        }
    });
    //代理人
    $.ajax({
        method: "GET",
        url: "api/getAllNurse",
        //data: $( "#form1" ).serialize()
        //data: {}
    }).done(function( response ) {
        showAjaxResponeMsg(this.url,response);
        if(response.success){
            agents = response.result;
        }else{
            e_alertMsg(response);
        }
    });
}
/**
 * 病房詳細資訊
 * @param data 病房詳細資訊
 */
function showDetail(data) {
    $('#remodal_header').html("");
    $('#all_ward_tbody1').html("");
    $('#all_ward_tbody2').html("");
    $('#all_ward_tbody3').html("");

    data.month = data.month + 1;
    thisyear = data.year;
    thismonth = data.month;
    thisday = data.date;
    thisdate = thisyear + "/" + thismonth + "/" + thisday;
    var results = {
        results: data
    };
    var tmp = Handlebars.compile($("#remodal_header_temp").html());
    $('#remodal_header').append(tmp(results));
    //取得所有病床
    $.ajax({
        method: "GET",
        url: "api/getAllBedByWard",
        data: {}
    }).done(function (response) {
        showAjaxResponeMsg(this.url,response);
        if (response.success) {
            var wards_results = {
                wards: response.result
                , class_id: "01"
            };
            var tmp = Handlebars.compile($("#all_ward_tbody_temp").html());
            $('#all_ward_tbody1').append(tmp(wards_results));
            var wards_results = {
                wards: response.result
                , class_id: "02"
            };
            $('#all_ward_tbody2').append(tmp(wards_results));
            var wards_results = {
                wards: response.result
                , class_id: "03"
            };
            $('#all_ward_tbody3').append(tmp(wards_results));

            //$('.pws_tab_active').trigger( "click" );
             sche_class = "01";
             class_name = "白班";
             data.sche_class = sche_class;
             setNurseSche(data);
        } else {
            e_alertMsg(response);
        }
    });
}
/**
 * 排班記錄
 * @param data
 */
function setNurseSche(data) {
    $.ajax({
        method: "POST",
        url: "api/queryNurseSche",
        data: {"start_date": thisdate, "end_date": thisdate, "sche_class": data.sche_class}
    }).done(function (response) {
        showAjaxResponeMsg(this.url,response);
        var rtnList = response.result;
        nurseList = [];
        var nurseobj = {};
        for (var i = 0; i < rtnList.length; i++) {
            var thissche = rtnList[i];
            var nurse_no = thissche.nurse_no;
            var nurse_name = thissche.nurse_name;
            var ward_id = thissche.ward_id;
            var bed_id = thissche.bed_id;
            //加入已選擇護士清單
            selected_nurse[nurse_no]="Y";
            //左側護士清單整理
            var thisnurse;
            if (nurse_no in nurseobj) {
                thisnurse = nurseobj[nurse_no];
                thisnurse.bed_num = thisnurse.bed_num + 1;
            } else {
                thisnurse = {
                    nurse_no: nurse_no
                    , nurse_name: nurse_name
                    , tel: thissche.tel
                    , fire_control_group_id: thissche.fire_control_group_id
                    , mission_group_id: thissche.mission_group_id
                    , agent1_nurse_id: thissche.agent1_nurse_id
                    , agent2_nurse_id: thissche.agent2_nurse_id
                    , agent3_nurse_id: thissche.agent3_nurse_id
                    , bed_num: 1
                    , mission_group: mission_group
                    , fire_group: fire_group
                    , agents: agents
                }
                nurseobj[nurse_no] = thisnurse;
                nurseList.push(thisnurse);
            }
            //產生左側護士清單
            var nurses_results = {
                nurses: nurseList
            };
            var tmp = Handlebars.compile($("#nurse_insche_temp").html());
            $('#nurse_tbody' + data.sche_class).html("");
            $('#nurse_tbody' + data.sche_class).append(tmp(nurses_results));

            //右側護士排班整理
            $('#label-' + ward_id + "-" + bed_id + "-" + data.sche_class).find("span:last").html(nurse_name);
            $('#a-' + ward_id + "-" + bed_id + "-" + data.sche_class).attr("data-nurse_no", nurse_no);
            $('#a-' + ward_id + "-" + bed_id + "-" + data.sche_class).attr("data-class", data.sche_class);
            $('#a-' + ward_id + "-" + bed_id + "-" + data.sche_class).attr("data-assign_date", thisdate);
        }
        
    });
}
/**
 * 提交排班與護士資訊
 */
function sumbitData() {
    var updateNurse = [];
    //左側護理師
    $("#nurse_tbody01").children(".nurse_tr").each(function (index, element) {
        var data = $(this).data();
        data.mission_group_id = $(this).find(".mission_select").val();
        data.fire_control_group_id = $(this).find(".fire_select").val();
        data.agent1_nurse_id = $(this).find(".agent_select1").val();
        data.agent2_nurse_id = $(this).find(".agent_select2").val();
        data.agent3_nurse_id = $(this).find(".agent_select3").val();
        updateNurse.push(data);
    });
    //右側排班資料
    var updateNurseSche = [];
    $(".bed_btn").each(function (index, element) {
        var data = $(this).data();
        if(data.ischanged == "Y"){
            updateNurseSche.push(data);
        }
    });

    $.ajax({
        method: "POST",
        url: "api/updateNurseGroup",
        data: {"updateNurse": updateNurse,"updateNurseSche": updateNurseSche}
    }).done(function (response) {
        showAjaxResponeMsg(this.url,response);
        if (response.success) {
            initialize();
            //alert("修改完成!");
        } else {
            e_alertMsg(response);
        }
    });
}
/**
 * 加入其他護理師
 */
function addNurse() {
    $.ajax({
        method: "GET",
        url: "api/getAllNurse2"
    }).done(function (response) {
        showAjaxResponeMsg(this.url,response);
        if (response.success) {
            var result = response.result;
            for(var i=0;i<result.length;i++){
                var thisnurse = result[i];
                if(thisnurse.employee_no in selected_nurse){
                    thisnurse.selected = "Y";
                }
            }
            var wards_results = {
                nurses: result
                ,thisdate:thisdate
                ,class_name:class_name
            };
            var tmp = Handlebars.compile($("#all_nurse_tbody_temp").html());
            $('#all_nurse_tbody').html("");
            $('#all_nurse_tbody').append(tmp(wards_results));
        } else {
            e_alertMsg(response);
        }
    });
}
/**
 * 加入其他護理師到清單中
 */
function addNurseToList() {
    //左側護理師
    $(".select_nurse").each(function (index, element) {
        var data = $(this).data();
        if(data.selected=="Y" && !selected_nurse[data.nurse_no]){
            data["mission_group"] = mission_group;
            data["fire_group"] = fire_group;
            data["agents"] = agents;
            nurseList.push(data);
            selected_nurse[data.nurse_no]="Y";
        }
    });
    //產生左側護士清單
    var nurses_results = {
        nurses: nurseList
    };
    var tmp = Handlebars.compile($("#nurse_insche_temp").html());
    $('#nurse_tbody' + sche_class).html("");
    $('#nurse_tbody' + sche_class).append(tmp(nurses_results));
}

