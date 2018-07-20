import React, { Component } from 'react';
import logo from './marker-icon-2x.png';
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
    description: '<b>Czajownia</b>'
  }, {
    position: {
      lat: 51.117953,
      lng: 17.032108
    },
    foursquareId: '',
    description: '<b>Macondo</b>'
  }, {
    position: {
      lat: 51.123011,
      lng: 17.034473
    },
    foursquareId: '',
    description: '<b>Hakernia</b>'
  }, {
    position: {
      lat: 51.118438,
      lng: 17.035584
    },
    foursquareId: '',
    description: '<b>Piecownia</b>'
  }, {
    position: {
      lat: 51.116138,
      lng: 17.042246
    },
    foursquareId: '',
    description: '<b>Manufaktura</b>'
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
    description: '<b>Smak<b>'
  }, {
    position: {
      lat: 51.109773,
      lng: 17.031984
    },
    foursquareId: '4b643fc4f964a52058a62ae3',
    description: 'Rynek'
  }, {
    position: {
      lat: 51.120522,
      lng: 17.05297
    },
    foursquareId: '4be8758088ed2d7f94e5cb1d',
    description: 'Park Tołpy'
  }, {
    position: {
      lat: 51.1193,
      lng: 17.033108
    },
    foursquareId: '558441d0498e012ffdab2637',
    description: 'Powoli'
  }, {
    position: {
      lat: 51.11997,
      lng: 17.031523
    },
    foursquareId: '579f5d16498ebfc79acf82b4',
    description: 'Ogień'
  }, {
    position: {
      lat: 51.12292,
      lng: 17.034495
    },
    foursquareId: '',
    description: 'Ramy Domański'
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
            query: "",
            selectedMarker: -1,
            markers: []
          }
  reloadMarkers = 0;

  setReloadMarkers = (value) => {
    this.reloadMarkers = value;
  }

  /*
   * Append third party data to markers kept in state
   */
  loadThirdPartyData(markers) {

    // load 4sq bestPhoto
    markers.forEach((marker, idx) => {
      // keep fsqId for future reference
      const fsqId = marker.foursquareId;
      // if key is available and data is missing
      if(fsqId && !marker.foursquareData) {
        // get data from API
        FoursquareAPI.getById(marker.foursquareId)
          .then(data => {
            console.log("Foursquare, " + marker.description);
            console.log(data);
            // if data received, make sure it has what we need in it
            if(data.meta && data.meta.code && data.meta.code === 200) {
              // it has, so apply it to the state
              this.setState((prevState) => {
                // update the right property in the previous state,
                // and return it as the new version
                prevState.markers =
                  prevState.markers.map(marker => {
                    // the fsqId we kept at the beginning will help locate
                    // the right spot (marker) to update
                    if(marker.foursquareId === fsqId)
                      marker.foursquareData = data;
                    return marker;
                  })
                console.log(prevState.markers[idx]);
                return {markers: prevState.markers};
              });
            }
          }).catch(err => console.log("4sq error: "+err));
      }
    });


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

  /*
   * Add markers (places) to a state
   */
  addMarkers = (markerList) => {
    // delete map references from markers so they are to be recreated
    // with newly added markers to map
    markerList.forEach(marker => {
      if(marker.mapref)
        delete(marker.mapref);
    });
    // add new markers to state
    this.setState({ markers: markerList });
    // unselect marker if any
    this.selectItemByIdx(-1);
    console.log(this.state.markers);
    console.log(markerList);

    this.loadThirdPartyData(markerList);
    // set flag that causes map to reload its markers on
    // map component update, see map's componentDidUpdate()
    this.setReloadMarkers(1);
  }

  /*
   * Update state when text in query box changes
   */
  updateQuery = (query) => {
    this.setState({query})
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

        <input
          className="query-input"
          type="text"
          placeholder="Filter places"
          value={this.state.query}
          onChange={(event) => this.updateQuery(event.target.value)}/>
a
        <ul>
          {this.state.markers.map((place, idx) => (
            <li>
              {
                place.foursquareData &&
                place.foursquareData.response &&
                place.foursquareData.response.venue &&
                place.foursquareData.response.venue.bestPhoto &&
                  <img
                    width="50px"
                    height="50px"
                    src={place.foursquareData.response.venue.bestPhoto.prefix +
                         place.foursquareData.response.venue.bestPhoto.width + 'x' +
                         place.foursquareData.response.venue.bestPhoto.height +
                         place.foursquareData.response.venue.bestPhoto.suffix}
                    alt={place.description}/>
              }
              <a href="#" onClick={(e) => this.selectItemByIdx(idx)}>{place.description}</a>
            </li>
          ))}
        </ul>
b
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <Button idx={2} onClk={this.addMarkers}></Button>

      </div>
    );
  }
}

export default App;
