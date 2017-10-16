var keystone = require('keystone');

exports = module.exports = function(req, res){
    var locals = res.locals;
    var view = new keystone.View(req, res);

    locals.section = 'activities';

    view.on('init', function(next){
        var q = keystone.list('Activity').model.find();
        q.exec(function(err, result){
            locals.activities = result;
            next(err);
        });
    });

    view.render('activities');
};
