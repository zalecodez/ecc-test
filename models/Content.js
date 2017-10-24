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
    bodyString:{type: String, hidden:true,  watch: 'body', value: function(){
        return striptags(this.body);
    }},

    audience: {type: Types.Relationship, ref: 'AudienceTag', many:true,},
    contentType: {type: Types.Relationship, ref: 'ContentTag', noedit: true,
        watch: 'slug', value: function(callback){
            if(this.__t){
                keystone.list('ContentTag').model.findOne()
                    .where('name', this.__t)
                    .exec(function(err,result){
                        callback(err, result.id);
                    })
                ;
            }
        }
    },
    age: {type: Types.Relationship, ref: 'AgeTag', many: true, },
    ageGroup: {type: String, hidden: true, noedit: true, 
        watch: 'age', value: function(callback){
            if(this.age.length == 0){
                callback(null, "");
            }
            else{
                var q = keystone.list('Tag').model.find({
                    _id: { $in: this.age}
                });

                q.exec(function(err, result){
                    if(err){
                        callback(err, "");
                    }
                    if(result.length == 1){
                        callback(err, result[0].name);
                    }
                    else{
                        var min, max;
                        min = parseInt(result[0].name);
                        max = parseInt(result[0].name);

                        for(var j = 0; j < result.length; j++){
                            var i = parseInt(result[j].name);
                            if(i > max){
                                max = i;
                            }
                            if(i < min){
                                min = i;
                            }
                        }

                        console.log(min+" "+max);
                        callback(err, min+" - "+max);
                    }
                });
            }
                
        }
    },
    topic: {type: Types.Relationship, ref: 'TopicTag', many: true, },
    skill: {type: Types.Relationship, ref: 'SkillTag', many: true },
    
    tagString: {type: String, index:true, hidden:true, 
        watch: 'topic skill audience age contentType', 
        value: function(callback){
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
