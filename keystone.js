// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'ECC Test',
	'brand': 'ECC Test',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',

	'wysiwyg override toolbar': false,
		'wysiwyg menubar': true,
		'wysiwyg skin': 'lightgray',
		'wysiwyg additional buttons': 'searchreplace visualchars,'
			+ ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
			+' emoticons media, preview print ',
		'wysiwyg additional plugins': 'example, table, advlist, anchor,'
			+ ' autolink, autosave, bbcode, charmap, contextmenu, '
			+ ' directionality, emoticons, fullpage, hr, media, pagebreak,'
			+ ' paste, preview, print, searchreplace, textcolor,'
			+ ' visualblocks, visualchars, wordcount',

});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
    users: 'users',
    blog: 'Post',
    'Lesson Plans': 'LessonPlan',
    articles: 'Article'
        
});

// Start Keystone to connect to your database and initialise the web server



keystone.start();
