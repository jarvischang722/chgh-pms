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
        url: "api/getAnnouncement",
        //data: $( "#form1" ).serialize()
        //data: {}
    })
        .done(function( result_obj ) {
            console.log(result_obj);
            var announcement_results = {
                announcements: result_obj.result
            };
            var tmp = Handlebars.compile($("#announcement_temp").html());
            $('#announcement_tbody').html("");
            $('#announcement_tbody').append(tmp(announcement_results));
        });
}
