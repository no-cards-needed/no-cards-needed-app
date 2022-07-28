import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ReactDOM from 'react-dom/client';
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
import App from './Game';
// Menu Development
// import App from './App';

import Dropdown from './components/Dropdown.js';

import StartScreen from "./components/startScreen.js"
import CreateGame from "./components/CreateGame.js"
import Game from "./components/Game.js"
import MenuHeader from "./components/MenuHeader.js"
import ContextMenu from "./components/ContextMenu.js"

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<StartScreen />} />
				<Route path="game/:gameId" element={<Game />} />
				<Route path="gametest" element={<Game />} />
				<Route path="game/new" element={<CreateGame />} />
				<Route path="debug/:gameId" element={<App />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
