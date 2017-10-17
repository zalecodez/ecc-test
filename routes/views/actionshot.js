var keystone = require('keystone');
var comments = require('./comments');
var locus = require('locus');

exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'actionshot';
    locals.view = view;

    locals.filter = {
        actionshot: req.params.actionshot
    };

    locals.data = {
        gallery: {},
        pdf: false,
        video: false,
    }
    locals.id = '';

    view.on('init', function(next){
        var q = keystone.list('ActionShot').model.findOne({
            slug: locals.filter.actionshot
        }).populate('audience skill age topic PDF video');

        q.exec(function(err, actionshot){
            if(err){
                next(err);
            }
            else if(actionshot == null){
                next();
            }
            else{
                locals.data.actionshot = actionshot;
                locals.id = actionshot.id;

                var host = req.protocol + "://" + req.get('host')
                locals.socials = {
                    img: '/favicon.ico',
                    imageUrl: host+'/'+'favicon.ico',
                    url: host + req.originalUrl,
                    title: actionshot.title,
                    descriptionText: actionshot.summary,
                }

                var type = actionshot.mediaType;

                if(type == "Gallery"){
                    var p = keystone.list('MediaUpload').model.find()
                        .where('gallery').in([actionshot.gallery])
                        .populate('gallery');
                    p.exec(function(err, gallery){
                        if(err){
                            next(err);
                        }
                        else{
                            locals.data.gallery = gallery;
                            comments.getComments(req, res, next);
                        }

                    });
                }
                else if(type == "PDF"){
                    locals.data.pdf = true;
                    comments.getComments(req, res, next);
                }
                else{
                    locals.data.video = true;
                    comments.getComments(req, res, next);
                }

                
            }
       });
    });

    comments.postComment(req, res);
    comments.deleteComment(req, res);
    view.render('actionshot');
};
