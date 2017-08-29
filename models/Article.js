var keystone = require('keystone');
var Types = keystone.Field.Types;

var Article = new keystone.List('Article', {
    map: {name:'title'},
    singular: 'Article', 
    plural: 'Articles',
    autokey: {path:'slug', from:'title', unique:'true'}
});

Article.add({
    title: {type: String, required: true},
    publishedDate: {type: Date, default: Date.now},
    headImage: {type: Types.CloudinaryImage},
    content: {type: Types.Html, wysiwyg: true, height:400},
    sources: {type: Types.Text},
    tags: {type: Types.Relationship, ref: 'Tag', many: true}
});

Article.register();
