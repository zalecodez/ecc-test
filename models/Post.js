var keystone = require('keystone');
var Types = keystone.Field.Types;
var Content = require('./Content');

var Post = new keystone.List('Post', {
    inherits: Content,
    singular: 'Post', 
    plural: 'Posts',
    hidden: false,
});

Post.relationship({path:'comments', ref:'Comment', refPath:'post'});

Post.register();
