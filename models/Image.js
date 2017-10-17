var keystone = require('keystone');
var Types = keystone.Field.Types;
var MediaUpload = require('./MediaUpload');

var imgStorage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs:{
        path: 'public/uploads/images',
        publicPath: '/public/uploads/images',
    }
    
});

var Image = new keystone.List('Image',{
    inherits: MediaUpload,
    hidden: false,
});

Image.add({
    type: {type: String, hidden: true, value: 'image'},
    image: {type: Types.File, requried: true, initial: true, index: true, storage: imgStorage,},
    url: {type: String, hidden: false, noedit: true, index: true, 
        watch: 'image', value: function(){
            return '/uploads/images/'+this.image.filename;
        },
    },
    preview: {type: Types.Html, wysiwyg: true, watch: 'image', 
        value: function(){
            return "<img width='150' height='150' src='/uploads/images/"+this.image.filename+"'/>";
        },
    },
});

Image.register();
