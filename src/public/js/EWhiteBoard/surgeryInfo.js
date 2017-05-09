/**
 * Created by Jun on 2017/4/9.
 */
Vue.component('surgery-info-tmp', {
    template: '#surgeryInfoTmp',
    props: ["surgeryInfoList"],
    data: function () {
        return {
        }
    },
    methods: {}
});

var vmMain = new Vue({
    el: '#ope_list',
    mounted: function () {
        this.fetchSurgeryInfo();
        this.fetchWeekSurgeryInfo();

    },
    data: {
        isReady:false,
        queryDate :moment().format("YYYY-MM-DD"),
        queryDateString :moment().format("YYYYMMDD"),
        surgeryInfoList : [],
        weekSurgeryInfoList : []
    },
    watch:{
        queryDate :function(newDate){
            this.queryDateString = moment(newDate).format("YYYYMMDD");
        }
    },
    methods:{
        //取得手術資訊
        fetchSurgeryInfo:function(){
            var params = {
                StratDate :this.queryDateString,
                EndDate :this.queryDateString
            };
            this.getSurgeryInfo(params,function(surgeryInfoList){

                vmMain.isReady = true;
                vmMain.surgeryInfoList  = surgeryInfoList ;
            });
        },
        fetchWeekSurgeryInfo:function(){
            var params = {
                StratDate :this.queryDateString,
                EndDate :moment(this.queryDate).add(7,"day").format("YYYYMMDD")
            };
            this.getSurgeryInfo(params,function(surgeryInfoList){
                vmMain.weekSurgeryInfoList  = surgeryInfoList;
            });
        },
        //取得手術資訊
        getSurgeryInfo:function(params,callback){

            $.post('/eWhiteBoard/api/qrySurgeryInfo' ,params, function(data){
                if(data.success){
                    callback(data.result.surgeryInfoList);
                }else{
                    callback([]);
                }

            });

        },
        fetchPreDay :function(){
            this.queryDate = moment(this.queryDate).subtract(1,"day").format("YYYY-MM-DD");
            this.fetchSurgeryInfo();
        },
        fetchNextDay :function(){
            this.queryDate = moment(this.queryDate).add(1,"day").format("YYYY-MM-DD");
            this.fetchSurgeryInfo();
        }
    }
});

