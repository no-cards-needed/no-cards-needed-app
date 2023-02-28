import Image from '../assets/no_cards_needed.svg';
import { useState} from 'react';
import {generateLobbyString} from "../helpers/words";
import Tutorial from "./TutorialModal"
import ModalEnter from "./ModalEnter"
import { Link } from "react-router-dom";
import { getItem } from '../helpers/localStorageHelper';

function StartScreen() {
  const [ processCreate, setProcessCreate ] = useState( false )
  const [ processJoin, setProcessJoin ] = useState( false )

  const [ displayTutorial, setDisplayTutorial ] = useState(true)

  const [ wasSkipped, setWasSkipped ] = useState(getItem("wasSkipped") === "true" ? true : false)
 
  const [gameId, setGameId] = useState("")


    return (
      <div className="maxWidth">
        <div className="startScreen noselect">
          <img style={{marginBottom: "10%", height: "35vh", marginTop: "10vh"}} src={Image} alt=""/>
          <div className="btnBig Primary" id="basicDrop" onClick={() => setProcessCreate(true)}>
            <div className="headline">Create Game</div>
          </div>
          <div className="btnBig Secondary" id="basicDrop" onClick={() => setProcessJoin(true)}>
            <div className="headline">Join Game </div>
          </div>
          <div style={{padding: '0 16px', display: 'flex', flexDirection: 'row', gap: '16px'}}>
            <div className="btn small Secondary" id="basicDrop" style={{width: '100%'}}>
              <Link to='About' style={{color: 'var(--vg-100)', textDecoration: 'none'}}>
                <p>About</p>           
              </Link>
            </div>
            <div className="btn small Secondary" id="basicDrop" style={{width: '100%'}}>
              <Link to='Imprint' style={{color: 'var(--vg-100)', textDecoration: 'none'}}>
                <p>Imprint</p> 
              </Link>          
            </div>
          </div>
        </div>

        <Tutorial displayTutorial={!wasSkipped ? displayTutorial : false} setDisplayTutorial={setDisplayTutorial} kind={'contentCreateGame'} wasSkipped={wasSkipped} setWasSkipped={setWasSkipped}/>


        {
          processJoin || processCreate ? <ModalEnter 
          processCreate={processCreate}
          setProcessCreate={setProcessCreate}
          processJoin={processJoin}
          setProcessJoin={setProcessJoin}
          gameId={gameId}
          setGameId={setGameId}
        /> : null
        }
        
      </div>
    );
  }

export default StartScreen