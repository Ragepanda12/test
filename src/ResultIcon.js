import React, { Component } from 'react';
import style from './style';

//this className is responsible for displaying all the results of a search request made by a tile
//all it takes in from Tile is the dict passed to it by scraper.py, which it then reformats into html
class ResultIcon extends Component{

	constructor(props) {
		super(props);
		this.state= {
		 	bigDict: this.props.results,
		 	bigArr: [],
		 	tempString: '',
		 	importants:[],
		 	id:-1,
		 	imglinks: [],
		};

    	this.handleResultClick = this.handleResultClick.bind(this);



		var p = this.state.bigDict;
	    //console.log(Object.keys(p).length);
	    var retString = ''; //our html formatted string
	    let defImg = 'https://i.pinimg.com/236x/c4/ee/45/c4ee45976bd00727d6c8f90fb03c6eb3--icon-png-pixel-art.jpg'; //this is a default image for when no image is provided by Dave
	    if (Object.keys(p).length === 0){
	      //console.log("empty response!");
	      retString = "<p>No results found!</p>";
	    } else {
	      var foundimglinks = [];	
	      for (var key in p){

	        if(p.hasOwnProperty(key)){
	          //console.log(key + "------>");
	          let j = p[key];
	          let normalCut = j['normal'].split(',');
			  let nameStr = normalCut[0];
			  if(normalCut.length > 0){
			  	nameStr = nameStr + ", " + normalCut[normalCut.length - 1];
			  }
         //    if ('imgLink' in j){//if an image is provided for thumbnail
         //    	retString = retString + '<a href="' + j['link'] +'"><img src="'+  j['imgLink'] +'" width="82" height="86" title="'+ j['imgAlt'] +'" alt="'+ j['imgAlt'] +'"></a>';
         //    } else {//otherwise just use the default image

             	//retString = retString + '<a href="' + j['link'] +'"><img src="'+  defImg +'" width="82" height="86" title="default icon" alt="default flower icon"></a>';
         //    }
        	// retString = retString + '<a href="#" onClick="tempFunc(' +  j['id']  +  ')">'+ nameStr +'</a>' //ugly code alert
         //    retString = retString + '<p><i>' +  j['scientific']  +  '</i></p>'
	        // }



	     


	   retString = retString + '<article class="search-result row"><div class="col-xs-12 col-sm-12 col-md-3"><a href="https://davesgarden.com'+j['link'] +'" target="_blank" title="Lorem ipsum" class="thumbnail">';




	        if ('imgLink' in j){//if an image is provided for thumbnail
	        	retString = retString + '<img src="'+  j['imgLink']  +'"  alt="'+ j['imgAlt'] +'" /></a></div><div class="col-xs-12 col-sm-12 col-md-9 excerpet">';	
            	var imgid = {
            		id:  j['id'],
            		imglink: j['imgLink'],
            	}
            	foundimglinks.push(imgid);
            	//retString = retString + '<a href="' + j['link'] +'"><img src="'+  j['imgLink'] +'" width="82" height="86" title="'+ j['imgAlt'] +'" alt="'+ j['imgAlt'] +'"></a>';
            } else {//otherwise just use the default image
            	retString = retString + '<img src="'+  defImg  +'"  alt="default icon" /></a></div><div class="col-xs-12 col-sm-12 col-md-9 excerpet">';;
            }
        	retString = retString + '<a href="#" onClick="tempFunc(' +  j['id']  +  ')">'+ nameStr +'</a>'//ugly code alert
            retString = retString + '<p><i>' +  j['scientific']  +  '</i></p>'
            retString = retString + '<span class="plus"><a href="#" onClick="tempFunc(' +  j['id']  +  ')" title="Lorem ipsum"><i class="glyphicon glyphicon-plus"></i></a></span></div><span class="clearfix borda"></span></article>'
	        }
	      }

	      //console.log(foundimglinks);
	    }//onClick="tempFunc(' +  j['id']  +  ')"
	    this.state.imglinks = foundimglinks;
	    this.state.tempString = retString;
	    //this.setState({tempString: retString});

	}

	handleResultClick(e){ //ideally this will call props.updatetiletype etc with the id of the plant that it has chosen
		e.preventDefault();
		var imglink = 'https://i.pinimg.com/236x/c4/ee/45/c4ee45976bd00727d6c8f90fb03c6eb3--icon-png-pixel-art.jpg';
		//console.log(this.state.imglinks);
		for(var i = 0; i<this.state.imglinks.length; i++) {
			if (this.state.imglinks[i].id === e.target.value) {
				imglink = this.state.imglinks[i].imglink;
				//console.log("found %$#%#@$%#$%#$% " + imglink);
			}
		}
		//imglink = this.state.imglinks[]
		this.props.onResultClicked(e.target.value, imglink);
		//console.log(this.state.imglinks);
		//console.log(e.target.value + "IT WORKED");
	}

//this shit is super hacky lmao
//so each of the <a> tags have onClick="tempFunc(id)", where id is dependent on the flower returned by dave's garden
//tempFunc is not defined anywhere here. In fact, you won't find it in any of the .js files. It's in index.html (at the bottom of <head>)
//what tempFunc does is it passes id to the value of the button with id 'sneakybutton' (which IS in this file) before triggering the onClick action
//of said sneakybutton. This then calls resClick which will eventually do the update tile thing

//the reason why things are like this is because dangerouslySetInnerHTML seems to ignore {{stuff in curly braces}} so I couldn't directly include
//it in retString, hence this terrible workaround.

//Ideally I'd have resultIcon call multiple of some other component à la TileList, but this way gives me a lot more flexibility with how I want to
//deal with the search results, as un-reacty as it is


	render() {


		return(

			<div style={{width:450, height: 300, overflow:'scroll', fontSize:'2rem'}}>			
				<form>
				  <button style={{display: 'none'}} id="sneakyButton" value="submit_value" onClick={this.handleResultClick}/>
				</form>
				<section className="col-xs-12 col-sm-6 col-md-12" dangerouslySetInnerHTML={{ __html: this.state.tempString }}/>


			</div>



				



		);
	}


}

export default ResultIcon;

				// <section className="col-xs-12 col-sm-6 col-md-12">
				// 	<article className="search-result row">
				// 		<div className="col-xs-12 col-sm-12 col-md-3">
				// 			<a href="#" title="Lorem ipsum" className="thumbnail"><img src='https://i.pinimg.com/236x/c4/ee/45/c4ee45976bd00727d6c8f90fb03c6eb3--icon-png-pixel-art.jpg' alt="Lorem ipsum" /></a>
				// 		</div>
				// 		<div className="col-xs-12 col-sm-12 col-md-9 excerpet">
				// 			<a href="#" title="">Marguerite Daisy, Paris Daisy "'Sugar Baby'"</a>
				// 			<p><i>Argyranthemum frutescens</i></p>						
				// 			<span className="plus"><a href="#" title="Lorem ipsum"><i className="glyphicon glyphicon-plus"></i></a></span>
				// 		</div>
				// 		<span className="clearfix borda"></span>
				// 	</article>
				// </section>
