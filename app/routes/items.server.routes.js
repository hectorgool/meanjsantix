'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	items = require('../../app/controllers/items.server.controller');

module.exports = function(app) {
	// Item Routes
	app.route('/items')
		.get(items.list)
		.post(users.requiresLogin, items.create);

	app.route('/items/:itemId')
		.get(items.read)
		.put(users.requiresLogin, items.hasAuthorization, items.update)
		.delete(users.requiresLogin, items.hasAuthorization, items.delete);

	app.route('/item/:itemSlug')
		.get(items.read);

	// Finish by binding the item middleware
	app.param('itemId', items.itemByID)//;
	   .param('itemSlug', items.itemBySlug);
};
