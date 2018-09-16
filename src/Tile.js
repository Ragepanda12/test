import React, { Component } from 'react';
import Center from 'react-center';
import Modal from 'react-modal';
import style from './style';
import ResultIcon from './ResultIcon';
import WaterMeter from './WaterMeter';
import marked from 'marked';
import ReactTooltip from 'react-tooltip'

import axios from 'axios';

class Tile extends Component {
  constructor(props) {
    super(props);
    this.state= {
      toBeUpdated: false,
      toChangeTile: false,
      author: '',
      text: '',
      moisture: '',
      sunlight: '',
      ph: 5,
      soiltype: '',
      newtiletypename: '',
      modalIsOpen: false,
      searchRet: '',
      retString:'',
      tempVal:'',
      oldDisplayState:'',
      waterCanHovered:false,
      isResult:false,
      davesgardenplant: '',
      davesgardenplantLong:'',
      davesgardenph: '',
      davesgardensun: '',
      davesgardenwater: '',
      davesgardenbloom: '',
      davesgardensci: '',
      davesgardencolour: '',
      needswater: false,
      daysnotwatered: 0,
      davesgardenbigimg: '',
      tileSelected :false,

    };
    //bind functions to this class
    this.deleteTile = this.deleteTile.bind(this);
    this.updateTile = this.updateTile.bind(this);
    this.changeTileType = this.changeTileType.bind(this);
    this.handleTileTypeDropdownChange = this.handleTileTypeDropdownChange.bind(this);

    this.handleSoilTypeChange = this.handleSoilTypeChange.bind(this);
    this.handlePHChange = this.handlePHChange.bind(this);
    this.handleMoistureChange = this.handleMoistureChange.bind(this);
    this.handleSunlightChange = this.handleSunlightChange.bind(this);

    //this.handleTileUpdate = this.handleTileUpdate.bind(this);
    this.handlePlotUpdate = this.handlePlotUpdate.bind(this);
    this.handleTileTypeUpdate = this.handleTileTypeUpdate.bind(this);
    this.handleBiologyClicked = this.handleBiologyClicked.bind(this);
    this.handleWaterClicked = this.handleWaterClicked.bind(this);
    this.handleResultClicked = this.handleResultClicked.bind(this);
    this.handleTileHover = this.handleTileHover.bind(this);
    this.handleSearchReq = this.handleSearchReq.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleParseSearch = this.handleParseSearch.bind(this);
    this.findPlantFromId = this.findPlantFromId.bind(this);

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.appendTileNum = this.appendTileNum.bind(this);
    this.setDaysNotWatered = this.setDaysNotWatered.bind(this);
    this.setTileName = this.setTileName.bind(this);

    this.handleSelectChange = this.handleSelectChange.bind(this);


    this.hexToRgbA = this.hexToRgbA.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
    this.showToolTip = this.showToolTip.bind(this);
    //this.afterSelect = this.afterSelect.bind(this)


  }
  updateTile(e) {
    e.preventDefault();
    //set update flag in the state
    if(this.state.toChangeTile){
      this.setState({ toBeUpdated: !this.state.toBeUpdated, toChangeTile: !this.state.toChangeTile})  
    }
    else{
      this.setState({ toBeUpdated: !this.state.toBeUpdated });
    }
  }
  changeTileType(e) {
  //changeTileType(){
    e.preventDefault();
    if(this.state.toBeUpdated){
      this.setState({ toBeUpdated: !this.state.toBeUpdated, toChangeTile: !this.state.toChangeTile})  
    }
    else{
      this.setState({ toChangeTile: !this.state.toChangeTile });
    }
  }
  handlePlotUpdate(e) {
    e.preventDefault();
    //console.log(this.props.uniqueID);
    let id = this.props.uniqueID;
    let moisture = (this.state.moisture) ? this.state.moisture : null;
    let sunlight = (this.state.sunlight) ? this.state.sunlight : null;
    let soiltype = (this.state.soiltype) ? this.state.soiltype : null;
    let ph = (this.state.ph) ? this.state.ph : null;
    let plot = {
      moisture: moisture,
      sunlight: sunlight,
      ph: ph,
      soiltype: soiltype,
    }
    this.props.onPlotUpdate(id, plot);
    this.setState({
      toBeUpdated: !this.state.toBeUpdated,
      moisture: '',
      sunlight: '',
      soiltype: '',
      ph: 5,
    })
  }
  handleTileTypeUpdate(e) {
    e.preventDefault();
    let tileId = this.props.uniqueID;
    let newTileTypeName = this.state.newtiletypename;
    this.props.onTileTypeUpdate(tileId, newTileTypeName);
    this.setState({
      toChangeTile: false,
      newtiletypename: '',
      davesgardencolour: '',
    })

    //also update plot to have d's garden id of -1
    let tempTile = {
      davesgardenid: -1,
    }
    this.props.onPlotUpdate(tileId, tempTile);
    this.setTileName();

  }
  handleBiologyClicked(e) {
    e.preventDefault();
    //let tileid = this.props.uniqueID;
    let name = this.props.tiletypename;
    //this.props.onBiologyClicked(name);
  }
  handleWaterClicked(e) {
    e.preventDefault();
    this.props.onWaterClicked(this.props.uniqueID);
    //reset needswater
    this.setState({needswater: false,
                   daysnotwatered: 0 });

  }
  handleTileHover(e) {
    e.preventDefault();
    //to update the timeline
    let name = this.state.davesgardenplant;
    if (this.state.davesgardenbloom) {
      let bloom = this.state.davesgardenbloom;
      this.props.onTileHover(name, bloom);
    }

  }
  deleteTile(e) {
    e.preventDefault();
    let id = this.props.uniqueID;
    this.props.onTileDelete(id);
    console.log('Tile deleted');
  }
  handleSoilTypeChange(e) {
    this.setState({soiltype: e.target.value});
  }
  handleMoistureChange(e) {
    this.setState({moisture: e.target.value});
  }
  handleSunlightChange(e) {
    this.setState({sunlight: e.target.value});
  }
  handlePHChange(e) {
    this.setState({ph: e.target.value});
  }
  handleTileTypeDropdownChange(e) {
    this.setState({newtiletypename: e.target.value});
  }
  rawMarkup() {
    let rawMarkup = marked(this.props.children.toString());
    return { __html: rawMarkup };
  }
  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal(e) {
    e.preventDefault();
    this.setState({isResult: false});
    this.setState({modalIsOpen: false});
  }
  appendTileNum(str){
    return str + this.props.gridorder.toString();
  }

  handleSearchChange(e){
    e.preventDefault();
    this.setState({tempVal: e.target.value});
  }
  handleSearchReq(evt){
    //e.preventDefault();
    this.setState({isResult:false});
    // this.props.onSearchReq(e,this.props.uniqueID);
    // this.setState({retString: ''});
    // console.log("?");

    evt.preventDefault();
      this.setState({ searchRet: 's' });
            //console.log(this.state.searchRet);
      axios.get('http://localhost:3001/api/search/'+this.state.tempVal)
      //axios.get('http://localhost:3001/api/search')
        .then(res =>{
          this.setState({ searchRet: res.data });
            let p = this.state.searchRet;
            //console.log(p);
            this.handleParseSearch();
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
            })
            //this.setState({searchHtml: retString});
            //this.setState({searchHtml: this.state.searchRet})


  }
  handleParseSearch(){
    var p = this.state.searchRet;
    //console.log(Object.keys(p).length);
    var retString = '';
    if (Object.keys(p).length == 0){
      //console.log("empty response!");
      retString = "<p>No results found!</p>";
    } else {

      for (var key in p){
        if(p.hasOwnProperty(key)){
          //console.log(key + "------>");
          let j = p[key];
          for(var key2 in j){
            if (j.hasOwnProperty(key2)){
                //console.log(key2 + "->" + j[key2])

                retString = retString + "<p>" + key2 + ': '+ j[key2]  +  "</p>"

            }
          }
        }
      }
    }
    this.setState({retString: retString});
    this.setState({isResult: true});

  }
  handleResultClicked(dgId, imglink){
    //e.preventDefault();
    //this.setState({isResult:false});\

    //we need to change the davesgardenid of the tile
    let tileId = this.props.uniqueID;
    let tempTile = {
      davesgardenid: dgId,
      imglink: imglink,
    }
    this.props.onPlotUpdate(tileId, tempTile);

    //and we need to change the tiletype of the tile to "other plant"
    this.props.onTileTypeUpdate(tileId, "Other plant");
    // this.setState({davesgardenplant: '',
    //                davesgardencolour: ''});
    this.setTileName(true, dgId);


  }
  
  //tile select check
  handleSelectChange=()=>{
    if(this.state.tileSelected == true){
      this.setState({tileSelected:false});
      //delete id from id List
      let id = this.props.uniqueID;
      this.props.onDeleteSelectFromList(id);
    }
    else if(this.state.tileSelected == false){
      this.setState({tileSelected:true});
      //add id into id list
      let id = this.props.uniqueID;
      this.props.onAddSelectIntoList(id);
    }
  }
  
  findPlantFromId(dgId){
    axios.get('http://localhost:3001/api/search/'+dgId)
      .then(res =>{
        //set name (only take first couple words)
        let plantname = res.data.name;
        let regex = /^([A-Za-z0-9\s]+),.*/g;
        let match = regex.exec(plantname);

        let normalCut = plantname.split(/,|'/);
        let nameStr = normalCut[1];
        if(normalCut.length > 0){
          nameStr = nameStr + ", " + normalCut[normalCut.length - 1];
          this.setState({ davesgardenplant: normalCut[1] });
        } else {
          this.setState({ davesgardenplant: normalCut[0] });
        }




        // if (match) {
        //   this.setState({ davesgardenplant: match[1] });
        // } else {
        //   this.setState({ davesgardenplant: plantname.substring(0,16) }); //character limit to stay on one line
        // }
        let p = this.state.davesgardenplant;
        //console.log(p);

        //set ph
        let ph = res.data['Soil pH requirements'];
        this.setState({ davesgardenph: ph });

        //set bloom time
        let bloom = res.data['Bloom Time'];
        this.setState({ davesgardenbloom: bloom });

        //set scientific name
        let sci = res.data['scientific'];
        this.setState({ davesgardensci: sci });

        //set watering
        let water = res.data['Water Requirements'];
        this.setState({ davesgardenwater: water });

        //set colour text
        let colour = res.data['Bloom Color'];
        this.setState({ davesgardencolour: colour });

        //set large image link
        let bigimg = res.data['imgCrop'];
        this.setState({ davesgardenbigimg: bigimg });
          //this.handleParseSearch();
    })
  }
  setDaysNotWatered() {
    //check if lastwatered is >7 days i.e it needs water
    var oneDay = 24*60*60*1000;
    var firstDate = new Date(this.props.lastwatered);
    var secondDate = new Date();
    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

    //set needswater
    if ((diffDays > 7) && !this.state.needswater && (this.state.davesgardenid != -1)) { //7 is a placeholder
      this.setState({ needswater: true });
    }

    //set daysnotwatered
    if (this.state.daysnotwatered != diffDays) {
      this.setState({ daysnotwatered: diffDays })
    }
  }
  setTileName(resultClicked, newid) {
    //check if tiletype is davesgarden plant or default tiletype
    if (this.props.davesgardenid == -1 && this.state.davesgardenplant === '') {
      //default tiletype
      //console.log(this.props);
      this.setState({davesgardenplant: this.props.tiletypename});
    } else if (this.props.davesgardenid !== -1) {
      if (this.state.davesgardenplant === '') {
        this.findPlantFromId(this.props.davesgardenid);
        //console.log(this.props.tiletypename);
      }
    }

    if ((this.props.davesgardenid == -1) && !(this.state.davesgardenplant === this.props.tiletypename)) {
      this.setState({davesgardenplant: this.props.tiletypename});
    }

    var defaults = ["Grass", "Path", "House"];
    if (this.props.davesgardenid !== -1 && defaults.indexOf(this.state.davesgardenplant)>-1) { //check if needs to be updated i.e still holding default text
      this.findPlantFromId(this.props.davesgardenid);
    }

    if (resultClicked && newid && this.state.davesgardenplant) { //changing from custom tile to a different custom tile
            console.log("last??");
            this.findPlantFromId(newid);
    }

  }
  componentDidMount() {
    this.setDaysNotWatered();
    //console.log(this.props.tiletypename)
    //this.setState({davesgardenplant: 'hi'})

    //this.setTileName();
    setInterval(this.setTileName, 5000);
  }

  hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex' + hex);
  }
  hideToolTip(str){
    //str.preventDefault();
    if(document.getElementById(str) != null){
      this.setState({oldDisplayState:document.getElementById(str).style.display});
      document.getElementById(str).style.display = 'none';
      // console.log("hiddeee");
      // console.log(str);
      // console.log(this.props.gridorder.toString());
      this.setState({waterCanHovered:true});
    }
  }
  showToolTip(str){
    //str.preventDefault();
    if(document.getElementById(str) != null){
      document.getElementById(str).style.display = this.state.oldDisplayState;
      // console.log("showwww");
      // console.log(str);
      // console.log(this.props.gridorder.toString());
      this.setState({waterCanHovered:false});
    }
  }

  render() {

    var contents = "Change Tile";
    // if( this.state.retString == ''){
    //   this.handleParseSearch();
    // }
    if (this.props.tiletypeisplant) {
      //contents = "Biology"
    }

    var flowerImages = {};
    flowerImages["Other plant"] = "https://p.memecdn.com/avatars/s_15452_506ee39357ccf.jpg";
    flowerImages["Sunflower"] = "https://pbs.twimg.com/profile_images/639501065210105860/BntxzORs.jpg";
    flowerImages["Daisy"] = "https://68.media.tumblr.com/avatar_d6bca09754c0_128.png";
    flowerImages["Rose"] = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Rose_Ingrid_Bergmann.jpg/256px-Rose_Ingrid_Bergmann.jpg";
    flowerImages["nothing"] = "https://p.memecdn.com/avatars/s_15452_506ee39357ccf.jpg"

    var flowerInfo = {};
    flowerInfo["Other plant"] = "Violet Information";
    flowerInfo["Sunflower"] = "Sunflower Information";
    flowerInfo["Daisy"] = "Daisy Information"; 
    flowerInfo["Rose"] = "Rose Information";

    var flowerSunInfo = {};
    flowerSunInfo["Other plant"] = "Required Sun Exposure: Full Sun";
    flowerSunInfo["Sunflower"] = "Required Sun Exposure: Full Sun";
    flowerSunInfo["Daisy"] = "Required Sun Exposure: Sun to Partial Shade";  
    flowerSunInfo["Rose"] = "Required Sun Exposure: Full Sun";

    var flowerMoistureInfo = {};
    flowerMoistureInfo["Other plant"] = "Water Requirements: Average Water Needs; Water regularly; do not overwater";
    flowerMoistureInfo["Sunflower"] = "Water Requirements: Average Water Needs; Water regularly; do not overwater";
    flowerMoistureInfo["Daisy"] = "Water Requirements: Average Water Needs; Water regularly; do not overwater";  
    flowerMoistureInfo["Rose"] = "Water Requirements: Average Water Needs; Water regularly; do not overwater";

    var flowerPHInfo = {};
    flowerPHInfo["Other plant"] = "Soil pH requirements: 6.6 to 7.5 (neutral)";
    flowerPHInfo["Sunflower"] = "Soil pH requirements: 6.6 to 7.5 (neutral)";
    flowerPHInfo["Daisy"] = "Soil pH requirements: 6.6 to 7.5 (neutral)";
    flowerPHInfo["Rose"] = "Soil pH requirements: 6.1 to 6.5 (mildly acidic)";


    var tileColour = this.props.tiletypecolour;
    var thisOpacity = null;

    //get filter colours
    if (this.props.filterState === "Sunlight") {
      if (this.props.tileprops.sunlight === "Moderate") {
        tileColour = '#ffdf00';
      }
      if (this.props.tileprops.sunlight === "None") {
        tileColour = '#8d90ff';
      }
      if (this.props.tileprops.sunlight === "Low") {
        tileColour = '#ffff80';
      }
      if (this.props.tileprops.sunlight === "High") {
        tileColour = '#ff6000';
      }
    }
    if (this.props.filterState === "Moisture") {
      if (this.props.tileprops.moisture === "None") {
        tileColour = '#d9eafd';
      }
      if (this.props.tileprops.moisture === "Low") {
        tileColour = '#5aaee1';
      }
      if (this.props.tileprops.moisture === "Moderate") {
        tileColour = '#1e8acb';
      }
      if (this.props.tileprops.moisture === "High") {
        tileColour = '#00608b';
      }
      if (this.props.tileprops.moisture === "Drenched") {
        tileColour = '#003b56';
      }
    }

    //extract colour of flower based on scraped data
    if (this.state.davesgardencolour && this.props.filterState === "None") {
      //basic pattern matching
      if (this.state.davesgardencolour.includes('Pink') || this.state.davesgardencolour.includes('pink')) {
          tileColour = '#ffc9e9';
      } else if (this.state.davesgardencolour.includes('Yellow') || this.state.davesgardencolour.includes('yellow')) {
          tileColour = '#f2bc4f';
      } else if (this.state.davesgardencolour.includes('Gold') || this.state.davesgardencolour.includes('gold')) {
          tileColour = '#f9f6d4';
      } else if (this.state.davesgardencolour.includes('Blue') || this.state.davesgardencolour.includes('blue')) {
          tileColour = '#92defc';
      } else if (this.state.davesgardencolour.includes('Violet') || this.state.davesgardencolour.includes('violet')) {
          tileColour = '#f780f3';
      } else if (this.state.davesgardencolour.includes('Red') || this.state.davesgardencolour.includes('red')) {
          tileColour = '#ff5b87';        
      } else if (this.state.davesgardencolour.includes('Orange')) {
          tileColour = '#ff7632';        
      }
  
      //console.log(this.hexToRgbA('#f9f6d4'));
    }
    //transparent change when selected tiles
    if (this.state.tileSelected == true){
      //when tile got selected, opacity decrese a bit
      var thisOpacity = 0.4;
    }

    //determine if big img is available
    var tileimg = this.props.imglink;
    if (this.state.davesgardenbigimg) {
      tileimg = this.state.davesgardenbigimg;
    }

    if (this.props.filterState === "None") {
    var backgroundStr = '';
    var buttonStr='';
    if(tileColour != undefined){
      let tilegrads = this.hexToRgbA(tileColour);
      let cut = tilegrads.split(/,|\(|\)/);

      let imgStr = '\'' + tileimg +'\'';
      var posStr = 'center';
      if (this.state.davesgardenplant == 'House'){
        imgStr = '\'http://bgfons.com/uploads/roof_tile/roof_tile_texture4065.jpg\'';
      } else if (this.state.davesgardenplant == 'Path'){
         imgStr = '\'http://www.texturemate.com/image/view/5553/\'';
      } else if (this.state.davesgardenplant == 'Grass'){
         imgStr = '\'https://image.freepik.com/free-photo/green-grass-texture_1249-15.jpg\'';
      }

      //backgroundStr = cut.toString();
      backgroundStr = 'linear-gradient(rgba('+ cut[1] +','+cut[2]+','+cut[3]+',1),rgba('+ cut[1] +','+cut[2]+','+cut[3]+',0.2)), url('+ imgStr +')';
      buttonStr = 'linear-gradient(rgba(175,175,175,.6), rgba('+ cut[1] +','+cut[2]+','+cut[3]+',.5),rgba(100,100,100,.6))';
       //backgroundStr = 'url(\'http://bgfons.com/uploads/roof_tile/roof_tile_texture4065.jpg\')';
      var hideUnderStr = "hideUnder("+ this.appendTileNum("tooltip") + ")";
    }
    }
    //console.log(backgroundStr);
//{this.props.gridorder} 
//style={Object.assign(style.tile, {backgroundColor: tileColour})}

    return (
        <div style={Object.assign(style.tile, {backgroundColor: tileColour,opacity: thisOpacity, backgroundImage: backgroundStr, backgroundPosition: posStr, backgroundSize: 'cover'})}  onMouseOver={this.handleTileHover} onClick={this.handleBiologyClicked} data-tip data-for={this.appendTileNum("tooltip")}>
        <center><b><font size="+1">{this.state.davesgardenplant}</font></b>
        </center>
        { (this.props.tiletypeisplant && (this.props.filterState === "None")) 
        ? (
          <div style={ style.imgcontWrapper }>

            <center id={this.appendTileNum('bigT')}>
              <ReactTooltip id={this.appendTileNum("tooltip")}>
                <p><b>{this.state.davesgardenplant}</b></p>
                <p><i>{this.state.davesgardensci}</i></p>
                <p><img src={this.props.imglink} width="100px"></img></p>
                {(this.state.davesgardenph) ? (<p>pH Requirements: {this.state.davesgardenph}</p>) : null}
                {(this.state.davesgardenwater) ? (<p>Watering frequency: every {this.state.davesgardenwater} days</p>) : null}
                {(this.state.davesgardensun) ? (<p>Sunlight needs: {this.state.davesgardensun}</p>) : null}
                {(this.state.davesgardenbloom) ? (<p>Bloom time: {this.state.davesgardenbloom}</p>) : null}
              </ReactTooltip>
            </center>
            <center id={this.appendTileNum('smallT')}>
                  <ReactTooltip id={this.appendTileNum("tooltip2")}>
                    <h4>Watering Urgency</h4>
                    <p><i>Click the watering can to water your plant!</i></p>
                    <p>Average temperature this week: {this.props.avgTempThisWeek.toFixed(2)}</p>
                    <p>Forecast: {(this.props.rainThisWeek) ? ("expecting rain") : ("sunny")}</p>
                    <p>Last watered: {this.state.daysnotwatered} days ago</p>
                  </ReactTooltip>
            </center>

          </div>
        ) : 
        null }
        
        
        <div style={style.stayDown}>
        {(this.props.tiletypeisplant && this.props.filterState==="None") ? 

        (
        <center><div style={style.wateringRow} data-tip data-for={this.appendTileNum("tooltip2")}>

        <div onMouseOver={()=>{this.hideToolTip(this.appendTileNum('bigT'))}}
            onMouseOut={()=>{this.showToolTip(this.appendTileNum('bigT'))}}>
        <WaterMeter
          daysnotwatered={this.state.daysnotwatered}
          wateringfrequency={this.state.davesgardenwater}
          rainThisWeek={this.props.rainThisWeek}
          avgTempThisWeek={this.props.avgTempThisWeek}
           />

         <button
            style={style.emptybutton}
            onClick={this.handleWaterClicked}
            value='Water'>
          <img src='https://i.imgur.com/9KRykNG.png' width='25'></img></button>




           </div>


        </div></center>
        ) : null }
        <center>

            <div style={style.buttonRow}>
            <button 
              style={Object.assign(style.tilebutton, {backgroundImage: buttonStr,})}
              onClick={this.openModal}
              value='Plot'>
              Edit
            </button>

              <button
              style={Object.assign(style.tilebutton, {backgroundImage: buttonStr,})}
              value = 'select me'
              onClick={this.handleSelectChange}>
              Select
              </button>

            </div>

            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              contentLabel="Tile Information Modal"
              style={ style }
            >

              <h2 ref={subtitle => this.subtitle = subtitle}>Plot Information</h2>
              <div style={ style.tilebox }>
                <div style={ style.comment }>
                  <p><b>Properties:</b></p>
                  <ul>
                    <li>Soil type: {this.props.tileprops.soiltype}</li>
                    <li>Moisture: {this.props.tileprops.moisture}</li>
                    <li>Sunlight: {this.props.tileprops.sunlight}</li>
                    <li>pH balance: {this.props.tileprops.ph}</li>
                    <li>Last watered: {this.props.lastwatered.toString()}</li>
                    <li>Ds G ID: {this.props.davesgardenid}</li>
                  </ul>
                  <a style={ style.updateLink } href='#' onClick={ this.updateTile }>Update</a>
                  <a style={ style.updateLink } href='#' onClick={ this.changeTileType }>Type</a>
                  <a style={ style.deleteLink } href='#' onClick={ this.deleteTile }>Delete</a>
                  { (this.state.toBeUpdated)
                    ? (<form onSubmit={ this.handlePlotUpdate }>
                        <select name="soiltype" onChange={this.handleSoilTypeChange}>
                          <option value="Select" selected>Soil Type</option>
                          <option value="Loam">Loam</option>
                          <option value="Sandy">Sandy</option>
                          <option value="Clay">Clay</option>
                          <option value="Silty">Silty</option>
                          <option value="Peaty">Peaty</option>
                        </select>
                        <select name="sunlight" onChange={this.handleSunlightChange}>
                          <option value="Select" selected>Sunlight</option>
                          <option value="None">None</option>
                          <option value="Low">Low</option>
                          <option value="Moderate">Moderate</option>
                          <option value="High">High</option>
                        </select>
                        <select name="moisture" onChange={this.handleMoistureChange}>
                          <option value="Select" selected>Moisture</option>
                          <option value="None">None</option>
                          <option value="Low">Low</option>
                          <option value="Moderate">Moderate</option>
                          <option value="High">High</option>
                          <option value="Drenched">Drenched</option>
                        </select>
                        <select name="ph" onChange={this.handlePHChange}>
                          <option value="Select" selected>pH</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                        </select>
                        <input
                          type='submit'
                          style={ style.commentFormPost }
                          value='Update' />
                      </form>)
                    : null}
                    <div>
                          { (this.state.toChangeTile )
               ? (<form onSubmit={ this.handleTileTypeUpdate }>
                      <select name="selectedtype" onChange={this.handleTileTypeDropdownChange}>
                        <option value="Select" selected>Tile</option>
                        <option value="Grass">Grass</option>
                        <option value="House">House</option>
                        <option value="Path">Path</option>
                      </select>
                      <input
                        type='submit'
                        style={ style.commentFormPost }
                        value='Change' 
                      />
                    </form>): null}
                    </div>
                </div>

            </div>
            <Center>
              <br></br>
              <form>

              <input
                type='text'
                placeholder='search me!'
                style={ style.searchFormText}
                value={ this.state.tempVal }
                onChange={this.handleSearchChange} />

              <button
                style={ style.commentFormPost }
                value='submit no refresh' 
                onClick={ this.handleSearchReq } 
                > search
              </button>
              <button onClick={this.closeModal} style={ style.commentFormPost }>Close</button>

              </form>
            </Center>


            { (this.state.isResult)
              ? <ResultIcon
              results={this.state.searchRet}
              onResultClicked={this.handleResultClicked}>
            </ResultIcon>:null}
          </Modal>
        </center>
      </div>
        
      </div>
    )
  }
}

export default Tile;

/*

        <button 
          style={ style.tilebutton } 
          onClick={this.changeTileType}
          value='Contents'>
          {contents}
        </button></center>
*/

//line 247:
//<li>Tile ID: {this.props.uniqueID}</li>
