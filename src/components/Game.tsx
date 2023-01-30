import chevronRight from '../assets/iconsBlack/chevron/right.svg';
import chevronLeft from '../assets/iconsBlack/chevron/left.svg';
import chevronUp from '../assets/iconsWhite/chevron/up.svg';
import chevronDown from '../assets/iconsWhite/chevron/down.svg';
import showRemovedCards from '../assets/iconsWhite/showRemovedCards.svg';
import { useState } from 'react';

import GameHeader from "./GameHeader"


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
            <div style={{background: "#DEDBE5", position: "fixed"}}>
                <div className='backgroundElement'></div>
                <div className="playingArea criticalMaxWidth">
                    <div className="playingAreaColumn">
                        <div className="playingAreaRow">
                            <div className="cardDropZone">
                                <div className="pileSize">55</div>
                            </div>
                            <div className="cardDropZone"></div>
                        </div>
                        <div className="playingAreaRow">
                            <div className="cardContainer" id="dropSmall">
                                <div className="stackZone"></div>
                                <div className="spreadZone"></div>                               
                            </div>
                            <div className="cardDropZone"></div>
                        </div>
                    </div>
                </div>


                {/* <GameHeader /> */}
                <div className="gameHeaderUnderBox criticalMaxWidth">
                    <div className={ activeRemoved ? "removedCards" : "removedCards removedCardsUnder"}>
                        <div className="tricks">
                            <div className="btn Secondary medium noselect" id="basicDrop" style={{height: "112px"}}>
                                <img src={chevronLeft} className="iconContainer" alt=""></img>
                            </div>
                            <div className="cardContainer"></div>
                            <div className="btn Secondary medium noselect" id="basicDrop" style={{height: "112px"}}>
                                <img src={chevronRight} className="iconContainer" alt=""></img>
                            </div>
                        </div>
                    </div>
                    <div className="lashHeader" onClick={toggleDisplayRemoved}>
                        <img src={showRemovedCards} className="iconContainer" alt="" style={{marginBottom: "2px"}}></img>
                        <label style={{cursor: "pointer"}}>{lashTextRemoved}</label>
                        <img src={activeRemoved ? chevronUp : chevronDown} className="iconContainer" alt="" style={{marginBottom: "2px"}}></img>
                    </div>
                </div>

                <div className="underBox criticalMaxWidth">
                    <div className={ activeTricks ? "lashHand noselect" : "lashHand lashHandUnder noselect"} onClick={toggleDisplayTricks}>
                        <label style={{cursor: "pointer"}}>{lashTextTricks}</label>
                        <img src={activeTricks ? chevronDown : chevronUp} className="iconContainer" alt=""></img>
                    </div>
                    <div className={ activeTricks ? "handUnderlaying" : "handUnderlaying handUnderlayingUnder"}>
                        <div className="tricks">
                            <div className="btn Secondary medium noselect" id="basicDrop" style={{height: "112px"}}>
                                <img src={chevronLeft} className="iconContainer" alt=""></img>
                            </div>
                            <div className="cardContainer"></div>
                            <div className="btn Secondary medium noselect" id="basicDrop" style={{height: "112px"}}>
                                <img src={chevronRight} className="iconContainer" alt=""></img>
                            </div>
                        </div>
                    </div>
                </div>    
                <div className="hand criticalMaxWidth" id="basicDrop">
                    <div className="cardContainer"></div>
                </div>
            </div>
    );
  }   

  export default Game