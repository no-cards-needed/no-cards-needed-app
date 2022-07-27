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


import Dropdown from './components/Dropdown.js';

import StartScreen from "./components/startScreen.js"
import Menu from "./components/CreateGame.js"
import Game from "./components/Game.js"
import MenuHeader from "./components/MenuHeader.js"
import ContextMenu from "./components/ContextMenu.js"




function App() {
  return (
    <>
      {/* <GameHeader /> */}
      {/* <StartScreen /> */}
      
      <Menu />
      {/* <Game /> */}
      {/* <ContextMenu /> */}
      </>
  )
}
export default App;