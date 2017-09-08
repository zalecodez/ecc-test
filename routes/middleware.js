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

    if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(ua)) {
        console.log(ua,' is a bot');
        if(!locals.social){
            locals.social = defaultParams;
        }
        res.render('bot', locals.social);
    } else {
        console.log("socialMediaHandler");
        next();
    }
}

exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
                { label: 'Blog', key: 'blog', href:'/blog'},
                { label: 'Lesson Plans', key: 'lessonplans', href:'/lessons'},
                { label: 'Articles', key: 'articles', href:'/articles'},
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
