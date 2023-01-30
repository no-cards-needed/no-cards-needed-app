import { useEffect, useRef, useState } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';

function ModaleEnter( {
  setDisplayModal,
  displayName, 
  setDisplayName,
  processCreate,
  setProcessCreate,
  processJoin,
  setProcessJoin,
  name,
  setName, 
  setDisplayKey,
  displayKey,
  gameId,
  setGameId
} : {
  setDisplayModal: (displayModal: boolean) => void, 
  displayName: string, 
  setDisplayName: (displayName: string) => void, 
  processCreate: boolean,
  setProcessCreate: (processCreate: boolean) => void,
  processJoin: boolean,
  setProcessJoin: (processJoin: boolean) => void,
  name: string,
  setName: (newName: string) => void, 
  displayKey: string,
  setDisplayKey: (displayKey: string) => void,
  gameId: string,
  setGameId: (newID: string) => void,
  
  
  } ) {

    const navigate = useNavigate()

    function discardName() {
      if (processCreate) {
        setProcessCreate(false) 
        setDisplayModal( false )
        setDisplayName( 'none' )
      } else if (processJoin) {
        setDisplayModal( false )
        setDisplayName( 'none' )
      }
    } 
  
    function nextName() {
      console.log(name)
      if (processCreate) {
        setProcessCreate(false) 
        setDisplayModal( false )
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
  
    function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'Enter'){
        nextKey()
      }
        else {
      }
    }
  
    function nextKey() {
      setProcessJoin(false) 
      setDisplayModal( false )
      setDisplayKey( 'none' )
      navigate('/auth', {state: {name: name, gameId: gameId}})
    }

    const inputElement = useRef(null)

    useEffect(() => {
      console.log("should focus now")
      const timeout = setTimeout(() => {
        inputElement.current.focus()
        clearTimeout(timeout)
      }, 1)
    }, [])

    return (
      <div className="modalBackground">
      <div className="modal" id="basicDrop" style={{display:displayName}}>
        <div className="headline"style={{textAlign: "center", letterSpacing: "0.01em"}}>  Choose your Nickname! </div>

        <input ref={inputElement} type="text" id="name" required minLength={3} maxLength={20} placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)} value={name} onKeyDown={(e) => name !== "" ? handleKey(e) : null }/>

        <div className="buttonContainer">
          <div className="btn medium Secondary noselect" id="basicDrop" style={{width: "100%"}} onClick={discardName}>
            <p>Discard</p>
          </div>
          <div className="btn medium Primary noselect" id="basicDrop" style={{width: "100%"}} onClick={() => name !== "" ? nextName() : null }>
            <p>Next</p>
          </div>
        </div>
      </div>

      <div className="modal" id="basicDrop" style={{display:displayKey}}>
        <div className="headline" style={{textAlign: "center", letterSpacing: "0.01em"}}>  Which Lobby do you <br />want to Join? </div>

        <input type="text" id="key" required minLength={3} maxLength={20} placeholder="Enter Access Code" onChange={(e) => setGameId(e.target.value)} value={gameId}/>

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
    );
  }   

  export default ModaleEnter