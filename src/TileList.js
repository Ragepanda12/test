import React, { Component } from 'react';
import Tile from './Tile';
import style from './style';

import RGL, { WidthProvider } from 'react-grid-layout';
import PropTypes from 'prop-types';

import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';

//import { Container, Row, Col } from 'reactstrap';

const ReactGridLayout = WidthProvider(RGL);

class TileList extends Component {
  constructor(props){
    super(props);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.handleCreateTile = this.handleCreateTile.bind(this);
  }
  onLayoutChange(layout){
    if(typeof layout[0] !== "undefined"){
      if(!(layout[0].w == 1 && layout[0].h == 1 && layout[0].x == 0)){
        this.props.onLayoutChange(layout);
      }
    }
  }
  handleCreateTile(e) {
    e.preventDefault();
    this.props.onCreateTile();
  }
  render() {
    var test="nope";
    if(this.props.tiletypes.length > 0) {
      test = "ho";
    }

    //match tiletype id
    var tiles = this.props.data.slice();

    //sort into ascending grid order
    tiles.sort(function(a,b) {
      return parseInt(a.gridorder) - parseInt(b.gridorder);
    })


    var tiletypes = this.props.tiletypes.slice();
    for(var i=0; i<tiles.length; i++) {
      var currentTileTypeID = tiles[i].tiletype;
      //console.log(currentTileTypeID);
      for(var j=0; j<tiletypes.length; j++) {
        //console.log(tiletypes[j].name);
        if(currentTileTypeID === tiletypes[j]._id) {
          tiles[i].tiletypename = tiletypes[j].name;
          tiles[i].tiletypecolour = tiletypes[j].tilecolour;
          tiles[i].tiletypeisplant = tiletypes[j].isplant;
          tiles[i].tiletypeinfo = tiletypes[j].info;
        }
      }
    }//style={Object.assign(style.tile, {backgroundColor: tileColour})}

    //let tileNodes = this.props.data.map(tile => {
    let tileNodes = tiles.map(tile => {
      let bgColor = tile['tiletypecolour'];
      let key = tile['_id'].toString();
      //Default sizes for new elements in the layout
      var x = 0;
      var y = 0;
      var w = 2;
      var h = 4;
      let minW = 2;
      let minH = 4;
      let vals = this.props.layout.filter(function (obj){
        if(obj.i == tile['_id']){
          x = obj.x;
          y = obj.y;
          w = obj.w;
          h = obj.h;
        }
        return obj.i == tile['_id'];
      });
      let styles = Object.assign(style.tile,{backgroundColor: tile['tiletypecolour']});//style={styles}
      return (
        <div key={key} data-grid={{w: w, h:h, x:x, y:y, minW: minW, minH: minH}}
           > 
          <Tile
            uniqueID={tile['_id']} 
            key={tile['_id']} 
            onAddSelectIntoList={this.props.onAddSelectIntoList}
            onDeleteSelectFromList = {this.props.onDeleteSelectFromList}
            onTileDelete={this.props.onTileDelete} 
            onPlotUpdate={this.props.onPlotUpdate} 
            onTileUpdate={this.props.onTileUpdate}  
            onBiologyClicked={this.props.onBiologyClicked} 
            onTileTypeUpdate={this.props.onTileTypeUpdate} 
            onSearchReq={this.props.onSearchReq}
            onSearchChange={this.props.onSearchChange}
            onTileHover={this.props.onTileHover}
            onWaterClicked={this.props.onWaterClicked}
            searchRet={this.props.searchRet} 
            filterState={this.props.filterState} 
            rainThisWeek={this.props.rainThisWeek}
            avgTempThisWeek={this.props.avgTempThisWeek} 
            parentgarden={tile.parentgarden} 
            tileprops={tile.tileprops}
            gridorder={tile.gridorder} 
            lastwatered={tile.lastwatered} 
            davesgardenid={tile.davesgardenid}
            imglink={tile.imglink} 
            tiletypename={tile['tiletypename']}
            tiletypecolour={tile['tiletypecolour']}
            tiletypeinfo = {tile['tiletypeinfo']}  
            tiletypeisplant={tile['tiletypeisplant']}>
          </Tile>
        </div>
      )
    })

    // let myPaddingStyle = {
    //   paddingTop: 0,
    //   paddingBottom: 0,
    //   paddingLeft:0,
    //   paddingRight:0,
    // } layout={layout}
    return (
      <div style={style.griddiv}>

      <ReactGridLayout cols={12} rowHeight={30} onLayoutChange={this.onLayoutChange} compactType='vertical'>
        {tileNodes}
      </ReactGridLayout>  
      </div>
    )
  }
}

export default TileList;

      // <Container>
      //   <div style = {myPaddingStyle} className = "col-md-2 ">
      //     {tileNodes.slice(0,2)}
      //   </div>
      //   <div style = {myPaddingStyle} className = "col-md-2 ">
      //     {tileNodes.slice(2,4)}
      //   </div>
      //   <div style = {myPaddingStyle} className = "col-md-2 ">
      //     {tileNodes.slice(2,4)}
      //   </div>
      //   <div style = {myPaddingStyle} className = "col-md-2">
      //     {tileNodes.slice(2,4)}
      //   </div>
      //     <div style = {myPaddingStyle} className = "col-md-2">
      //     {tileNodes.slice(2,4)}
      //   </div>
      // </Container>

//      <button style={style.commentFormPost} onClick={this.handleCreateTile}>add tile</button>
