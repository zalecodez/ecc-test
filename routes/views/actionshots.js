var keystone = require('keystone');

exports = module.exports = function(req, res){
    var locals = res.locals;
    var view = new keystone.View(req, res);

    locals.section = 'actionshots';

    view.on('init', function(next){
        var q = keystone.list('ActionShot').model.find();
        q.exec(function(err, result){
            locals.actionshots = result;
            next(err);
        });
    });

    view.render('actionshots');
};
