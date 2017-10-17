/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var paths = require('./paths');

// Common Middleware
//keystone.pre('routes', middleware.checkIP);
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.spamFilter);
keystone.pre('render', middleware.socialMediaHandler);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    views: importRoutes('./views'),
    api: importRoutes('./api'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
    // Views
    app.get('/', routes.views.index);

    app.get(paths.Article.many, routes.views.articles);
    app.all(paths.Article.one, routes.views.article);

    app.get(paths.Activity.many, routes.views.activities);
    app.all(paths.Activity.one, routes.views.activity);

    app.get(paths.ActivityPlan.many, routes.views.activityplans);
    app.all(paths.ActivityPlan.one, routes.views.activityplan);

    app.get(paths.ActionShot.many, routes.views.actionshots);
    app.all(paths.ActionShot.one, routes.views.actionshot);

    app.get(paths.Printable.many, routes.views.printables);
    app.all(paths.Printable.one, routes.views.printable);


    
    app.get('/search', routes.views.search);

    app.get('/api/fileupload/list', keystone.middleware.api, routes.api.fileupload.list);
    app.get('/api/fileupload/:id', keystone.middleware.api, routes.api.fileupload.get);
    app.all('/api/fileupload/:id/update', keystone.middleware.api, routes.api.fileupload.update); app.all('/api/fileupload/create', keystone.middleware.api, routes.api.fileupload.create);
    app.get('/api/fileupload/:id/remove', keystone.middleware.api, routes.api.fileupload.remove);



    // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
    // app.get('/protected', middleware.requireUser, routes.views.protected);

};
