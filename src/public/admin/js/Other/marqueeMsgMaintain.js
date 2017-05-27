//畫面變數
$(function () {
    initialize(); //初始執行

    //dom event
    $("#insert_btn").click(doInsert);
    $("#update_btn").click(doUpdate);
    $("#delete_btn").click(doDelete);

    $(document).on('click', '.edit_marquee', function () {
        var data = $(this);
        edit_marquee(data.data());
    });
    $(document).on('click', '#new_btn', function () {
        $( "#insert_form" )[0].reset();
    });
});
/**
 *
 */
function initialize() {
    //跑馬燈
    $.ajax({
        method: "GET",
        url: "api/getAllMarquee",
    }).done(function (response) {
        console.log(response);
        if (response.success) {
             var marquees_results = {
                 marquees: response.result
             };
             var tmp = Handlebars.compile($("#marqueemsg_temp").html());
             $('#all_marquee_body').html("");
             $('#all_marquee_body').append(tmp(marquees_results));

            //筆數
            $('#marquee_num').html(response.result.length);
        } else {
            alert(response.errorMsg);
        }
    });
}
/**
 * 新增跑馬燈
 */
function doInsert() {
    $.ajax({
        method: "POST",
        url: "api/insertMarquee",
        data: $( "#insert_form" ).serialize()
    }).done(function (response) {
        if (response.success) {
            initialize();
            //alert("新增成功!");
        } else {
            alert(response.errorMsg);
        }
    });
}
/**
 * 編輯跑馬燈
 */
function edit_marquee(data) {
    var marquee_results = {
        marquees: data
    };
    var tmp = Handlebars.compile($("#edit_marquee_temp").html());
    $('#edit_marquee_div').html("");
    $('#edit_marquee_div').append(tmp(marquee_results));

    $('.datepicker-here').datepicker({
        minDate: new Date(),
    });
    $('.color_picker').minicolors({
        position: 'bottom right',
    });
}
/**
 * 更新跑馬燈
 */
function doUpdate() {
    $.ajax({
        method: "POST",
        url: "api/updateMarquee",
        data: $( "#update_form" ).serialize()
    }).done(function (response) {
        if (response.success) {
            initialize();
            //alert("編輯成功!");
        } else {
            alert(response.errorMsg);
        }
    });
}
/**
 * 刪除跑馬燈
 */
function doDelete() {
    event.preventDefault();

    confirm("確定刪除嗎? ", function(result){
        if (result){
//取得checkbox selected
            var searchIDs = $("#marquee_table input:checkbox:checked").map(function () {
                return {'id': $(this).val()};
            }).get();

            $.ajax({
                method: "POST",
                url: "api/deleteMarquee",
                data: {"marquees": searchIDs}
            }).done(function (response) {
                    if (response.success) {
                        initialize();
                        //alert("刪除成功!");
                    } else {
                        alert(response.errorMsg);
                    }
                });
        }
    })




}
