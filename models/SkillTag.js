var keystone = require('keystone');
var Types = keystone.Field.Types;
var Tag = require('./Tag');

var SkillTag = new keystone.List('SkillTag', {
    inherits: Tag,
    hidden: false,
});

SkillTag.register();

