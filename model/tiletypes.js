'use strict';
//import dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//tiletype schema (name, altname(e.g latin/scientific), isPlant, list of requirements)
var TileTypeSchema = new Schema({
	_id : Schema.Types.ObjectId,
	name: String,
	altname: String,
	isplant: Boolean, 
	info: String,
	tilecolour: String,
});

//export our modules to use in server.js
module.exports = mongoose.model('TileType', TileTypeSchema);
