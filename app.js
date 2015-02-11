global.config = {
    'archive_dir': '../архив',
    'result_file': '../мероприятия.html'
}

console.log('processing');

var dirs = require('./dirs');
//var render = require('./render');

console.log(dirs.start());
