import Image from '../assets/no_cards_needed.svg';
import { useState} from 'react';
import {generateLobbyString} from "../helpers/words";
import Tutorial from "./TutorialModal"
import ModalEnter from "./ModalEnter"
import { Link, useNavigate } from "react-router-dom";
import { getItem } from '../helpers/localStorageHelper';
import Button from "./Button"

function StartScreen() {
const [ processCreate, setProcessCreate ] = useState( false )
const [ processJoin, setProcessJoin ] = useState( false )

const [ displayTutorial, setDisplayTutorial ] = useState(true)

const [ wasSkipped, setWasSkipped ] = useState(getItem("wasSkipped") === "true" ? true : false)

const [gameId, setGameId] = useState("")

const navigate = useNavigate()

	return (
	<div className="maxWidth">
		<div className="startScreen noselect">
			<img style={{marginBottom: "10%", height: "35vh", marginTop: "10vh"}} src={Image} alt=""/>
			<Button label={"Create Game"} btn={"btnBig"} size={""} type={"Primary"} drop={"basicDrop"} click={() => setProcessCreate(true)} />
			<Button label={"Join Game"} btn={"btnBig"} size={""} type={"Secondary"} drop={"basicDrop"} click={() => setProcessJoin(true)} />
			
			<div style={{padding: '0 16px', display: 'flex', flexDirection: 'row', gap: '16px', justifyContent: 'center'}}>
				{/* <Button label={"About"} btn={"btn"} size={"small"} type={"Secondary"} drop={"dropSmall"} style={{width: "100%"}} click={() => {navigate('/about')}} /> */}
				<p style={{margin: '16px', fontWeight: '400', cursor: 'pointer'}} onClick={() => {navigate('/about')}}>About</p>
				<p style={{margin: '16px', fontWeight: '400', cursor: 'pointer'}} onClick={() => {navigate('/imprint')}}>Imprint</p>
				{/* <Button label={"Imprint"} btn={"btn"} size={"small"} type={"Secondary"} drop={"dropSmall"} style={{width: "100%"}} click={() => {navigate('/imprint')}} /> */}
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