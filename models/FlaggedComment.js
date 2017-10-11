var keystone = require('keystone');
var Comment = require('./Comment');


const LISTNAME = 'FlaggedComment';
var FlaggedComment = new keystone.List(LISTNAME,{
    inherits: Comment,
    label: 'Flagged',
    singular: 'Flagged Comment',
    plural: 'Flagged Comments',
    hidden: false,
    nodelete:false,
});

FlaggedComment.add({
    listname:{type: String, hidden: true, noedit: true, default: LISTNAME},
});


FlaggedComment.register();
