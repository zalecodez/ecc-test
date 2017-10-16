var keystone = require('keystone');
var Types = keystone.Field.Types;

var Event = new keystone.List('Event');

Event.add({
    eventName: {type: String},
    description: {type: String},
    date: {type: Date},
});

Event.register();

