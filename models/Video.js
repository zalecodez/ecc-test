var keystone = require('keystone');
var Types = keystone.Field.Types;
var MediaUpload = require('./MediaUpload');
var video2img = require('./video2img');

var vidStorage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs:{
        path: 'public/uploads/videos',
        publicPath: '/public/uploads/videos',
    }
});

var Video = new keystone.List('Video',{
    inherits: MediaUpload,
    hidden: false,
});

Video.add({
    type: {type: String, hidden: true, value: 'video'},
    video: {type: Types.File, requried: true, index: true, initial: true, storage: vidStorage,},
    url: {type: String, hidden: false, noedit: true, index: true, 
        watch: 'video', value: function(){
            return '/uploads/videos/'+this.video.filename;
        },
    },
    thumbnail: {type: String, hidden: true, 
        watch: 'video', value: function(callback){
            video2img(__dirname+"/../public/uploads/videos/"+this.video.filename, callback);
        }
    },
    preview: {type: Types.Html, wysiwyg: true, watch: true, 
        value: function(){
            return "<img width='150' height='150' src='"+this.thumbnail+"'/>";
        },
    },

});

Video.register();
