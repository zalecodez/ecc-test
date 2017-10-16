var keystone = require('keystone');
var Types = keystone.Field.Types;
var Tag = require('./Tag');

var TopicTag = new keystone.List('TopicTag', {
    inherits: Tag,
    hidden: false,
});

TopicTag.register();

