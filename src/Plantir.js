import React, { Component } from 'react';
import axios from 'axios';
import TileList from './TileList';
import WeatherWidget from './WeatherWidget';
//import EditTile from './EditTile';
import WelcomeHeader from './WelcomeHeader';
import Timeline from './Timeline';
import style from './style';


class Plantir extends Component {
      //weather api
    // axios.get('http://api.openweathermap.org/data/2.5/forecast?q=Sydney&units=metric&APPID=6a99ef09a79de9a2a3fa190f2d84a2df')
    //   .then(res => {
    //     this.setState({ temp: res.data.main.temp });
    // })
    //https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/03n.png
  constructor(props) {
    super(props);
    this.state = { 
      data: [], //i.e the Tiles belonging to a garden
      tiletypes: [],
      garden: {}, //the Garden object, includes location, id, etc
      temp: 25.1,

      tempVal: 'oi',
      searchRet: '43534',
      currentBiology: 'Biological Information',
      filter: 'None',
      haveWeather: false,
      weatherMess: '',
      searchHtml: 'tt',
      hoverBloomString: '',
      hoverFlowerName: '',

      avgTempThisWeek: 0,
      rainThisWeek: false,

      globalSoilType: '',
      globalSunlight: '',
      globalMoisture: '',
      globalPh: '',
      selectedList: [],
    };
    this.loadTilesFromServer = this.loadTilesFromServer.bind(this);
    this.loadTileTypesFromServer = this.loadTileTypesFromServer.bind(this);
    this.handleCreateClicked = this.handleCreateClicked.bind(this);    
    this.handleTokenSubmit = this.handleTokenSubmit.bind(this);
    this.handleTileSubmit = this.handleTileSubmit.bind(this);
    this.handleTileDelete = this.handleTileDelete.bind(this);
    this.handleTileUpdate = this.handleTileUpdate.bind(this);
    this.handleTileTypeUpdate = this.handleTileTypeUpdate.bind(this);
    this.handleBiologyClicked = this.handleBiologyClicked.bind(this);
    this.handleSearchReq = this.handleSearchReq.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleNoneFilter = this.handleNoneFilter.bind(this);
    this.handleSunlightFilter = this.handleSunlightFilter.bind(this);
    this.handleMoistureFilter = this.handleMoistureFilter.bind(this);
    this.handleWaterClicked = this.handleWaterClicked.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.handleCreateTileClicked = this.handleCreateTileClicked.bind(this);
    this.handleTileHover = this.handleTileHover.bind(this);
    this.handleGlobalEdit = this.handleGlobalEdit.bind(this);
    this.handleGlobalSoilTypeChange = this.handleGlobalSoilTypeChange.bind(this);
    this.handleGlobalSunlightChange = this.handleGlobalSunlightChange.bind(this);
    this.handleGlobalMoistureChange = this.handleGlobalMoistureChange.bind(this);
    this.handleGlobalPhChange = this.handleGlobalPhChange.bind(this);

    this.addSelectIntoList = this.addSelectIntoList.bind(this);
    this.deleteSelectFromList = this.deleteSelectFromList.bind(this);
    this.handleGlobalDeleteTiles = this.handleGlobalDeleteTiles.bind(this);
  }
  getWeather(){
    var reqStr = 'http://api.openweathermap.org/data/2.5/forecast?q='+ this.state.garden.location +'&units=metric&APPID=6a99ef09a79de9a2a3fa190f2d84a2df';
    axios.get(reqStr)
      .then(res => {
        this.setState({ weatherMess: res.data.list , haveWeather: true });
    })
  }

  addSelectIntoList(id){
    console.log(id);
    this.state.selectedList.push(id);
    console.log(this.state.selectedList);
  }

  deleteSelectFromList(id){
    console.log(id);
    this.state.selectedList.pop(id);
    console.log(this.state.selectedList);

  }







  loadTilesFromServer() {
    //if garden id has been submitted
    //console.log(this.state.currentBiology.usage)
    if (this.state.garden._id) {
      //get token 
      var gardentoken = this.state.garden._id;
      axios.get('http://localhost:3001/api/garden/'+gardentoken+'/findtiles')
        .then(res => {
          //console.log("here");
          //console.log(res);
          //console.log("there");
          this.setState({ data: res.data },
            function() {
              this.loadTileTypesFromServer();
            })
        })

      }
    //var gardenURL = 'http://localhost:3001/api/garden/59c3a401c6038385985dfd59/findtiles';
    //axios.get(this.props.url)
  }
  //*** not sure if this is the best way to do it,
  //    but it works by loading all needed tiletypes
  //    into an array and we can match that to tiles'
  //    tiletype_id later - Gino
  // update: THIS MADE IT SLOW :'( BAD IDEA
  loadTileTypesFromServer() {
    // if (this.state.garden._id) {
    //   //assume we have a valid garden at this point?
    //   var neededTileTypes = this.state.tiletypes.slice();
    //   //loop through all tiles
    //   //console.log(this.state.data);
    //   for(var i=0;i<this.state.data.length;i++) {
    //     //create a list of needed tiles?
    //     var currentid = this.state.data[i].tiletype;
    //     //retrieve tiletype from db
    //     axios.get('http://localhost:3001/api/tiletype/'+currentid)
    //       .then(res => {
    //           //console.log(res.data);
    //           if(!neededTileTypes.includes(res.data)) {
    //             neededTileTypes.push(res.data);
    //           }
    //       })
    //   }
    //   //console.log(neededTileTypes)
    //   //console.log(this.state.tiletypes)
    //   this.setState({ tiletypes: neededTileTypes})
    // }
    axios.get('http://localhost:3001/api/tiletype/')
      .then(res => {
        //console.log("doing");
        //console.log(res.data);
        //console.log("done");
        this.setState({tiletypes: res.data})
    })

  }
  handleTileSubmit(tile) {
    let tiles = this.state.data;
    tile.id = Date.now();
    let newTiles = tiles.concat([tile]);
    this.setState({ data: newTiles});

    axios.post(this.props.url, tile)
      .then(res => {
        this.setState({ data: res });
      })
      .catch(err => {
        console.error(err);
      });
  }
  handleTileDelete(id) {
    axios.delete('http://localhost:3001/api/tile/' + id, {tileId : id})
      .then(res => {
        console.log('Tile deleted');
      })
      .catch(err => {
        console.error(err);
      });
  }
  handleTileUpdate(id, tile) {
    axios.put(`${this.props.url}/${id}`, tile)
      .catch(err => {
        console.log(err);
      })
  }
  handleTileHover(name, bloom) { //update timeline with bloom duration
    // console.log("name: " + name);
    // console.log("bloom: " + bloom);

    let bloomString = bloom;
    let time = '';
    let season = '';

    let regexTime   = /(mid|early|late)/i;
    let regexSeason = /(summer|winter|fall|autumn|spring)/i;
    let matchTime   = regexTime.exec(bloomString);
    let matchSeason = regexSeason.exec(bloomString);
    
    if (matchTime) {
      time = matchTime[0];
      // console.log("Time: " + time);
    }

    if (matchSeason) {
      season = matchSeason[0];
      // console.log("Season: " + season);
    }

    let combined = time + " " + season;
    // console.log("Bloom edited: " + combined.toLowerCase());

    this.setState({hoverFlowerName: name, hoverBloomString: combined.toLowerCase()});
    // let summerRegex = /[Ss]ummer/g;
    // let winterRegex = /[Ww]inter/g;
    // let   fallRegex = /[Ff]all/g;
    // let autumnRegex = /Aa]utumn/g;
    //let springRegex = /[Ss]p[ring/g;



  }
  handlePlotUpdate(id, plot) {
    if (plot.ph === "Select") {
      plot.ph = '';
    }
    if (plot.moisture === "Select") {
      plot.moisture = '';
    }
    if (plot.sunlight === "Select") {
      plot.sunlight = '';
    }
    if (plot.soiltype === "Select") {
      plot.soiltype = '';
    }
    axios.put('http://localhost:3001/api/tile/'+id, plot)
      .catch(err => {
        console.log(err);
    })
  }
  handleTileTypeUpdate(tileid, tiletypename) {
    axios.get('http://localhost:3001/api/tiletype/name/'+tiletypename)
      .then(res => {
        var tiletypeid = res.data._id;
        var body = {tiletype: tiletypeid};

      axios.put('http://localhost:3001/api/tile/'+tileid, body)
        .catch(err => {
        console.log(err);
      })
    })
  }
  handleTokenSubmit(token) {
    //token has been given
    axios.get('http://localhost:3001/api/garden/'+token)
      .then(res => {
        this.setState({ garden: res.data });
        this.getWeather();
        //this.loadTileTypesFromServer();

    })
  }
  handleCreateClicked() {
    axios.post('http://localhost:3001/api/garden')
      .then(res => {
        var newID = res.data.gardenid;
        //get new garden object
        this.handleTokenSubmit(newID);
        //this.setState({ garden: res.data });
    })
  }
  handleBiologyClicked(name) {
    axios.get('http://localhost:3001/api/search/'+name)
    //axios.get('http://localhost:3001/api/search')
      .then(res =>{
        this.setState({ currentBiology: res.data });
        //console.log(this.state.searchRet);
      })
  }
  handleWaterClicked(id) {
    let body = {lastwatered: new Date()}
    console.log("hi")
    axios.put('http://localhost:3001/api/tile/'+id, body)
      .catch(err => {
        console.log(err);
    })
  }
  componentDidMount() {
    //this.loadGardenFromServer();
    this.loadTilesFromServer();
    setInterval(this.loadTilesFromServer, this.props.pollInterval);
    //setInterval(this.handleBiologyClicked, this.props.pollInterval);
  }
  handleSearchReq(evt, id) {
      //alert('search request submitted  ' + this.state.tempVal);
      evt.preventDefault();
      this.setState({ searchRet: 's' });
            console.log(this.state.searchRet);
      axios.get('http://localhost:3001/api/search/'+this.state.tempVal)
      //axios.get('http://localhost:3001/api/search')
        .then(res =>{
          this.setState({ searchRet: res.data });
            let p = this.state.searchRet;
            console.log(p);
            // var retString = '';
            // if (Object.keys(p).length == 0){
            //   console.log("empty response!");
            //   retString = "<p>No results found!</p>";
            // } else {

            //   for (var key in p){
            //     if(p.hasOwnProperty(key)){
            //       console.log(key + "------>");
            //       let j = p[key];
            //       for(var key2 in j){
            //         if (j.hasOwnProperty(key2)){
            //             console.log(key2 + "->" + j[key2])

            //             retString = retString + "<p>" + key2 + ': '+ j[key2]  +  "</p>"

            //         }
            //       }
            //     }
            //   }
            // }
            //this.setState({searchHtml: retString});
            //this.setState({searchHtml: this.state.searchRet})
            return this.state.searchRet;
        })
  }


  handleGlobalSoilTypeChange(e) {
    this.setState({globalSoiltype: e.target.value});
  }
  handleGlobalSunlightChange(e) {
    this.setState({globalSunlight: e.target.value});
  }
  handleGlobalMoistureChange(e) {
    this.setState({globalMoisture: e.target.value});
  }

  handleGlobalPhChange(e) {
    this.setState({globalPh: e.target.value});
  }

  handleSearchChange(evt){
    this.setState({tempVal: evt.target.value});
  }
  handleNoneFilter(e) {
    this.setState({filter: e.target.value});
  }
  handleSunlightFilter(e) {
    this.setState({filter: e.target.value});
  }
  handleMoistureFilter(e) {
    this.setState({filter: e.target.value});
  }



  handleLayoutChange(layouts){
    axios.put('http://localhost:3001/api/garden/' + this.state.garden._id, {
      location: this.state.garden.location,
      layout: layouts
    });
  }
  handleCreateTileClicked(e){
    var tiletype = this.state.tiletypes[0];
    while(tiletype === undefined){
      tiletype = this.state.tiletypes[0];
    }
    var tempGridorder = 0;
    if(this.state.data.length != 0){
      tempGridorder = this.state.data[this.state.data.length-1].gridorder + 1
    }
    let body = {
      parentgarden: this.state.garden._id,
      tiletype: tiletype,
      soiltype: "Peaty",
      ph: 5,
      sunlight: "None",
      moisture: "Drenched",
      gridorder: tempGridorder,
      lastwatered: new Date("13 Mar 2010"),
    };
    axios.post('http://localhost:3001/api/tile/', body).then(res => {
      console.log(res);
      this.loadTilesFromServer();
    });;
  }


  //--------globalEdit(update)----------
  handleGlobalEdit(e){
    for(var idIndex = 0; idIndex<this.state.selectedList.length; idIndex++){
      //for each tile selected, call function to edit tile
      let plot = {
        moisture: this.state.globalMoisture,
        sunlight: this.state.globalSunlight,
        ph: this.state.globalPh,
        soiltype: this.state.globalSoiltype,
      }
      let id = this.state.selectedList[idIndex];
      this.handlePlotUpdate(id,plot);
      console.log("doing global update");
    }
  }
  //------------------------------------


  //------------globalDelete---------------
  handleGlobalDeleteTiles(e){
    //for each tile selected,call function to delete tiles
    for(var idIndex1 = 0; idIndex1<this.state.selectedList.length; idIndex1++){
      let id = this.state.selectedList[idIndex1];
      this.handleTileDelete(id);
      console.log("deleting global tiles");
    }
  }
  //---------------------------------------



  render() {
    // console.log("states of plantir are");
    // console.log(this.state);
    //console.log(this.state.data);

    if (this.state.haveWeather && this.state.avgTempThisWeek == 0) {
      //get rainThisWeek and avgTempThisWeek
      var weatherData = this.state.weatherMess;

      var rainFound = false;
      var avgTemp = 0;
      var tempSum = 0;
      for (var i = 0; i<weatherData.length; i++) {
        var weatherDay = weatherData[i];
        if (weatherDay['weather']['0']['description'].includes("rain")) {
          rainFound = true;
        }
        tempSum = tempSum + weatherDay['main']['temp'];
      }
      avgTemp = tempSum / weatherData.length;

      this.setState({avgTempThisWeek: avgTemp, rainThisWeek: rainFound});
    }


    return ( 
      <div style={ style.commentBox }>
      <center><img src="https://i.imgur.com/0LifPKw.png" width="300"></img></center>
      <center><p>Create a new garden or enter an existing token. Try: <b>59e41a62387a641f4c38bf3a</b></p></center>
      <WelcomeHeader 
        onTokenSubmit={this.handleTokenSubmit}
        onCreateClicked={this.handleCreateClicked} />
      { (this.state.garden._id) ?
      <div>
    
                          



      <TileList
        onAddSelectIntoList={this.addSelectIntoList}
        onDeleteSelectFromList = {this.deleteSelectFromList}
        onTileDelete={this.handleTileDelete} 
        onTileUpdate={this.handleTileUpdate}
        onPlotUpdate={this.handlePlotUpdate} 
        onLayoutChange={this.handleLayoutChange}
        onCreateTile={this.handleCreateTileClicked}
        onTileTypeUpdate={this.handleTileTypeUpdate} 
        onBiologyClicked={this.handleBiologyClicked} 
        onWaterClicked={this.handleWaterClicked}
        onSearchReq={this.handleSearchReq}
        onSearchChange={this.handleSearchChange}
        onTileHover={this.handleTileHover}
        rainThisWeek={this.state.rainThisWeek}
        avgTempThisWeek={this.state.avgTempThisWeek}
        data={ this.state.data }
        filterState = {this.state.filter}
        searchRet = {this.state.searchRet} 
        tiletypes={this.state.tiletypes}
        layout = {this.state.garden.layout} />
      
      <br></br>




      </div> :null }

      { (this.state.garden._id) ? (
              <div style={style.filterRow}><center>
              <button style={style.commentFormPost} onClick={this.handleCreateTileClicked}>add tile!</button>&nbsp;&nbsp;&#124;&nbsp;&nbsp;
              <b>Soil filters:</b> <input type="radio" 
                                name="filter"  
                                value="None" 
                                checked={this.state.filter === "None"}
                                onChange={this.handleNoneFilter}
                          ></input> None&nbsp;&nbsp;
                          <input  type="radio" 
                                  name="filter" 
                                  value="Sunlight" 
                                  checked={this.state.filter === "Sunlight"}
                                  onChange={this.handleSunlightFilter}
                          ></input> Sun Exposure&nbsp;&nbsp;
                          <input  type="radio" 
                                  name="filter" 
                                  value="Moisture" 
                                  checked={this.state.filter === "Moisture"}
                                  onChange={this.handleMoistureFilter}
                          ></input> Water Content&nbsp;&nbsp;&#124;&nbsp;&nbsp;<b>Group update:&nbsp;&nbsp;</b>



                          <select name="globalSoiltype" onChange={this.handleGlobalSoilTypeChange} >
                            <option value="Select" selected>Soil Type</option>
                            <option value="Loam">Loam</option>
                            <option value="Sandy">Sandy</option>
                            <option value="Clay">Clay</option>
                            <option value="Silty">Silty</option>
                            <option value="Peaty">Peaty</option>
                          </select>&nbsp;
                          <select name="globalSunlight" onChange={this.handleGlobalSunlightChange}>
                            <option value="Select" selected>Sunlight</option>
                            <option value="None">None</option>
                            <option value="Low">Low</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High</option>
                          </select>&nbsp;
                          <select name="globalMoisture" onChange={this.handleGlobalMoistureChange}>
                            <option value="Select" selected>Moisture</option>
                            <option value="None">None</option>
                            <option value="Low">Low</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High</option>
                            <option value="Drenched">Drenched</option>
                          </select>&nbsp;

                          <button
                            value="globalEdit"
                            style={style.commentFormPost1}
                            onClick={this.handleGlobalEdit}>
                            Batch Edit
                          </button>&nbsp;

                          <button 
                            value = "globalDelete"
                            style={style.commentFormPost2}
                            onClick={this.handleGlobalDeleteTiles}>
                            Batch Delete
                          </button>








                          </center></div>) : null }


        <div>
            

      { (this.state.garden._id) ? 
        (

        <Timeline 
        hoverName={this.state.hoverFlowerName}
        hoverBloom={this.state.hoverBloomString}
        location={this.state.garden.location} />)
        : null
      }

      {  (this.state.haveWeather) ?
          <WeatherWidget
            weatherMess={this.state.weatherMess}
            check="alalal"
          />:null }
        </div>
      </div>

      )

  }
}

export default Plantir;
/* line 249

*/
//      <EditTile onTileSubmit={this.handleTileSubmit} />
        // <form style={ style.commentForm }>
        //   <button
        //   style={ style.commentFormPost }
        //   value='submit no refresh' 
        //   onClick={ this.handleSearchReq } >search</button>
        //   <input
        //     type='text'
        //     placeholder='search me!'
        //     style={ style.commentFormText}
        //     value={ this.state.tempVal }
        //     onChange={this.handleSearchChange} />

        // </form>
        // <p> results currently printed in console </p>
        // <p>  </p>
