var G_intervalInst;

$(function () {
    initializeMarquee(); //初始執行
    SIPGetCheckInterval();
});

function initializeMarquee() {

    $.ajax({
        method: "GET",
        url: "/api/getMarquee"
    })
        .done(function (result_obj) {

            var marquee_results = {
                marquees: result_obj.result
            };
            var tmp = Handlebars.compile($("#marquee_temp").html());
            $('#footer_inner').html("");
            $('#footer_inner').append(tmp(marquee_results));

        });
}

/**
 * 區間設定
 * @constructor
 */
function SIPGetCheckInterval() {

    try {
        //clear origin Interval
        clearInterval(G_intervalInst);
    } catch (e) {
        console.error('clear interval error ! ');
    }


    //在這個頁面裡面，每5分鐘去檢查一次sip的phone是否上線
    $.get("/SystemMaintain/SIPGetCheckInterval", function (result) {

        var checkMinInterval = 5;

        try {

            checkMinInterval = result["result"];
            SIPCheckIsOnline();

            G_intervalInst = setInterval(function () {
                SIPCheckIsOnline();
            }, checkMinInterval * 1000 * 60);

        } catch (e) {


        }



    })
}

/**
 * sip 裝置異常檢查並將異常裝置顯示在跑馬燈中
 * @constructor
 */
function SIPCheckIsOnline() {

    $.get("/SystemMaintain/SIPCheckIsOnline", function (result) {

        try {
            console.log("start fetch offline SIP");
            console.log(moment().format("YYYY/MM/DD HH:mm:ss"));
            var rows = result["result"];

            //砍掉原有的
            $(".offline-sip-phone").remove();

            //加入新的
            $.each(rows, function (index, value) {

                $('.footer_inner_text').append(" <span class='offline-sip-phone' style='color:#ab0000'>分機碼:" + value.phoneno + " 無法偵測，請查明原因!!</span>");

            });

        } catch (e) {
            console.log("fetch offline SIP Error");
        }
    })

}
