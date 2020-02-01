import React, { Component } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
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
    let group = select(node)
      .append('g')
      .attrs({
        'transform': `translate(0,25)`
      })
    
    let xScale = scaleLinear()
      .domain([0, 1050]) // input
      .range([0, this.props.width]); // output
    group.append('rect')
      .attrs({
        'x': 0,
        'y': 0,
        'width': xScale(this.props.value[0]),
        'height':this.props.barHeight,
        'fill':this.props.color
      })
    group.append('rect')
      .attrs({
        'x': 0,
        'y': this.props.barHeight + 10,
        'width': xScale(this.props.value[1]),
        'height':this.props.barHeight,
        'fill':this.props.color
      })

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