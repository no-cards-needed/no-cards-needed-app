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
    [24, " Cards, Ace—9"],
    [32, " Cards, Ace—7"],
    [36, " Cards, Ace—6"],
    [52, " Cards, Ace—2"],
  ]

  const [ active, setActive ] = useState(true)
  const [ displaySettings, setDisplaySettings ] = useState( 'flex' )

  const [ buttonLabel, setButtonLabel ] = useState('Create Lobby')

  const [ lobby, setLobby] = useState(false)
  const [ displayLobby, setDisplayLobby ] = useState( 'none' )

  const [ totalCards, setTotalCards ] = useState(null)

  function toggleDisplay() {
    if (active) {   
        setActive(false) 
        setDisplaySettings( 'none' )

    } else { 
      setActive(true) 
      setDisplaySettings( 'flex' )

    }
  } 

  function createLobby() {
    if (lobby === false) {   
      setLobby(true) 
      setDisplayLobby( 'flex' )
      setButtonLabel('Start Game')
      setActive(false) 
      setDisplaySettings( 'none' )

    }
  }

    return (
     
  
      <div className="Menu" style={{display: "flex", flexDirection: "column", gap: "24px"}}>
        <MenuHeader />

        <div class="settingsContainer noselect" style={{marginTop: "96px"}} id="basicDrop">

          <div class="settingsLabel" onClick={toggleDisplay}>
            <text>Game Settings</text>
            <img src={active ? chevronUp : chevronDown} class="iconContainer" style={{margin: "16px", transform: "translateX(16px)", cursor: "pointer"}} alt=""></img>
          </div>

          <div class="settingsContent" style={{display:displaySettings}}>

            <div class="labelItemGroup">
              <label>cards per deck</label>
              <Dropdown options={dropdownContent}/>
            </div>

            <div style={{display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "16px", flexWrap: "wrap"}}>
              <div class="labelItemGroup">
                <label>jokers per deck</label>
                <Counter value={0} />
              </div>
              <div class="labelItemGroup">
                <label>number of decks</label>
                <Counter value={0} />
              </div>
            </div>

            <div class="infoTag">
              <label>´totalCards cards in total´</label>
            </div>

            <div class="hairline"></div>

              <div style={{display: "flex", flexDirection: "row", alignItems: "flex-end", gap: "16px", flexWrap: "wrap"}}>
                <div class="labelItemGroup">
                  <label>Cards on hand</label>
                  <Counter value={5} />
                </div> 
                <div class="btn medium Primary" id="basicDrop">
                  <text>Split Cards Equaliy</text>
                </div>
              </div>

              <div class="hairline"></div>

              <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: "8px 0px", alignSelf: "stretch"}}>
                <text>Show Draw Pile</text>
                <Toggle />
              </div>

          </div>    

        </div>

        <div class="settingsContainer" style={{gap: "32px", display:displayLobby}} id="basicDrop">

          <label>Wating for players ...</label>

          <div class="labelItemGroup">
            <label>Players</label>
            <PlayerCards names={[ "Milla", "Kleo", "Klaus", "Kalle" ]} />
          </div>

          <div style={{display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "16px"}}>
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

        <div class="btnBig Primary" id="basicDrop" onClick={createLobby}>
          <headline>{buttonLabel}</headline>
        </div>
      </div>
    );
  }   

  export default Menu