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


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
        */
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
