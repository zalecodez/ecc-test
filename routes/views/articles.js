var keystone = require('keystone');

exports = module.exports = function(req, res){
    var locals = res.locals;
    var view = new keystone.View(req, res);

    locals.section = 'articles';

    view.on('init', function(next){
        var q = keystone.list('Article').model.find();
        q.exec(function(err, result){
            locals.articles = result;
            next(err);
        });
    });

    view.render('articles');
};
