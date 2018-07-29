import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PlacesList extends Component {

  componentDidUpdate() {
    // Scroll places list to show selected place
    // by setting focus on it
    if(this.props.selectedPlace > -1) {
      const foc = document.getElementById('place-'+this.props.selectedPlace);
      if (foc) {
        foc.focus();
      }
      this.props.selectPlaceByIdx(-1);
    }
  }

  render() {
    return (
      <ul className="places-list">
        {this.props.places.map((place, idx) => (
          <li key={"place-"+idx}
              tabIndex='-1'
              className={(this.props.highlightedPlace === idx ? "selected-place" : "")}
          >
            <button
              onClick={(e) => this.props.placeOnClick(idx)}
              onMouseEnter={(e) => this.props.placeOnFocus(idx)}
              onFocus={(e) => this.props.placeOnFocus(idx)}
              id={"place-"+idx}
              className="place"
              aria-label={
                !place.foursquareId && "Place" + place.description + " no Foursquare information available." ||
                "Get data on " + place.description + " from Foursquare. " + (
                place.foursquareId &&
                place.foursquareData &&
                place.foursquareData.meta &&
                place.foursquareData.meta.code &&
                (place.foursquareData.meta.code === 200) && " Data already received" ||
                ""
              )}
            >
            <div className="place-header">
            <span><h2 className="place-name" aria-label="Place name">{place.description}</h2></span>
            {
              place.foursquareData &&
              place.foursquareData.response &&
              place.foursquareData.response.venue &&
              place.foursquareData.response.venue.rating &&
                <span
                  className="fsq-rating"
                  aria-label="rating"
                >({place.foursquareData.response.venue.rating})
                </span>
            }
            </div>
            {
              place.keywords &&
                <p className="keywords"
                   aria-label="Keywords"
                   name="Keywords"
                >
                {place.keywords.trim().replace(new RegExp(" ","g"), ", ")}
                </p>
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
                  (place.foursquareData.meta.code === 400) && <p className="fsq-missing-msg">The place is no longer on foursquare or the place reference to foursquare data is broken. Call support.</p>
                }
                {
                  place.foursquareId &&
                  place.foursquareData &&
                  place.foursquareData.meta &&
                  place.foursquareData.meta.code &&
                  (place.foursquareData.meta.code !== 200) &&
                  (place.foursquareData.meta.code !== 400) &&
                  <p className="fsq-missing-msg">Failed to load foursquare data. Try again later or bet {place.foursquareData.meta.code} on lottery.</p>
                }
                <p className="external-links">
                {
                  place.facebookUrl &&
                    <a className="fb-url" href={place.facebookUrl}><img className="small_logo" src="./fb_logo.svg" alt={"Link to "+ place.description +" facebook"}/></a>
                }
                {
                  place.www &&
                    <a className="www-url" href={place.www}><img className="small_logo" src="./www_logo.svg" alt={"Link to "+ place.description +" website"}/></a>
                }
                </p>
                </div>
            </article>
            </button>
          </li>
        ))}
      </ul>
    )
  }
}

PlacesList.propTypes = {
  places: PropTypes.array.isRequired,
  highlightedPlace: PropTypes.number.isRequired,
  selectedPlace: PropTypes.number.isRequired,
  placeOnClick: PropTypes.func.isRequired,
  placeOnFocus: PropTypes.func.isRequired,
  selectPlaceByIdx: PropTypes.func.isRequired
}

export default PlacesList
