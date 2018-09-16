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

function formatLabel(season, formattedValue, valueAxis) {
  if (season == "Summer2") {
    return "Summer";
  }
  if (season.includes('Early') || season.includes('Late')) {
    return "";
  } else {
    return season;
  }

}

class Timeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataProvider: this.updateData(),
      timer: null,
      dateSeason: '',
    };
    this.updateData = this.updateData.bind(this);
    this.setupCurrentDate = this.setupCurrentDate.bind(this);
  }
  updateData() {
    let name = this.props.hoverName;
    let bloom = this.props.hoverBloom;

    let summerval = 0;
    let springval = 0;
    let winterval = 0;
    let autumnval = 0;

    let lsval = 0;
    let laval = 0;
    let lwval = 0;
    let lspval = 0;

    let wideval = 0.4;

    if (bloom.includes("summer")) {
      if (bloom.includes("late")) {
        summerval = wideval;
        lsval = 1;
        autumnval = wideval;
      } else if (bloom.includes("early")) {
        springval = wideval;
        lspval = 1;
        summerval = wideval;
      } else {
        lspval = wideval;
        summerval = 1;
        lsval = wideval;
      }
    }
    if (bloom.includes("spring")) {
      if (bloom.includes("late")) {
        summerval = wideval;
        lspval = 1;
        springval = wideval;
      } else if (bloom.includes("early")) {
        winterval = wideval;
        lwval = 1;
        springval = wideval;
      } else {
        lwval = wideval;
        springval = 1;
        lspval = wideval;
      }
    }
    if (bloom.includes("winter")) {
      if (bloom.includes("late")) {
        winterval = wideval;
        lwval = 1;
        springval = wideval;
      } else if (bloom.includes("early")) {
        winterval = wideval;
        laval = 1;
        autumnval = wideval;
      } else {
        laval = wideval;
        winterval = 1;
        lwval = wideval;
      }
    }
    if (bloom.includes("autumn") || (bloom.includes("fall"))) {
      if (bloom.includes("late")) {
        winterval = wideval;
        laval = 1;
        winterval = wideval;
      } else if (bloom.includes("early")) {
        summerval = wideval;
        lsval = 1;
        autumnval = wideval;
      } else {
        lsval = wideval;
        autumnval = 1;
        laval = wideval;
      }
    }


      var data = [{
        "season": "Summer",
        "value": summerval,
        }, {
        "season": "Late Summer",//late summer or early autumn
        "value": lsval,
        }, {
        "season": "Autumn",
        "value": autumnval,
        }, {
        "season": "Late Autumn", //late autumn or early winter
        "value": laval,
        }, {
        "season": "Winter",
        "value": winterval,
        }, {
        "season": "Late Winter",//late winter or early spring
        "value": lwval,
        }, {
        "season": "Spring",
        "value": springval,
        }, {
        "season": "Late Spring",
        "value": lspval,
        }, {
        "season": "Summer2",
        "value": summerval,
       }];
       for (var i = 0; i<data.length ; i++) {
        let datapoint = data[i];
        if (datapoint.value == 1) {
          datapoint.name = "Peak expected bloom";
        }
       }

       this.setState({dataProvider: data});
  }
  setupCurrentDate() {
    let date = new Date();
    let month = date.getMonth();

    if (month == 0) {
      this.setState({dateSeason: "Summer"});
    } else if (month == 1 || month == 2) {
      this.setState({dateSeason: "Late Summer"});
    } else if (month == 3) {
      this.setState({dateSeason: "Autumn"});
    } else if (month == 4 || month == 5) {
      this.setState({dateSeason: "Late Autumn"});
    } else if (month == 6) {
      this.setState({dateSeason: "Winter"});
    } else if (month == 7 || month == 8) {
      this.setState({dateSeason: "Late Winter"});
    } else if (month == 9) {
      this.setState({dateSeason: "Spring"});
    } else if (month == 10 || month == 11) {
      this.setState({dateSeason: "Late Spring"});
    }
  }
  componentDidMount() {
    this.setupCurrentDate();

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
      "theme": "patterns",
      "marginRight": 40,
      "marginLeft": 40,
      "autoMarginOffset": 20,
      "mouseWheelZoomEnabled": true,
      "valueAxes": [{
        "id": "v1",
        "axisAlpha": 0,
        "position": "left",
        "ignoreAxisWidth": true,
        "labelsEnabled": false,
      }],
      "balloon": {
        "borderThickness": 1,
        "shadowAlpha": 0
      },
      "graphs": [{
        "id":"g1",
        //"balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        //"bullet": "round",
        "bulletSize": 8,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "type": "smoothedLine",
        "labelText": "[[name]]",
        "valueField": "value"
      }],
      "guides": [{
        category: this.state.dateSeason,
        lineColor: "#9fd64d",
        lineAlpha: 0.3,
        dashLength: 0,
        inside: true,
        labelRotation: 0,
        label: "Current season",
        fontSize: 14,
        position: "bottom",
        lineThickness: 3,
      },{
            "fillAlpha": 0.3,
            "fillColor": "#96d8ff",
            "lineAlpha": 0,
            "toCategory": "Late Autumn",
            "category": "Late Winter",
        }, {
            "fillAlpha": 0.3,
            "fillColor": "#ff8484",
            "lineAlpha": 0,
            "toCategory": "Late Spring",
            "category": "Summer2",
        }, {
            "fillAlpha": 0.3,
            "fillColor": "#ffd06d",
            "lineAlpha": 0,
            "toCategory": "Late Summer",
            "category": "Late Autumn",
        }, {
            "fillAlpha": 0.3,
            "fillColor": "#cbff83",
            "lineAlpha": 0,
            "toCategory": "Late Winter",
            "category": "Late Spring",
        }, {
            "fillAlpha": 0.3,
            "fillColor": "#ff8484",
            "lineAlpha": 0,
            "toCategory": "Summer",
            "category": "Late Summer",
        }
      ],
      // "chartCursor": {
      //   "pan": true,
      //   "valueLineEnabled": true,
      //   "valueLineBalloonEnabled": true,
      //   "cursorAlpha":1,
      //   "cursorColor":"#258cbb",
      //   "limitToGraph":"g1",
      //   "valueLineAlpha":0.2,
      //   "valueZoomable": true
      // },
      "categoryField": "season",
      "categoryAxis": {
        "dashLength": 1,
        "minorGridEnabled": true,
        "labelFunction": formatLabel,
      },
      "dataProvider": this.state.dataProvider,
    };

    return (
      <div className="Timeline" style={{ 'width': '55%', 'display': 'inline-block'}}>
        <div style={style.chartTitle}>
        {(this.props.location) ? (<center><h4>{this.props.location} Seasonal Timeline</h4></center>) : null}
        {(this.props.hoverName) ? (<center><p>Bloom time for <b>{this.props.hoverName}</b></p></center>) : (<p>&nbsp;</p>)}</div>
        <AmCharts.React style={{ width: "100%", height: "150px" }} options={config} />
      </div>
    );

  }
}


export default Timeline;

        // <p>Bloom time for: {this.props.hoverName}</p>
        // <p>String: {this.props.hoverBloom}</p>
        // <p>Current Month: {this.state.dateSeason}</p>

        //        {(this.props.hoverName) ? (<p>Bloom time for <b>{this.props.hoverName}</b></p>) : null}
