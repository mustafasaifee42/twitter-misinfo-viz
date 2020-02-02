import React, { Component } from 'react';
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';
import 'd3-selection-multi';
import { select } from 'd3';

class ProjectCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentDidUpdate(){
    this.createGraph()
  }

  getHourBudget = (dataObj) => {

    let nestData = d3.nest()
      .key(d => d.hourValue)
      .entries(dataObj);

    nestData.forEach(d => {
      d.key = +d.key
    })

    let hourData = []

    for(let  i= 0; i < 85; i ++){
      hourData.push(0)
    }

    nestData.forEach(d => {
      hourData[d.key] = d.values.length
    })
    
    return hourData

  }

  createGraph = () => {
    
    let dataCopy = Object.assign([], this.props.data);

    let dateRef = new Date('2020-01-02 10:00:00')

    dataCopy.forEach((d,i) => {
      d.dateDiff = (d['Date And Time'] - dateRef)
      d.hourValue = Math.floor(((d['Date And Time'] - dateRef) / 60000) /60)
    })

    let dataByClassification = d3.nest()
      .key(d => d.Classification)
      .entries(dataCopy);

    let supportCAA = dataByClassification[1].values
    let trolling = dataByClassification[0].values
    let misinfo = dataByClassification[2].values

    dataByClassification[4].values.forEach(d => {
      misinfo.push(d)
    })
    let supportCAAHour = this.getHourBudget(supportCAA)
    let trollingHour = this.getHourBudget(trolling)
    let misinfoHour = this.getHourBudget(misinfo)
    
    const node = this.node

    let g  = select(node)
      .append('g')
      .attrs({
        'transform': `translate(${20},${20})`
      })
    let g1  = select(node)
      .append('g')
      .attrs({
        'transform': `translate(${20},${20 + this.props.graphHeight - this.props.overlap})`
      })
    let g2  = select(node)
      .append('g')
      .attrs({
        'transform': `translate(${20},${20 + 2 * (this.props.graphHeight - this.props.overlap)})`
      })
        
    let xScale = scaleLinear()
      .domain([0, 84]) // input
      .range([0, this.props.width - 30]); // output
    let yScale = scaleLinear()
      .domain([0, 115]) // input
      .range([this.props.graphHeight,0]); // output
    let line = d3.line()
        .x((d, i) => xScale(i)) // set the x values for the line generator
        .y((d) => yScale(d)) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line
    g.append('line')
      .attrs({
        'x1':0,
        'y1':150,
        'x2':this.props.width - 30,
        'y2':150,
        'stroke':'#aaa',
        'fill':'none',
      })
    g.append("path")
      .datum(supportCAAHour) // 10. Binds data to the line 
      .attrs({
        "class": "line",
        "d": line,
        'stroke':this.props.color[0],
        'stroke-width':1,
        'fill':this.props.color[0],
        'fill-opacity':0.4,
      })
    g.append('text')
      .text('Truthful Tweets')
      .attrs({
        'x':0,
        'y':30,
        'fill':this.props.color[0],
        'font-family':'IBM Plex Sans',
        'font-size':14,
        'font-weight':'bold',
      })
    g.append('text')
      .text('There was an initial wave of truthful')
      .attrs({
        'x':0,
        'y':50,
        'fill':'#414141',
        'font-family':'IBM Plex Sans',
        'font-size':12,
      })
    g.append('text')
      .text('tweets that peaked around')
      .attrs({
        'x':0,
        'y':65,
        'fill':'#414141',
        'font-family':'IBM Plex Sans',
        'font-size':12,
      })
    g.append('text')
      .text('1 PM on 3rd of Jan')
      .attrs({
        'x':0,
        'y':82,
        'fill':'#414141',
        'font-family':'IBM Plex Sans',
        'font-size':12,
        'font-weight':'bold',
      })
        
      
    g1.append('line')
      .attrs({
        'x1':0,
        'y1':150,
        'x2':this.props.width - 30,
        'y2':150,
        'stroke':'#aaa',
        'fill':'none',
      })
    
    g1.append("path")
      .datum(misinfoHour) // 10. Binds data to the line 
      .attrs({
        "class": "line",
        "d": line,
        'stroke':this.props.color[1],
        'stroke-width':1,
        'fill':this.props.color[1],
        'fill-opacity':0.4,
      })
  
    g1.append('text')
      .text('Tweets Spreading Falsehoods')
      .attrs({
        'x':0,
        'y':30 + this.props.overlap,
        'fill':this.props.color[1],
        'font-family':'IBM Plex Sans',
        'font-size':14,
        'font-weight':'bold',
      })
    g1.append('text')
      .text('Then a wave of tweets spreading falsehoods kicked in.')
      .attrs({
        'x':0,
        'y':50 + this.props.overlap,
        'fill':'#414141',
        'font-family':'IBM Plex Sans',
        'font-size':12,
      })
    g1.append('text')
      .text('In this period the no. of tweets tweeting falsehoods, were')
      .attrs({
        'x':0,
        'y':65 + this.props.overlap,
        'fill':'#414141',
        'font-family':'IBM Plex Sans',
        'font-size':12,
      })
    g1.append('text')
      .text('more than that of no. of tweets that tweeted truthful info.')
      .attrs({
        'x':0,
        'y':82 + this.props.overlap,
        'fill':'#414141',
        'font-family':'IBM Plex Sans',
        'font-size':12,
      })
    g2.append('line')
      .attrs({
        'x1':0,
        'y1':150,
        'x2':this.props.width - 30,
        'y2':150,
        'stroke':'#aaa',
        'fill':'none',
      })
    g2.append("path")
      .datum(trollingHour) // 10. Binds data to the line 
      .attrs({
        "class": "line",
        "d": line,
        'stroke':this.props.color[2],
        'stroke-width':1,
        'fill':this.props.color[2],
        'fill-opacity':0.4,
      })
      g2.append('text')
        .text('Fact Checking + Trolling')
        .attrs({
          'x':0,
          'y':30 + this.props.overlap,
          'fill':this.props.color[2],
          'font-family':'IBM Plex Sans',
          'font-size':14,
          'font-weight':'bold',
        })
      g2.append('text')
        .text('Then once people started realizing the extend of false tweets,')
        .attrs({
          'x':0,
          'y':50 + this.props.overlap,
          'fill':'#414141',
          'font-family':'IBM Plex Sans',
          'font-size':12,
        })
      g2.append('text')
        .text('a small wave of fact checking and trolling tweets warning the users')
        .attrs({
          'x':0,
          'y':65 + this.props.overlap,
          'fill':'#414141',
          'font-family':'IBM Plex Sans',
          'font-size':12,
        })
      g2.append('text')
        .text('about the misinformation started')
        .attrs({
          'x':0,
          'y':82 + this.props.overlap,
          'fill':'#414141',
          'font-family':'IBM Plex Sans',
          'font-size':12,
        })

    for(let i = 0; i <= 85; i = i + 12){
      g2.append('line')
        .attrs({
          'x1':xScale(i),
          'y1':150,
          'x2':xScale(i),
          'y2':155,
          'stroke':'#aaa',
          'fill':'none',
        })

      g2.append('text')
        .attrs({
          'x':xScale(i),
          'y':175,
          'fill':'#aaa',
          'text-anchor':() => {
            if (i === 0)
             return 'start'
            if (i === 84)
              return 'end'
            return 'middle'
          },
          'font-family':'IBM Plex Sans',
          'font-size':10
        })
        .text(() => {
          var dt = new Date('2020-01-02 10:00:00');
          dt.setHours( dt.getHours() + i);
          let formatDate = d3.timeFormat("%d/%m %H:00")
          return formatDate(dt)
          
        })

    }
    
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