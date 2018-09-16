'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
// var TileSchema = new Schema({
//   author: String,
//   text: String
// });

//tile schema (owner(gardenid), tile type(from preset scraped list), properties)
var TileSchema = new Schema({
	_id : Schema.Types.ObjectId,
	parentgarden: {type: Schema.Types.ObjectId, ref: 'Garden'},
	tiletype: {type: Schema.Types.ObjectId, ref: 'TileType'},
	tileprops: {
		soiltype: String,
		ph: Number,
		sunlight: String,
		moisture: String,
	},
	gridorder: Number,
	davesgardenid: Number,
	imglink: String,
	lastwatered: Date,
	x: Number,
	y: Number,
	width: Number,
	height: Number,
});

//export our modules to use in server.js
module.exports = mongoose.model('Tile', TileSchema);

