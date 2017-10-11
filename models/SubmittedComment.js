var keystone = require('keystone');
var Comment = require('./Comment');


const LISTNAME = 'SubmittedComment';
var SubmittedComment = new keystone.List(LISTNAME,{
    inherits: Comment,
    label: 'Submitted',
    singular: 'Submitted Comment',
    plural: 'Submitted Comments',
    hidden: false,
});

SubmittedComment.add({
    listname:{type: String, hidden: true, noedit: true, default: LISTNAME},
});


SubmittedComment.register();
