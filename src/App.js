import React, { Component } from 'react';
// import logo from './marker-icon-2x.png';
import './App.css';
import Map from './Map';
//import * as UnsplashAPI from './UnsplashAPI';
import * as FoursquareAPI from './FoursquareAPI';
//import * as NytAPI from './NytAPI';
import escapeRegExp from 'escape-string-regexp';
//import regExp from 'escape-string-regexp';
import QueryBox from './QueryBox';
import PlacesList from './PlacesList.js';


const hardcodedPlaces = [{
    position: {
      lat: 51.108177,
      lng: 17.039484
    },
    foursquareId: '4b7cef7ef964a520aba92fe3',
    facebookUrl: 'https://www.facebook.com/GaleriaDominikanska/',
    www: 'http://galeria-dominikanska.pl/',
    description: 'Galeria Dominikańska',
    keywords: 'cafe coffee tea ice beer bars food pizza pasta sushi shops clothes restrooms'
  }, {
    position: {
      lat: 51.112262,
      lng: 17.028149
    },
    foursquareId: '4d20d1235c4ca1cd6670a43d',
    facebookUrl: 'https://m.facebook.com/CzaiszCzajowniaWroclaw/',
    www: 'https://www.czajownia.pl/',
    description: 'Czajownia',
    keywords: 'tea bar'
  }, {
    position: {
      lat: 51.117953,
      lng: 17.032108
    },
    foursquareId: '52b03642498e42beba495943',
    facebookUrl: 'https://www.facebook.com/macondo.fundacja/',
    www: 'http://www.macondo.com.pl',
    description: 'Macondo',
    keywords: 'cafe coffee tea art gallery handcraft souvenirs shop events'
  }, {
    position: {
      lat: 51.1167066,
      lng: 17.0313012
    },
    foursquareId: '4e0b56b2d164e3547c2feb9d',
    facebookUrl: 'https://www.facebook.com/caferozrusznik/',
    description: 'Cafe Rozrusznik',
    keywords: 'cafe coffee tea bar'
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
    foursquareId: '50d33e8a011cb4281d823a94',
    facebookUrl: 'https://www.facebook.com/Piecownia/',
    www: 'http://www.piecownia.com.pl/',
    description: 'Piecownia',
    keywords: 'handmade ceramics souvenirs shop handcraft diy'
  }, {
    position: {
      lat: 51.116138,
      lng: 17.042246
    },
    foursquareId: '',
    description: 'Manufaktura',
    keywords: 'art gallery shop handcraft'
  }, {
    position: {
      lat: 51.119617,
      lng: 17.032521
    },
    foursquareId: '55577e53498ec3f82b1871c8',
    facebookUrl: 'https://www.facebook.com/bistronaroznik/',
    description: 'Narożnik',
    keywords: 'restaurant food cafe coffee tea beer alcohol bar'
  }, {
    position: {
      lat: 51.122896,
      lng: 17.033867
    },
    foursquareId: '',
    description: 'Smak',
    keywords: 'restaurant food coffee pierogi'
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
    description: 'Powoli',
    keywords: 'restaurant slowfood coffee tea'
  }, {
    position: {
      lat: 51.11997,
      lng: 17.031523
    },
    foursquareId: '579f5d16498ebfc79acf82b4',
    description: 'Ogień',
    keywords: 'restaurant pizza pasta coffee tea'
  }, {
    position: {
      lat: 51.12292,
      lng: 17.034495
    },
    foursquareId: '',
    description: 'Ramy Domański',
    keywords: 'art frames handcraft service'
  }
]


class App extends Component {

  state = {
            query: "",
            selectedPlace: -1,
            highlightedPlace: -1,
            places: [],
            reloadPlaces: 0
          }

  /*
   * Returns array of places. For the purpose of this project it is hardcoded
   * and stored in a global variable.
   */
  getAllPlaces() {
    return hardcodedPlaces;
  }

  /*
   * Set or reset a flag that causes map to reload its places on
   * map component update, see map's componentDidUpdate()
   */
  requireReloadPlaces = (value) => {
    this.setState({reloadPlaces: value})
  }

  /*
   * Append third party data to places kept in state
   */
  loadThirdPartyData(places) {

    // load foursquare data
    places.forEach((place, idx) => {
      // keep fsqId for future reference
      const fsqId = place.foursquareId;
      // if key is available and data is missing
      if(fsqId &&
           (!place.foursquareData ||
             place.foursquareData === "Error" ||
            !(place.foursquareData.meta.code === 200))) {
        // get data from API
        place.foursquareData = 'Loading';
        this.forceUpdate();
        FoursquareAPI.getById(place.foursquareId)
          .then(data => {
            // if data received, make sure it has what we need in it
            if(data.meta && data.meta.code) {
              // it has, so apply it to the state
              this.setState((prevState) => {
                // update the right property in the previous state,
                // and return it as the new version
                prevState.places =
                  prevState.places.map(place => {
                    // the fsqId we kept at the beginning will help locate
                    // the right spot (place) to update
                    if(place.foursquareId === fsqId)
                      place.foursquareData = data;
                    return place;
                  })
                return {places: prevState.places};
              });
            } else {
              console.log("4sq response code: "+ data.meta.code);
            }
          }).catch(err => {
            place.foursquareData = 'Error';
            this.forceUpdate();
            console.log("4sq error: "+err);
          })
      }
    });

    // proceed other third-party downloads if necessary
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
    this.addPlaces(this.getAllPlaces());
  }

  /*
   * Executed when place is focused or hovered
   */
  highlightPlaceByIdx = (idx) => {
    this.setState({ highlightedPlace: idx });
  }

  /*
   * Executed when place is clicked. This marks place to be reloaded.
   */
  selectPlaceByIdx = (idx) => {
    this.setState({ selectedPlace: idx });
  }

  /*
   * Executed when map marker or listed place is clicked
   */
  clickItemByIdx = (idx) => {
    this.highlightPlaceByIdx(idx);
    this.selectPlaceByIdx(idx);
    if(idx > -1) {
      const singleItemList = [];
      singleItemList.push(this.state.places[idx]);
      this.loadThirdPartyData(singleItemList);
    }
  }

  /*
   * Add single place to a state
   */
  addPlace = (placeData) => {
    this.setState((state) => { return state.places.push(placeData); });
    this.requireReloadPlaces(1);
  }

  /*
   * Add places to a state
   */
  addPlaces = (placesList) => {
    // delete map references from places so they are to be recreated
    // with newly added places to map
    placesList.forEach(place => {
      if(place.mapref)
        delete(place.mapref);
    });
    // replace old places with new places in state
    this.setState({ places: placesList });
    // unselect place if any
    this.clickItemByIdx(-1);

    // Uncomment the line below should API data be loaded for all places at once
    // When commented out the loading runs on click, to save API query limits
    //this.loadThirdPartyData(placesList);

    this.requireReloadPlaces(1);
  }

  /*
   * Update state when text in query box changes
   */
  filterPlacesByQuery = (query) => {
    this.setState({query});
    if(query) {
      // Uncomment line below to select places matching any word in the query
      //let q = escapeRegExp(query).replace(' ','|');

      // Select places matching every (partial) word in the query.
      // The queried words are expected to be separated by spaces or commas.
      // the final regexp: (?=.*food)(?=.*cafe)(?=.*art).+
      let q = "(?=.*" + escapeRegExp(query)
          .trim()
          .replace(new RegExp(",","g"), " ")  // ignore commas
          .replace(new RegExp(" +","g"), ")(?=.*")+").+";

      const match = new RegExp(q, "i");
      this.addPlaces(
        this.getAllPlaces().filter(place =>
          match.test(place.description) ||
          (place.keywords && match.test(place.keywords))
        )
      );
    }
    else {
      // for empty query take all places
      this.addPlaces(this.getAllPlaces());
    }
    // reset focus
    this.highlightPlaceByIdx(-1);
  }

  render() {
    return (
      <div className="App">

          <a href="#places-filter" className="skip-map">
            Skip map
          </a>

        <header className="App-header">
          <h1 className="App-title">Neighborhood Map</h1>
        </header>

        <main id="maincontent">
          <section id="map-container">
            <Map
              role="application"
              aria-label="Map with places"
              mapid="themap"
              markers={this.state.places}
              reloadMarkers={this.state.reloadPlaces}
              setReloadMarkers={this.requireReloadPlaces}
              selectedMarker={this.state.highlightedPlace}
              markerOnClick={this.clickItemByIdx}
            ></Map>
          </section>
          <section id="places-container">
            <QueryBox
              query={this.state.query}
              updateQuery={this.filterPlacesByQuery}
            />
            <PlacesList
              places={this.state.places}
              highlightedPlace={this.state.highlightedPlace}
              selectedPlace={this.state.selectedPlace}
              placeOnClick={this.clickItemByIdx}
              placeOnFocus={this.highlightPlaceByIdx}
              selectPlaceByIdx={this.selectPlaceByIdx}
            ></PlacesList>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
