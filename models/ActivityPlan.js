var keystone = require('keystone');
var Types = keystone.Field.Types;
var Content = require('./Content');

var ActivityPlan = new keystone.List('ActivityPlan', {
    inherits: Content,
    singular: 'ActivityPlan', 
    plural: 'ActivityPlans',
    hidden: false,
});

ActivityPlan.add({
    image: {type: Types.Relationship, ref: 'Image'}
});

ActivityPlan.register();
