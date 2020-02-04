import React, { Component } from 'react';
import { select } from 'd3-selection';
import { scaleSqrt } from 'd3-scale';
import * as d3 from 'd3';
import 'd3-selection-multi';

class ProjectCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }


  createGraph = () => {
    const node =  this.node
    let data = Object.assign([],this.props.data)
    let radiusScale = scaleSqrt()
      .domain([0,this.props.maxValue])
      .range([0,this.props.maxRadius])
    const canvasChart = select(node)
      .append('canvas')
      .attrs({
        'width': this.props.width,
        'height': this.props.height,
        'class': 'canvas-plot'
      });

    const context = canvasChart.node().getContext('2d');

    let tick = () => {
      context.clearRect(0, 0, this.props.width, this.props.height);
  
      // draw nodes
      context.strokeStyle = this.props.color;
      context.fillStyle = "#414141"
      context.font = "700 16px IBM Plex Sans";
      context.textAlign='center';
      context.fillText(`${this.props.text}`,this.props.width / 2,20);
      context.globalAlpha = 1;
      context.beginPath();
      data.forEach(d => {
        context.moveTo(d.x + radiusScale(d.percentage), d.y);
        context.arc(d.x, d.y, radiusScale(d.percentage), 0, 2 * Math.PI);
      });
      context.stroke();

      
      context.fillStyle = this.props.color;
      context.globalAlpha = 0.3;
      context.beginPath();
      data.forEach(d => {
        context.moveTo(d.x, d.y);
        context.arc(d.x, d.y, radiusScale(d.percentage), 0, 2 * Math.PI);
      });
      context.fill();

      
      context.fillStyle = "#414141"
      context.globalAlpha=1
      context.font = "10px IBM Plex Sans";
      data.forEach(d => {
        context.fillText(`${d.word}`,d.x,d.y);
        context.fillText(`${(d.percentage).toFixed(1)}%`,d.x,d.y + 10);
      });
    }
  
    let simulation = d3.forceSimulation()
      .force("forceX", d3.forceX().strength(.1).x(this.props.width * .5))
      .force("forceY", d3.forceY().strength(.1).y(this.props.height * .5))
      .force("center", d3.forceCenter().x(this.props.width * .5).y(this.props.height * .5))
      .force("charge", d3.forceManyBody().strength(-15));
    simulation
      .nodes(data)
      .force("collide", d3.forceCollide().strength(.5).radius(d => radiusScale(d.percentage) + 1).iterations(1))
      .on("tick", tick)

  }
  componentDidMount() {
    this.createGraph();
  }
  render(){
    return (
      <div className='bubblechart-div' ref={node => this.node = node}>
      </div>
    )
  }
}
export default ProjectCards