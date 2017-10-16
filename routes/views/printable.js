var keystone = require('keystone');

exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'printable';

    locals.filter = {
        printable: req.params.printable
    };

    view.query('printable', keystone.list('Printable').model.findOne({
        slug: locals.filter.printable
    }).populate('tags'));

    view.render('printable');
};
