/**
 * Created by Eason on 2017/4/8.
 */
$(function () {
    initialize(); //初始執行
    //body dom event
    $('body').on("click", "#refresh", function(event) {
        event.preventDefault();
        initialize();
    });
});

function initialize(){
    $.ajax({
        method: "GET",
        url: "api/getDischargeNote"
    }).done(function( result_obj ) {
        console.log(result_obj.result);
        var result_tbody = new Vue({
            el: '#result_tbody',
            data: {
                results: result_obj.result
            }
        });
    });
}