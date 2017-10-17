var keystone = require('keystone');


exports.getComments = function(req, res, next){
    locals = res.locals;
    var p = keystone.list('Comment').model
        .find()
        .where('state', 'published')
        .where('post', locals.id)
        .sort('-publishedDate');

    p.exec(function(err, comments){
        locals.data.comments = comments;
        next(err);
    });
}
exports.postComment = function(req, res){
    //Post a Comment
    var locals = res.locals;
    locals.view.on('post', {action: 'comment.create'}, function (next) {
        console.log("post made");

        var newComment = new (keystone.list('Comment')).model({
            post: locals.id,
            author: {
                name: locals.user?locals.user.name.full:"Guest", 
                email:locals.user?locals.user.email:"guest@ecce.com"
            },
            user: locals.user?locals.user.id:null,
            state:locals.user?"published":"submitted",
        });


        var updater = newComment.getUpdateHandler(req);

        updater.process(req.body, {
            fields: 'content, author.name, author.email',
            flashErrors: true,
            logErrors: true,
        }, function (err) {
            console.log("NewComment:\n"+newComment);
            console.log(req.body);
            if (err) {
                locals.validationErrors = err.errors;
            } else {
                if(locals.user){
                    req.flash('success', 'Your comment was added.');
                }
                else{
                    req.flash('success', 'Your comment was submitted for approval.');
                }
                return res.redirect('back');
            }
            next();
        });
    });
}

// Delete a Comment
exports.deleteComment = function(req, res){
    var locals = res.locals;
    locals.view.on('get', {remove: 'comment'}, function (next) {

        if (!req.user) {
            req.flash('error', 'You must be signed in to delete a comment.');
            return next();
        }

        keystone.list('Comment').model.findOne({
            _id: req.query.comment,
            post: locals.data.id,
        })
        .exec(function (err, comment) {
            if (err) {
                if (err.name === 'CastError') {
                    req.flash('error', 'The comment ' + req.query.comment + ' could not be found.');
                    return next();
                }
                return res.err(err);
            }
            if (!comment) {
                req.flash('error', 'The comment ' + req.query.comment + ' could not be found.');
                return next();
            }
            if (comment.user != req.user.id && !req.user.isAdmin) {
                req.flash('error', 'Sorry, you must be the author of a comment to delete it.');
                return next();
            }
            comment.state = 'archived';
            comment.save(function (err) {
                if (err){
                    return res.err(err);
                }
                req.flash('success', 'The comment has been deleted.');
                return res.redirect('back');
            });
        });
    });
};
