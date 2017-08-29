var keystone = require('keystone');

exports = module.exports = function(req, res){
    var view = new keystone.View(req,res);
    var locals = res.locals;

    //set locals
    locals.section = 'lessonplans';
    locals.filters={
        plan: req.params.plan
    }

    locals.data = {
        plan:[]
    }

    view.on('init', function(next){
        var q = keystone.list('LessonPlan').model.findOne({
            slug: locals.filters.plan
        }).populate('tags');

        console.log(locals.filters.plan);

        q.exec(function(err, result){
            locals.data.plan = result;
            console.log("PLANNNNN: "+locals.data.plan);
            next(err);
        });
    });

    view.render('plan');
};
