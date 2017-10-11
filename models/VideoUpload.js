var keystone = require('keystone');
var Types = keystone.Field.Types;

var vidStorage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs:{
        path: 'public/uploads/videos',
        publicPath: '/public/uploads/videos',
    }
});

var VideoUpload = new keystone.List('VideoUpload');

VideoUpload.add({
    file: {type: Types.File, storage: vidStorage,},
    url: {type: String},
});

VideoUpload.register();


