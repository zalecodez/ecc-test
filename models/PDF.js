var keystone = require('keystone');
var Types = keystone.Field.Types;
var pdf2png = require('./pdf2png');

var pdfstorage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs:{
        path: 'public/uploads/pdf',
        publicPath: '/public/uploads/pdf',
    }
});


var PDF = new keystone.List('PDF',{
    map: {name: 'name'}
});

PDF.add({
    name: {type: String, required: true, initial: true,},
    __t: {type: String, required: true, hidden: true, default: "PDF"},
    PDF: {type: Types.File, required: true, initial: true, storage: pdfstorage,},
    url: {type: String, hidden: false, noedit: true, index: true, 
        watch: 'PDF', value: function(){
            return '/uploads/pdf/'+this.PDF.filename;
        },
    },
    thumbnail: {type: String, hidden: true, 
        watch: 'PDF', value: function(callback){
            pdf2png(__dirname+"/../public/uploads/pdf/"+this.PDF.filename, callback);
        }
    },
    preview: {type: Types.Html, wysiwyg: true, watch: true, height: '500',
        value: function(){
            return "<img  height='500' src='"+this.thumbnail+"'/>";
        },
    },
});

PDF.register();

module.exports = PDF;
