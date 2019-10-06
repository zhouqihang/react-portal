import React, { Component } from 'react';
import logo from './logo.svg';
import Tooltip from './Tooltip'
import './App.css';

class App extends Component {
  readonly state = {
    visible: true
  }
  render() {
    return (
      <div className="App" style={{padding: 100}}>
        <div className="tooltip-container">
          <div className="tooltip-container-top">
            <Tooltip position="top left">
              <button role="button" onClick={ () => { console.log('111') } } >tooltip</button>
            </Tooltip>
            <Tooltip position="top">
              <button role="button" onClick={ () => { console.log('111') } } >tooltip</button>
            </Tooltip>
            <Tooltip position="top right">
              <button role="button" onClick={ () => { console.log('111') } } >tooltip</button>
            </Tooltip>
          </div>
          <div className="tooltip-container-center">
            <div className="tooltip-container-center-left">
              <Tooltip position="left top">
                <button role="button" onClick={ () => { console.log('111') } } >tooltip</button>
              </Tooltip>
              <Tooltip position="left">
                <button role="button" onClick={ () => { console.log('111') } } >tooltip</button>
              </Tooltip>
              <Tooltip position="left bottom">
                <button role="button" onClick={ () => { console.log('111') } } >tooltip</button>
              </Tooltip>
            </div>
            <div className="tooltip-container-center-left">
              <Tooltip position="right top">
                <button role="button" onClick={ () => { console.log('111') } } >tooltip</button>
              </Tooltip>
              <Tooltip position="right">
                <button role="button" onClick={ () => { console.log('111') } } >tooltip</button>
              </Tooltip>
              <Tooltip position="right bottom">
                <button role="button" onClick={ () => { console.log('111') } } >tooltip</button>
              </Tooltip>
            </div>
          </div>
          <div className="tooltip-container-top">
            <Tooltip position="bottom left" trigger="click" content="this is a tooltip component">
              <button role="button" onClick={ () => { console.log('111') } } >click</button>
            </Tooltip>
            <Tooltip position="bottom" trigger="focus" content="this is a tooltip component">
              <button role="button" onClick={ () => { console.log('111') } } >focus</button>
            </Tooltip>
            <Tooltip position="bottom right" content="this is a tooltip component" visible={this.state.visible} onChange={(visible) => this.setState({visible})}>
              <button role="button" onClick={ () => { console.log('111') } } >hover</button>
            </Tooltip>
          </div>
        </div>
        <div id="t">
          <div id="o"></div>
          this is a react tooltip component
        </div>
      </div>
    );
  }
}

export default App;
