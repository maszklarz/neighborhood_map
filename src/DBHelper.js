class DBHelper {
  static getDatabaseURL() {
    let port = 3000; // Change this to your server port for development
    if(process.env.NODE_ENV === 'production')
      port = 5000;    // Change this to your server port for production
    return `http://localhost:${port}/places.json`;
  }

  /**
   * Fetch all places.
   */
  static fetchPlaces() {
    return fetch(this.getDatabaseURL())
      .then(response => response.json());
  }
}

export default DBHelper
