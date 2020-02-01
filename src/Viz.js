import React, { Component } from 'react';
import Graph from './Graph';

class ProjectCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
      size:'Retweet',
      inactive:false,
    }
  }
  render(){
    return (
      <div>
        <div className='container'>
          <div className='section-head-div'>
            <div className='filters'>
              <div className="size-radio">
                <div className="size-title"> 
                  Size
                </div> 
                <div className={this.state.size === 'Retweet' ? "size-click checked" : "size-click"}>Retweets</div>
                <div className={this.state.size === 'Likes' ? "size-click checked" : "size-click"}>Likes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default ProjectCards