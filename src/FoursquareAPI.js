
// 45.5589522,-122.6517163
export const getByLoc = (latlon) =>
  fetch('https://api.foursquare.com/v2/venues/explore?'+
  'limit=1'+
  '&ll='+latlon+
  '&client_id=OWT0JDCCLVFEX3S2L22EUQVGZY1WXEQONHU5GGOPE1ILQRZ0'+
  '&client_secret=3PJOBP4YBXKLAIXHXL4N1EBNGA4U0MEE34TUQ1JTEVBGCORE'+
  '&v=20140806')
  .then(response => response.json());

//4b643fc4f964a52058a62ae3
export const getById = (venueId) =>
  fetch('https://api.foursquare.com/v2/venues/'+venueId+
    '?limit=1'+
    '&client_id=OWT0JDCCLVFEX3S2L22EUQVGZY1WXEQONHU5GGOPE1ILQRZ0'+
    '&client_secret=3PJOBP4YBXKLAIXHXL4N1EBNGA4U0MEE34TUQ1JTEVBGCORE'+
    '&v=20140806')
  .then(response => response.json());
