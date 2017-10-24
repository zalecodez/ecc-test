var keystone = require('keystone');
var FuzzySearch = require('fuzzy-search');
var locus = require('locus');
var _ = require('lodash');
exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    view.render('search');
};
