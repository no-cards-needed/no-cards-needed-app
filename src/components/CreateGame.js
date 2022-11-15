import React, { useState, useEffect } from 'react';

import MenuHeader from "./MenuHeader.js"
import Counter from './Counter.js';
import Dropdown from "./Dropdown.js";
import Toggle from "./Toggle.js";
import PlayerCards from "./PlayerCards.js";

import chevronDown from '../assets/iconsBlack/chevron/down.svg';
import chevronUp from '../assets/iconsBlack/chevron/up.svg';
import jokerIcon from '../assets/iconsBlack/joker.svg';
import cardIcon from '../assets/iconsBlack/card.svg';
import deckIcon from '../assets/iconsBlack/deck.svg';
import handIcon from '../assets/iconsBlack/hand.svg';
import share from '../assets/iconsWhite/share.svg';

function Menu( props ) {
  
  const {deckCards, setDeckCards, joker, setJoker, decks, setDecks, hand, setHand, pile, setPile, dropdownContent, players, startGame, setStartGame, gameId} = props

  const [ active, setActive ] = useState(true)
  const [ displaySettings, setDisplaySettings ] = useState( 'none' )
  const [ isHost, setIsHost ] = useState(true)

  function toggleDisplay() {
    if (active) {   
        setActive(false) 
        setDisplaySettings( 'flex' )
    } else { 
      setActive(true) 
      setDisplaySettings( 'none' )
    }
  } 

    const [split, setSplit] = useState(false)

    const [totalCards, setTotalCards] = useState(24)
    const [cardsInDrawPile, setCardsInDrawPile] = useState(19)
    const [maxValue, setMaxValue] = useState(totalCards / Object.values(players).length)

    const copy = async () => {
      await navigator.clipboard.writeText(gameId);
    }

    useEffect(() => {
      setTotalCards((deckCards[0] + joker) * decks)

      setCardsInDrawPile(totalCards - (Object.values(players).length * hand))

      if (split) setHand(totalCards / Object.values(players).length)

      totalCards % Object.values(players).length !== 0 ? setMaxValue(totalCards / Object.values(players).length - 1) : setMaxValue(totalCards / Object.values(players).length)

    }, [deckCards, totalCards, joker, decks, hand, players, split, pile])

    return (
     
  
      <div className="Menu maxWidth" style={{display: "flex", flexDirection: "column", gap: "24px"}}>
        <MenuHeader />

        <div className="settingsContainer" style={{marginTop: "104px", gap: "32px"}} id="basicDrop">

          <label>Wating for players ...</label>

          <div className="labelItemGroup">
            <label>Players</label>
            <PlayerCards names={players} />
          </div>

          <div style={{display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "16px", width: "100%", maxWidth: "394px"}}>
            <div className="labelItemGroup">
              <label>access code</label>
              <div className="infoTag" onClick={copy}>
                <label>{gameId}</label>
                {/* <label style={{display: }}>Copied to clipboard</label> */}
              </div>
            </div>
              
            <div className="labelItemGroup">
              <label>share access</label>
              <div className="quadBtnSmall Primary small noselect" id="basicDrop">
                <img onClick={copy} src={share} className="iconContainer" alt=""></img>
              </div>
            </div>
          </div>
        </div>

        <div className="settingsContainer noselect" id="basicDrop" style={{display: isHost ? 'flex' : 'none'}}>

          <div className="settingsLabel" onClick={toggleDisplay}>
            <p>Game Settings</p>
            <img src={active ? chevronDown : chevronUp} className="iconContainer" style={{margin: "16px", transform: "translateX(16px)", cursor: "pointer"}} alt=""></img>
          </div>

          <div className="settingsContent" style={{display:displaySettings, flexDirection: "column", flexWrap: "wrap"}}>


            <div style={{display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", width: "100%", maxWidth: "668px"}}>

              <div className="labelItemGroup" style={{width: "250px"}}>
                <div className="labelIconCombo">
                  <img src={cardIcon} className="iconContainer" alt=""></img>
                  <label>cards per deck</label>
                </div>
                <Dropdown options={dropdownContent} setSelection={setDeckCards} deckCards={deckCards}/>
              </div>

              <div style={{display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", width: "394px"}}>
                <div className="labelItemGroup" style={{maxWidth: "197px"}}>
                  <div className="labelIconCombo">
                    <img src={jokerIcon} className="iconContainer" alt=""></img>
                    <label>jokers per deck</label>
                  </div>
                  <Counter value={joker} setValue={setJoker} minValue={0} maxValue={10} disabled={false}/>
                </div>
                <div className="labelItemGroup" style={{maxWidth: "197px"}}>
                  <div className="labelIconCombo">
                    <img src={deckIcon} className="iconContainer" alt=""></img>
                    <label>number of decks</label>
                  </div>
                  <Counter value={decks} setValue={setDecks} minValue={1} maxValue={10} disabled={false}/>
                </div>
              </div>
            </div>

            <div className="hairline"></div>

            <div style={{display: "flex", flexDirection: "row", alignItems: "flex-end", gap: "16px", flexWrap: "wrap"}}>
              <div className="labelItemGroup">
                  <div className="labelIconCombo">
                      <img src={handIcon} className="iconContainer" alt=""></img>
                      <label>Hand Cards</label>
                  </div>
                <div style={{opacity: split ? "0.7" : "1" }}>
                  <Counter value={hand} setValue={setHand} minValue={0} maxValue={maxValue} disabled={split ? true : false} />
                </div>
              </div> 
            </div>

            <div className="labelItemGroupContainer">
              <p>Split All Cards Equally</p>
              <Toggle toggleOn={split} setToggleOn={setSplit}/>
            </div>

            <div className="hairline"></div>

            <div className="labelItemGroupContainer">
              <p>Show Draw Pile</p>
              <Toggle toggleOn={pile} setToggleOn={setPile}/>
            </div>

            <div className="hairline"></div>

            <div className="playerContainer">
              <div className="infoTag">
                <label>{totalCards} cards in total</label>
              </div>
              <div className="infoTag">
                <label>{hand} cards on hand</label>
              </div>
              <div className="infoTag" style={{display: pile ? "flex" : "none"}}>
                <label>{cardsInDrawPile} cards in draw pile</label>
              </div>
            </div>
          </div>    
        </div> 

        <div className="btnBig Primary" id="basicDrop" onClick={() => setStartGame(true)} style={{display: isHost ? 'flex' : 'none'}}>
          <div className="headline">Start Game</div>
        </div>

      </div>
    );
  }   

  export default Menu