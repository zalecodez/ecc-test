var keystone = require('keystone');
var Types = keystone.Field.Types;

var Gallery = new keystone.List('Gallery', {
    
});

Gallery.add({
    name: {type: String, required: true, initial:true},
});

Gallery.relationship({path: 'media', ref: 'MediaUpload', refPath:'gallery'});

Gallery.register();
