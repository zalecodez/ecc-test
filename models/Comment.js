var keystone = require('keystone');
var striptags = require('striptags');
var Types = keystone.Field.Types;

var Comment = new keystone.List('Comment', {
    label: 'Comments',
    drilldown: 'post',
    defaultSort: '-publishedDate'

});

Comment.add({
    author: {
        name: {type: String, required: true, initial: false}, 
    email:{type: Types.Email, required: true, initial: false},
    },
    user: {type: Types.Relationship, ref:'User', index:true},
    post: {type: Types.Relationship, ref: 'Post', index:true, initial:true, required:true},
    publishedDate: {type: Date, default: Date.now, noedit: true, index:true},
    content: {type: String, height:400, required: true, initial: false},
    state:{type: Types.Select, options: ['published', 'draft', 'archived'], default:'published', index:true},
    contentString:{type: String, hidden:true,  watch: true, value: function(){
        return striptags(this.content);
    }},
    title:{type: String, hidden:true, watch: 'contentString', value: function(){
        return this.contentString.substring(0, 20)+"...";
    }},
});

Comment.schema.pre('save', function (next) {
    this.wasNew = this.isNew;
    if (!this.isModified('publishedOn') && this.isModified('commentState') && this.commentState === 'published') {
        this.publishedOn = new Date();
    }
    next();
});

Comment.schema.post('save', function () {
    if (!this.wasNew)
        return;
    if (this.author) {
        keystone.list('User').model.findById(this.author).exec(function (err, user) {
            if (typeof user !== "undefined" && user) {
                user.wasActive().save();
            }
        });
    }
});
Comment.defaultColumns = 'title, post, publishedDate';

Comment.track = true;

Comment.register();


