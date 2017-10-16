var keystone = require('keystone');
var Types = keystone.Field.Types;

var Announcement = new keystone.List('Announcement');

Announcement.add({
    image: {type: Types.Relationship, ref: 'Image'},
    imageurl: {type: Types.Url},
    body: {type: String},
    expireOn: {type: Date, index: {expireAfterSeconds: 60}},
});

Announcement.register();

