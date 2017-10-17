var keystone = require('keystone');
var comments = require('./comments');
var locus = require('locus');

exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'printable';
    locals.view = view;

    locals.filter = {
        printable: req.params.printable
    };

    locals.data = {
        gallery: {},
        pdf: false,
        video: false,
    }
    locals.id = '';

    view.on('init', function(next){
        var q = keystone.list('Printable').model.findOne({
            slug: locals.filter.printable
        }).populate('audience skill age topic PDF video');

        q.exec(function(err, printable){
            if(err){
                next(err);
            }
            else if(printable == null){
                next();
            }
            else{
                locals.data.printable = printable;
                locals.id = printable.id;

                var host = req.protocol + "://" + req.get('host')
                locals.socials = {
                    img: '/favicon.ico',
                    imageUrl: host+'/'+'favicon.ico',
                    url: host + req.originalUrl,
                    title: printable.title,
                    descriptionText: printable.summary,
                }

                var type = printable.mediaType;

                if(type == "Gallery"){
                    var p = keystone.list('MediaUpload').model.find()
                        .where('gallery').in([printable.gallery])
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
    view.render('printable');
};
