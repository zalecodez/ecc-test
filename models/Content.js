var keystone = require('keystone');
var striptags = require('striptags');
var Types = keystone.Field.Types;
var vidStorage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs: {
        path: 'public/videos/',
        publicPath: '/public/videos/',
    }
});

var Content = new keystone.List('Content', {
    map: {name:'title'},
    autokey: {path:'slug', from:'title', unique:'true'},
    searchFields: 'title bodyString tagString',
    searchUsesTextIndex:true,
    hidden: true,
});

Content.add({
    title: {type: String, required: true, index:true},
    publishedDate: {type: Date, default: Date.now, hidden: true},
    summary: {type: Types.Text},
    body: {type: Types.Html, wysiwyg: true, height:400},
    bodyString:{type: String, hidden:true,  watch: true, value: function(){
        return striptags(this.body);
    }},

    audience: {type: Types.Relationship, ref: 'AudienceTag', many:true,},
    contentType: {type: Types.Relationship, ref: 'ContentTag'},
    age: {type: Types.Relationship, ref: 'AgeTag', many: true, },
    topic: {type: Types.Relationship, ref: 'TopicTag', many: true, },
    skill: {type: Types.Relationship, ref: 'SkillTag', many: true },
    
    tagString: {type: String, index:true, hidden:true, watch: true, value: function(callback){
        var str = "";
        var id = [this.contentType];

        var q = keystone.list('Tag').model.find({
            _id: { $in: id.concat(this.age.concat(this.topic.concat(this.skill))) }
        });

        q.exec(function(err, result){
            for(var i = 0; i < result.length; i++){
                str = str+result[i].name+" ";
            }

            callback(err, str);
        });
    }}
});

Content.relationship({path: 'comments', ref: 'Comment', refPath: 'post'});

Content.register();

module.exports = Content;
