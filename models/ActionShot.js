var keystone = require('keystone');
var Types = keystone.Field.Types;
var Content = require('./Content');

var ActionShot = new keystone.List('ActionShot', {
    inherits: Content,
    singular: 'ActionShot', 
    plural: 'ActionShots',
    hidden: false,
});

ActionShot.add({
    mediaType: {type: Types.Select, options: ['Gallery', 'PDF', 'Video']},
    media: {type: Types.Relationship, ref: 'Gallery', many: false, dependsOn: {mediaType: 'Gallery'}},
    pdf: {type: Types.Relationship, ref: 'PDFUpload', many: false, dependsOn: {mediaType: 'PDF'}},
    video: {type: Types.Relationship, ref: 'Video', many: false, dependsOn: {mediaType: 'Video'}},
});

ActionShot.register();
