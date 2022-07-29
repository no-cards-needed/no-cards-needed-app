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
            <div className="gameHeaderContent">
                <div className="avatarContainer">
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                </div>
                <label>{lastAction}</label>
            </div>
            <div className="btn Primary medium noselect" id="basicDrop" style={{width: "48px"}} onClick={toggleDisplay}>
              <img src={hamburger} alt=""></img>
            </div>
            <div className="hamburger noselect" id="basicDrop" style={{color: "#fff", display:display}}>
              <div className="hamburgerClose" style={{cursor: "pointer"}} onClick={toggleDisplay}>
              <img src={close} className="iconContainer" alt=""></img>
              </div>
              {/* <div className="hamburgerItem">
                <img src={settings} className="iconContainer"></img>
                <p>Settings</p>
              </div> */}
              <div className="hamburgerItem">
                <img src={showRemovedCards} className="iconContainer" alt=""></img>
                <p>Show Removed <br/> Cards</p>
              </div>
              {/* <div className="hamburgerItem">
                <img src={foldAllCards} className="iconContainer"></img>
                <p>Fold all Cards</p>
              </div> */}
              <div className="hamburgerItem" onClick={toggleModal}>
                <img src={leave} className="iconContainer" alt=""></img>
                <p>Leave Game</p>
              </div>
            </div>

        <div className="modalBackground" style={{display:displayModal, transform: "translateX(-28px)"}}>
          <div className="modal" id="basicDrop">
            <p style={{pAlign: "center", letterSpacing: "0.01em"}}>  Do You Really Want to <br/> Leave This Game? </p>
            <div className="buttonContainer">
              <div className="btn medium Secondary noselect" id="basicDrop" style={{width: "100%"}} onClick={toggleModal}>
                <p>No</p>
              </div>
              <div type="submit" className="btn medium Primary noselect" id="basicDrop" style={{width: "100%"}}>
                <p>Yes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default GameHeader