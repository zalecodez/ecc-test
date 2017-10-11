var keystone = require('keystone');
var Comment = require('./Comment');


const LISTNAME = 'PublishedComment';
var PublishedComment = new keystone.List(LISTNAME,{
    inherits: Comment,
    label: 'Published',
    singular: 'Published Comment',
    plural: 'Published Comments',
    hidden: false,
});

PublishedComment.add({
    listname:{type: String, hidden: true, noedit: true, default: LISTNAME},
});

PublishedComment.register();
