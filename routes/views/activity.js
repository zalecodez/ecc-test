var keystone = require('keystone');

exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'activity';

    locals.filter = {
        activity: req.params.activity
    };

    view.query('activity', keystone.list('Activity').model.findOne({
        slug: locals.filter.activity
    }).populate('tags'));

    view.render('activity');
};
