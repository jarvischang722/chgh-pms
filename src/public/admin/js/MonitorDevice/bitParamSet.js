//畫面變數
var bit_class={};
$(function () {
    initialize(); //初始執行

    //dom event
    $("#submit_btn").click(doSubmit);
    $("#update_btn").click(doUpdate);

    $(document).on('click', '.edit_bit_bed_config', function () {
        var data = $(this);
        editBitBedConfig(data.data());
    });

    /*
    $("#delete_btn").click(doDelete);

    $('input[type=radio][name=mission_types]').change(function() {
        console.log(this.value);
        getfmList(this.value);
    });
    */
});
/**
 *
 */
function initialize() {
    //點滴共用參數設定
    $.ajax({
        method: "GET",
        url: "api/getBitSet",
        data: {}
    }).done(function (response) {
        if (response.success) {
            //點滴測量方式
            var measure_method = response.result[0].measure_method;
            $('input:radio[name="drop_types"]').filter('[value="'+measure_method+'"]').attr('checked', true);
            //點滴共用參數設定
            var config_results = {
                items: response.result
            };
            var tmp = Handlebars.compile($("#config_temp").html());
            $('#bitConfigdiv').html("");
            $('#bitConfigdiv').append(tmp(config_results));
            var tmp2 = Handlebars.compile($("#other_config_temp").html());
            $('#other_bitConfigdiv').html("");
            $('#other_bitConfigdiv').append(tmp2(config_results));
        } else {
            alert(response.errorMsg);
        }
    });
    //個別點滴參數
    getBitBedConfig();
    //點滴種類下拉選單
    $.ajax({
        method: "GET",
        url: "queryBitClass"
    }).done(function (response) {
        // console.log("點滴種類下拉選單");
        // console.log(response);
        bit_class = response.result;
    });
}

function getBitBedConfig(){
    var bed = $('#bed_input').val();
    var patient = $('#patient_input').val();
        $.ajax({
        method: "POST",
        url: "api/getBitBedConfig",
        data: {bed:bed,patient:patient}
    }).done(function (response) {
        // console.log("個別點滴參數");
        // console.log(response);
        if (response.success) {
            var results = {
                items: response.result
            };
            var tmp = Handlebars.compile($("#bit_bed_config_temp").html());
            $('#bit_bed_config_tbody').html("");
            $('#bit_bed_config_tbody').append(tmp(results));

            //筆數顯示
            $('#bit_bed_num').html(response.result.length);
        } else {
            alert(response.errorMsg);
        }
    });
}

/**
 * 確定btn
 */
function doSubmit() {
    event.preventDefault();
    var data={};
    $("form#config_form :input").each(function(){
        var input = $(this);
        data[input.attr("name")] = input.val();
    });
    $("form#other_config_form :input").each(function(){
        var input = $(this);
        data[input.attr("name")] = input.val();
    });
    data["measure_method"] = $('input[name="drop_types"]:checked').val();
    $.ajax({
        method: "POST",
        url: "api/updateBitSet",
        data: {"config":data}
    }).done(function (response) {
        if (response.success) {
            //alert("修改成功!");
        } else {
            alert(response.errorMsg);
        }
    });
}

/**
 * 編輯個別點滴參數畫面
 */
function editBitBedConfig(data) {
    data.bit_class = bit_class;
    var results = {
        items: data
    };
    var tmp = Handlebars.compile($("#edit_bit_bed_config_temp").html());
    $('#edit_bit_bed_config_div').html("");
    $('#edit_bit_bed_config_div').append(tmp(results));
}

/**
 * 更新個別點滴參數
 */
function doUpdate() {
    var data={};
    $("form#ed_form01 :input,select").each(function(){
        var input = $(this);
        if(input.is("select")){
            data[input.attr("name")] = input.val();
        }else{
            data[input.attr("name")] = input.val();
        }
    });
    $("form#ed_form02 :input,select").each(function(){
        var input = $(this);
        data[input.attr("name")] = input.val();
    });
    // console.log("doUpdate");
    // console.log(data);
    $.ajax({
        method: "POST",
        url: "api/updateBitBedConfig",
        data: data
    }).done(function (response) {
        if (response.success) {
            getBitBedConfig();
            //alert("編輯成功!");
        } else {
            alert(response.errorMsg);
        }
    });
}