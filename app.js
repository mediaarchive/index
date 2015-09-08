global.config = {
    'archive_dir': '../архив',
    'result_file': '../мероприятия.html',
    'html_assets_dir': 'app/assets',
    'html_archive_dir': 'архив',
}

console.log('processing');

var dirs = require('./dirs');
var render = require('./render');

var data = dirs.start();

render.start(data);
console.log('Total ' + data.length + ' events fetched');
console.log(global.config.result_file + ' created');
