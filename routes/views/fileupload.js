var keystone = require('keystone');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var locus = require('locus');
var http = require('http');

exports = module.exports = function(req, res){

    var view = new keystone.View(req, res);
    var locals = res.locals;

    view.on('get', function(next){
        console.log("get called");
        next();
    });

    view.on('post', function(next){
        console.log("post called");
        var form = new formidable.IncomingForm();

        //form.multiples = true;

        //form.uploadDir = '/public/uploads'; 

        //form.on('file', function(field, file){
        //    eval(locus);
        //    fs.rename(file.path, path.join(form.uploadDir, file.name));
        //});

        //form.on('error', function(err){
        //    console.log('An error has occured: \n'+err);
        //});

        //form.on('end', function(){
        //    res.write("FileUploaded");
        //    res.end();
        //});

        //form.parse(req);

        form.parse(req, function(err, fields, files){
            console.log("Form Processed");
            next();
        });
        
    });
    view.render('fileupload');
};

