class DBHelper {
  static getDatabaseURL() {
    const port = 3000; // Change this to your server port
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
