var async = require('async');
var keystone = require('keystone');
var exec = require('child_process').exec;

var VideoData = keystone.list('VideoUpload');

/**
 * List Videos
 */
exports.list = function(req, res) {
    VideoData.model.find(function(err, items) {

        if (err) return res.apiError('database error', err);

        res.apiResponse({
            collections: items
        });

    });
}

/**
 * Get Video by ID
 */
exports.get = function(req, res) {

    VideoData.model.findById(req.params.id).exec(function(err, item) {

        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');

        res.apiResponse({
            collection: item
        });

    });
}


/**
 * Update Video by ID
 */
exports.update = function(req, res) {
    VideoData.model.findById(req.params.id).exec(function(err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');

        var data = (req.method == 'POST') ? req.body : req.query;

        item.getUpdateHandler(req).process(data, function(err) {

            if (err) return res.apiError('create error', err);

            res.apiResponse({
                collection: item
            });

        });
    });
}

/**
 * Upload a New Video
 */
exports.create = function(req, res) {
    console.log("create called");

    var item = new VideoData.model(),
        data = (req.method == 'POST') ? req.body : req.query;

    console.log(req.body);
    item.getUpdateHandler(req).process(req.files, function(err) {

        if (err) return res.apiError('error', err);

        console.log("uploaded"+item);

        res.apiResponse({
            file_upload: item
        });

    });
}

/**
 * Delete Video by ID
 */
exports.remove = function(req, res) {
    var fileId = req.params.id;
    VideoData.model.findById(req.params.id).exec(function (err, item) {

        if (err) return res.apiError('database error', err);

        if (!item) return res.apiError('not found');

        item.remove(function (err) {

            if (err) return res.apiError('database error', err);

            //Delete the file
            exec('rm public/uploads/files/'+fileId+'.*', function(err, stdout, stderr) {
                if (err) {
                    console.log('child process exited with error code ' + err.code);
                    return;
                }
                console.log(stdout);
            });

            return res.apiResponse({
                success: true
            });
        });

    });
}
