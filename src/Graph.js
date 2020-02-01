import React, { Component } from 'react';
import { select, selectAll } from 'd3-selection';
import { scaleSqrt, scaleTime } from 'd3-scale';
import * as d3 from 'd3';
import 'd3-selection-multi';

class ProjectCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'all',
    }
  }
  changeSelected = (value) => { 
    selectAll('.dot')
      .attrs ({
        'opacity':d => {
          switch(value) {
            case 'all':
              return 1
            case 'truth':
              if(d.Classification === 'Support CAA')
                return 1
              return 0.1
            case 'false':
              if(d.Classification === 'Clickbait' || d.Classification === 'Misinformation opposite')
                return 1
              return 0.1
            case 'troll':
              if(d.Classification === 'Trolling opposite')
                return 1
              return 0.1
            case 'unknown':
              if(d.Classification === 'Unknown')
                return 1
              return 0.1
            case 'inactive':
              if(d['User Status'] === 'Inactive')
                return 1
              return 0.1
            default:
              return 1
          }
        }
      })
    this.setState({
      selected:value,
    })
  }


  createGraph = () => {
    function tick(){
  
      selectAll('.dot')
        .attrs({
          'cx': d => d.x,
          'cy': d => d.y,
        })  
    }
    const node =  this.node;
    let data = Object.assign([],this.props.data)
    data.sort((a, b) => d3.ascending(a.Classification, b.Classification))
    let g = select(node)
      .append('g')
    let xScale = scaleTime()
      .domain([new Date("2020-01-02 10:00:00"), new Date("2020-01-05 22:00:00")])
      .range([100, this.props.width - 100])
    let radiusScale = scaleSqrt()
      .domain([0,1000])
      .range([2.5,30])
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
              return '#c0ca33'
            if(d.Classification === 'Trolling opposite')
              return '#ff9800'
            if(d.Classification === 'Unknown')
              return '#aaa'
            if(d.Classification === 'Clickbait')
              return '#e03e3e'
            if(d.Classification === 'Misinformation opposite')
              return '#e03e3e'
          },
          "stroke":(d,i) => {
            if(d.Classification === 'Support CAA')
              return '#c0ca33'
            if(d.Classification === 'Trolling opposite')
              return '#ff9800'
            if(d.Classification === 'Unknown')
              return '#aaa'
            if(d.Classification === 'Clickbait')
              return '#e03e3e'
            if(d.Classification === 'Misinformation opposite')
              return '#e03e3e'

          },
          'fill-opacity':0.6,
        })
        .on('mouseenter', d => {
          console.log(d)
        })
    d3.forceSimulation(data)
        .force("x", d3.forceX(d =>  xScale(d['Date And Time'])).strength(1))
        .force("y", d3.forceY(this.props.height / 2).strength(0.5))
        .force("collide", d3.forceCollide(d => radiusScale(d.Retweet) + 1))
        .force("charge", d3.forceManyBody().strength(-15))
        .on('tick', tick)
  }

  componentDidMount() {
    this.createGraph();
  }
  render(){
    return (
      <div>
        <div className='filters'>
          <div className={this.state.selected === 'all' ? "inactive-user checked" : "inactive-user"} onClick={() => { this.changeSelected('all') }}>
            All Tweets
          </div>
          <div className={this.state.selected === 'truth' ? "truthfull-filter truthfull-checked" : "truthfull-filter"} onClick={() => { this.changeSelected('truth') }}>
            Truthful Tweets
          </div>
          <div className={this.state.selected === 'false' ? "false-filter false-checked" : "false-filter"} onClick={() => { this.changeSelected('false') }}>
            Tweets Spreading Falsehoods
          </div>
          <div className={this.state.selected === 'troll' ? "troll-filter troll-checked" : "troll-filter"} onClick={() => { this.changeSelected('troll') }}>
            Trolling + Fact Checking
          </div>
          <div className={this.state.selected === 'unknown' ? "unknown-filter unknown-checked" : "unknown-filter"} onClick={() => { this.changeSelected('unknown') }}>
            Unknown / Neutral
          </div>
          <div className={this.state.selected === 'inactive' ? "inactive-user checked" : "inactive-user"} onClick={() => { this.changeSelected('inactive') }}>
            Inactive Users
          </div>
        </div>
        <svg width={this.props.width} height={this.props.height} ref={node => this.node = node}>
        </svg>
      </div>
    )
  }
}
export default ProjectCards