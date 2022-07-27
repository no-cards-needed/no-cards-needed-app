import React, { useState } from 'react';
import MenuHeader from "./MenuHeader.js"
import Counter from './Counter.js';
import Dropdown from "./Dropdown.js";
import Toggle from "./Toggle.js";
import PlayerCards from "./PlayerCards.js";

import chevronDown from '../assets/iconsBlack/chevron/down.svg';
import chevronUp from '../assets/iconsBlack/chevron/up.svg';
import share from '../assets/iconsWhite/share.svg';

function Menu() {
  
  const dropdownContent = [
    [24, " Cards, 9–Ace"],
    [32, " Cards, 7–Ace"],
    [36, " Cards, 6-Ace"],
    [52, " Cards, 2–Ace"],
  ]

  const [ active, setActive ] = useState(true)
  const [ displaySettings, setDisplaySettings ] = useState( 'none' )

  function toggleDisplay() {
    if (active) {   
        setActive(false) 
        setDisplaySettings( 'flex' )
    } else { 
      setActive(true) 
      setDisplaySettings( 'none' )

    }
  } 

  const [deckCards, setDeckCards] = useState(null)
  const [joker, setJoker] = useState(0)
  const [decks, setDecks] = useState(1)
  const [hand, setHand] = useState(5)

  const [split, setSplit] = useState(false)
  const [pile, setPile] = useState(false)

  const [totalCards, setTotalCards] = useState(null)
  const [cardsInDrawPile, setCardsInDrawPile] = useState(null)

  const selectedDeckSize = () => {
    setDeckCards((d) => d );
  };




    return (
     
  
      <div className="Menu" class="maxWidth" style={{display: "flex", flexDirection: "column", gap: "24px"}}>
        <MenuHeader />


        <div class="settingsContainer" style={{marginTop: "104px", gap: "32px"}} id="basicDrop">

          <label>Wating for players ...</label>

          <div class="labelItemGroup">
            <label>Players</label>
            <PlayerCards names={[ "Milla", "Kleo", "Klaus", "Kalle" ]} />
          </div>

          <div style={{display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "16px", width: "100%", maxWidth: "394px"}}>
              <div class="labelItemGroup">
                <label>access code</label>
                <div class="infoTag">
                  <label>H6H182DF</label>
                </div>
              </div>
              
              <div class="labelItemGroup">
                <label>share access</label>
                <div class="quadBtnSmall Primary small noselect" id="basicDrop">
                  <img src={share} class="iconContainer" alt=""></img>
                </div>
              </div>
            </div>

        </div>

        <div class="settingsContainer noselect" id="basicDrop">

          <div class="settingsLabel" onClick={toggleDisplay}>
            <text>Game Settings</text>
            <img src={active ? chevronDown : chevronUp} class="iconContainer" style={{margin: "16px", transform: "translateX(16px)", cursor: "pointer"}} alt=""></img>
          </div>

          <div class="settingsContent" style={{display:displaySettings, flexDirection: "column", flexWrap: "wrap"}}>

            

            <div style={{display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", width: "100%", maxWidth: "668px"}}>

              <div class="labelItemGroup" style={{width: "250px"}}>
                <label>cards per deck</label>
                <Dropdown options={dropdownContent} selection={selectedDeckSize}/>
              </div>

              <div style={{display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", width: "394px"}}>
                <div class="labelItemGroup" style={{maxWidth: "197px"}}>
                  <label>jokers per deck</label>
                  <Counter value={joker} />
                </div>
                <div class="labelItemGroup" style={{maxWidth: "197px"}}>
                  <label>number of decks</label>
                  <Counter value={decks} />
                </div>
              </div>
            </div>

            <div class="hairline"></div>

            <div style={{display: "flex", flexDirection: "row", alignItems: "flex-end", gap: "16px", flexWrap: "wrap"}}>
              <div class="labelItemGroup">
                <label>Hand Cards</label>
                <Counter value={5} />
              </div> 
            </div>

            <div class="labelItemGroupContainer">
              <text>Split All Cards Equally</text>
              <Toggle />
            </div>

            <div class="hairline"></div>

            <div class="labelItemGroupContainer">
              <text>Show Draw Pile</text>
              <Toggle />
            </div>

            <div class="hairline"></div>

            <div class="playerContainer">
              <div class="infoTag">
                <label>´cards in total´</label>
              </div>
              <div class="infoTag">
                <label>´cards on hand´</label>
              </div>
              <div class="infoTag">
                <label>´cards in draw pile´</label>
              </div>
            </div>


          </div>    

        </div> 

        <div class="btnBig Primary" id="basicDrop" >
          <headline>Start Game</headline>
        </div>

      </div>
    );
  }   

  export default Menu