import Image from '../assets/no_cards_needed.svg';
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {generateLobbyString} from "../helpers/words";


function StartScreen() {
  const [ displayModal, setDisplayModal ] = useState( 'none' )

  const [ displayName, setDisplayName ] = useState( 'none' )

  const [ displayKey, setDisplayKey ] = useState( 'none' )

  const [ processCreate, setProcessCreate ] = useState( false )
  const [ processJoin, setProcessJoin ] = useState( false )

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

  const navigate = useNavigate()
  function nextName() {
    navigate('/debug/'+generateLobbyString())
    if (processCreate) {
      setProcessCreate(false) 
      setDisplayModal( 'none' )
      setDisplayName( 'none' )
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
  }
  const [name, setName] = useState("")
    return (
      <div>
        <div className="startScreen noselect">
          <img style={{marginBottom: "10%", height: "35vh", marginTop: "10vh"}} src={Image} />
          <div class="btnBig Primary" id="basicDrop" onClick={toggleCreate}>
            <headline>Create Game</headline>
          </div>
          <div class="btnBig Secondary" id="basicDrop" onClick={toggleJoin}>
            <headline>Join Game </headline>
          </div>
        </div>

        


        <div class="modalBackground" style={{display:displayModal}}>
          <div class="modal" id="basicDrop" style={{display:displayName}}>
            <headline style={{textAlign: "center", letterSpacing: "0.01em"}}>  Choose your Nickname! </headline>

            <input type="text" id="name" required minlength="3" maxlength="20" placeholder="Enter Your Name" onChange={(e) => setName(e.value)} value={name}/>

            <div class="buttonContainer">
              <div class="btn medium Secondary noselect" id="basicDrop" style={{width: "100%"}} onClick={discardName}>
                <text>Discard</text>
              </div>
              <div type="submit" class="btn medium Primary noselect" id="basicDrop" style={{width: "100%"}} onClick={() => name !== "" ? nextName() : null}>
                <text>Next</text>
              </div>
            </div>
          </div>

          <div class="modal" id="basicDrop" style={{display:displayKey}}>
            <headline style={{textAlign: "center", letterSpacing: "0.01em"}}>  Which Lobby do you <br />want to Join? </headline>

            <input type="text" id="key" required minlength="3" maxlength="20" placeholder="Enter Access Code" />

            <div class="buttonContainer">
              <div class="btn medium Secondary noselect" id="basicDrop" style={{width: "100%"}} onClick={discardKey}>
                <text>Back</text>
              </div>
              <div type="submit" class="btn medium Primary noselect" id="basicDrop" style={{width: "100%"}} onClick={nextKey}>
                <text>Next</text>
              </div>
            </div>
          </div>
        </div>
    </div>
    );
  }

export default StartScreen