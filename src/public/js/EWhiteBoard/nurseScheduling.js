Vue.component('nurse-info-tmp', {
    template: '#nurseInfoTmp',
    props:['patientInfo'],
    data: function () {
        return {}
    },
    methods: {}
});

var vmMain = new Vue({
    el: '#app',
    mounted: function () {
        this.initialize();
    },
    data: {
        wardListA1:[],
        wardListA2:[],
        wardListB1:[],
        wardListB2:[],
        wardListC1:[],
        wardListC2:[],
        nurseListA:[],
        nurseListB:[],
        nurseListC:[],
        patientInfo :{},      //單一病患資訊
    },
    watch: {

    },
    methods: {
        initialize : function(){
            $.ajax({
                method: "GET",
                url: "api/getNurseSche"
            })
                .done(function( result_obj ) {
                    var sche = result_obj.result;
                    console.log(sche);
                    //依病房排班顯示
                    vmMain.createTemp01(sche,"A");
                    vmMain.createTemp01(sche,"B");
                    vmMain.createTemp01(sche,"C");

                    //依護理師排班顯示
                    vmMain.createTemp02(sche,"A");
                    vmMain.createTemp02(sche,"B");
                    vmMain.createTemp02(sche,"C");
                });
        },
        createTemp01 : function(sche,thisclass){ //產生班表by病房
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

            if(thisclass=="A"){
                vmMain.wardListA1 = wardListA;
                vmMain.wardListA2 = wardListB;
            }else if(thisclass=="B"){
                vmMain.wardListB1 = wardListA;
                vmMain.wardListB2 = wardListB;
            }else if(thisclass=="C"){
                vmMain.wardListC1 = wardListA;
                vmMain.wardListC2 = wardListB;
            }
        },
        createTemp02 : function(sche,thisclass){ //產生班表by護理師
            var classobj = sche[thisclass];
            var nurseList;
            if(!classobj || !classobj['nurse']){
                nurseList=[];
            }else{
                classobj = classobj['nurse'];
                nurseList = classobj.nurseList;
            }
            if(thisclass=="A"){
                vmMain.nurseListA = nurseList;
            }else if(thisclass=="B"){
                vmMain.nurseListB = nurseList;
            }else if(thisclass=="C"){
                vmMain.nurseListC = nurseList;
            }
        },
        fetchSinglePatientInfo : function (nur_id,patient_id) { //取一筆病患

            var formData ={
                nur_id:nur_id,
                patient_id:patient_id
            };

            $.post("/eWhiteBoard/api/fetchSinglePatientInfo/", formData , function(result){
                vmMain.patientInfo = result.patientInfo;
                console.log(vmMain.patientInfo);
                $('[data-remodal-id=rooms_modal]').remodal().open();
            })
        },
    }
});
