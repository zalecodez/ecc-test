var keystone = require('keystone');


exports.getComments = function(locals, next){
    var p = keystone.list('Comment').model
        .find()
        .where('state', 'published')
        .where('post', locals.data.id)
        .sort('-publishedDate');

    p.exec(function(err, comments){
        locals.data.comments = comments;
        console.log('in comments');
        next(err);
    });
}
exports.postComment = function(req, res){
    //Post a Comment
    res.locals.view.on('post', {action: 'comment.create'}, function (next) {
        console.log("post made");

        var newComment = new (keystone.list('Comment')).model({
            post: res.locals.data.id,
            author: {
                name: locals.user?locals.user.name.full:"Guest", 
                email:locals.user?locals.user.email:"guest@ecce.com"
            },
            user: locals.user?locals.user.id:null,
            state:locals.user?"published":"submitted",
        });

        var updater = newComment.getUpdateHandler(req);

        console.log(req.body);

        updater.process(req.body, {
            fields: 'content, author.name, author.email',
            flashErrors: true,
            logErrors: true,
        }, function (err) {
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
