var keystone = require('keystone');
var Types = keystone.Field.Types;

var Tag = new keystone.List('Tag', {
    map:{name:'name'},
    autokey: {path:'key', from:'name', unique:true}
});

Tag.add({
    name:{type: String, required: true}
});

Tag.relationship({ path: 'posts', ref: 'Post', refPath: 'tags' });
Tag.relationship({path: 'articles', ref: 'Article', refPath: 'tags'});
Tag.relationship({path: 'lessonplans', ref: 'LessonPlan', refPath: 'tags'});



Tag.register();
