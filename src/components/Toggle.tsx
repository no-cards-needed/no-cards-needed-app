import useSound from 'use-sound';

function Toggle( {toggleOn, setToggleOn}: {toggleOn: boolean, setToggleOn: (newToggleState: boolean) => void} ) {
		function activate() {
			if (toggleOn) { 
				setToggleOn(false) 
			} else { 
				setToggleOn(true)
			}
		} 

		const [play] = useSound('/sounds/button-click.ogg');

		return (
			<div className="Toggle"> 
				<div className={toggleOn ? "toggleOn" : "toggleOff"} onClick={() => {activate(); play()}}>
					<div className={toggleOn ? "toggleCircleOn basicDrop" : "toggleCircleOff basicDrop"}></div>
				</div>
			</div>
		);
	}   
export default Toggle