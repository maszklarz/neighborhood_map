import React, { Component } from 'react';
import L from 'leaflet';
// To make leaflet available add "leaflet" to dependencies in package.json
// and perform npm install
// No need to include the leaflet.js in index.html, but leaflet.css is still
// required.

class Map extends Component {

  markerRefs = [];

  highlightSelectedMarker() {
    if(this.props.markers) {
      this.props.markers.forEach((marker, idx) => {
        console.log(this.props.markers);
        console.log(this.markerRefs);
        if(marker.mapref) {
          if(this.props.selectedMarker === idx) {
            L.DomUtil.addClass(marker.mapref._icon, "blinking");
            marker.mapref.openPopup();
          } else {
            L.DomUtil.removeClass(marker.mapref._icon, "blinking");
          }
        }
      });
    }
  }

  markerOnClick(idx) {
    this.props.markerOnClick(idx);
  }

  removeMarkersFromMap() {
    this.markerRefs.forEach((markerRef, idx) => {
      if(markerRef) {
        markerRef.remove();
      }
    });
    this.markerRefs = [];
  }

  loadMarkersToMap( markers ) {
    console.log("loadMarkersToMap:");
    console.log(this.props.markers);
    this.props.markers.forEach((marker, idx) => {
        // Do not use setState here. Mere completion of the refmap in the
        // state is not considered a state change.
        if(!marker.mapref) {
          marker.mapref = L.marker(marker.position)
            .bindPopup(marker.description+" "+idx)
            .on('click', (e) => this.markerOnClick(idx))
            .on('keypress', (e) => {
              if(e.originalEvent.key==="Enter")
                this.markerOnClick(idx);
              })
            .addTo(this.map);
        }
        this.markerRefs.push(marker.mapref);
      });
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

    this.loadMarkersToMap( this.props.markers );
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(this.props.reloadMarkers) {
      this.removeMarkersFromMap();
      this.loadMarkersToMap();
      this.props.setReloadMarkers(0);
      console.log(this.markerRefs);
    }
    this.highlightSelectedMarker();
  }

  render() {
    return (
      <div
        className="leaflet-map"
        id={this.props.mapid}>
      </div>
    )
  }
}

export default Map
