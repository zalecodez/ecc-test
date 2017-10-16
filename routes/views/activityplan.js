var keystone = require('keystone');

exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'activityplan';

    locals.filter = {
        activityplan: req.params.activityplan
    };

    view.query('activityplan', keystone.list('ActivityPlan').model.findOne({
        slug: locals.filter.activityplan
    }).populate('tags'));

    view.render('activityplan');
};
