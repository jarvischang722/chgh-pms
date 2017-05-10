/**
 * Created by Jun on 2017/4/16.
 * 出入院
 */
// Vue.component('', {
//     template: '#componentApp',
//     props:[],
//     data:function () {
//         return {
//
//         }
//     },
//     methods:{
//
//     }
// });

var vmMain = new Vue({
    el: '#in_and_out',
    mounted: function () {
        this.fetchInOutInfo();
    },
    data: {
        inTranList:[],
        outTranList:[],
        isReady:false,
        queryDate :moment().format("YYYY-MM-DD"),
        queryDateString :moment().format("YYYYMMDD")
    },
    watch:{
        queryDate :function(newDate){
            this.queryDateString = moment(newDate).format("YYYYMMDD");
        }
    },
    methods: {
        fetchInOutInfo:function(){
            $.post("/eWhiteBoard/api/fetchInTranInfo/",{Query_date:this.queryDateString},function (result) {
                vmMain.isReady = true;
                vmMain.inTranList = result.inTranInfo;
                console.log(vmMain.inTranList);
            });

            $.post("/eWhiteBoard/api/fetchOutTranInfo/",{Query_date:this.queryDateString},function (result) {
                vmMain.isReady = true;
                vmMain.outTranList = result.outTranInfo;
                console.log(vmMain.outTranList);
            });
        },
        fetchPreDay :function(){
            this.queryDate = moment(this.queryDate).subtract(1,"day").format("YYYY-MM-DD");
            this.fetchInOutInfo();
        },
        fetchNextDay :function(){
            this.queryDate = moment(this.queryDate).add(1,"day").format("YYYY-MM-DD");
            this.fetchInOutInfo();
        }
    }
});

