var keystone = require('keystone');
var Types = keystone.Field.Types;
var MediaUpload = require('./MediaUpload');

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
    video: {type: Types.File, requried: true, index: true, initial: true, storage: vidStorage,},
    url: {type: String, hidden: false, noedit: true, index: true, 
        watch: 'video', value: function(){
            return '/uploads/videos/'+this.video.filename;
        },
    },
    //preview: {type: Types.Html, wysiwyg: true, watch: 'video', 
    //    value: function(){
    //        return "<video width='150' height='150' controls>\
    //                <source \
    //                    src='/uploads/videos/"+this.video.filename+"'\
    //                    type= '"+this.video.mimetype+"'\
    //                />\
    //            </video>";
    //    },
    //},

});

Video.register();
