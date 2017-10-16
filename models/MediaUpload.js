var keystone = require('keystone');
var Types = keystone.Field.Types;

var MediaUpload = new keystone.List('MediaUpload',{
    //autokey: {path: 'filename', from: 'name', unique: true},
    map: {name: 'name'},
    hidden: true,
});

MediaUpload.add({
    name: {type: String, required: true, initial: true},
    caption:{type: String},
    altText:{type: String},
    gallery: {type: Types.Relationship, ref: 'Gallery'},
});

MediaUpload.register();

module.exports = MediaUpload;
