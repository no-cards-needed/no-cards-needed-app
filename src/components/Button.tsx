import { getItem } from '../helpers/localStorageHelper';
import useSound from 'use-sound';

function Button( {
	label, 
	iconTailing,
	iconLeading,
	btn,
	size,
	type,
	drop,
	style,
	click
}: {
	label?: string, 
	iconTailing?: string,
	iconLeading?: string,
	btn: string,
	size: string,
	type: string,
	drop: string,
	style?: {},
	click?: () => void
} ) {

	const [play] = useSound(
		'/sounds/button-click.mp3',
		{
			volume: localStorage.getItem("stateSoundOn") === "false" ? 0.1 : 0
		});

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
		<div className={`${btn} ${size} ${type} noselect`} id={drop} style={style} onClick={() => {handleClick()}}>
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
		</div>
	);
	}   
export default Button