import style from './style';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var AmCharts = require("@amcharts/amcharts3-react");
//import AmCharts from "@amcharts/amcharts3-react";

function generateData(name, bloomString) {

  var dataProvider = [{
          "season": "Summer",
          "value": 0,
          }, {
          "season": "Autumn",
          "value": 1
          }, {
          "season": "Winter",
          "value": 0
          }, {
          "season": "Spring",
          "value": 0
  }];

  return dataProvider;
}

class WaterMeter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataProvider: this.updateData(),
      timer: null,
      urgency: 0,
    };
    this.updateData = this.updateData.bind(this);
    this.setupCurrentDate = this.setupCurrentDate.bind(this);
  }
  updateData() { //crude-ass formula that accounts for rain and high temperature

    //basically:
    //if theres rain, urgency goes down
    //if temp is high, urgency goes up,
    //if not watered for a while, urgency goes up
    //if lastwatered today, urgency is 0
    let daysDry = this.props.daysnotwatered;
    let freq = this.props.wateringfrequency;
    let israin = false;
    if (this.props.rainThisWeek) {
      israin = this.props.rainThisWeek;
    };
    let avg = 25;
    if (this.props.avgTempThisWeek) {
      avg = this.props.avgTempThisWeek;
    };

    let urgency = 3; //percentage 3 is effectively "0" but looks nicer 

    if (daysDry >= freq) {
      urgency = 97;
    } else if (daysDry == 0) {
      urgency = 3;
    } else {
      let daysUrgency = daysDry / freq;
      if (avg > 25) {//hot hot !
        daysUrgency = daysUrgency + ((1- daysUrgency)/2);
      }
      if (israin) {
        daysUrgency = daysUrgency / 2;
      }
      urgency = daysUrgency * 100;
    }

    //set state
    this.setState({urgency: urgency});




  }
  setupCurrentDate() {
  }
  componentDidMount() {
    // this.setupCurrentDate();

    this.setState({
      // Update the chart dataProvider every 3 seconds
      timer: setInterval(() => {this.updateData()}, 1000)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  render() {
    const config = {
      "type": "serial",
      "dataProvider": [{
        "x": 1,
        "y": 100,
      }],
      "categoryField": "x",
      "rotate": true,
      "autoMargins": false,
      "marginLeft": 0,
      "marginRight": 0,
      "marginTop": 0,
      "marginBottom": 0,
      "graphs": [ {
        "valueField": "y",
        "type": "column",
        "fillAlphas": 1,
        "fillColors": [ "#49cbec", "#f73838" ],
        "gradientOrientation": "horizontal",
        "lineColor": "#FFFFFF",
        "showBalloon": false
      } ],
      "valueAxes": [ {
        "gridAlpha": 0,
        "axisAlpha": 0,
        "stackType": "100%",
        "guides": [ {
          "value": this.state.urgency,
          "lineAlpha": 1,
          "above": true
        } ]
      } ],
      "categoryAxis": {
        "gridAlpha": 0,
        "axisAlpha": 0
      },
      "creditsPosition": "bottom-left"
    };
    return (
        <AmCharts.React style={{ width: "100px", height: "20px", display: "inline-block", verticalAlign: "middle" }} options={config} />

    );

  }
}


export default WaterMeter;


        // <p>Bloom time for: {this.props.hoverName}</p>
        // <p>String: {this.props.hoverBloom}</p>
        // <p>Current Month: {this.state.dateSeason}</p>