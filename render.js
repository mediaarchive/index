/*
* @Author: Artur Atnagulov (ClienDDev team)
*/

var fs = require('fs');

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

exports.start = function(data){
    console.log('rendering');
    exports.json_generate('../index.json', data);
};