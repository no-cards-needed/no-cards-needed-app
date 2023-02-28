import useSound from 'use-sound';

function Button( {
	label, 
	iconTailing,
	iconLeading,
	btn,
	size,
	type,
	style,
	click,
	children
}: {
	label?: string, 
	iconTailing?: string,
	iconLeading?: string,
	btn: string,
	size: string,
	type: string,
	style?: {},
	click?: () => void,
	children?: string | JSX.Element | JSX.Element[]

} ) {

	const [play] = useSound('/sounds/button-click.ogg');

	const handleClick = () => {
		if(typeof(click) === "function") {
			click()
			play()
		}
		if(typeof(play) === "function") {
			play()
		}		
	}

	return (
		<div className={`${btn} ${size} ${type} noselect`} id="basicDrop" style={style} onClick={() => {handleClick()}}>
			{
			iconLeading ? <img src={iconLeading} className="iconContainer" alt=""></img> : null
			}
			{
			label && btn !== "btnBig" ? <p>{label}</p> : null
			}
			{
			label && btn === "btnBig" ? <div className="headline">{label}</div> : null
			}
			{
			iconTailing ? <img src={iconTailing} className="iconContainer" alt=""></img> : null
			}
			{children}
		</div>
	);
	}   
export default Button