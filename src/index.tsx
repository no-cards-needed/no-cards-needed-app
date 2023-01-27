import * as React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import * as  ReactDOM from 'react-dom/client';
import './css/index.css';
import './css/App.css';
import './css/btn.css';
import './css/shdws.css';
import './css/typo.css';
import './css/assets.css';
import './css/header.css';
import './css/dropdown.css';
import './css/context.css';
import './css/hamburger.css';
import './css/toggle.css';
import './css/settings.css';
import './css/hand.css';
import './css/modal.css';
import './css/cards.css';

// Comment out the thing you are currently not working on

// Game Development
import App from './PlayingGame';
// Menu Development
// import App from './App';

import StartScreen from "./components/startScreen"
import CreateGame from "./components/CreateGame"
import Imprint from "./components/Imprint"
import About from "./components/About"

import reportWebVitals from './reportWebVitals';
import { GameWrapper } from './GameWrapper';
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to usea
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: "no-cards-needed.firebaseapp.com",
	databaseURL: "https://no-cards-needed-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "no-cards-needed",
	storageBucket: "no-cards-needed.appspot.com",
	messagingSenderId: "917536359159",
	appId: "1:917536359159:web:20c347751643b46b2a09f2",
	measurementId: "G-LDX1SMVPRE"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<StartScreen />} />
				<Route path=":gameId/" element={<GameWrapper app={app} />} />
				<Route path="imprint" element={<Imprint />} />
				<Route path="about" element={<About />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();