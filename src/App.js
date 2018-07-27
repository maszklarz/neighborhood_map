import React, { Component } from 'react';
import logo from './marker-icon-2x.png';
import './App.css';
import Map from './Map';
import * as UnsplashAPI from './UnsplashAPI';
import * as FoursquareAPI from './FoursquareAPI';
import * as NytAPI from './NytAPI';
import escapeRegExp from 'escape-string-regexp';
import regExp from 'escape-string-regexp';


const placesList = [{
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
            places: []
          }
  reloadPlaces = 0;

  setReloadPlaces = (value) => {
    this.reloadPlaces = value;
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
    this.addPlaces(placesList);
  }

  addPlace = (placeData) => {
    this.setState((state) => { return state.places.push(placeData); });
    this.setReloadPlaces(1);
  }

  /*
   * Executed when map marker or listed place is clicked
   */
  clickItemByIdx = (idx) => {
    this.setState({ selectedPlace: idx });
    this.setState({ highlightedPlace: idx });
    if(idx > -1) {
      const singleItemList = [];
      singleItemList.push(this.state.places[idx]);
      this.loadThirdPartyData(singleItemList);
    }
  }

  /*
   * Executed when place is focused or hovered
   */
  focusItemByIdx = (idx) => {
    this.setState({ highlightedPlace: idx });
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

    // Do not load the data now
    // Load it later, after click, to save API queries limits
    //this.loadThirdPartyData(placesList);

    // set flag that causes map to reload its places on
    // map component update, see map's componentDidUpdate()
    this.setReloadPlaces(1);
  }

  /*
   * Update state when text in query box changes
   */
  updateQuery = (query) => {
    this.setState({query});
    if(query) {
      // select places matching any word in the query
      // let q = escapeRegExp(query).replace(' ','|');

      // select places matching every (partial) word in the query
      // the final regexp string: (?=.*food)(?=.*cafe)(?=.*art).+
      // ignore commas
      let q = "(?=.*" + escapeRegExp(query)
          .trim()
          .replace(new RegExp(",","g"), " ")
          .replace(new RegExp(" +","g"), ")(?=.*")+").+";

      const match = new RegExp(q, "i");
      this.addPlaces(
        placesList.filter(place =>
          match.test(place.description) ||
          (place.keywords && match.test(place.keywords))
        )
      );
    }
    else {
      // for empty query take all places
      this.addPlaces(placesList);
    }

    this.focusItemByIdx(-1);
  }

  componentDidUpdate() {
    // Scroll places list to show selected place
    // by setting focus on it
    if(this.state.selectedPlace > -1) {
      const foc = document.getElementById('place-'+this.state.selectedPlace);
      if (foc) {
        foc.focus();
      }
      this.setState({selectedPlace: -1});
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
              markers={this.state.places}
              reloadMarkers={this.reloadPlaces}
              setReloadMarkers={this.setReloadPlaces}
              selectedMarker={this.state.highlightedPlace}
              markerOnClick={this.clickItemByIdx}
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
              {this.state.places.map((place, idx) => (
                <li key={"place-"+idx}
                    tabIndex='-1'
                    className={(this.state.highlightedPlace === idx ? "selected-place" : "")}
                >
                  <button
                    onClick={(e) => this.clickItemByIdx(idx)}
                    onMouseEnter={(e) => this.focusItemByIdx(idx)}
                    onFocus={(e) => this.focusItemByIdx(idx)}
                    id={"place-"+idx}
                    className="place"
                  >
                  <div className="place-header">
                  <span><h2 className="place-name">{place.description}</h2></span>
                  {
                    place.foursquareData &&
                    place.foursquareData.response &&
                    place.foursquareData.response.venue &&
                    place.foursquareData.response.venue.rating &&
                      <span className="fsq-rating">({place.foursquareData.response.venue.rating})</span>
                  }
                  </div>
                  {
                    place.keywords &&
                      <p className="keywords">{place.keywords.trim().replace(new RegExp(" ","g"), ", ")}</p>
                  }
                  <article className="place-main-content">
                    {
                      place.foursquareData &&
                      place.foursquareData.response &&
                      place.foursquareData.response.venue &&
                      place.foursquareData.response.venue.bestPhoto &&
                        <div className="place-img">
                          <img className="fsq-img"
                            src={place.foursquareData.response.venue.bestPhoto.prefix +
                                 place.foursquareData.response.venue.bestPhoto.width + 'x' +
                                 place.foursquareData.response.venue.bestPhoto.height +
                                 place.foursquareData.response.venue.bestPhoto.suffix}
                            alt={"A picture of "+place.description}/>
                        </div>
                    }
                      <div className="place-main-text">
                      {
                        place.foursquareData &&
                        place.foursquareData.response &&
                        place.foursquareData.response.venue &&
                        <div className="place-main-text-fsq">
                        {
                          place.foursquareData.response.venue.location &&
                          place.foursquareData.response.venue.location.address &&
                            <p className="fsq-address">Address: {place.foursquareData.response.venue.location.address}</p>
                        }
                        {
                          place.foursquareData.response.venue.tips &&
                          place.foursquareData.response.venue.tips.groups &&
                          place.foursquareData.response.venue.tips.groups.forEach((group) => {
                              group.items &&
                              group.items.forEach((item) =>
                                item.text && <p className="fsq-tip">{item.text}</p>
                              )
                            }
                          )
                        }
                        {
                          place.foursquareData.response.venue.tips &&
                          place.foursquareData.response.venue.tips.groups[0] &&
                          place.foursquareData.response.venue.tips.groups[0].items[0] &&
                          place.foursquareData.response.venue.tips.groups[0].items[0].text &&
                            <p className="fsq-tip">Tip: {place.foursquareData.response.venue.tips.groups[0].items[0].text}</p>
                        }
                        </div>
                      }
                      {
                        !place.foursquareId && <p className="fsq-missing-msg">No foursquare reference for this place.</p>
                      }
                      {
                        place.foursquareId &&
                        !place.foursquareData &&
                          <p className="fsq-missing-msg">Foursquare data may be available.</p>
                      }
                      {
                        place.foursquareId &&
                        place.foursquareData &&
                        place.foursquareData === "Error" &&
                          <p className="fsq-missing-msg">Error loading foursquare data. Internet connection may be down.</p>
                      }
                      {
                        place.foursquareId &&
                        place.foursquareData &&
                        place.foursquareData === "Loading" &&
                          <p className="fsq-missing-msg">Loading...</p>
                      }
                      {
                        place.foursquareId &&
                        place.foursquareData &&
                        place.foursquareData.meta &&
                        place.foursquareData.meta.code &&
                        (place.foursquareData.meta.code !== 200) && <p className="fsq-missing-msg">Failed to load foursquare data. Try again later or bet {place.foursquareData.meta.code} on lottery.</p>
                      }
                      <p className="external-links">
                      {
                        place.facebookUrl &&
                          <a className="fb-url" href={place.facebookUrl}><img className="small_logo" src="./fb_logo.svg" alt="Link to facebook"/></a>
                      }
                      {
                        place.www &&
                          <a className="www-url" href={place.www}><img className="small_logo" src="./www_logo.svg" alt="Link to website"/></a>
                      }
                      </p>
                      </div>
                  </article>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
