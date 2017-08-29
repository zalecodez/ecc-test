var keystone = require('keystone');

exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;

    //set locals
    locals.section = 'lessonplans';

    //load lesson plans
    view.query("lessonplans", keystone.list('LessonPlan').model.find(function(err, lessonplans){
        console.log("lessons::: "+lessonplans);
    }));
    view.render('lessonplanlist');
};
