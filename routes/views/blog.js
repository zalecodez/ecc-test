keystone = require('keystone');


exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'blog';

    view.query('blog', keystone.list('Post').model.find());
    view.render('blog');
};
