var keystone = require('keystone');
var FuzzySearch = require('fuzzy-search');
var locus = require('locus');
var paths = require('../paths');
var _ = require('lodash');

exports = module.exports = function(req, res){

    var mongosearch = function(lists, searchQuery, tagQuery, next, callback){
        var key = Object.keys(lists[0])[0];
        var current =  lists[0][key];
        var query = Object.assign(tagQuery, current.addSearchToQuery(searchQuery));
        // var query = current.addSearchToQuery(searchQuery);

        var q = current.model.find(query); 

        var rem = lists.slice(1);
        q.exec(function(err, result){
            callback(err, next, rem, key, result);
        });
    };

    var locals = res.locals;
    var searchResults;

    locals.data = {
        paths: paths,
        searchResults: [],
        
    };
    var searchQuery = req.query.search;
    
    console.log(req.query);

    if(!_.isEmpty(req.query)){
        var tagQuery = {};
        if(req.query.audience){
            tagQuery.audience = {$in: [].concat(req.query.audience)};
        }
        if(req.query.age){
            tagQuery.age = {$in: [].concat(req.query.age)};
        }

        if(req.query.skill){
            tagQuery.skill = {$in: [].concat(req.query.skill)};
        }
        if(req.query.topic){
            tagQuery.topic = {$in: [].concat(req.query.topic)};
        }


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
        mongosearch(lists, searchQuery, tagQuery, next, 
            function lambda(error, next, lists, key, searchResults){
                if(searchResults.length > 0){
                    locals.data.searchResults[key] = searchResults;
                }

                if(lists.length == 0){
                    next(error);
                }
                else{
                    mongosearch(lists, searchQuery, tagQuery, next, lambda); 
                }
            }
        );
    }
};
