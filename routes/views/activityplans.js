var keystone = require('keystone');

exports = module.exports = function(req, res){
    var locals = res.locals;
    var view = new keystone.View(req, res);

    locals.section = 'activityplans';

    view.on('init', function(next){
        var q = keystone.list('ActivityPlan').model.find();
        q.exec(function(err, result){
            locals.activityplans = result;
            next(err);
        });
    });

    view.render('activityplans');
};
