import React, { Component } from 'react';
import logo from './marker-icon-2x.png';
import './App.css';
import Map from './Map';
import * as UnsplashAPI from './UnsplashAPI';
import * as FoursquareAPI from './FoursquareAPI';
import * as NytAPI from './NytAPI';
import escapeRegExp from 'escape-string-regexp';
import regExp from 'escape-string-regexp';


const markerList = [{
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
    description: 'Czajownia'
  }, {
    position: {
      lat: 51.117953,
      lng: 17.032108
    },
    foursquareId: '52b03642498e42beba495943',
    description: 'Macondo'
  }, {
    position: {
      lat: 51.1167066,
      lng: 17.0313012
    },
    foursquareId: '4e0b56b2d164e3547c2feb9d',
    description: 'Cafe Rozrusznik'
  }, {
    position: {
      lat: 51.123011,
      lng: 17.034473
    },
    foursquareId: '',
    description: 'Hakernia'
  }, {
    position: {
      lat: 51.118438,
      lng: 17.035584
    },
    foursquareId: '',
    description: 'Piecownia'
  }, {
    position: {
      lat: 51.116138,
      lng: 17.042246
    },
    foursquareId: '',
    description: 'Manufaktura'
  }, {
    position: {
      lat: 51.119617,
      lng: 17.032521
    },
    foursquareId: '',
    description: 'Narożnik'
  }, {
    position: {
      lat: 51.122896,
      lng: 17.033867
    },
    foursquareId: '',
    description: 'Smak'
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


class Button extends Component {
  randomMarkers = () => {
    return markerList.filter(marker => (Math.random() < 0.5));
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
    this.addMarkers(markerList);
  }

  addMarker = (markerData) => {
    this.setState((state) => { return state.markers.push(markerData); });
    this.setReloadMarkers(1);
  }

  /*
   * Executed when map marker is clicked
   */
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
    // replace old markers with new markers in state
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
    this.setState({query});
    if(query) {
      // select places matching the query
      const match = new RegExp(escapeRegExp(query), "i");
      this.addMarkers(markerList.filter(marker => match.test(marker.description)));
    }
    else {
      // for empty query take all places
      this.addMarkers(markerList);
    }
  }

  componentDidUpdate() {
//    ReactDOM.findDOMNode(this.refs['place-'+this.state.selectedMarker]).focus();
    //this.state.selectedMarker
    const foc = document.getElementById('place-'+this.state.selectedMarker);
    if (foc) {
      foc.focus();
    }
  }
  render() {
    return (
      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Neighborhood Map</h1>
        </header>

        <main id="maincontent">
          <section id="map-container">
            <Map
              role="application"
              aria-label="Map with places"
              mapid="themap"
              markers={this.state.markers}
              reloadMarkers={this.reloadMarkers}
              setReloadMarkers={this.setReloadMarkers}
              selectedMarker={this.state.selectedMarker}
              markerOnClick={this.selectItemByIdx}
            ></Map>
          </section>
          <section id="places-container">
            <input
              className="query-input"
              name="places-filter"
              type="text"
              placeholder="Filter places"
              value={this.state.query}
              onChange={(event) => this.updateQuery(event.target.value)}
            />
            <ul className="places-list">
              {this.state.markers.map((place, idx) => (
                <li key={"place-"+idx}
                    tabindex='-1'
                    className={this.state.selectedMarker === idx ? "selected-place" : ""}
                >
                  <button
                    onClick={(e) => this.selectItemByIdx(idx)}
                    id={"place-"+idx}
                  >
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
                        alt={"A picture of "+place.description}/>
                  }
                  {
                    !place.foursquareData && <p className="fsq-missing-msg">Foursquare data not available.</p>
                  }
                  <h2>{place.description}</h2>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <Button idx={2} onClk={this.addMarkers}></Button>
        </main>
      </div>
    );
  }
}

export default App;
