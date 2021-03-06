'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Store = mongoose.model('Store'),
	_ = require('lodash');

/**
 * Create a store
 */
exports.create = function(req, res) {
	var store = new Store(req.body);
	store.user = req.user;

	store.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(store);
		}
	});
};

/**
 * Show the current store
 */
exports.read = function(req, res) {
	res.json(req.store);
};

/**
 * Update a store
 */
exports.update = function(req, res) {
	var store = req.store;

	store = _.extend(store, req.body);

	store.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(store);
		}
	});
};

/**
 * Delete an store
 */
exports.delete = function(req, res) {
	var store = req.store;

	store.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(store);
		}
	});
};

/**
 * List of Stores
 */
exports.list = function(req, res) {
	Store.find().sort('-created').populate('user', 'displayName').exec(function(err, stores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(stores);
		}
	});
};

/**
 * Store middleware
 */
exports.storeByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Store is invalid'
		});
	}

	Store.findById(id).populate('user', 'displayName').exec(function(err, store) {
		if (err) return next(err);
		if (!store) {
			return res.status(404).send({
				message: 'Store not found'
			});
		}
		req.store = store;
		next();
	});
};

/**
 * Store authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.store.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

/**
 * Store middleware
 */
 //santo
/* 
exports.storeBySlug = function(req, res, next, slug) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Store is invalid'
		});
	}

	Store.findBySlug(slug).populate('user', 'displayName').exec(function(err, store) {
		if (err) return next(err);
		if (!store) {
			return res.status(404).send({
				message: 'Store not found'
			});
		}
		req.store = store;
		next();
	});
};
*/