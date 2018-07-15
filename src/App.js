import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';

class App extends Component {

  state = { markers: [{position: { lat: 51.108177, lng: 17.039484 }},
                      {position: { lat: 51.112262, lng: 17.028149 }}] };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Map mapid="themap" markers={this.state.markers}></Map>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
