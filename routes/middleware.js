/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var locus = require('locus');
var request = require('request');
var keystone = require('keystone');
var paths = require('./paths');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
        */

exports.search = function(req, res, next){

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
    
    
    var info = req.post || req.query;

    console.log(info);
    if(!_.isEmpty(info)){
        var searchQuery = info.search;
        var tagQuery = {};
        if(info.audience){
            tagQuery.audience = {$in: [].concat(info.audience)};
        }
        if(info.age){
            tagQuery.age = {$in: [].concat(info.age)};
        }

        if(info.skill){
            tagQuery.skill = {$in: [].concat(info.skill)};
        }
        if(info.topic){
            tagQuery.topic = {$in: [].concat(info.topic)};
        }
        if(info.type){
            tagQuery.contentType = info.type;
        }

        var potentials = keystone.lists;
        var lists = [];
        var count = 0;
        var last = false;
        var found = false;
        if(info.type){
            for (var l in potentials){
                if(l == info.type){
                    found = true;
                    lists[count] = {};
                    lists[count++][l] = potentials[l];
                }
            }
        }
        if(!found){
            for(var l in potentials){
                if(potentials[l].options.inherits == keystone.lists.Content){
                    lists[count] = {}
                    lists[count++][l]=potentials[l];
                }
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
    else{
        next();
    }
};
exports.getTags = function(req, res, next){
    locals = res.locals;
    locals.tags = {
        audiences: [],
        ages: [],
        topics: [],
        skills: [],
        types: [],
    }

    keystone.list('Tag').model.find()
        .exec(function(err, tags){
            if(!err){
                for(i = 0; i < tags.length; i++){
                    if(tags[i].__t == "AudienceTag"){
                        locals.tags.audiences.push(tags[i]);
                    }
                    if(tags[i].__t == "AgeTag"){
                        locals.tags.ages.push(tags[i]);
                    }
                    if(tags[i].__t == "TopicTag"){
                        locals.tags.topics.push(tags[i]);
                    }
                    if(tags[i].__t == "SkillTag"){
                        locals.tags.skills.push(tags[i]);
                    }
                    if(tags[i].__t == "ContentTag"){
                        locals.tags.types.push(tags[i]);
                    }
                }
            }
            console.log(locals.tags.types);
            next();
        });
}
exports.socialMediaHandler = function(req, res, next){
    var ua = req.headers['user-agent'];
    var locals =  res.locals;

    var host = req.protocol + "://" + req.get('host')

    var defaultParams = {
        img: '/favicon.ico',
        url: host + req.originalUrl,
        title: 'Early Childhood Care and Education',
        descriptionText: 'Parents and Teachers! Get involved with the best practices for teaching and raising children between the ages of 0 and 5.',
        imageUrl: host+'/'+'favicon.ico',
    };

    if(!locals.socials){
        locals.socials = defaultParams;
    }
    if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(ua)) {
        res.render('bot');
    } else {
        next();
    }
}

exports.checkIP = function(req, res, next){
    var ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var q = keystone.list('BlockedIP').model.findOne({
        address: ip
    });

    q.exec(function(err, result){
        if(result){
            console.log("blocked IP tryna be up in dis");
            next(new Error('Blocked'));
        }
        else{
            next(err);
        }
    });
}

exports.spamFilter = function(req, res, next){

    if(req.body.action && req.body.action === "comment.create"){
        request(
            {
                url: 'https://www.google.com/recaptcha/api/siteverify',
                method: 'POST',
                form: {
                    secret: '6LdibDAUAAAAAM2KAP0_UsMnYlHF3L4fP5Rw6RyR',
                    response: req.body['g-recaptcha-response'],
                },
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body);
                    if(body.success == true){
                        next();
                    }
                    else{
                          var ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
                          var block = new (keystone.list('BlockedIP')).model({
                              address: ip
                          });

                          block.save(function(err, block){
                              if(err){ 
                                  return console.error(err);
                              }
                          });
                          return res.redirect('/');

                    }
                }
            }
        );
        /*
         * HONEYPOT TRAPS:
         * DEEMED NOT NECESSARY BECAUSE OF RECAPTCHA
        if((req.body.contact_me && Boolean(req.body.contact_me) === true)
            || (req.body.rating)){
            console.log("spamfilter bot detected");
            
            var ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
            console.log("ip is"+ ip);
            var block = new (keystone.list('BlockedIP')).model({
                address: ip
            });

            block.save(function(err, block){
                console.log(ip+"block added");
                if(err){ 
                    return console.error(err);
                }
            });
            return res.redirect('/');
        }
        else{
            next();
        }
        */
    }
    else{
        next();
    }
}



exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
                { label: 'Articles', key: 'articles', href:'/articles'},
                { label: 'Activities', key: 'activities', href:'/activities'},
                { label: 'Activity Plans', key: 'activity-plans', href:'/activityplans'},
                { label: 'Action Shots', key: 'action-shots', href:'/actionshots'},
                { label: 'Printables', key: 'printables', href:'/printables'},
                { label: 'Search', href:'/search'}
	];
	res.locals.user = req.user;
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
