import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';
import * as UnsplashAPI from './UnsplashAPI';
import * as FoursquareAPI from './FoursquareAPI';
import * as NytAPI from './NytAPI';

class Button extends Component {
  render() {
    return (
      <button onClick={event => this.props.onClk(this.props.idx)}>Guzik Component</button>
    )
  }
}

class App extends Component {

  state = { markers: {
              sel: 1,
              list: [{position: { lat: 51.108177, lng: 17.039484 }, id: '', description: 'Galeria<br>Handlowa' },
                     {position: { lat: 51.112262, lng: 17.028149 }, id: '', description: '<b>Knajpa<b>'}]
            }
          }

  componentDidMount() {

    // Temporary test code for various APIs
    /*
    UnsplashAPI.getByQuery('android')
      .then(data => console.log(data));

    FoursquareAPI.getByLoc('45.5589522,-122.6517163')
      .then(data => console.log(data));

    FoursquareAPI.getById('4b643fc4f964a52058a62ae3')
      .then(data => console.log(data));

    NytAPI.getByQuery('wroclaw')
      .then(data => console.log(data));
*/
  }

  selectItemByIdx = (idx) => {
    this.setState((state) => { return state.markers.sel = idx; });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Map
          mapid="themap"
          markers={this.state.markers}
          markerOnClick={this.selectItemByIdx}
        >
        </Map>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button idx={0} onClk={this.selectItemByIdx}></Button>
        <Button idx={1} onClk={this.selectItemByIdx}></Button>
      </div>
    );
  }
}

export default App;
