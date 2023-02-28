import { useEffect, useRef, useState } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { setItem, getItem } from '../helpers/localStorageHelper';

function ModaleEnter( {
	processCreate,
	setProcessCreate,
	processJoin,
	setProcessJoin,
	gameId,
	setGameId,
	setLoading,
	setName
	} : {
	processCreate: boolean,
	setProcessCreate: (processCreate: boolean) => void,
	processJoin: boolean,
	setProcessJoin: (processJoin: boolean) => void,
	gameId: string,
	setGameId: (newID: string) => void,
	setLoading?: (loading: boolean) => void,
	setName?: (name: string) => void

} ) {

	const navigate = useNavigate()
	const [localName, setLocalName] = useState(localStorage.getItem("name"))

	const [ displayName, setDisplayName ] = useState( true )
	const [ displayKey, setDisplayKey ] = useState( false )

	function discardName() {
		if (processCreate) {
			setProcessCreate(false) 
			setDisplayName(false)
			setDisplayName( true )
		} else if (processJoin) {
			setDisplayName(false)
			setProcessJoin(false) 
		}
	} 

	function nextName() {
		if (processCreate) {
				setProcessCreate(false) 
				setDisplayName( false )
				if(typeof(setLoading) === "function") {
					setName(localName)
					setLoading(false)
				} else {
					navigate('/auth', {state: {name: localName}})
				}
				console.log('start game')
		} else if (processJoin) {
			setDisplayKey( true )
			setDisplayName( false )
		}
	} 

	function discardKey() {
		setDisplayKey( false )
		setDisplayName( true )
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
		setDisplayKey( false )
		navigate('/auth', {state: {name: localName, gameId: gameId}})
	}

	const inputElement = useRef(null)


	useEffect(() => {
		const timeout = setTimeout(() => {
			inputElement.current.focus()
			clearTimeout(timeout)
		}, 1)
	}, [])

	return (
	<div className="modalBackground">
		{ displayName ? <div className="modal" id="basicDrop" style={{display: 'flex'}}>
		<div className="headline"style={{textAlign: "center", letterSpacing: "0.01em"}}>  Choose your Nickname! </div>

		<input ref={inputElement} type="text" id="name" required minLength={3} maxLength={20} placeholder="Enter Your Name" onChange={(e) => {setItem('name', `${e.target.value}`); setLocalName(e.target.value)}} value={localName} onKeyDown={(e) => localName !== "" ? handleKey(e) : null }/>

		<div className="buttonContainer">
			<div className="btn medium Secondary noselect" id="basicDrop" style={{width: "100%"}} onClick={discardName}>
			<p>Discard</p>
			</div>
			<div className="btn medium Primary noselect" id="basicDrop" style={{width: "100%"}} onClick={() => localName !== "" ? nextName() : null}>
			<p>Next</p>
			</div>
		</div>
		</div> : null }


		{ displayKey ? <div className="modal" id="basicDrop" style={{display: 'flex'}}>
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
		</div>  : null }

	</div>
	);
}   

export default ModaleEnter