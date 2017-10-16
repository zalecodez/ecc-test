var keystone = require('keystone');
var Types = keystone.Field.Types;
var Content = require('./Content');

var Activity = new keystone.List('Activity', {
    inherits: Content,
    singular: 'Activity', 
    plural: 'Activities',
    hidden: false,
});

Activity.add({
    image: {type: Types.Relationship, ref: 'Image'}
});

Activity.register();
