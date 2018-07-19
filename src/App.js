import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';
import * as UnsplashAPI from './UnsplashAPI';
import * as FoursquareAPI from './FoursquareAPI';
import * as NytAPI from './NytAPI';

class Button extends Component {

markerList = [{
    position: {
      lat: 51.108177,
      lng: 17.039484
    },
    foursquareId: '',
    description: 'Galeria Dominikańska'
  }, {
    position: {
      lat: 51.112262,
      lng: 17.028149
    },
    foursquareId: '',
    description: '<b>Czajownia<b>'
  }, {
    position: {
      lat: 51.117953,
      lng: 17.032108
    },
    foursquareId: '',
    description: '<b>Macondo<b>'
  }, {
    position: {
      lat: 51.123011,
      lng: 17.034473
    },
    foursquareId: '',
    description: '<b>Hakernia<b>'
  }, {
    position: {
      lat: 51.118438,
      lng: 17.035584
    },
    foursquareId: '',
    description: '<b>Piecownia<b>'
  }, {
    position: {
      lat: 51.116138,
      lng: 17.042246
    },
    foursquareId: '',
    description: '<b>Manufaktura<b>'
  }, {
    position: {
      lat: 51.119617,
      lng: 17.032521
    },
    foursquareId: '',
    description: '<b>Narożnik<b>'
  }, {
    position: {
      lat: 51.122896,
      lng: 17.033867
    },
    foursquareId: '',
    description: '<b>Pierogi<b>'
  }
]

  randomMarkers = () => {
    return this.markerList.filter(marker => (Math.random() < 0.5));
  }

  newMarker = {
      position: {
        lat: 51.109177,
        lng: 17.036484
      },
      foursquareId: '',
      description: 'Nowy marker'
    }

  render() {
    return (
      <button onClick={(event) => { this.props.onClk(this.randomMarkers()); }}>Guzik Component</button>
    )
  }
}

class App extends Component {

  state = {
            selectedMarker: -1,
            markers: []
          }
  reloadMarkers = 0;

  setReloadMarkers = (value) => {
    this.reloadMarkers = value;
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

  addMarker = (markerData) => {
    this.setState((state) => { return state.markers.push(markerData); });
    this.setReloadMarkers(1);
  }

  selectItemByIdx = (idx) => {
    this.setState({ selectedMarker: idx });
    console.log(this.state);
  }

  addMarkers = (markerList) => {
    markerList.forEach(marker => {
      if(marker.mapref)
      delete(marker.mapref);
    });
    this.setState({ markers: markerList });
    this.selectItemByIdx(-1);
    console.log(this.state.markers);
    console.log(markerList);
    this.setReloadMarkers(1);
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
          reloadMarkers={this.reloadMarkers}
          setReloadMarkers={this.setReloadMarkers}
          selectedMarker={this.state.selectedMarker}
          markerOnClick={this.selectItemByIdx}
        >
        </Map>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button idx={2} onClk={this.addMarkers}></Button>
      </div>
    );
  }
}

export default App;
