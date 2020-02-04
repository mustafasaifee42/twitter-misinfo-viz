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
              if(d.Classification === 'Misinformation by Pro-CAA Users' || d.Classification === 'Misinformation by Anti-CAA Users')
                return 1
              return 0.1
            case 'troll':
              if(d.Classification === 'Fact check + Trolling')
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
    let xScale = scaleTime()
      .domain([new Date("2020-01-02 10:00:00"), new Date("2020-01-05 23:00:00")])
      .range([100, this.props.width - 100])
    let data = Object.assign([],this.props.data)
    let formatDate = d3.timeFormat("%d/%m %H:00")
    for(let i = 0; i <= 85; i = i + 12){
      var dt = new Date('2020-01-02 10:00:00');
      dt.setHours( dt.getHours() + i);
      select(node).append('text')
        .attrs({
          'x':xScale(dt),
          'y':this.props.height - 20,
          'fill':'#aaa',
          'text-anchor':() => {
            if (i === 0)
            return 'start'
            if (i === 84)
              return 'end'
            return 'middle'
          },
          'font-family':'IBM Plex Sans',
          'font-size':10,
          'opacity':0.5
        })
        .text(formatDate(dt))
    }
    data.sort((a, b) => d3.ascending(a.Classification, b.Classification))
    let g = select(node)
      .append('g')
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
          if(d.Classification === 'Fact check + Trolling')
            return '#ff9800'
          if(d.Classification === 'Unknown')
            return '#aaa'
          if(d.Classification === 'Misinformation by Pro-CAA Users')
            return '#e03e3e'
          if(d.Classification === 'Misinformation by Anti-CAA Users')
            return '#e03e3e'
        },
        "stroke":(d,i) => {
          if(d.Classification === 'Support CAA')
            return '#c0ca33'
          if(d.Classification === 'Fact check + Trolling')
            return '#ff9800'
          if(d.Classification === 'Unknown')
            return '#aaa'
          if(d.Classification === 'Misinformation by Pro-CAA Users')
            return '#e03e3e'
          if(d.Classification === 'Misinformation by Anti-CAA Users')
            return '#e03e3e'

        },
        'fill-opacity':0.6,
      })
      .on('mouseenter', function(d,i){
        selectAll('.dot')
          .attrs({
            'opacity':(el,j) => {
              if(el.User === d.User)
                return 1
              return 0.1
            },
          })
        select(this)
          .attrs({
            'opacity':1,
          })
        select('.tooltip')
          .style('position','absolute')
          .style('display','inline')
          .style('left',`${d3.event.pageX + 20}px`)
          .style('top',`${d3.event.pageY - 30}px`)
        select('.tweet-username')
          .html(d["User"])
        select('.retweet-tooltip-value')
          .html(d["Retweet"])
        select('.likes-tooltip-value')
          .html(d["Likes"])
        select('.tweet-content')
          .html(d["Tweet Content"])
        if(d['User Status'] === 'Active')
          select('.active-true')
            .style('display','none')
        else
          select('.active-true')
            .style('display','inline')
      })
      .on('click', function(d,i){
        window.open(d['Tweet Link'],'_blank');
      })
      .on('mousemove', function(d,i){
        select('.tooltip')
          .style('left',`${d3.event.pageX + 20}px`)
          .style('top',`${d3.event.pageY - 30}px`)
      })
      .on('mouseout', ()=> {
        selectAll('.dot')
          .attrs({
            'opacity':d => {
              switch(this.state.selected) {
                case 'all':
                  return 1
                case 'truth':
                  if(d.Classification === 'Support CAA')
                    return 1
                  return 0.1
                case 'false':
                  if(d.Classification === 'Misinformation by Pro-CAA Users' || d.Classification === 'Misinformation by Anti-CAA Users')
                    return 1
                  return 0.1
                case 'troll':
                  if(d.Classification === 'Fact check + Trolling')
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
        select('.tooltip')
          .style('display','none')

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
        <div className='tooltip'>
          <div className='tooltip-header'>
            <div className='tweet-username'>Project Name</div> 
            <div className={'active-true'}>Inactive</div>
          </div>
          <div className='tweet-content'>
            tweet content
          </div>
          <div className='tooltip-footer'>
            <div>Retweets: <span className={'bold retweet-tooltip-value'}>0</span></div>
            <div>Likes: <span className={'bold likes-tooltip-value'}>0</span></div>
          </div>
        </div>
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
            Fact Checking + Trolling
          </div>
          <div className={this.state.selected === 'unknown' ? "unknown-filter unknown-checked" : "unknown-filter"} onClick={() => { this.changeSelected('unknown') }}>
            Unknown / Neutral
          </div>
          <div className={this.state.selected === 'inactive' ? "inactive-user checked" : "inactive-user"} onClick={() => { this.changeSelected('inactive') }}>
            Inactive Users
          </div>
        </div>
        <p className='italics text-mouseover'>Mouseover to see the details and highlight other tweets by the same user; and click to open the tweet in new window</p>
        <svg width={this.props.width} height={this.props.height} ref={node => this.node = node}>
        </svg>
      </div>
    )
  }
}
export default ProjectCards