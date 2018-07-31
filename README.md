# Neighborhood Map
This is the final, eighth project in Google Udacity FEND Nanodegree Scholarship. It has been built with React and it features a map API, an external data API, the responsive design, the accessibility, and the offline-first approach.

## Author
Made by Mariola Karpiewska based on initial code generated by create-react-app.

## Installation and Execution
1. Clone the git repository
2. Go to the project's main directory and type `npm install`
3. Run the server with `npm start`
Note, make sure there is nothing else running on the localhost port 3000. If so, stop it firts.
4. Navigate with your browser to `localhost:3000`

### Offline First Approach
A Create React App provides a service worker that is active in a production build only. The setup above utilizes a development build but is still equipped with the service worker. It is a different code than the one coming with React though. This custom made service worker is able to cache the external json file with place definitions, which was ignored by the original SW.

### Port Number
If port number needs to be changed make sure the `src/DBHelper.js` script is modified accordingly.

## Application Usage
### The Layout
The application shows a responsive view of a map of Wroclaw and a list of predefined places. Hovering over the place on the list animates the corresponding pin on the map and opens its small popup with the name. Clicking the pin or the place on the list initiates an attempt to complete the place's data based on the external source. So far a Foursquare API is used for the task. If the data is unavailable or cannot be downloaded for any reason the respective message is displayed in the place description area.

### Search Functionality
The list of places can be narrowed down by query string. The string is entered to a text box. The places are filtered by name and keywords. Empty string shows all available places. The more words entered, the less places may meet the criteria.

### Accessibility
The application uses HTML5 semantics and ARIA attributes to make it accessible for page readers. Keyboard only users may utilize convenient skip link to avoid long tab chain through the map. Focusing the places on their list has similar effect to hovering it with mouse, with additional stops on links to external pages (FB, homepage). Clicking the place with Enter or Space launches a request to external API.

### The API Caveat
Note, the API client ID and client secret used to gather Forsquare data is limited to 50 calls a day. If the limit is exceeded, the 429 code value is displayed in the cryptic form of lottery numbers ;-)

## Code Description
### Component Structure
The application is built with React. There are four React components created:
1. App (`src/App.js`)
2. Map (`src/Map.js`) - wraps up a Leaflet map library
3. QueryBox (`src/QueryBox.js`)
4. PlacesList (`src/PlacesList.js`)

### Leaflet
This project uses Leaflet as its mapping system. It is an open source library. To make the Leaflet available the "leaflet" has been added to dependencies in package.json, so the npm install may gather the required code. There was no need to include the leaflet.js in index.html, which is the way suggested in [Leaflet guide](https://leafletjs.com/examples/quick-start/). Regular import in Map.js has been used instead. The leaflet.css was still required in the html.

### API Modules
The external data is gathered asynchronically with Fetch. There are separate modules to handle various APIs:
- `src/FoursquareAPI.js` - the only one used so far in the app
- `src/NytAPI.js`
- `src/UnsplashAPI.js`
The latter two APIs have been tested but they are not used at the moment. The initial code has been included but commented out. The main reason is a poor reference to the predefined places (no pictures on Unsplash, no articles in NYT).

There is also a separate module to gather the predefined list of places stored in public/places.json:
- `src/DBHelper.js`

### Predefined Places
File name: `public/places.json`
The json data has following format:
```
{
	places: [{
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
	...
	}]
}
```
The `description` field is required. It actually contains the name of the place. The searching (filtering) routines use the field and the keywords field to select the required venues.

The `facebookUrl` and `www` fields are expected to contain links to the FB and webpage respectively. If they are omitted, the respective icons won't appear on the place description area.

If the `foursquareId` contains a correct place identifier, the application allows completion of the predefined data with information from Foursquare. If the field is omitted or contains incorrect ID, the application will inform user accordingly. The data goes to the places field of the App component's state. If the API download succeeds, additional field is added to the processed place: `foursquareData`. It contains the Foursquare response. The `render()` routine of the PlacesList component generates the UI view based on the part of the data.

The App state is the source of the data for all components. Apart from the `places` field described above, it contains a query string (`query` field) used to filter the places, two selectors, `selectedPlace` and `highlightedPlace`, pointing to the clicked and hovered (or focused) places, respectively.

The `reloadPlace` flag informs Map's `componentDidUpdate()` function to resynchronize the list of markers on the map with the list of places in the App's state. It is necessary, as the map is made with an external library called **Leaflet**, which is not natively compatible with React.

### Service Worker
The service worker utilized in this project consists of two files:
- `src/sw_support.js` - contains the installation routine
- `public/sw.js` - the service worker itself

The `src/registerServiceWorker.js` is an original SW registration routine provided by Create React App. It is not used in this project by default but remains available just in case.

## Dependencies
- [React](https://reactjs.org)
- Tiling library: [leafletjs](https://leafletjs.com/)
- Map provider: [Mapbox](https://www.mapbox.com/)
- [escape-string-regexp](https://www.npmjs.com/package/escape-string-regexp)

## Contributing
Pull requests are not expected, but may be accepted if they occur ;-)

## Useful links
- [Rubric](https://review.udacity.com/#!/rubrics/1351/view) for the project.
- Making accessible apps using ChromeVox: [video tutorial](https://www.youtube.com/watch?v=x18vEEfpK3g)
- [Introduction to Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers/#register_a_service_worker)
- [A Guide to Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Introduction to JS Promises](https://developers.google.com/web/fundamentals/primers/promises)
- [Regexr](https://regexr.com/335fm), the Regular Expressions tester
- [A guide to flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [JSON formatter](https://jsonlint.com/)
- [Markdown cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- [Markdown Editor](https://dillinger.io/)
