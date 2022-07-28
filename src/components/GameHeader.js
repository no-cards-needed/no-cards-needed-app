import hamburger from '../assets/iconsWhite/hamburger.svg';
import close from '../assets/iconsWhite/close.svg';
import settings from '../assets/iconsWhite/settings.svg';
import showRemovedCards from '../assets/iconsWhite/showRemovedCards.svg';
import foldAllCards from '../assets/iconsWhite/foldAllCards.svg';
import leave from '../assets/iconsWhite/leave.svg';

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

  const [ displayModal, setDisplayModal ] = useState( 'none' )

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
      if ( display === 'none' ) {
          setDisplay( 'block' )
      } else {
          setDisplay( 'none' )
      }
  }

  function toggleModal() {
    if ( displayModal === 'none' ) {
        setDisplayModal( 'flex' )
    } else {
        setDisplayModal( 'none' )
    }
}

  
    return (
      <div className="gameHeader criticalMaxWidth" id="basicDrop">
            <div class="gameHeaderContent">
                <div class="avatarContainer">
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                </div>
                <label>{lastAction}</label>
            </div>
            <div class="btn Primary medium noselect" id="basicDrop" style={{width: "48px"}} onClick={toggleDisplay}>
              <img src={hamburger} alt=""></img>
            </div>
            <div class="hamburger noselect" id="basicDrop" style={{color: "#fff", display:display}}>
              <div class="hamburgerClose" style={{cursor: "pointer"}} onClick={toggleDisplay}>
              <img src={close} class="iconContainer" alt=""></img>
              </div>
              {/* <div class="hamburgerItem">
                <img src={settings} class="iconContainer"></img>
                <p>Settings</p>
              </div> */}
              <div class="hamburgerItem">
                <img src={showRemovedCards} class="iconContainer" alt=""></img>
                <p>Show Removed <br/> Cards</p>
              </div>
              {/* <div class="hamburgerItem">
                <img src={foldAllCards} class="iconContainer"></img>
                <p>Fold all Cards</p>
              </div> */}
              <div class="hamburgerItem" onClick={toggleModal}>
                <img src={leave} class="iconContainer" alt=""></img>
                <p>Leave Game</p>
              </div>
            </div>

        <div class="modalBackground" style={{display:displayModal, transform: "translateX(-28px)"}}>
          <div class="modal" id="basicDrop">
            <headline style={{pAlign: "center", letterSpacing: "0.01em"}}>  Do You Really Want to <br/> Leave This Game? </headline>
            <div class="buttonContainer">
              <div class="btn medium Secondary noselect" id="basicDrop" style={{width: "100%"}} onClick={toggleModal}>
                <p>No</p>
              </div>
              <div type="submit" class="btn medium Primary noselect" id="basicDrop" style={{width: "100%"}}>
                <p>Yes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default GameHeader