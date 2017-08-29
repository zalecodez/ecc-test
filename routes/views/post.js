var keystone = require('keystone');

exports = module.exports = function(req, res){

    var view = new keystone.View(req, res);

    var locals = res.locals;

    locals.section = 'blog';

    locals.filters = {
        post: req.params.post
    }

    locals.data = {
        post:{}
    }

    view.on('init', function(next){
        var q = keystone.list('Post').model.findOne({
            slug: locals.filters.post
        }).populate('tags');

        q.exec(function(err, result){
            locals.data.post = result;
            console.log(result);

            next(err)
        });
    });

    view.render('post');
};

