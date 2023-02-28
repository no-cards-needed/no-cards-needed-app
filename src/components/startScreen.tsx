import Image from '../assets/no_cards_needed.svg';
import { useState} from 'react';
import {generateLobbyString} from "../helpers/words";
import Tutorial from "./TutorialModal"
import ModalEnter from "./ModalEnter"
import { Link } from "react-router-dom";
import { getItem } from '../helpers/localStorageHelper';
import Button from "./Button"

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
			<Button label={"Create Game"} btn={"btnBig"} size={""} type={"Primary"} click={() => setProcessCreate(true)} />
			<Button label={"Join Game"} btn={"btnBig"} size={""} type={"Secondary"} click={() => setProcessJoin(true)} />
			
			<div style={{padding: '0 16px', display: 'flex', flexDirection: 'row', gap: '16px'}}>
				<Button btn={"btn"} size={"small"} type={"Secondary"} style={{width: "100%"}}>
					<Link to='About' style={{color: 'var(--vg-100)', textDecoration: 'none', width: '100%', height: "100%"}}>
						<p>About</p>           
					</Link> 
				</Button>
				<Button btn={"btn"} size={"small"} type={"Secondary"} style={{width: "100%"}}>
					<Link to='Imprint' style={{color: 'var(--vg-100)', textDecoration: 'none', width: '100%', height: "100%"}}>
						<p>Imprint</p> 
					</Link> 
				</Button>
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