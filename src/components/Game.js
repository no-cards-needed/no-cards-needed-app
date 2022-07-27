import chevronRight from '../assets/iconsBlack/chevron/right.svg';
import chevronLeft from '../assets/iconsBlack/chevron/left.svg';
import chevronUp from '../assets/iconsWhite/chevron/up.svg';
import chevronDown from '../assets/iconsWhite/chevron/down.svg';
import showRemovedCards from '../assets/iconsWhite/showRemovedCards.svg';
import React, { useState } from 'react';

import GameHeader from "./GameHeader.js"


function Game() {
    
    const [ lashTextTricks, setLashTextTricks ] = useState( 'Show Tricks' )
    const [ lashTextRemoved, setLashTextRemoved ] = useState( 'Show Removed Cards' )

    const [ activeTricks, setActiveTricks ] = useState( false )

    const [ activeRemoved, setActiveRemoved ] = useState( false )

    function toggleDisplayTricks() {
        if (activeTricks) {   
            setActiveTricks(false) 
            setLashTextTricks('Show Tricks')
        } else { 
          setActiveTricks(true) 
          setLashTextTricks('Hide Tricks')

          setActiveRemoved(false) 
          setLashTextRemoved('Show Removed Cards')
        }
      } 

      function toggleDisplayRemoved() {
        if (activeRemoved) {   
            setActiveRemoved(false) 
            setLashTextRemoved('Show Removed Cards')
        } else { 
          setActiveRemoved(true) 
          setLashTextRemoved('Hide Removed Cards')

          setActiveTricks(false) 
          setLashTextTricks('Show Tricks')
        }
      } 
    
    return (
        <div className="Game" class="maxWidth">

            <GameHeader />
            <div class="gameHeaderUnderBox">
                <div class={ activeRemoved ? "removedCards" : "removedCards removedCardsUnder"}>
                    <div class="tricks">
                        <div class="btn Secondary medium noselect" id="basicDrop" style={{height: "112px"}}>
                            <img src={chevronLeft} class="iconContainer" alt=""></img>
                        </div>
                        <div class="cardContainer"></div>
                        <div class="btn Secondary medium noselect" id="basicDrop" style={{height: "112px"}}>
                            <img src={chevronRight} class="iconContainer" alt=""></img>
                        </div>
                    </div>
                </div>
                <div class="lashHeader" onClick={toggleDisplayRemoved}>
                    <img src={showRemovedCards} class="iconContainer" alt="" style={{marginBottom: "2px"}}></img>
                    <label style={{cursor: "pointer"}}>{lashTextRemoved}</label>
                    <img src={activeRemoved ? chevronUp : chevronDown} class="iconContainer" alt="" style={{marginBottom: "2px"}}></img>
                </div>
            </div>

            <div class="underBox">
                <div class={ activeTricks ? "lashHand noselect" : "lashHand lashHandUnder noselect"} onClick={toggleDisplayTricks}>
                    <label style={{cursor: "pointer"}}>{lashTextTricks}</label>
                    <img src={activeTricks ? chevronDown : chevronUp} class="iconContainer" alt=""></img>
                </div>
                <div class={ activeTricks ? "handUnderlaying" : "handUnderlaying handUnderlayingUnder"}>
                    <div class="tricks">
                        <div class="btn Secondary medium noselect" id="basicDrop" style={{height: "112px"}}>
                            <img src={chevronLeft} class="iconContainer" alt=""></img>
                        </div>
                        <div class="cardContainer"></div>
                        <div class="btn Secondary medium noselect" id="basicDrop" style={{height: "112px"}}>
                            <img src={chevronRight} class="iconContainer" alt=""></img>
                        </div>
                    </div>
                </div>
            </div>    
            <div class="hand" id="basicDrop">
                <div class="cardContainer"></div>
            </div>
        </div>
    );
  }   

  export default Game