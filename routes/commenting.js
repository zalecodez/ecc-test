var keystone = require('keystone');

var createComment = function(view){
    view.on('post', {action: 'comment.create'}, function (next) {

        var newComment = new (keystone.list('PostComment')).model({
            state: 'published',
            post: locals.data.post.id,
            author: locals.user.id,
        });

        var updater = newComment.getUpdateHandler(req);

        updater.process(req.body, {
            fields: 'content',
            flashErrors: true,
            logErrors: true,
        }, function (err) {
            if (err) {
                locals.validationErrors = err.errors;
            } else {
                req.flash('success', 'Your comment was added.');
                return res.redirect('/blog/post/' + locals.data.post.slug + '#comment-id-' + newComment.id);
            }
            next();
        });


    }
}

module.exports = createComment;

