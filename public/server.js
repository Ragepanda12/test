'use strict'

//first we import our dependencies...
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Garden = require('../model/gardens');
var Tile = require('../model/tiles');
var TileType = require('../model/tiletypes');
var Schema = mongoose.Schema;

const { exec } = require('child_process');
const spawn = require('child_process').spawn;

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
//var port = process.env.API_PORT || 3001;
var port = 3001;

//mongodb://admin:admin@ds135514.mlab.com:35514/plantir-db
var mongoDB = 'mongodb://admin:admin@ds135514.mlab.com:35514/plantir-db';
mongoose.connect(mongoDB, { useMongoClient: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now  we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

//NOT USED -- DEMO PURPOSES ONLY
//adding the /comments route to our /api router
router.route('/comments')
  //retrieve all comments from the database
  .get(function(req, res) {
    //looks at our Comment Schema
    Tile.find(function(err, comments) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(comments)
    });
  })
  //post new comment to the database
  .post(function(req, res) {
    var comment = new Tile();
    //body parser lets us use the req.body
    comment.author = req.body.author;
    comment.text = req.body.text;

    comment.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Comment successfully added!' });
    });
  });


//NOT USED -- DEMO PURPOSES ONLY
router.route('/comments/:garden_id')
//The put method gives us the chance to update our comment based on the ID passed to the route
 .put(function(req, res) {
   Tile.findById(req.params.garden_id, function(err, tile) {
     if (err)
       res.send(err);
     //setting the new author and text to whatever was changed. If nothing was changed
     // we will not alter the field.
     (req.body.author) ? tile.author = req.body.author : null;
     (req.body.text) ? tile.text = req.body.text : null;
     //save comment
     tile.save(function(err) {
       if (err)
         res.send(err);
       res.json({ message: 'Comment has been updated' });
     });
   });
 })
 //delete method for removing a comment from our database
 .delete(function(req, res) {
   //selects the comment by its ID, then removes it.
   Tile.remove({ _id: req.params.garden_id }, function(err, tile) {
     if (err)
       res.send(err);
     res.json({ message: 'Comment has been deleted' })
   })
});


//POST -- CREATE NEW GARDEN TOKEN
//GET  -- RETRIEVE LIST OF ALL GARDENS
router.route('/garden')
  	.get(function(req, res) {
    	Garden.find(function(err, gardens) {
    		if (err)
        		res.send(err);
      		//responds with a json object of our database gardens
      		res.json(gardens)
    	});
  	})
	//post new garden
	.post(function(req, res) {
    	var garden = new Garden({
    		_id: new mongoose.Types.ObjectId(),
    		location: 'Sydney',
        layout: []
    		//location: req.body.location;
    	});
    	//garden.location = req.body.location;
    	console.log("Garden created: "+garden._id);
    	garden.save(function(err) {
      		if (err)
        	res.send(err);
/*

        	//loop to add 25 tiles to create default demo house
        	for (var i=0; i<25; i++) {
        		//change to brick for demo purposes
        		//grass
        		var tiletypeobject = mongoose.Types.ObjectId("59cb40fa9b7ea709e92b151a")
        		//house
        		if([1,2,3,6,7,8].includes(i)) {
        			tiletypeobject = mongoose.Types.ObjectId("59cb41419b7ea709e92b151c")
        		} 
        		//sunflower
        		if([11,12].includes(i)) {
        			tiletypeobject = mongoose.Types.ObjectId("59cf04d4eba6283df8131bb1")
        		} 
        		//path
        		if([13,18,23].includes(i)) {
        			tiletypeobject = mongoose.Types.ObjectId("59cf36be829c56459f23ea37")
        		}
	        	var emptytile = new Tile({
	    			_id: new mongoose.Types.ObjectId(),
	        		parentgarden: garden._id,
	        		//add grass as default tiletype on new garden creation
	        		tiletype: tiletypeobject,
	        		tileprops: {
	        			soiltype: "Loam",
	        			ph: 5,
	        			sunlight: "Moderate",
	        			moisture: "Moderate"
	        		},
              davesgardenid: -1,
              imglink: 'https://i.pinimg.com/236x/c4/ee/45/c4ee45976bd00727d6c8f90fb03c6eb3--icon-png-pixel-art.jpg',
	        		gridorder: i,
	        		lastwatered: new Date("13 Mar 2010") //fake date to test watering function
	        	});
	        	emptytile.save(function (err) {
	        		if (err) 
	        		res.send(err);
              
	        	})
	        }
*/
      		res.json({ message: 'Garden created!',
      			       gardenid: garden._id });
    	});
});

router.route('/garden/:garden_id')
  	.get(function(req, res) {
		Garden.findById(req.params.garden_id, function(err, garden) {
  			if (err)
  				res.send(err);
  			res.json(garden)
  		});
  	})
	.put(function(req, res) {
		Garden.findById(req.params.garden_id, function(err, garden) {
    		if (err)
    		res.send(err);
        	(req.body.location) ? garden.location = req.body.location : null;
          (req.body.layout) ? garden.layout = req.body.layout : null;
        	garden.save(function(err) {
            	if (err)
            	 return res.send(err);
            	res.json({ message: 'Garden location has been updated',layout: garden.layout });
        	});
    	});
 	})
 	//delete method for removing a comment from our database
 	.delete(function(req, res) {
    	//selects the comment by its ID, then removes it.
   		Garden.remove({ _id: req.params.garden_id }, function(err, garden) {
     		if (err)
       		return res.send(err);
     		res.json({ message: 'Garden has been deleted' })
  		})
});

//GET -- RETRIEVE ALL TILES BELONGING TO A SINGLE GARDEN-ID
router.route('/garden/:garden_id/findtiles')
  	.get(function(req, res) {
		Tile.find( {parentgarden: req.params.garden_id}, function(err, tiles) {
  			if (err)
  				res.send(err);
  			res.json(tiles)
  		});
});

//POST -- CREATE A NEW TOKEN WITH PARENT GARDEN
router.route('/tile')
	.post(function(req, res) {
    console.log(req.body.parentgarden);
    	var tile = new Tile({
    		_id: new mongoose.Types.ObjectId(),
    		parentgarden: req.body.parentgarden,
    		tiletype: req.body.tiletype,
    		tileprops: {
    			soiltype: req.body.soiltype,
    			ph: req.body.ph,
    			sunlight: req.body.sunlight,
    			moisture: req.body.moisture
    		},
        davesgardenid: -1,
        imglink: 'https://i.pinimg.com/236x/c4/ee/45/c4ee45976bd00727d6c8f90fb03c6eb3--icon-png-pixel-art.jpg',
        gridorder: req.body.gridorder,
        lastwatered: new Date("13 Mar 2010") //fake date to test watering function
    		/*x: req.body.x,
    		y: req.body.y,
    		height: req.body.height,
    		width: req.body.width,*/
    		//location: req.body.location;
    	});
    	tile.save(function(err) {
      		if (err)
        	res.send(err);

      		res.json({ message: 'Tile created!',
      			       tileid: tile._id, parentgarden: req.body.parentgarden});
    	});
});

//POST -- EDIT A TILE (i.e the plot information): Takes: soiltype, moisture, ph(int), sunlight
router.route('/tile/:tile_id')
		.put(function(req, res) {
			Tile.findById(req.params.tile_id, function(err, tile) {
	    		if (err)
	    		res.send(err);
	        	(req.body.moisture) ? tile.tileprops.moisture = req.body.moisture : null;
	        	(req.body.sunlight) ? tile.tileprops.sunlight = req.body.sunlight : null;
	        	//(req.body.ph) ? tile.location = req.body.ph : null;
	        	(req.body.soiltype) ? tile.tileprops.soiltype = req.body.soiltype : null;
	        	(req.body.tiletype) ? tile.tiletype = req.body.tiletype : null;
	        	(req.body.lastwatered) ? tile.lastwatered = req.body.lastwatered : null;
            (req.body.davesgardenid) ? tile.davesgardenid = req.body.davesgardenid : null;
            (req.body.imglink) ? tile.imglink = req.body.imglink : null;
	        	(req.body.x) ? tile.x = req.body.x : null;
	        	(req.body.y) ? tile.y = req.body.y : null;
	        	(req.body.height) ? tile.height = req.body.height : null;
	        	(req.body.width) ? tile.width = req.body.width : null;

	        	tile.save(function(err) {
	            	if (err)
	            	res.send(err);
	            	//console.log('Plot information has been updated');
	            	res.json({ message: 'Plot information has been updated' });

	        	});
    	});
  })
  .delete(function(req, res) {
   //Delete a tile by the ID in req
   Tile.remove({ _id: req.params.tile_id }, function(err, tile) {
     if (err)
       res.send(err);
     res.json({ message: 'Tile has been deleted' });
   });
});

router.route('/search/:search_str')
	.get(function(req, res) {
		console.log('hello ddd ' + req.params.search_str);
		console.log(process.cwd());
	// 	execString = 'python ../scraper/scraper.py ' + req.params.search_str;
	// 	exec(execString, (err, stdout, stderr)) => {
	// 		if (err) {
	// 			console.error(`exec error: ${err}`);
	// 			return;
	// 		}
	// 		console.log('returned');
	// 		console.log($(stdout));
	// }

		const prog = spawn('python3', ['scraper/scraper.py', req.params.search_str]);
		prog.stderr.on('data', (data) =>{
      /*const prog3 = spawn('python3', ['scraper/scraper.py', req.params.search_str]);
      prog3.stdout.on('data', (data) =>{
        console.log(`output: ${data}`);
       res.send(data);
      });
      prog3.on('close', (code) => {
        //console.log(`child process exited with code ${code}`);
      });*/
			console.log(`error: ${data}`);
		});
		prog.stdout.on('data', (data) =>{
			console.log(`output: ${data}`);
			res.send(data);
		});
		prog.on('close', (code) => {
		  //console.log(`child process exited with code ${code}`);
		});


    	//res.json({ message: req.params.search_str });
});


//POST -- CREATE NEW TILETYPE | TAKES: name(string), isplant(bool), tilecolour(#ffffff)
//GET
router.route('/tiletype')
  	.get(function(req, res) {
    	TileType.find(function(err, tiletypes) {
    		if (err)
        		res.send(err);
      		//responds with a json object of our database gardens
      		res.json(tiletypes)
    	});
  	})
	.post(function(req, res) {
    	var tiletype = new TileType({
    		_id: new mongoose.Types.ObjectId(),
    		name: req.body.name,
    		altname: "Default",
    		isplant: req.body.isplant,
    		info: "Default",
    		tilecolour: req.body.tilecolour,
    		//location: req.body.location;
    	});
    	tiletype.save(function(err) {
      		if (err)
        	res.send(err);

      		res.json({ message: 'Tiletype created!',
      			       tiletypeid: tiletype._id });
    	});
});

//GET -- RETRIEVE TILETYPE FROM KNOWN IDS
//USED WHEN CREATING DEFAULT GRASS TILES
router.route('/tiletype/:tiletype_id')
  	.get(function(req, res) {
		TileType.findById(req.params.tiletype_id, function(err, tiletype) {
  			if (err)
  				res.send(err);
  			res.json(tiletype)
  		});
});

//GET -- RETRIEVE TILETYPE FROM NAME
router.route('/tiletype/name/:tiletypename')
  	.get(function(req, res) {
		TileType.findOne({name: req.params.tiletypename}, function(err, tiletype) {
  			if (err)
  				res.send(err);
  			res.json(tiletype)
  		});
});

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});