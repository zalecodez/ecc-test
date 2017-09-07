var keystone = require('keystone');
var FuzzySearch = require('fuzzy-search');
var locus = require('locus');
var paths = require('../paths');

var fuzzy = function(searchQuery, next, callback){
    var q = keystone.list('Post').model.find().populate('tags', 'name');
    q.exec(function(err, result){
        var blog = result;

        const searcher = new FuzzySearch(blog, ['contentString', 'title', 'tagString']);
        searchResults = searcher.search(searchQuery);
        console.log("SEARCH RESULTS: "+searchResults);
        callback(searchResults);
    });
}

var mongosearch = function(lists, searchQuery, next, callback){
    var key = Object.keys(lists[0])[0];
    var current =  lists[0][key];
    var q = current.model.find(current.addSearchToQuery(searchQuery)); 

    var rem = lists.slice(1);
    q.exec(function(err, result){
        callback(err, next, rem, key, result);
    });
};
exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;
    var searchResults;

    locals.data = {
        paths: paths,
        searchResults: []
    };
    var searchQuery = req.query.search;

    if(searchQuery){
        view.on('init', function(next){
            var potentials = keystone.lists;
            var lists = [];
            var count = 0;
            var last = false;
            for(var l in potentials){
                if(potentials[l].options.inherits == keystone.lists.Content){
                    lists[count] = {}
                    lists[count++][l]=potentials[l];
                }
            }
            //now we have lists, the list of keystone lists to display


            //mongo index search
            //search on the first list, on callback search on remainder
            mongosearch(lists, searchQuery, next, 
            function lambda(error, next, lists, key, searchResults){
                if(searchResults.length > 0){
                    locals.data.searchResults[key] = searchResults;
                }

                if(lists.length == 0){
                    next(error);
                }
                else{
                    mongosearch(lists, searchQuery, next, lambda); 
                }
            });
        });
    }
    view.render('search');
};
