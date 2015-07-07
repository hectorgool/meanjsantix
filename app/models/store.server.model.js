'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Store Schema
 */
var StoreSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	slug: {
		type: String,
		default: ''
	},	
	description: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	}	
});

mongoose.model('Store', StoreSchema);
