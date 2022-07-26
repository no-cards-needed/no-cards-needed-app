import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import './btn.css';
import './shdws.css';
import './typo.css';
import './assets.css';
import './header.css';
import './dropdown.css';
import './context.css';
import './hamburger.css';
import './toggle.css';
import './settings.css';
import './hand.css';
import './modal.css';

// Comment out the thing you are currently not working on

// Game Development
import App from './Game';
// Menu Development
// import App from './App';

import Dropdown from './components/Dropdown.js';

import StartScreen from "./components/startScreen.js"
import Menu from "./components/menu.js"
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
				<Route path="game/new" element={<Menu />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
