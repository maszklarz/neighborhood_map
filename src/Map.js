import React, { Component } from 'react';
import L from 'leaflet';
// To make leaflet available add "leaflet" to dependencies in package.json
// and perform npm install
// No need to include the leaflet.js in index.html, but leaflet.css is still
// required.

class Map extends Component {

  updateMarkerSelection() {
    if(this.props.markers.list && this.props.markers.list[0].mapref)
    this.props.markers.list.forEach((marker, idx) => {
        if(this.props.markers.sel === idx) {
          L.DomUtil.addClass(marker.mapref._icon, "blinking");
          marker.mapref.openPopup();
        } else {
          L.DomUtil.removeClass(marker.mapref._icon, "blinking");
        }
      });
  }

  markerOnClick(idx) {
    this.props.markerOnClick(idx);
  }

  componentDidMount() {
    this.map = L.map(this.props.mapid).setView([51.110036, 17.031952], 15);

    // Alternative map otions:
    //const theMapUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png'; // this does not require token
    const theMapUrl='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFzemtsYXJ6IiwiYSI6ImNqaXc3ZTNwZDBkaWUzdm10cjV0eTJjZmgifQ.FdcNhehRyAH6Mv2EA5aPCA';

    L.tileLayer(theMapUrl, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'your.mapbox.access.token'
    }).addTo(this.map);

    this.props.markers.list.forEach((marker, idx) => {
        // Do not use setState here. Mere completion of the refmap in the
        // state is not considered a state change.
        this.props.markers.list[idx].mapref = L.marker(marker.position)
          .bindPopup(marker.description+" "+idx)
          .on('click', (e) => this.markerOnClick(idx))
          .addTo(this.map);
      });
    this.updateMarkerSelection();
  }

  render() {
    // The map is not a React element. It explains why this side effect of render(),
    // which is normally a no no.
    this.updateMarkerSelection();
    return (
      <div
        className="leaflet-map"
        id={this.props.mapid}>
      </div>
    )
  }
}

export default Map
