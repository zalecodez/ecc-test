var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

        locals.data = {
            blogList : {}
        };

        view.on('init', function(next){
            var q = keystone.list('Post').model.find().limit(3);
            q.exec(function(err, result){
                locals.data.blogList = result;
                next();
            });
        });

	// Render the view
	view.render('index');
};
