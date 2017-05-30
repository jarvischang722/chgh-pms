$(function () {



    //載入病房區資訊
    loadAllWardZone();




})


loadAllWardZone=function(){


    //載入全部病房區的資訊
    $.ajax({
        url: "/SystemMaintain/getWardZonePrivilege",
        type: "get",
        data: {},
        success: function (data) {

            console.log(data);
            if(data.success){


                var source   = $("#room-list-template").html();
                var template = Handlebars.compile(source);
                var context = {result: data.result};
                var html    = template(context);

                $("#room-list-container").html(html);


                //設定到畫面垂直置中
                jQuery.fn.center = function(parent) {
                    if (parent) {
                        parent = this.parent();
                    } else {
                        parent = window;
                    }
                    this.css({
                        "position": "absolute",
                        "top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px"),
                        "left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
                    });
                    return this;
                }
                $(".center").center(true);



                //設定btn的onClick
                $(document).on("click",'.room_btn',enterSystem);

            }else{

            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })

}


enterSystem=function(){


    var ward_zone_id=$(this).data("ward-zone-id");
    var ward_zone_name=$(this).data("ward-zone-name");

    //讓modal不會被btn蓋掉
    $(".room_stop_inner").css("z-index",1);
    site.showWaitingModal("讀取護理站的開放模組資訊中");

//載入全部病房區的資訊
    $.ajax({
        url: "/selectWardzone",
        type: "post",
        data: {ward_zone_id:ward_zone_id, ward_zone_name:ward_zone_name},
        success: function (data) {
            site.closeWaitingModal();

            console.log(data);

            if(data.success){
                //已經登入

                var result=data.result;

                var system_type=result.system_type || "pms";

                var redirect_url="";

                if(system_type=="pms"){
                    //導向至醫護管理系統頁面
                    redirect_url="";
                }else{
                    //導向至電子白板
                    redirect_url="EWhiteBoard/patientInfo";

                }


                var baseUrl=function() {
                    return window.location.origin?window.location.origin+'/':window.location.protocol+'/'+window.location.host+'/';
                }


                //轉址
                window.location.href = baseUrl()+redirect_url;


            }else{
                //尚未登入，回登入頁面

                alert("尚未登入!");

                var baseUrl=function() {
                    return window.location.origin?window.location.origin+'/':window.location.protocol+'/'+window.location.host+'/';
                }

                //轉址
                window.location.href = baseUrl()+"login";



            }
        },
        error: function (err) {
            console.log("Error: " + JSON.stringify(err));
        }
    })



}