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
    const node =  this.node;
    let data = Object.assign([],this.props.data)
    let radiusScale = scaleSqrt()
      .domain([0,this.props.maxValue])
      .range([0,this.props.maxRadius])

    

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
  
      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
  
      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
      }
    
    let simulation = d3.forceSimulation()
      .force("forceX", d3.forceX().strength(.1).x(this.props.width * .5))
      .force("forceY", d3.forceY().strength(.1).y(this.props.height * .5))
      .force("center", d3.forceCenter().x(this.props.width * .5).y(this.props.height * .5))
      .force("charge", d3.forceManyBody().strength(-15));
    
    select(node)
      .append('text')
      .attrs({
        "fill": '#414141',
        "x": this.props.width / 2,
        "y":20,
        'text-anchor':'middle',
        'font-family':'IBM Plex Sans',
        'font-size':14,
        'font-weight':'bold',
      })
      .text(this.props.text)

    let g = select(node).append("g")
      .attr("class", "node")
      .selectAll(".nodeG")
      .data(data)
      .enter()
      .append('g')
      .attrs({
        'class':'nodeG',
      })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    g.append("circle")
      .attrs({
        "r": d => radiusScale(d.percentage),
        "fill": this.props.color,
        "cx":0,
        "cy":0,
        'stroke':this.props.color,
        'stroke-width':1,
        'fill-opacity':0.5,
      })
    g.append('text')
      .attrs({
        "fill": '#414141',
        "x":0,
        "y":0,
        'dy':-5,
        'text-anchor':'middle',
        'font-family':'IBM Plex Sans',
        'font-size':10,
        'font-weight':'bold',
      })
      .text(d => d.word)
    g.append('text')
      .attrs({
        "fill": '#414141',
        "x":0,
        "y":0,
        'dy':10,
        'text-anchor':'middle',
        'font-family':'IBM Plex Sans',
        'font-size':10,
        'font-weight':'bold',
      })
      .text(d => `${(d.percentage).toFixed(1)}%`)

    simulation
      .nodes(data)
      .force("collide", d3.forceCollide().strength(.5).radius(d => radiusScale(d.percentage) + 1).iterations(1))
      .on("tick", d => {
        g.attrs({
          'transform':d => `translate(${d.x},${d.y})`
        })
          
      });
    
        
  }

  componentDidMount() {
    this.createGraph();
  }
  render(){
    return (
      <div className='bubblechart-div'>
        <svg width={this.props.width} height={this.props.height} ref={node => this.node = node}>
        </svg>
      </div>
    )
  }
}
export default ProjectCards