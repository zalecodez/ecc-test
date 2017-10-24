var keystone = require('keystone');
var Types = keystone.Field.Types;
var pdfjs = require('pdfjs-dist');

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
    thumbnail: {type: String, watch: true, value: function(callback){
        function makeThumb(page) {
            // draw page to fit into 96x96 canvas
            var vp = page.getViewport(1);
            var canvas = document.createElement("canvas");
            canvas.width = canvas.height = 500;
            var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
            return page.render({canvasContext: canvas.getContext("2d"), viewport: page.getViewport(scale)}).promise.then(function () {
                return canvas;
            });
        }

        pdfjs.PDFJS.getDocument("localhost:300/uploads/pdf/GMgLfcV7yk2Xu9oF.pdf").promise.then(function (doc) {
            console.log(doc);
        }).catch(console.error);
    }},

});

PDF.register();

module.exports = PDF;
