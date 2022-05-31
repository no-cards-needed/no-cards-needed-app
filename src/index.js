import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Comment out the thing you are currently not working on

// Game Development
import App from './Game';
// Menu Development
// import App from './App';


import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
