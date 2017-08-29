var keystone = require('keystone');

exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'articles';

    locals.filter = {
        article: req.params.article
    };

    view.query('article', keystone.list('Article').model.findOne({
        slug: locals.filter.article
    }).populate('tags'));

    view.render('article');
};
