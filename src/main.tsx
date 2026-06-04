import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MUIThemeProvider from './providers/themeprovider';
import SnackbarProvider from './providers/snackbarprovider';
import StoreProvider from './providers/storeprovider';
import NavigationProvider from './providers/navigationprovider';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// import "@fontsource/open-sans";
import "@fontsource/open-sans/300-italic.css";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400-italic.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500-italic.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/600-italic.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700-italic.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/open-sans/800-italic.css";
import "@fontsource/open-sans/800.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <SnackbarProvider>
    <MUIThemeProvider>
      <StoreProvider>
        <NavigationProvider>
          <App />
        </NavigationProvider>
      </StoreProvider>
    </MUIThemeProvider>
  </SnackbarProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorkerRegistration.register()