$(function () {

    //驗證序號
    $("#enterKey").click(function (e) {

        var key=$("textarea#key").val();


        $.ajax({
            url: "/Installer/checkKey",
            type: "post",
            data: {key:key},
            success: function (data) {
                console.log(data);
                $("#keyValidArea").show();

                if (data.success==true) {

                    $("#key").attr("readonly","readonly");

                    $("#validResult").html("驗證成功");

                    $("#enterKey").hide();

                    //顯示序號資訊
                    $("#keyInfoArea").show();

                    //系統人數
                    $("#maxUserNumber").html(data.result.MaxUser);

                    //把能安裝的模組資訊顯示成checklist
                    generateChecklistFromArray(data.result.FunctionList,document.getElementById("FunctionList"));


                } else {
                    //清空key
                    $("#key").html("");
                    $("#validResult").html("驗證失敗");
                }
            },
            error: function (err) {
                console.log("Error: " + JSON.stringify(err));
            }
        })
    })



    //安裝function
    $("#functionListForm").submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "/Installer/installFunction",
            type: "post",
            data: $("#functionListForm").serialize(),
            success: function (data) {
                if(data.success){

                    alert("安裝成功，將進入系統首頁");

                    var baseUrl=function() {
                        return window.location.origin?window.location.origin+'/':window.location.protocol+'/'+window.location.host+'/';
                    }

                    console.log("baseUrl"+baseUrl());
                    window.location.href = baseUrl()+"login";


                }else{

                    alert("安裝失敗");

                }
            },
            error: function (err) {
                console.log("Error: " + JSON.stringify(err));
            }
        })
    })


    function generateChecklistFromArray(optionArray,target){
        //從array產生check list
        //target為要產生資料的DOM位置

        for (var option in optionArray) {

            if (optionArray.hasOwnProperty(option)) {
                var pair = optionArray[option];


                var label = document.createElement('label')

                //把checkbox嵌入label中
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "FunctionList";
                checkbox.value = pair;

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(moduleEnglishNameToChinese(pair)));

                target.appendChild(label);
                target.appendChild(document.createElement("br"));
            }
        }

    }

    function moduleEnglishNameToChinese(englishName){

        var nameArray = {
            EWhiteBoard: "電子白板模組",
            Doctor: "醫生模組",
            MonitorDevice: "監測裝置模組",
            Nurse: "護理師模組",
            Patient: "病患模組",
            SystemMaintain: "系統維護模組",
            otherFunc: "其他模組"
        };


        return nameArray[englishName];


    }

})