export function register() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log('ServiceWorker registration successful:', registration);
          })
          .catch((error) => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    } else {
      console.log('Service workers are not supported.');
    }
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.unregister()
          .then(() => {
            console.log('ServiceWorker unregistration successful');
          })
          .catch((error) => {
            console.log('ServiceWorker unregistration failed:', error);
          });
      });
    } else {
      console.log('Service workers are not supported.');
    }
  }
  