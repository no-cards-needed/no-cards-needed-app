import hamburger from './iconsWhite/hamburger.svg';
import close from './iconsWhite/close.svg';
import settings from './iconsWhite/settings.svg';
import showRemovedCards from './iconsWhite/showRemovedCards.svg';
import foldAllCards from './iconsWhite/foldAllCards.svg';
import leave from './iconsWhite/leave.svg';

import { useState } from 'react';


function GameHeader() {

  const [ display, setDisplay ] = useState( 'none' )
  const [ lastAction, setLastAction ] = useState( 'none' )

  const name = [
    "Mila",
    "Jako",
    "Sibylle",
  ]
  
  const cardNames = {
    color: ["Clubs", "Spades", "Hearts", "Diamonds", ""],
    number: ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Joker"]
}

  const actions = [
    "played",
    "removed a pile",
    "took a card",
    "took a trick",
    "shuffled a pile",
    "dealt all cards",
    "folded all cards",
  ]
  

  function toggleDisplay() {

    // setLastAction(`${name[0]} ${actions[0]} ${cardNames.number[2]} of ${cardNames.color[2]}`)

      if ( display == 'none' ) {

          setDisplay( 'block' )

      } else {

          setDisplay( 'none' )

      }

  }

    return (
      <div className="gameHeader" id="basicDrop">
            <div class="gameHeaderContent">
                <div class="avatarContainer">
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                </div>
                <label>{lastAction}</label>
            </div>
            <div class="btn Primary medium noselect" id="basicDrop" style={{width: "16px"}} onClick={toggleDisplay}>
              <img src={hamburger}></img>
            </div>
            <div class="hamburger noselect" id="basicDrop" style={{color: "#fff", display:display}}>
              <div class="hamburgerClose">
              <img src={close} class="iconContainer" onClick={toggleDisplay}></img>
              </div>
              <div class="hamburgerItem">
                <img src={settings} class="iconContainer"></img>
                <text>Settings</text>
              </div>
              <div class="hamburgerItem">
                <img src={showRemovedCards} class="iconContainer"></img>
                <text>Show Removed <br/> Cards</text>
              </div>
              <div class="hamburgerItem">
                <img src={foldAllCards} class="iconContainer"></img>
                <text>Fold all Cards</text>
              </div>
              <div class="hamburgerItem">
                <img src={leave} class="iconContainer"></img>
                <text>Leave Game</text>
              </div>
            </div>
      </div>
    );
  }

export default GameHeader