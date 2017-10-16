var keystone = require('keystone');
var Types = keystone.Field.Types;
var Tag = require('./Tag');

var ContentTag = new keystone.List('ContentTag', {
    inherits: Tag,
    hidden: false,
});

ContentTag.register();

