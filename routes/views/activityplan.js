var keystone = require('keystone');
var comments = require('./comments');

exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'activityplan';
    locals.view = view;

    locals.filter = {
        activityplan: req.params.activityplan,
    };

    locals.socials = {};

    locals.id = '';

    locals.data = {};

    view.on('init', function(next){
        var q = keystone.list('ActivityPlan').model.findOne({
            slug: locals.filter.activityplan
        }).populate('image audience age topic skill');

        q.exec(function(err, result){
            if(err){
                next(err);
            }
            else if(result == null){
                next();
            }
            else{
                locals.activityplan = result;
                locals.id = result.id;
                var host = req.protocol + "://" + req.get('host')
                locals.socials = {
                    img: result.image.url,
                    url: host + req.originalUrl,
                    title: result.title,
                    descriptionText: result.summary,
                    imageUrl: host+result.image.url,
                }
                comments.getComments(req, res, next);
            }
        });
    });

    comments.postComment(req, res);
    comments.deleteComment(req, res);
    view.render('activityplan');
};
