var ffmpeg = require('fluent-ffmpeg');
var path = require('path');

module.exports = function(vidPath, callback){
    var file;
    var proc = ffmpeg(vidPath)
    // setup event handlers
        .on('filenames', function(filenames) {
            console.log(filenames);
            file = filenames[0];
        })
        .on('end', function() {
            console.log('screenshots were saved');
            callback(null, "/uploads/videos/"+file);
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
            callback(err, null);
        })
        .takeScreenshots(
            { 
                count: 1, 
                timemarks: [ '50%' ],
                filename: "%b",
            }, path.dirname(vidPath)
        ); 
};
