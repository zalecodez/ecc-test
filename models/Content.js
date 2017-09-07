var keystone = require('keystone');
var striptags = require('striptags');
var Types = keystone.Field.Types;

var Content = new keystone.List('Content', {
    map: {name:'title'},
    autokey: {path:'slug', from:'title', unique:'true'},
    searchFields: 'title contentString tagString',
    searchUsesTextIndex:true
});

Content.add({
    title: {type: String, required: true, index:true},
    publishedDate: {type: Date, default: Date.now},
    headImage: {type: Types.CloudinaryImage},
    content: {type: Types.Html, wysiwyg: true, height:400},
    contentString:{type: String, hidden:true,  watch: true, value: function(){
        return striptags(this.content);
    }},
    tags: {type: Types.Relationship, ref: 'Tag', many: true},
    tagString: {type: String, index:true, hidden:true, watch: true, value: function(callback){
        var str = "";

        var q = keystone.list('Tag').model.find({
            _id: { $in: this.tags }
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
