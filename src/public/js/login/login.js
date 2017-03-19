$(function () {

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


    //初始化登入按鈕的動作
    initLoginBtn();

})


initLoginBtn=function(){

//登入驗證
    $("#login_btn").click(function (e) {
        e.preventDefault();
        $.ajax({
            url: "/login",
            type: "post",
            data: $("#loginForm").serialize(),
            success: function (data) {

                if(data.success){

                    //轉入選擇病房區的畫面
                    var redirect_url="selectWardzone";

                    var baseUrl=function() {
                        return window.location.origin?window.location.origin+'/':window.location.protocol+'/'+window.location.host+'/';
                    }

                    window.location.href = baseUrl()+redirect_url;


                }else{

                    alert("登入失敗，請檢查帳密是否正確");

                }
            },
            error: function (err) {
                console.log("Error: " + JSON.stringify(err));
            }
        })
    })

}

