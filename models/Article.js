var keystone = require('keystone');
var Types = keystone.Field.Types;
var Content = require('./Content');

var Article = new keystone.List('Article', {
    inherits: Content,
    singular: 'Article', 
    plural: 'Articles',
});

Article.add({
    sources: {type: Types.Text},
});

Article.register();
