export default function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(r) {
        console.log('Service Worker registered.')
      }).catch(function(e) {
        console.log('Error registering Service Worker. '+e)
      });
    });
  }
}
