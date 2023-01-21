function Toggle( {toggleOn, setToggleOn}: {toggleOn: boolean, setToggleOn: (newToggleState: boolean) => void} ) {
		function activate() {
			if (toggleOn) { 
					setToggleOn(false) 
			} else { 
				setToggleOn(true)
			}
		} 

		return (
			<div className="Toggle"> 
				<div className={toggleOn ? "toggleOn" : "toggleOff"} onClick={activate}>
						<div className={toggleOn ? "toggleCircleOn basicDrop" : "toggleCircleOff basicDrop"}></div>
				</div>
			</div>
		);
	}   
export default Toggle