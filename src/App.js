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
            selectedMarker: -1,
            highlightedMarker: -1,
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
  clickItemByIdx = (idx) => {
    console.log("clickItemByIdx("+idx+")")
    this.setState({ selectedMarker: idx });
    this.setState({ highlightedMarker: idx });
    if(idx > -1) {
      const singleItemList = [];
      singleItemList.push(this.state.markers[idx]);
      this.loadThirdPartyData(singleItemList);
    }
  }

  /*
   * Executed when place is focused or hovered
   */
  focusItemByIdx = (idx) => {
    // debugger;
    console.log("focusItemByIdx("+idx+")");
    this.setState({ highlightedMarker: idx });
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
    this.clickItemByIdx(-1);
    console.log(this.state.markers);
    console.log(markerList);

    // Do not load the data now
    // Load it later, after click, to save API queries limits
    //this.loadThirdPartyData(markerList);

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
      this.addMarkers(
        markerList.filter(marker =>
          match.test(marker.description) ||
          (marker.keywords && match.test(marker.keywords))
        )
      );
    }
    else {
      // for empty query take all places
      this.addMarkers(markerList);
    }

    this.focusItemByIdx(-1);
  }

  componentDidUpdate() {
    // Scroll places list to show selected place
    // by setting focus on it
    console.log('componentDidUpdate()' + this.state.selectedMarker);
    if(this.state.selectedMarker > -1) {
      const foc = document.getElementById('place-'+this.state.selectedMarker);
      if (foc) {
        foc.focus();
      }
      this.state.selectedMarker = -1;
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
              selectedMarker={this.state.highlightedMarker}
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
              {this.state.markers.map((place, idx) => (
                <li key={"place-"+idx}
                    tabIndex='-1'
                    className={(this.state.highlightedMarker === idx ? "selected-place" : "")}
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
                              group.items.forEach((item) => {
                                item.text && <p className="fsq-tip">{item.text}</p>
                              })
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
                        !place.foursquareData && <p className="fsq-missing-msg">Foursquare data could not be loaded.</p>
                      }
                      <p className="external-links">
                      {
                        place.facebookUrl &&
                          <a className="fb-url" href={place.facebookUrl}><img class="small_logo" src="./fb_logo.svg" alt="Link to facebook"/></a>
                      }
                      {
                        place.www &&
                          <a className="www-url" href={place.www}><img class="small_logo" src="./www_logo.svg" alt="Link to website"/></a>
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
