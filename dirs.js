var fs = require('fs');
var path = require('path');

function dir_is_year(dir_name){
    if (dir_name != NaN && dir_name.length === 4) 
        return true;
    else
        return false;
}

function dir_is_month_or_day(dir_name) {
    if (dir_name != NaN && dir_name.length === 2) 
        return true;
    else
        return false;
}

exports.start = function(){
    var result = [];
    
    var years = fs.readdirSync(global.config.archive_dir);
    
    years.forEach(function(year){ // цикл по годам
        if (year == '.' || year == '..')
            return false;
        
        if (!dir_is_year(year)) { // если это не год
            console.log('Error: dir "' + year + '" not a year dir');
            return false;
        }
            
        var months = fs.readdirSync(global.config.archive_dir + '/' + year); 
        
        months.forEach(function(month){
            if (month == '.' || month == '..')
                return false;
            
            if (!dir_is_month_or_day(month)) { // если это не месяц
                console.log('Error: dir "' + year + '/' + month + '" not a month dir');
                return false;
            }
            
            var days = fs.readdirSync(global.config.archive_dir + '/' + year + '/' + month);
            
            days.forEach(function(day){
                if (day == '.' || day == '..')
                    return false;
                
                if (!dir_is_month_or_day(day)) { // если это не месяц
                    console.log('Error: dir "' + year + '/' + month + '/' + day + '" not a day dir');
                    return false;
                }
                
                var events = fs.readdirSync(global.config.archive_dir + '/' + year + '/' + month + '/' + day);
                
                events.forEach(function(event){
                    if (event == '.' || event == '..')
                        return false;
                    
                    if(!fs.lstatSync(global.config.archive_dir + '/' + year + '/' + month + '/' + day + '/' + event).isDirectory()){
                        console.log('Error: dir "' + year + '/' + month + '/' + day + '/' + event + '" not event dir');
                        return false;
                    }
                    
                    var event_res = {
                        name: event,
                        date: {
                            day: day,
                            month: month,
                            year: year
                        },
                        photos: false,
                        preview_photo: '',
                        dir: year + '/' + month + '/' + day + '/' + event
                    }
                    
                    if(fs.existsSync(global.config.archive_dir + '/' + year + '/' + month + '/' + day + '/' + event + '/фото'))
                        event_res.photos = true;
                    
                    var files = fs.readdirSync(global.config.archive_dir + '/' + year + '/' + month + '/' + day + '/' + event);
                    
                    files.forEach(function(file){
                        if (file == '.' || file == '..')
                            return false;
                        
                        var ext = path.extname(file).toLowerCase().replace('.', '');
                        
                        if (ext == 'jpg' || ext == 'jpeg' || ext == 'gif' || ext == 'png') {
                            event_res.preview_photo = file;
                            return true;
                        }
                        
                        return true;
                    });
                    
                    result.push(event_res);
                    
                    return true;
                });
                
                return true;
            });
            
            return true;
        });
        
        return true;
    });
    
    return result;
}