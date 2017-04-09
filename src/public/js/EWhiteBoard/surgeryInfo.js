/**
 * Created by Jun on 2017/4/9.
 */
var vmMain = new Vue({
    el: '#ope_list',
    mounted: function () {
        this.fetchSurgeryInfo();

    },
    data: {
        isReady:false,
        queryDate :moment().format("YYYY/MM/DD"),
        queryDateString :moment().format("YYYYMMDD"),
        surgeryInfoList : []
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

            $.post('/eWhiteBoard/api/qrySurgeryInfo' ,params, function(data){
                vmMain.isReady = true;
                vmMain.surgeryInfoList = [];
                if(data.success){
                    vmMain.surgeryInfoList  = data.result.surgeryInfoList ;
                }
            });

        },
        fetchPreDay :function(){
            this.queryDate = moment(this.queryDate).subtract(1,"day").format("YYYY/MM/DD");
            this.fetchSurgeryInfo();
        },
        fetchNextDay :function(){
            this.queryDate = moment(this.queryDate).add(1,"day").format("YYYY/MM/DD");
            this.fetchSurgeryInfo();
        }
    }
});

