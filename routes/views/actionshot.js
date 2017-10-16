var keystone = require('keystone');

exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'actionshot';

    locals.filter = {
        actionshot: req.params.actionshot
    };

    view.query('actionshot', keystone.list('ActionShot').model.findOne({
        slug: locals.filter.actionshot
    }).populate('tags'));

    view.render('actionshot');
};
