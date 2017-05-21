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

jQuery.fn.center_vertical = function(parent) {
    if (parent) {
        parent = this.parent();
    } else {
        parent = window;
    }
    this.css({
        "position": "absolute",
        "top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px")
    });
    return this;
}
$("#choose_room_stop").center_vertical(true);

$('#login_system').popSelect({
    showTitle: false,
    placeholderText: '選擇登入系統',
    maxAllowed: 1,
});

$('#login_rooms').popSelect({
    showTitle: false,
    placeholderText: '選擇病房',
});

jQuery(document).ready(function($) {
    $('.rooms_tabs').pwstabs({
        effect: 'scale',
        horizontalPosition: 'bottom',
        responsive: false,
        theme: 'pws_theme_grey',
    });
    $('.beds_tabs').pwstabs({
        effect: 'scale',
        horizontalPosition: 'bottom',
        responsive: false,
        theme: 'pws_theme_grey',
    });
    $('.nurse_tabs').pwstabs({
        effect: 'scale',
        horizontalPosition: 'bottom',
        responsive: false,
        theme: 'pws_theme_grey',
    });
    $('.nurse_tabs_nested_1').pwstabs({
        effect: 'scale',
        horizontalPosition: 'bottom',
        responsive: false,
        theme: 'pws_theme_grey',
    });
    $('.nurse_tabs_nested_2').pwstabs({
        effect: 'scale',
        horizontalPosition: 'bottom',
        responsive: false,
        theme: 'pws_theme_grey',
    });
    $('.work_tabs').pwstabs({
        effect: 'scale',
        horizontalPosition: 'bottom',
        responsive: false,
        theme: 'pws_theme_grey',
    });
    $('.his_tabs').pwstabs({
        effect: 'scale',
        horizontalPosition: 'top',
        responsive: false,
        theme: 'pws_theme_grey',
    });
    $('.drop_tabs').pwstabs({
        effect: 'scale',
        horizontalPosition: 'top',
        responsive: false,
        theme: 'pws_theme_grey',
    });
});

var marquee = $('#footer_inner');
marquee.each(function() {
    var mar = $(this),
        indent = mar.width();
    mar.marquee = function() {
        indent--;
        mar.css('text-indent', indent);
        if (indent < -1 * mar.children('.footer_inner_text').width()) {
            indent = mar.width();
        }
    };
    mar.data('interval', setInterval(mar.marquee, 1000 / 60));
});

(function() {
    $('dd').filter(':nth-child(n+4)').addClass('hide');
    $('dl').on('click', 'dt', function() {
        $(this)
            .next()
            .slideDown(300)
            .siblings('dd')
            .slideUp(300);
    });
})();



$('#ope_range').datepicker({
    minDate: new Date(),
});

$('#date_select').datepicker({
    minDate: new Date(),
});

$('#month_select').datepicker({
    minDate: new Date(),
    onSelect: function onSelect(fd, date) {
        var inst = $('[data-remodal-id=month_select_modal]').remodal();
        inst.open();
    }
});

$('#day_room_select').datepicker({
    minDate: new Date(),
    onSelect: function onSelect(fd, date) {
        var inst = $('[data-remodal-id=day_room_select_modal]').remodal();
        inst.open();
    }
});

$('#day_remodal_select_1').datepicker({
    minDate: new Date(),
    onSelect: function onSelect(fd, date) {
        var content = '';
        content = fd;
        $(".date_checklist_pool").append('<div class="checkbox_list"><label><input type="checkbox" class="option-input checkbox select_all_check_check_2" /> ' + content + ' </label></div>');
    }
});

$('#time_range_1, #time_range_2').datepicker({
    minDate: new Date(),
    dateFormat: ' ',
    timepicker: true,
    classes: 'only-timepicker'
});

$('.select_all').click(function(e) {
    $('.container .sticky-wrap').find('td input:checkbox').prop('checked', this.checked);
});

$('.select_all_remodal').click(function(e) {
    $('.remodal_1 .sticky-wrap').find('td input:checkbox').prop('checked', this.checked);
});

$('.select_all_remodal_2').click(function(e) {
    $('.remodal_2 .sticky-wrap').find('td input:checkbox').prop('checked', this.checked);
});

$('.select_all_remodal_dd').click(function(e) {
    $('.remodal_3 .sticky-wrap').find('td input:checkbox').prop('checked', this.checked);
});

$('.select_all_check').click(function(e) {
    $('.select_all_check_check').prop('checked', this.checked);
});

$('.select_all_check_2').click(function(e) {
    $('.select_all_check_check_2').prop('checked', this.checked);
});

$('.choose_room_stop_check').click(function(e) {
    $('.choose_room_stop_check_check').prop('checked', this.checked);
});

$('a#add_note').click(function(e) {
    $(".out_note_pool").append($("#note_type").val() + ' ' + $("#note_copy").val() + ' 份，');
});

$('a#add_note_2').click(function(e) {
    $(".out_note_pool_2").append($("#note_type_2").val() + ' ' + $("#note_copy_2").val() + ' 份，');
});

$('input[name=doctor_1]').click(function() {
    $('.doctor_radio_pool').html(this.value);
});

// $('.color_picker').minicolors({
//     position: 'bottom right',
// });
