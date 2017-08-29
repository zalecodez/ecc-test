var keystone = require('keystone');
var FuzzySearch = require('fuzzy-search');
var locus = require('locus');

var fuzzy = function(searchQuery, next, callback){
    var q = keystone.list('Post').model.find().populate('tags', 'name');
    q.exec(function(err, result){
        var blog = result;

        const searcher = new FuzzySearch(blog, ['contentString', 'title', 'tagString']);
        searchResults = searcher.search(searchQuery);
        console.log("SEARCH RESULTS: "+searchResults);
        callback(searchResults);
        next(err);
    });
}

var mongosearch = function(searchQuery, next, callback){
    var q = keystone.list('Post').model.find({$text: {$search: searchQuery}}); 

    q.exec(function(err,result){
        searchResults = result;
        callback(searchResults);
        next(err);
    });
};
exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals;
    var searchResults;

    locals.data = {
        searchResults: {}
    };
    var searchQuery = req.query.search;

    if(searchQuery){
        view.on('init', function(next){
//
//            //fuzzy search
//            fuzzy(searchQuery, next, function(searchResults){
//                if(searchResults){
//                    locals.data.searchResults = searchResults;
//                }
//            });
//
//            //mongo index search
//            mongosearch(searchQuery, next,function(searchResults){
//                if(searchResults){
//                    locals.data.searchResults = searchResults;
//                }
//            });
            var post = keystone.list('Post');
            var coll = post.model.collection;

            coll.getIndexes(function(err, indexes){
                eval(locus);
                if(err) throw err;
var data = keystone.list('Post').buildSearchTextIndex();
            eval(locus);
            data = keystone.list('Post').ensureTextIndex();
            data = keystone.list('Post').declaresTextIndex();
            console.log(data);

            });
        });

    }
    view.render('search');
};
