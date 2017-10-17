var keystone = require('keystone');
var Types = keystone.Field.Types;

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
});

PDF.register();

module.exports = PDF;
