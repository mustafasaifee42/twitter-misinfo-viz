import React, { Component } from 'react';
import { select, selectAll } from 'd3-selection';
import { scaleThreshold, scaleSqrt, scaleTime } from 'd3-scale';
import * as d3 from 'd3';
import 'd3-selection-multi';

const percentile = require("percentile");
class ProjectCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentDidUpdate(){
    this.createGraph()
  }

  createGraph = () => {
    const node = this.node;
    let dataByUserStatus = d3.nest()
      .key(d => d['User Status'])
      .entries(this.props.data);
    let UserActive = d3.nest()
      .key(d => d['User'])
      .entries(dataByUserStatus[0].values);
    let UserInactive = d3.nest()
      .key(d => d['User'])
      .entries(dataByUserStatus[1].values);
    console.log(UserActive, UserInactive)
    let dataByClassification = d3.nest()
      .key(d => d.Classification)
      .entries(this.props.data);
    let data = {}
    dataByClassification.forEach(d => {
      let arr = []
      d.values.forEach(k => {
        arr.push(k.Retweet)
      })
      d.values.sort(function(x, y){
        return d3.ascending(x.Retweet, y.Retweet);
      })
    })
    let dataByCategory = d3.nest()
      .key(d => d.Category)
      .entries(dataByClassification[0].values);
    console.log(dataByCategory)
  }

  componentDidMount() {
    this.createGraph();
  }
  render(){
    return (
      <div className='donut'>
        <svg width={this.props.width} height={this.props.height} ref={node => this.node = node} >
        </svg>
      </div>
    )
  }
}
export default ProjectCards