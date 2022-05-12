import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

import { useSpring, animated } from 'react-spring'

import { cards } from "../helpers/Cards";


function Card({handleCardDrag, handleCardDrop, controlledPosition, zIndex, id, symbol}) {

	const nodeRef = useRef(null)

	// const [activeDrags, setActiceDrags] = useState(0)
	const [deltaPosition, setDeltaPosition] = useState({x: 0, y: 0})
	// const [controlledPosition, setControlledPosition] = useState({x: 0, y: 0})
	
	const handleStart = () => {
	
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

		handleCardDrop(nodeRef, id)
		// if(colliding) {

		// 	const stackPosition = stack.stack
		// 	console.log(handOffset(stack.stackCardAmount, stack.stackCardAmount))
		// 	const offset = stack.stackType === "stack" ? 0 : handOffset(stack.stackCardAmount, 1)

		// 	setControlledPosition(
		// 		{
		// 			x: stackPosition.left + stackPosition.width / 2 - nodeRef.current.clientWidth / 2 + offset, 
		// 			y: stackPosition.top + stackPosition.height / 2 - nodeRef.current.clientHeight / 2
		// 		}
		// 	)
		// }
	}

	const handCardDistance = 50
	const handOffset = (amount, i) => (handCardDistance * amount) * -1 + handCardDistance * i

	
	// useEffect(() => {
	// 	// Card gets loaded
	// 	const handPosition = hand.handRef.current.getBoundingClientRect()

	// 	console.log(handOffset(hand.handCardAmount, hand.i))
	// 	const cardX = handPosition.left + handPosition.width / 2 - nodeRef.current.clientWidth / 2 + handOffset(hand.handCardAmount, hand.i)
	// 	const cardY = handPosition.top + handPosition.height / 2 - nodeRef.current.clientHeight / 2

	// 	setControlledPosition({x: cardX, y: cardY})
	
	//   return () => {
	// 	// Card gets unloaded
	//   }
	// }, [])
	
	const getRandomCard = () => {
		const rand = Math.floor(Math.random() * cards.length)
		return (cards[rand].icon)
	}

	const [cardToDisplay, setCardToDisplay] = useState(getRandomCard());
	// useEffect(() => {
	// 	// Card gets loaded
	// 	cardToDisplay = getRandomCard()
	// }, [])


	const {springyX, springyY} = useSpring(() => ({springyX: controlledPosition, springyY: controlledPosition}))

	return (
		<Draggable
			nodeRef={nodeRef}
			defaultPosition={{x: 0, y: 0}}
			position={controlledPosition}
			// position={{x: springyX, y: springyY}}
			// grid={[25, 25]}
			scale={1}
			onStart={handleStart}
			onDrag={handleDrag}
			onStop={handleStop}>

			<div ref={nodeRef} style={{position: 'absolute', top: 0, left: 0, zIndex}}>
				{cardToDisplay}
			</div>
		</Draggable>

	);
}

export default Card;
