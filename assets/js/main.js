var events_raw, archive_dir;

function events_raw_data(data, dir) {
    events_raw = JSON.parse(data);
    archive_dir = dir;
}

$(document).ready(function(){
    $('table').DataTable({
        pageLength: 10,
        "columns": [
            {
                "orderable": false
            },
            null,
            null,
            {
                "orderable": false
            },
        ],
        order: [[ 2, "desc" ]],
        language: {
            "sProcessing":   "Подождите...",
            "sLengthMenu":   "Показать _MENU_ записей",
            "sZeroRecords":  "Записи отсутствуют.",
            "sInfo":         "Записи с _START_ до _END_ из _TOTAL_ записей",
            "sInfoEmpty":    "Записи с 0 до 0 из 0 записей",
            "sInfoFiltered": "(отфильтровано из _MAX_ записей)",
            "sInfoPostFix":  "",
            "sSearch":       "Поиск:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst": "Первая",
                "sPrevious": "Предыдущая",
                "sNext": "Следующая",
                "sLast": "Последняя"
            },
            "oAria": {
                "sSortAscending":  ": активировать для сортировки столбца по возрастанию",
                "sSortDescending": ": активировать для сортировки столбцов по убыванию"
            }
        }
    });
    
    //$("img.lazy").lazyload();
    
    var for_calendar = [];
    
    for(var key in events_raw){
        var time = (new Date(events_raw[key].date.year, Number(events_raw[key].date.month) - 1, events_raw[key].date.day)).getTime();
        for_calendar.push({
            id: key,
            title: events_raw[key].name + ' (' + events_raw[key].date.day + '.' + events_raw[key].date.month + '.' + events_raw[key].date.year + ')',
            url: archive_dir + '/' + events_raw[key].dir,
            class: 'event-important',
            start: time,
            end: time,
        })
    }
    
    var calendar = $('#calendar_obj').calendar({
        language: 'ru-RU',
        events_source: for_calendar,
        tmpl_path: 'app/assets/js/bootstrap_calendar_tmpls/',
        onAfterViewLoad: function(view) {
			$('#calendar_obj a.event-item').attr('target', '_blank');
        
			$('#calendar #title').text(this.getTitle());
			$('.btn-group button').removeClass('active');
			$('button[data-calendar-view="' + view + '"]').addClass('active');
		},
        
    });
    
    $('#calendar button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.navigate($this.data('calendar-nav'));
		});
	});
    
    $('#calendar button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.view($this.data('calendar-view'));
		});
	});
})