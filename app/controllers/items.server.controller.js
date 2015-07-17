	'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Item = mongoose.model('Item'),
	_ = require('lodash');

/**
 * Create a item
 */
exports.create = function(req, res) {
	var item = new Item(req.body);
	item.user = req.user;

	item.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(item);
		}
	});
};

/**
 * Show the current item
 */
exports.read = function(req, res) {
	res.json(req.item);
};

/**
 * Update a item
 */
exports.update = function(req, res) {
	var item = req.item;

	item = _.extend(item, req.body);

	item.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(item);
		}
	});
};

/**
 * Delete an item
 */
exports.delete = function(req, res) {
	var item = req.item;

	item.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(item);
		}
	});
};

/**
 * List of Items
 */
exports.list = function(req, res) {
	//santo: populate, select double field
	Item.find().sort('-created').populate('user', {'displayName':'displayName','username':'username'}).exec(function(err, items) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(items);
		}
	});
};

/**
 * Item middleware
 */
exports.itemByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Item is invalid'
		});
	}

	Item.findById(id).populate('user', 'displayName').exec(function(err, item) {
		if (err) return next(err);
		if (!item) {
			return res.status(404).send({
				message: 'Item not found'
			});
		}
		req.item = item;
		next();
	});
};

/**
 * Item authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.item.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

/**
 * Item middleware
 */
 //santo
exports.itemBySlug = function(req, res, next, slug) {
	/*
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Item is invalid'
		});
	}
	*/
	Item.findOne({'slug' : slug}).populate('user', {'displayName':'displayName','username':'username'}).exec(function(err, item) {
		if (err) return next(err);
		if (!item) {
			return res.status(404).send({
				message: 'Item not found'
			});
		}
		req.item = item;
		next();
	});
};
