import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

import { cards } from "../helpers/Cards";


function Card({handleCardDrag, handleCardDrop, card, setRef}) {

	const {id, symbol, zIndex, controlledPosition, onStackType} = card;
	// console.log(card)

	const nodeRef = useRef(null)
	const [transition, setTransition] = useState(false)

	const [deltaPosition, setDeltaPosition] = useState({x: 0, y: 0})
	
	// Move card aside when card.movedAside is left or right

	const [temporalPosition, setTemporalPosition] = useState({x: 0, y: 0})
	useEffect(() => {
		const moveAmount =  nodeRef.current.getBoundingClientRect().width / 2
		if (card.movedAside === "left") {
			setTemporalPosition({
				x: moveAmount,
				y: 0
			})
		} else if (card.movedAside === "right") {
			setTemporalPosition({
				x: - moveAmount,
				y: 0
			})
		} else {
			setTemporalPosition({x: 0, y: 0})
		}
	}, [card.movedAside])

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

	// Animate controlled position

	const [newControlledPosition, setNewControlledPosition] = useState({x: 0, y: 0})
	useEffect(() => {
		setDroppedTimer()
		setNewControlledPosition({
			x: controlledPosition.x + temporalPosition.x,
			y: controlledPosition.y + temporalPosition.y
		})
	}, [controlledPosition, temporalPosition])

	// Setting a Timer to remove "animate" class

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

	const [color, setColor] = useState(Math.floor(Math.random() * 100))

	const [touched, setTouched] = useState(false);

	const touchStart = () => {
		console.log("touched")
		setTouched(true)
	}

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
			onStop={handleStop}
			>
			<div 
				ref={nodeRef} 
				// TODO: When moving on from debug, delete absolute dimensions
				style={{position: 'absolute', top: 0, left: 0, zIndex, height: 150, width: 107, transform: onStackType === "stack" ? "rotate(5deg)" : "scale(5)", background: `rgb(${color}, ${color}, ${color})`}} 
				className={transition ? "animation" : null}
				onTouchStart={touchStart}
				// onClick={touchStart}
				>
				{/* {cardToDisplay} */}
				{card.movedAside}
				{temporalPosition.x}
				{temporalPosition.y}
			</div>
		</Draggable>

	);
}

export default Card;
