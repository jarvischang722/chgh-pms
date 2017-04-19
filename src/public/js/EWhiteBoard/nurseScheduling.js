Vue.component('nurse-info-tmp', {
    template: '#nurseInfoTmp',
    props: [],
    data: function () {
        return {}
    },
    methods: {}
});

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

        //排序
        wardList01.sort(function(a, b){
            return a["ward_id"]-b["ward_id"]
        });

        if(count>=80){
            wardList02 = wardList01.slice(count/2);
            wardList01 = wardList01.slice(0,count/2);
        }else if(count>=40){
            wardList02 = wardList01.slice(40);
            wardList01 = wardList01.slice(0,40);
        }else{
            wardList02=[];
        }
    }

    //每4個一組
    var wardListA=[];
    var tmpList=[];
    for(var i=0;i<wardList01.length;i++){
        if(i%4==0){
            tmpList = new Array();
            wardListA.push(tmpList);
        }
        tmpList.push(wardList01[i]);
    }

    var wardListB=[];
    var tmpList=[];
    for(var i=0;i<wardList02.length;i++){
        if(i%4==0){
            tmpList = new Array();
            wardListB.push(tmpList);
        }
        tmpList.push(wardList02[i]);
    }


    var result_tbody1 = new Vue({
        el: '#'+divid+'_1',
        data: {
            results: wardListA
        }
    });
    var result_tbody2 = new Vue({
        el: '#'+divid+'_2',
        data: {
            results: wardListB
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
