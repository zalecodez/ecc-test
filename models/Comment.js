var keystone = require('keystone');
var locus = require('locus');
var striptags = require('striptags');
var Types = keystone.Field.Types;

const LISTNAME = 'Comment';

var Comment = new keystone.List(LISTNAME, {
    label: 'Comments',
    drilldown: 'post',
    defaultSort: 'post, state, -submittedOn',
    hidden: true,
    //nodelete: true,

});

Comment.add({
    prevId: {type: Types.Key, hidden:true, noedit:true,},
    prevListName:{type:String, hidden: true, noedit:true,},
    listname:{type: String, hidden: true, noedit: true, default: LISTNAME},
    author: {
        name: {type: String, required: true, initial: false, noedit:true}, 
        email:{type: Types.Email, required: true, initial: false, noedit:true},
    },
    user: {type: Types.Relationship, ref:'User', index:true, noedit:true},
    post: {type: Types.Relationship, ref: 'Post', index:true, initial:true, required:true, noedit:true},
    submittedOn: {type: Date, default: Date.now, noedit: true, index:true},
    content: {type: String, height:400, required: true, initial: false, noedit:true},
    state:{type: Types.Select, options: ['published', 'submitted', 'flagged', 'archived'], default:'submitted', index:true},
    contentString:{type: String, hidden:true,  watch: true, value: function(){
        return striptags(this.content);
    }},
    comment:{type: String, hidden:true, watch: 'contentString', value: function(){
        var str = this.contentString.substring(0, 20);
        if(this.contentString.length > 20){
            str = str+"...";
        }

        return str;
    }},
});

//Comment.schema.pre('save', function (next) {
//    console.log('pre save on '+this.listname);
//    if(this.prevId){
//        keystone.list(this.prevListName).model.findById(this.prevId).remove(function(err){
//            console.log("pre save "+this.listname+"dup found");
//            if(!err){
//                console.log("deleted");
//            }
//            else{
//                console.log("error deleting:\n"+err);
//            }
//        });
//    }
//
//    next();
//});
Comment.schema.post('save', function () {
    var mod;

    console.log("post save on "+this.listname);
    //eval(locus);

    //if(this.isModified('state')){
    if(this.state === 'flagged'){
        mod = 'FlaggedComment';
    }
    if(this.state === 'archived'){
        mod = 'ArchivedComment';
    }
    if(this.state === 'submitted'){
        mod = 'SubmittedComment';
    }
    if(this.state === 'published'){
        mod = 'PublishedComment';
    }
    if(this.listname != mod){
        console.log("state modified. add to "+mod);

        var newComment = new (keystone.list(mod)).model({
            prevId: this.id,
            prevListName: this.listname,
            listname: mod,
            author: this.author,
            user: this.user,
            post: this.post,
            submittedOn: this.submittedOn,
            content: this.content, 
            state: this.state,
            contentString: this.contentString, 
            comment: this.comment, 
        });

        var prevname = this.listname;
        var previd = this.id;
        
        newComment.save(function(err){
            if(!err){
                console.log("added to "+mod);
                console.log("delete "+previd+" from "+prevname);
                keystone.list(prevname).model.findById(previd).remove(function(err){
                    if(!err){
                        console.log("deleted");

                    }
                    else{
                        console.log("SWAGSWAGSWAG"+err);
                    }

                });
            }


        });
    }
});
/*
Comment.schema.pre('save', function (next) {
    this.wasNew = this.isNew;
    if (!this.isModified('submittedOn') && this.isModified('commentState') && this.commentState === 'submitted') {
        this.submittedOn = new Date();
    }
    next();
});

Comment.schema.post('save', function () {
    if (!this.wasNew)
        return;
    if (this.user) {
        keystone.list('User').model.findById(this.user).exec(function (err, user) {
            if (typeof user !== "undefined" && user) {
                user.wasActive().save();
            }
        });
    }
    next();
});
*/
Comment.defaultColumns = 'state, comment, post, submittedOn';

Comment.track = true;

Comment.register();

module.exports = Comment;
