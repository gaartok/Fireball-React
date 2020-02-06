import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import Fireball from './Fireball';
import './Fireball.css';


export default class ReactFireball extends Component {
  constructor(props) {
    super(props);

    let fireballApp = new Fireball();

    this.state = {
      fireballApp:fireballApp,
      areaDivHeight:0,
      areaDivWidth:0
    };

  }


  componentDidMount() {
//    console.log("ReactFireball componentDidMount");

    let areaDivHeight = document.getElementById('areaGameFireball').clientHeight;
    let areaDivWidth = document.getElementById('areaGameFireball').clientWidth;
    this.setState({ areaDivHeight:areaDivHeight });
    this.setState({ areaDivWidth:areaDivWidth });

//    console.log("areaDivWidth = ", areaDivWidth, " areaDivHeight = ", areaDivHeight);
}

  
  handleChange(selectedOption) {
  };


  render() {
      let returnVal =
        <div className="entirePageFireball">
          <div className="areaHeadingFireball">
            <p>This is an embedded React version of the "world famous" game of Fireball.<br/>
               Fireball was originally written in C++, then ported to plain Javascript, and finally to be a React component.
            </p>
          </div>
          <div className="areaGameFireball" id="areaGameFireball">
            <P5Wrapper divWidth={this.state.areaDivWidth} divHeight={this.state.areaDivHeight} sketch={this.state.fireballApp.sketch} ></P5Wrapper>
          </div>
          <div className="areaFooterFireball">
            Footer
          </div>
        </div>

      return (returnVal);
  }
}

