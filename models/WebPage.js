var keystone = require('keystone');
var striptags = require('striptags');
var Types = keystone.Field.Types;

var WebPage = new keystone.List('WebPage', {
    map: {name:'title'},
    autokey: {path:'slug', from:'title', unique:'true'},
    searchFields: 'title bodyString summary',
    searchUsesTextIndex:true,
});

WebPage.add({
    title: {type: String, required: true, index:true},
    image: {type: Types.Relationship, ref: 'Image'},
    summary: {type: Types.Text, height:200},
    body: {type: Types.Html, wysiwyg: true, height:400},
    bodyString:{type: String, hidden:true,  watch: true, value: function(){
        return striptags(this.body);
    }},

});

WebPage.register();

module.exports = WebPage;
