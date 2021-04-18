import React, { Suspense} from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react'

import './assets/css/App.css';

import LogoGather from './components/first'

function Loading() {
  return (
    <div />
  );
}

function App() {

  return (
    <div className="App">
      <LogoGather />
    </div>
  );
}

const myTheme = {
  // "type": "dark",
  "palette": {
    "accents_1": "#111",
    "accents_2": "#333",
    "accents_3": "#444",
    "accents_4": "#666",
    "accents_5": "#888",
    "accents_6": "#999",
    "accents_7": "#eaeaea",
    "accents_8": "#fafafa",
    "background": "#000",
    "foreground": "#fff",
    "selection": "#D1FF52",
    "secondary": "#888",
    "success": "#D1FF52",
    "successLight": "#D1FF52",
    "successDark": "#D1FF52",
    "code": "#79ffe1",
    "border": "#333",
    "link": "#D1FF52"
  },
  "expressiveness": {
    "dropdownBoxShadow": "0 0 0 1px #333",
    "shadowSmall": "0 0 0 1px #333",
    "shadowMedium": "0 0 0 1px #333",
    "shadowLarge": "0 0 0 1px #333",
    "portalOpacity": 0.75
  }
};

function DecorateApp () {
  return (
    <GeistProvider theme={myTheme}>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </GeistProvider>
  );
}

export default DecorateApp;
