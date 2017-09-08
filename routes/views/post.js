var keystone = require('keystone');
var locus = require('locus');

exports = module.exports = function(req, res){

    var view = new keystone.View(req, res);

    var locals = res.locals;

    locals.section = 'blog';

    locals.filters = {
        post: req.params.post
    }

    locals.data = {
        post:{},
        comments:[],
    }
   
    view.on('init', function(next){
        var q = keystone.list('Post').model.findOne({
            slug: locals.filters.post
        }).populate('tags');

        q.exec(function(err, result){
            locals.data.post = result;

            locals.social = {
                img: result.headImage.url,
                url: host + req.originalUrl,
                title: result.title,
                //descriptionText: 'Parents and Teachers! Get involved with the best practices for teaching and raising children between the ages of 0 and 5.',
                descriptionText: result.contentString.substring(0,50)+"...",
                imageUrl: result.headImage.url,
            };

            var p = keystone.list('Comment').model.find().where('state', 'published').where('post', result.id).sort('-publishedDate');
            p.exec(function(err, comments){
                locals.data.comments = comments;

                next(err);
            });
        });
    });

    view.on('post', {action: 'comment.create'}, function (next) {

        var newComment = new (keystone.list('Comment')).model({
            post: locals.data.post.id,
            author: {
                name: locals.user?locals.user.name.full:"Guest", 
            email:locals.user?locals.user.email:"guest@ecce.com"
            },
            user: locals.user?locals.user.id:null
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
                req.flash('success', 'Your comment was added.');
                return res.redirect('/blog/' + locals.data.post.slug + '#comment-id-' + newComment.id);
            }
            next();
        });


    });

    // Delete a Comment
    view.on('get', {remove: 'comment'}, function (next) {

        if (!req.user) {
            req.flash('error', 'You must be signed in to delete a comment.');
            return next();
        }

        keystone.list('Comment').model.findOne({
            _id: req.query.comment,
            post: locals.data.post.id,
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
                if (err)
                return res.err(err);
            req.flash('success', 'Your comment has been deleted.');
            return res.redirect('/blog/' + locals.data.post.slug);
            });
        });
    });

    view.render('post');
};

