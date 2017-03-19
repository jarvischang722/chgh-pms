/**
 * Created by Jun on 2016/10/16.
 * 網站共用function
 */

var  site = {
    
    /**
     * 開啟Modal
     * @param message 等待中的訊息     (default  資料讀取中)
     * @param canClose 可否讓使用者關閉 (default  false)
     * **/
    showWaitingModal:function(message, canClose){
        if(_.isUndefined(message)|| _.isEmpty(message)){
            message = "資料讀取中";
        }

        if(_.isUndefined(canClose)){
            canClose = false
        }

        $("#pmsModal").find("#messageSpan").text(message);

        $('#pmsModal').modal({
            showClose: canClose,
            clickClose: canClose
        });
    },
    /**
     * 關閉Modal
     * **/
    closeWaitingModal:function(){
        $.modal.close();
    }


};


//電子白板上面的跑馬燈
var datetime = null,
    date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format('YYYY/MM/DD A hh:mm:ss'));
};





$(document).ready(function(){
    datetime = $('#head_current_datetime')
    update();
    setInterval(update, 1000);
});

//解決在IE下，ajax會去抓快取資料的bug
$.ajaxSetup({ cache: false });






////覆寫全站的confirm box

window.confirm = function (message, callback, caption) {
    caption = caption || '確認'


    $(document.createElement('div')).attr({
        title: caption,
        'class': 'dialog'
    }).html(message).dialog({
//            position: ['center', 100],
            dialogClass: 'fixed',
            buttons: {
                "確認": function () {
                    $(this).dialog('close');
                    if (callback && typeof(callback) == "function"){
                        callback(true);
                    }
                    return true;
                },
                "取消": function () {
                    $(this).dialog('close');
                    if (callback && typeof(callback) == "function"){
                        callback(false);
                    }
                    return false;
                }
            },
            close: function () {
                $(this).remove();
            },
            draggable: false,
            modal: true,
            resizable: false,
            width: 'auto'
        });

};



