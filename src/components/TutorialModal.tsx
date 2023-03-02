import { useState, useEffect } from 'react';
import { setItem, getItem } from '../helpers/localStorageHelper';

import chevronLeft from '../assets/iconsBlack/chevron/left.svg';
import chevronRight from '../assets/iconsWhite/chevron/right.svg';
import Button from './Button';

type Props = {
	displayTutorial: boolean;
	setDisplayTutorial: (displayTutorial: boolean) => void;
	kind: string;
	wasSkipped: boolean;
	setWasSkipped: (wasSkipped: boolean) => void;
}

function Tutorial( { displayTutorial, setDisplayTutorial, kind, wasSkipped, setWasSkipped }: Props ) {
	const contentCreateGame = [
		{
			text: 'That’s the place where your friends appear.'
		},
		{
			text: 'Your friends will need this to join the game.'
		},
		{
			text: 'Here you can choose what kind of deck you want to use for your game.'
		},
		{
			text: 'How many Jokers do you want?'
		},
		{
			text: 'Do you need more than one deck to play your game?'
		},
		{
			text: 'You can turn this on, if everyone should get the same amount of cards.'
		},
		{
			text: 'Turn this on, if you want your game to have a drawing pile.'
		}
	]

	const contentGame = [
		{
			text: 'Here are your hand cards. You’r the only one who can see it.'
		},
		{
			text: 'You can drag your cards onto the play area. (shake, )'
		},
		{
			text: 'You can double tab to get more action possibilities.'
		},
		{
			text: 'Here you can see what your friends are doing.'
		},
		{
			text: 'All cards that are removed out of the game will appear here.'
		},
		{
			text: 'The tricks you take turn up here.'
		}
	]


	const [ contentInUse, setContentInUse ] = useState(contentCreateGame)

	const [ page, setPage ] = useState(0)
	
	function countDown() {
		if (page > 0) {
			setPage(page - 1) 
		}
	} 
	
	function countUp() {
		if (page < contentInUse.length - 1 ) {
			setPage(page + 1)
		} else {
			setDisplayTutorial(false)
			setPage(0)
		}
	} 

	// if (kind === 'contentCreateGame') {
	//     setContentInUse(contentCreateGame)
	// }

	// useEffect(() => {
	//     console.log(page)
	//   }, [page]);

	const skipTutorial = () => {
		setDisplayTutorial(false);
		setWasSkipped(true);
		setItem('wasSkipped', "true")
	}

	return (
		<div className="modalBackground" style={{display: displayTutorial ? 'flex' : 'none'}}>
				<div className="modal" id="basicDrop" style={{marginBottom: '64px', padding: '16px'}}>
					<Button label={"SKIP"} btn={"btn"} size={"medium"} type={"Secondary"} drop={"dropSmall"} style={{alignSelf: 'flex-end'}} click={() => {skipTutorial()}} />

					<div className="content-text-container">
						<div className="tutorial-content">

						</div>
						<div className="text-box">
							<div className="tut">
								{contentInUse[page].text}
							</div>
						</div>
					</div>
					<div className="page-bar">
						<Button btn={"btn"} iconLeading={chevronLeft} size={"medium"} type={"Secondary"} drop={"dropSmall"} style={{opacity: page === 0 ? '0' : '1'}} click={countDown} />

						<div className="infoTag">
						{contentInUse.map( (content, i) => (
							<div key={i} className="dot" style={{backgroundColor: i === page ? 'var(--vg-0)' : 'var(--vg-40)'}} onClick={() => setPage(i)}/>
						))}
						</div>
						<Button btn={"btn"} iconLeading={chevronRight} size={"medium"} type={"Primary"} drop={"dropSmall"} click={countUp} />
					</div>
				</div>
		</div>
	);
}

export default Tutorial

