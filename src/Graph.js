import React, { Component } from 'react';
import { select, selectAll } from 'd3-selection';
import { scaleThreshold, scaleSqrt, scaleTime } from 'd3-scale';
import * as d3 from 'd3';
import 'd3-selection-multi';

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
    function tick(){
  
      selectAll('.dot')
        .attr('cx', function(d){return d.x})
        .attr('cy', function(d){return d.y})
  
    }
    let drawDots = () => {
      g.selectAll(".dot")
        .data(this.props.data)
        .enter()
        .append("circle")
        .attrs({
          'class':'dot',
          "r": (d,i) => radiusScale(d.Retweet),
          "cx":(d,i) => d.x,
          "cy":(d,i) => d.y,
          'fill':(d,i) => {
            if(d.Classification === 'Support CAA')
              return '#ff9800'
            if(d.Classification === 'Trolling opposite')
              return '#c0ca33'
            if(d.Classification === 'Unknown')
              return '#d7d7d7'
            if(d.Classification === 'Clickbait')
              return '#3b00ed'
            if(d.Classification === 'Misinformation opposite')
              return '#9c27b0'
          },
          "stroke":(d,i) => {
            if(d.Classification === 'Support CAA')
              return '#ff9800'
            if(d.Classification === 'Trolling opposite')
              return '#c0ca33'
            if(d.Classification === 'Unknown')
              return '#d7d7d7'
            if(d.Classification === 'Clickbait')
              return '#3b00ed'
            if(d.Classification === 'Misinformation opposite')
              return '#9c27b0'

          },
          'fill-opacity':0.6,
          'opacity':d => {
            if (d['User Status'] === 'Active')
              return 0
            return 1
          }
        })
        .on('mouseenter', d => {
          console.log(d)
        })
      
    }
    const node =  this.node;
    let g = select(node)
      .append('g')
    let xScale = scaleTime()
      .domain([new Date("2020-01-02 12:00:00"), new Date("2020-01-05 10:00:00")])
      .range([30, this.props.width - 250])
    let radiusScale = scaleSqrt()
      .domain([0,1000])
      .range([3.5,30])
    var simulation = d3.forceSimulation(this.props.data)
        .force("x", d3.forceX(d =>  xScale(d['Date And Time'])).strength(1))
        .force("y", d3.forceY(this.props.height / 2))
        .force("collide", d3.forceCollide(d => radiusScale(d.Retweet) + 1))
        .force("charge", d3.forceManyBody().strength(-4))
        .on('tick', tick)
        .on('end',drawDots)
  }

  componentDidMount() {
    this.createGraph();
  }
  render(){
    return (
      <div>
        <svg width={this.props.width} height={this.props.height} ref={node => this.node = node}>
        </svg>
      </div>
    )
  }
}
export default ProjectCards