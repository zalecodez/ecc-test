var keystone = require('keystone');
var Types = keystone.Field.Types;
var Tag = require('./Tag');

var AgeTag = new keystone.List('AgeTag', {
    inherits: Tag,
    hidden: false,
});

AgeTag.register();

