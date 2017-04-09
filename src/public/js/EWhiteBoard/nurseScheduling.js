$(function () {
    initialize(); //初始執行
    //body dom event
     $('body').on("click", "#refresh", function(event) {
         event.preventDefault();
         initialize();
     });
});
//初始
function initialize(){
    $.ajax({
        method: "GET",
        url: "api/getNurseSche"
    })
        .done(function( result_obj ) {
            console.log(result_obj);

            var sche = result_obj.result;
            //依病房排班顯示
            createTemp01(sche,"A","nurse_tabs_nested_A");
            createTemp01(sche,"B","nurse_tabs_nested_B");
            createTemp01(sche,"C","nurse_tabs_nested_C");

            //依護理師排班顯示
            createTemp02(sche,"A","nurse_tabs_nested_D");
            createTemp02(sche,"B","nurse_tabs_nested_E");
            createTemp02(sche,"C","nurse_tabs_nested_F");
        });
}

//產生班表by病房
function createTemp01(sche,thisclass,divid){
    var classobj = sche[thisclass];
    var wardList01;
    var wardList02;
    if(!classobj || !classobj['ward']){
        wardList01=[];
        wardList02=[];
    }else{
        classobj = classobj['ward'];

        wardList01 = classobj.wardList;
        wardList02;
        var count = wardList01.length;
        if(count>=18){
            wardList02 = wardList01.slice(count/2);
            wardList01 = wardList01.slice(0,count/2);
        }else if(count>=9){
            wardList02 = wardList01.slice(9);
            wardList01 = wardList01.slice(0,9);
        }else{
            wardList02=[];
        }
    }

    var result_tbody1 = new Vue({
        el: '#'+divid+'_1',
        data: {
            results: wardList01
        }
    });
    var result_tbody2 = new Vue({
        el: '#'+divid+'_2',
        data: {
            results: wardList02
        }
    });
}

//產生班表by護理師
function createTemp02(sche,thisclass,tableid){
    var classobj = sche[thisclass];
    var nurseList;
    if(!classobj || !classobj['nurse']){
        nurseList=[];
    }else{
        classobj = classobj['nurse'];
        nurseList = classobj.nurseList;
    }

    var result_tbody1 = new Vue({
        el: '#'+tableid+'_1',
        data: {
            results: nurseList
        }
    });
}
