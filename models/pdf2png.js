module.exports = function(pdfPath, callback){
    var fs      = require('fs');
    var path    = require('path');
    var pdf2img = require('pdf2img');

    var input   = pdfPath;

    pdf2img.setOptions({
        type: 'png',                                // png or jpg, default jpg 
        size: 1024,                                 // default 1024 
        density: 600,                               // default 600 
        outputdir: __dirname + path.sep + '../public/uploads/pdf', // output folder, default null (if null given, then it will create folder name same as file name) 
        outputname: null,                         // output file name, dafault null (if null given, then it will create image name same as input name) 
        page: 1                                  // convert selected page, default null (if null given, then it will convert all pages) 
    });

    pdf2img.convert(input, function(err, info) {
        if (err){
             console.log(err)
        }
        else {
            console.log(info);
        }
        callback(err, "/uploads/pdf/"+info.message[0].name);
    });
};
