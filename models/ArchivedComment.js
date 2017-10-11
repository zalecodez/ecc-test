var keystone = require('keystone');
var Comment = require('./Comment');

const LISTNAME = 'ArchivedComment';
var ArchivedComment = new keystone.List(LISTNAME,{
    inherits: Comment,
    label: 'Archived',
    singular: 'Archived Comment',
    plural: 'Archived Comments',
    hidden: false,
    nodelete: false,
});

ArchivedComment.add({
    listname:{type: String, hidden: true, noedit: true, default: LISTNAME},
});

ArchivedComment.register();
