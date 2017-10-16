var keystone = require('keystone');
var Types = keystone.Field.Types;
var Content = require('./Content');

var LessonPlan = new keystone.List('LessonPlan', {
    inherits: Content,
    singular: 'Lesson Plan', 
    plural: 'Lesson Plans',
    hidden: true,
});

LessonPlan.add({
    gallery: {type: Types.CloudinaryImages},
    materials: {type: Types.Text},
    //instructions: {type: Types.Html, wysiwyg: true, height:400},
});

LessonPlan.register();
