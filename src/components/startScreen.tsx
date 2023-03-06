import Image from '../assets/no_cards_needed.svg';
import { useState} from 'react';
import {generateLobbyString} from "../helpers/words";
import Tutorial from "./TutorialModal"
import ModalEnter from "./ModalEnter"
import { useNavigate } from "react-router-dom";
import { setItem, getItem } from '../helpers/localStorageHelper';
import Button from "./Button"
import soundOn from '../assets/iconsWhite/soundOn.svg';
import soundOff from '../assets/iconsWhite/soundOff.svg';


function StartScreen() {
const [ processCreate, setProcessCreate ] = useState( false )
const [ processJoin, setProcessJoin ] = useState( false )

const [ displayTutorial, setDisplayTutorial ] = useState(true)

const [ wasSkipped, setWasSkipped ] = useState(getItem("wasSkipped") === "true" ? true : false)

const [gameId, setGameId] = useState("")

const navigate = useNavigate()

const [ stateSoundOn, setStateSoundOn ] = useState(true)

function toggleSound() {
	setStateSoundOn(!stateSoundOn)
	setItem('stateSoundOn', `${stateSoundOn}`)
} 


	return (
	<div className="maxWidth">
		<div className="startScreen noselect">
			<Button iconLeading={stateSoundOn ? soundOn : soundOff} btn={"btn"} size={"medium"} type={"Primary"} drop={"dropSmall"} style={{position: "absolute", top: "28.5px", right: "28.5px", width: "48px"}} click={toggleSound} />
			<img style={{marginBottom: "10%", height: "35vh", marginTop: "10vh"}} src={Image} alt=""/>
			<Button label={"Create Game"} btn={"btnBig"} size={""} type={"Primary"} drop={"basicDrop"} click={() => setProcessCreate(true)} />
			<Button label={"Join Game"} btn={"btnBig"} size={""} type={"Secondary"} drop={"basicDrop"} click={() => setProcessJoin(true)} />
			
			<div style={{padding: '0 16px', display: 'flex', flexDirection: 'row', gap: '16px', justifyContent: 'center'}}>
				<p style={{margin: '16px', fontWeight: '400', cursor: 'pointer'}} onClick={() => {navigate('/about')}}>About</p>
				<p style={{margin: '16px', fontWeight: '400', cursor: 'pointer'}} onClick={() => {navigate('/imprint')}}>Imprint</p>
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