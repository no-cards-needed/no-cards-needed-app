import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

import { cards } from "../helpers/Cards";


function Card({handleCardDrag, handleCardDrop, controlledPosition, zIndex, id, symbol, setRef}) {

	const nodeRef = useRef(null)
	const [transition, setTransition] = useState(false)

	const [deltaPosition, setDeltaPosition] = useState({x: 0, y: 0})
	
	const handleStart = () => {
		setRef(id, nodeRef)
	}

	const handleDrag = (e, ui) => {
		const {x, y} = deltaPosition
		setDeltaPosition(
			{
				x: x + ui.deltaX,
				y: y + ui.deltaY
			}
		)

		handleCardDrag(nodeRef, id)
	}
	
	const handleStop = (e) => {
		setDroppedTimer()
		handleCardDrop(nodeRef, id)
	}

	const [newControlledPosition, setNewControlledPosition] = useState({x: 0, y: 0})
	useEffect(() => {
		console.log("controlled position changed", controlledPosition)
		setDroppedTimer()
		setNewControlledPosition(controlledPosition)
	}, [controlledPosition])

	const timerRef = useRef(null)
	const transitionTime = 500

	const setDroppedTimer = () => {
		setTransition(true)
	  	timerRef.current = setTimeout(() => setTransition(false), transitionTime)
	}
	
	useEffect(() => {
	  return () => clearTimeout(timerRef.current);
	}, [])

	const getRandomCard = () => {
		const rand = Math.floor(Math.random() * cards.length)
		return (cards[rand].icon)
	}

	const [cardToDisplay, setCardToDisplay] = useState(getRandomCard());

	return (
		<Draggable
			nodeRef={nodeRef}
			defaultPosition={{x: 0, y: 0}}
			position={newControlledPosition}
			// position={{x: springyX, y: springyY}}
			// grid={[25, 25]}
			scale={1}
			onStart={handleStart}
			onDrag={handleDrag}
			onStop={handleStop}>

			<div ref={nodeRef} style={{position: 'absolute', top: 0, left: 0, zIndex}} className={transition ? "animation" : null}>
				{cardToDisplay}
			</div>
		</Draggable>

	);
}

export default Card;
