var keystone = require('keystone');
var Types = keystone.Field.Types;
var Tag = require('./Tag');

var AudienceTag = new keystone.List('AudienceTag', {
    inherits: Tag,
    hidden: false,
});

AudienceTag.register();

