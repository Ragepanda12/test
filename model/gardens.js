'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//garden schema (list of tiles, creation date, id(token), location text(for weather api)
var GardenSchema = new Schema({
	_id : Schema.Types.ObjectId,
	location : String,
	layout : [Schema.Types.Mixed]
	//tiles : [{type: Schema.Types.ObjectId, ref: 'Tile'}]
});

//export our modules to use in server.js
module.exports = mongoose.model('Garden', GardenSchema);

