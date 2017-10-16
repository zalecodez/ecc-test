var keystone = require('keystone');

exports = module.exports = function(req, res){
    var locals = res.locals;
    var view = new keystone.View(req, res);

    locals.section = 'printables';

    view.on('init', function(next){
        var q = keystone.list('Printable').model.find();
        q.exec(function(err, result){
            locals.printables = result;
            next(err);
        });
    });

    view.render('printables');
};
