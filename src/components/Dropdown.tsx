import { useState } from 'react';
import chevronDown from '../assets/iconsWhite/chevron/down.svg';
import chevronUp from '../assets/iconsWhite/chevron/up.svg';

import useSound from 'use-sound';


function Dropdown( {options, setSelection, deckCards}: {options: any[], setSelection: any, deckCards: any} ) {

	const [ display, setDisplay ] = useState( 'none' )
	const [ active, setActive ] = useState( false )

	function toggleDisplay() {
		if (active) {   
			setActive(false) 
			setDisplay( 'none' )
		} else { 
			setActive(true) 
			setDisplay( 'flex' )
	
		}
	} 

	const [play] = useSound('/sounds/button-click.ogg');

	return (    
		<div className="Dropdown">
			<div className="dropdown" id="dropSmall" style={{borderBottomRightRadius: active ? "0px" : "12px", borderBottomLeftRadius: active ? "0px" : "12px",}}>
				<div className="dropdownHead" onClick={() => {toggleDisplay(); play()}}>
					<p>{deckCards.text}</p>
					<img src={active ? chevronUp : chevronDown} alt=""></img>
				</div>

				<div className="dropdownUnfolded" style={{display:display}}>
					{options.map((option, index) => (
						<div className="dropdownItem" key={index} onClick={ () => { setSelection(option); toggleDisplay() }}>
							<p>{option.text}</p>
						</div>
					))}

				</div>
			</div>
			
		</div>
	)

}

export default Dropdown