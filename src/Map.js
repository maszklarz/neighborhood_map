import React, { Component } from 'react';
import L from 'leaflet';
// To make leaflet available add "leaflet" to dependencies in package.json
// and perform npm install
// No need to include the leaflet.js in index.html, but leaflet.css is still
// required.

class Map extends Component {

  componentDidMount() {
    const theMap = L.map(this.props.mapid).setView([51.110036, 17.031952], 15);

    // Alternative map otions:
    //const theMapUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png'; // this does not require token
    const theMapUrl='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFzemtsYXJ6IiwiYSI6ImNqaXc3ZTNwZDBkaWUzdm10cjV0eTJjZmgifQ.FdcNhehRyAH6Mv2EA5aPCA';

    L.tileLayer(theMapUrl, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'your.mapbox.access.token'
    }).addTo(theMap);
  }

  render() {
    return (
      <div
        class="leaflet-map"
        id={this.props.mapid}>
      </div>
    )
  }
}

export default Map
