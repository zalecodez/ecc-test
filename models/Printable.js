var keystone = require('keystone');
var Types = keystone.Field.Types;
var Content = require('./Content');

var Printable = new keystone.List('Printable', {
    inherits: Content,
    singular: 'Printable', 
    plural: 'Printables',
    hidden: false,
});

Printable.add({
    mediaType: {type: Types.Select, options: ['Gallery', 'PDF', 'Video']},
    media: {type: Types.Relationship, ref: 'Gallery', many: false, dependsOn: {mediaType: 'Gallery'}},
    pdf: {type: Types.Relationship, ref: 'PDFUpload', many: false, dependsOn: {mediaType: 'PDF'}},
    video: {type: Types.Relationship, ref: 'Video', many: false, dependsOn: {mediaType: 'Video'}},
});

Printable.register();
