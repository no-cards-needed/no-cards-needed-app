import Image from '../assets/no_cards_needed.svg';
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {generateLobbyString} from "../helpers/words";
import Tutorial from "./TutorialModal.js"


function StartScreen() {
  const [ displayModal, setDisplayModal ] = useState( 'none' )

  const [ displayName, setDisplayName ] = useState( 'none' )

  const [ displayKey, setDisplayKey ] = useState( 'none' )

  const [ processCreate, setProcessCreate ] = useState( false )
  const [ processJoin, setProcessJoin ] = useState( false )

  const [ displayTutorial, setDisplayTutorial ] = useState(true)

  function toggleCreate() { 
    setProcessCreate(true) 
    setDisplayModal( 'flex' )
    setDisplayName( 'flex' )
  } 

  function toggleJoin() {
    setProcessJoin(true) 
    setDisplayModal( 'flex' )
    setDisplayName( 'flex' )
  } 

  function discardName() {
    if (processCreate) {
      setProcessCreate(false) 
      setDisplayModal( 'none' )
      setDisplayName( 'none' )
    } else if (processJoin) {
      setDisplayModal( 'none' )
      setDisplayName( 'none' )
    }
  } 
  const [name, setName] = useState("")
  const [gameId, setGameId] = useState("")
  const navigate = useNavigate()

  function nextName() {
    console.log(name)
    if (processCreate) {
      setProcessCreate(false) 
      setDisplayModal( 'none' )
      setDisplayName( 'none' )
      navigate('/auth', {state: {name: name}})
    } else if (processJoin) {
      setDisplayKey( 'flex' )
      setDisplayName( 'none' )
    }
  } 

  function discardKey() {
    setDisplayKey( 'none' )
    setDisplayName( 'flex' )
  }

  function nextKey() {
    setProcessJoin(false) 
    setDisplayModal( 'none' )
    setDisplayKey( 'none' )
    navigate('/auth', {state: {name: name, gameId: gameId}})
  }

    return (
      <div className="maxWidth">
        <div className="startScreen noselect">
          <img style={{marginBottom: "10%", height: "35vh", marginTop: "10vh"}} src={Image} alt=""/>
          <div className="btnBig Primary" id="basicDrop" onClick={toggleCreate}>
            <div className="headline">Create Game</div>
          </div>
          <div className="btnBig Secondary" id="basicDrop" onClick={toggleJoin}>
            <div className="headline">Join Game </div>
          </div>
        </div>

        <Tutorial displayTutorial={displayTutorial} setDisplayTutorial={setDisplayTutorial} kind={'contentCreateGame'}/>


        <div className="modalBackground" style={{display:displayModal}}>
          <div className="modal" id="basicDrop" style={{display:displayName}}>
            <div className="headline"style={{textAlign: "center", letterSpacing: "0.01em"}}>  Choose your Nickname! </div>

            <input type="text" id="name" required minLength="3" maxLength="20" placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)} value={name}/>

            <div className="buttonContainer">
              <div className="btn medium Secondary noselect" id="basicDrop" style={{width: "100%"}} onClick={discardName}>
                <p>Discard</p>
              </div>
              <div className="btn medium Primary noselect" id="basicDrop" style={{width: "100%"}} onClick={() => name !== "" ? nextName() : null}>
                <p>Next</p>
              </div>
            </div>
          </div>

          <div className="modal" id="basicDrop" style={{display:displayKey}}>
            <div className="headline" style={{textAlign: "center", letterSpacing: "0.01em"}}>  Which Lobby do you <br />want to Join? </div>

            <input type="text" id="key" required minLength="3" maxLength="20" placeholder="Enter Access Code" onChange={(e) => setGameId(e.target.value)} value={gameId}/>

            <div className="buttonContainer">
              <div className="btn medium Secondary noselect" id="basicDrop" style={{width: "100%"}} onClick={discardKey}>
                <p>Back</p>
              </div>
              <div className="btn medium Primary noselect" id="basicDrop" style={{width: "100%"}} onClick={() => gameId !== "" ? nextKey() : null}>
                <p>Next</p>
              </div>
            </div>
          </div>
        </div>
    </div>
    );
  }

export default StartScreen