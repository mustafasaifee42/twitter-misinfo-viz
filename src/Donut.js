import React, { Component } from 'react';
import { select } from 'd3-selection';
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
    const node = this.node;
    let color = this.props.color
    let value = this.props.value
    let keyValue = this.props.keyValue
    let radius  = this.props.radius;
    let group = select(node)
      .append('g')
      .attrs({
        'transform': `translate(25,25)`
      })
    let g = group
      .attrs({
        'transform': `translate(${radius},${radius})`
      })
    let key  = select(node)
      .append('g')
      .attrs({
        'transform': `translate(${this.props.keyPos[0] },${this.props.keyPos[1]})`
      })
    key.selectAll('.keySquare')
      .data(keyValue)
      .enter()
      .append('rect')
      .attrs({
        'class':'keySquare',
        'x':0,
        'y':(d,i) => i * 25,
        'width': 15,
        'height': 15,
        'fill':(d,i) => color[i],
      })
    key.selectAll('.keyText')
      .data(keyValue)
      .enter()
      .append('text')
      .attrs({
        'class':'keyText',
        'x':15,
        'y':(d,i) => i * 25,
        'dx':5,
        'dy':13,
        'fill':(d,i) => color[i],
        'font-weight':'bold',
        'font-size':14,
      })
      .text((d,i) => {
        return `${d} (${value[i]})`
      })
      
    g.append('text')
      .attrs({
        "x":0,
        'y':0,
        'text-anchor':'middle',
        'font-weight':'bold',
        'font-size':42,
        "fill": '#414141',
      })
      .text(this.props.total)
    g.append('text')
      .attrs({
        "x":0,
        'y':0,
        'text-anchor':'middle',
        'font-size':24,
        'dy':30,
        "fill": '#414141',
      })
      .text(this.props.text)

    const pie = d3.pie()
        .value(d => d)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(radius - 90)
        .outerRadius(radius - 50);

    
    const path = g.selectAll(".arcs")
      .data(pie(value))
      .enter()
      .append('g')
      .attrs({
        'class':'arcs',
      });

    // Enter new arcs
    path.append("path")
        .attrs({
          "d":arc,
          "stroke":"white",
          "stroke-width":1,
          "fill": (d, i) => color[i],
        })
    path.append('text')
      .attrs({
        "transform":d => {
          let _d = arc.centroid(d);
          _d[0] *= 1.5;	//multiply by a constant factor
          _d[1] *= 1.5;	//multiply by a constant factor
          return "translate(" + _d + ")";
        },
        "x":0,
        'y':0,
        'text-anchor':'middle',
        'dx':(d,i) => {
          if(i === 0)
            return this.props.dx
          if(i === 1)
            return this.props.dx1
          return 0
        },
        'font-size':16,
        'dy':(d,i) => {
          if(i === 0)
            return this.props.dy
          if(i === 1)
            return this.props.dy1
          return this.props.dy1
        },
        "fill": (d, i) => color[i],
        'font-weight':'bold',
      })
      .text((d,i) => `${(value[i] * 100 / this.props.total).toFixed(1)}%`)

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