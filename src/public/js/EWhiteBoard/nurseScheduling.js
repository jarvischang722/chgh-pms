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
        wardListA:[],
        wardListB:[],
        wardListC:[],
        nurseListA:[],
        nurseListB:[],
        nurseListC:[],
        patientInfo :{},      //單一病患資訊1
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
            if(!classobj || !classobj['ward']){
                wardList01=[];
            }else{
                classobj = classobj['ward'];
                wardList01 = classobj.wardList;
            }

            //每4個一組
            var wardListA=[];
            var tmpList=[];
            for(var i=0;i<wardList01.length;i++){
                if(i%8==0){
                    tmpList = new Array();
                    wardListA.push(tmpList);
                }
                tmpList.push(wardList01[i]);
            }

            if(thisclass=="A"){
                vmMain.wardListA = wardListA;
            }else if(thisclass=="B"){
                vmMain.wardListB = wardListA;
            }else if(thisclass=="C"){
                vmMain.wardListC = wardListA;
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
