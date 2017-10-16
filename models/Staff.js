var keystone = require('keystone');
var Types = keystone.Field.Types;

var Staff = new keystone.List('Staff', {
});

Staff.add({
    picture: {type: Types.Relationship, ref: 'Image'},
    name: {type: String},
    body: {type: String},
});

Staff.register();

