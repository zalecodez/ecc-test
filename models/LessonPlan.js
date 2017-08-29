var keystone = require('keystone');
var Types = keystone.Field.Types;

var LessonPlan = new keystone.List('LessonPlan', {
    map: {name:'title'},
    singular: 'Lesson Plan', 
    plural: 'Lesson Plans',
    autokey: {path:'slug', from:'title', unique:'true'}
});

LessonPlan.add({
    title: {type: String, required: true},
    publishedDate: {type: Date, default: Date.now},
    headImage: {type: Types.CloudinaryImage},
    gallery: {type: Types.CloudinaryImages},
    materials: {type: Types.Text},
    instructions: {type: Types.Html, wysiwyg: true, height:400},
    tags: {type: Types.Relationship, ref: 'Tag', many: true}
});

LessonPlan.register();
