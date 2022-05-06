import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";


import { cards } from "../helpers/Cards";


function Card({positionCallback, colliding, stack, card, hand}) {

	const nodeRef = useRef(null)

	// const [activeDrags, setActiceDrags] = useState(0)
	const [deltaPosition, setDeltaPosition] = useState({x: 0, y: 0})
	const [controlledPosition, setControlledPosition] = useState({x: 0, y: 0})
	
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

		positionCallback(nodeRef)
	}
	
	const handleStop = (e) => {
		if(colliding) {

			const stackPosition = stack.stack
			console.log(handOffset(stack.stackCardAmount, stack.stackCardAmount))
			const offset = stack.stackType === "stack" ? 0 : handOffset(stack.stackCardAmount, 1)

			setControlledPosition(
				{
					x: stackPosition.left + stackPosition.width / 2 - nodeRef.current.clientWidth / 2 + offset, 
					y: stackPosition.top + stackPosition.height / 2 - nodeRef.current.clientHeight / 2
				}
			)
		}
	}

	const handCardDistance = 50
	const handOffset = (amount, i) => (handCardDistance * amount) * -1 + handCardDistance * i

	useEffect(() => {
		// Card gets loaded
		const handPosition = hand.handRef.current.getBoundingClientRect()

		console.log(handOffset(hand.handCardAmount, hand.i))
		const cardX = handPosition.left + handPosition.width / 2 - nodeRef.current.clientWidth / 2 + handOffset(hand.handCardAmount, hand.i)
		const cardY = handPosition.top + handPosition.height / 2 - nodeRef.current.clientHeight / 2

		setControlledPosition({x: cardX, y: cardY})
	
	  return () => {
		// Card gets unloaded
	  }
	}, [])
	
	const cardToDisplay = () => {
		const rand = Math.floor(Math.random() * cards.length)
		console.log(cards[0])
		return (cards[0].icon)
	}

	return (
		<Draggable
		nodeRef={nodeRef}
		defaultPosition={{x: 0, y: 0}}
		position={controlledPosition}
		// grid={[25, 25]}
		scale={1}
		onStart={handleStart}
		onDrag={handleDrag}
		onStop={handleStop}>
		<div ref={nodeRef} style={{position: 'absolute', top: 0, left: 0}}>
			{cardToDisplay()}
		</div>
	</Draggable>

	);
}

export default Card;
