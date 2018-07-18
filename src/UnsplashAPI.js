const headers = {
  Authorization: 'Client-ID cee23f5d79da52375ed10abcbdab9bc43a490947cf321f02eaa6297759153f30'
}

export const getByQuery = (query) =>
fetch('https://api.unsplash.com/search/photos?page=1'+
      '&query=' + query, { headers })
  .then(response => response.json());
