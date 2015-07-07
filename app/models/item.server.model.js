'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	sku: {
		type: String,
		default: '',
		trim: true
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
	},
	shipping: [shippingSchema],
	pricing: [pricingSchema]
});


var shippingSchema = new Schema({ 
	weight: {
		type: Number,
		default: 0.0
	},
	dimensions: [dimensionsSchema]
});


var dimensionsSchema = new Schema({
	width: {
		type: Number,
		default: 0.0
	},
	height: {
		type: Number,
		default: 0.0
	},
	depth: {
		type: Number,
		default: 0.0
	}
});


var pricingSchema = new Schema({ 
	list: {
		type: Number,
		default: 0.0
	},
	retail: {
		type: Number,
		default: 0.0
	},
	savings: {
		type: Number,
		default: 0.0
	},
	pct_savings: {
		type: Number,
		default: 0.0
	}
});


mongoose.model('Item', ItemSchema);
