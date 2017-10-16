var keystone = require('keystone');
var Types = keystone.Field.Types;

var pdfstorage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs:{
        path: 'public/uploads/pdf',
        publicPath: '/public/uploads/pdf',
    }
});


var PDFUpload = new keystone.List('PDFUpload',{
    map: {name: 'name'}
});

PDFUpload.add({
    name: {type: String, required: true, initial: true,},
    url: {type: String, required: true, initial: true,},
    PDF: {type: Types.File, required: true, initial: true, storage: pdfstorage,},
});

PDFUpload.register();

module.exports = PDFUpload;
