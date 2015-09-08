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
                    fs.readFileSync('assets/js/libs/bootstrap.calendar/bootstrap_calendar_tmpls/' + val + '.html').toString() +
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

exports.start = function(data, json_path){
    if (fs.existsSync(global.config.result_file))
        fs.unlinkSync(global.config.result_file);
    
    if (fs.existsSync('../index.json')) 
        fs.unlinkSync('../index.json');    
    
    console.log('rendering');
    fs.writeFileSync('../index.json', JSON.stringify(data));
    
    var template = Handlebars.compile(fs.readFileSync('templates/main.html').toString());
    
    fs.writeFileSync(global.config.result_file, template({
        assets_dir: global.config.html_assets_dir,
        archive_dir: global.config.html_archive_dir,
        events: data,
        events_raw_data: JSON.stringify(data),
        calendar_templates: calendar_templates(),
        scripts_raw: get_scripts(),
        styles_raw: get_styles()
    }));
}