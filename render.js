var fs = require('fs');
var Handlebars = require('handlebars');
var uglifyjs = require('uglify-js');
var CleanCSS = require('clean-css');
var less = require('less');
var async = require('async');

var scripts = [
    'assets/libs/jquery/dist/jquery.min.js',
    'assets/libs/jquery_lazyload/jquery.lazyload.js',
    'assets/libs/datatables/media/js/jquery.dataTables.min.js',
    
    'assets/libs/underscore/underscore-min.js',
    
    'assets/libs/bootstrap/dist/js/bootstrap.min.js',
    'assets/libs/datatables/media/js/dataTables.bootstrap.min.js',

    'assets/libs/bootstrap-calendar/js/calendar.min.js',
    'assets/libs/bootstrap-calendar/js/language/ru-RU.js',

    'assets/js/main.js'
];

var styles = [
    'assets/libs/bootstrap/dist/css/bootstrap.min.css',
    'assets/libs/dataTables/media/css/dataTables.bootstrap.min.css',
    'assets/libs/bootstrap-calendar/css/calendar.min.css',
];

function calendar_templates() {
    console.log('loading calendar templates');
    
    var list = [
        'day', 'events-list', 'modal', 'month', 'month-day', 'week', 'week-days', 'year', 'year-month'
    ];
    
    var str = '';
    
    list.forEach(function(val){
        str += '<script type="text/x-handlebars-template" id="' + val + '_calendar_template">' +
                    fs.readFileSync('assets/js/bootstrap_calendar_tmpls/' + val + '.html').toString() +
                '</script>';
        
    });
    
    return str;
}

function get_scripts(){
    console.log('loading scripts');
    return '<script>' + uglifyjs.minify(scripts).code + '</script>';
}

function get_styles(){
    console.log('loading styles');
    var str = '<style>';
    
    for(var key in styles)
        str += new CleanCSS().minify(fs.readFileSync(styles[key]).toString()).styles + ' ';
    
    str += '</style>';
    return str;
}

exports.json_generate = function(filename, data){
    console.log('generating json');

    var json = JSON.stringify(data);

    if(filename !== false) { // если файл указан - генерируем его
        if (fs.existsSync(filename))
            fs.unlinkSync(filename);

        fs.writeFileSync(filename, json);
    }
    else // если не указан - просто возвращаем json
        return json;
};

exports.html_generate = function(filename, data){
    console.log('generating html');

    var template = Handlebars.compile(fs.readFileSync('templates/main.html').toString());
    var html = template({
        assets_dir: global.config.html_assets_dir,
        archive_dir: global.config.html_archive_dir,
        events: data,
        events_raw_data: JSON.stringify(data),
        calendar_templates: calendar_templates(),
        scripts_raw: get_scripts(),
        styles_raw: get_styles()
    });

    if(filename !== false) { // если файл указан - генерируем его
        if (fs.existsSync(filename))
            fs.unlinkSync(filename);

        fs.writeFileSync(filename, html);
    }
    else // если не указан - просто возвращаем html
        return html;
};

exports.start = function(data){
    console.log('rendering');
    exports.json_generate('../index.json', data);
    exports.html_generate(global.config.result_file, data);
};