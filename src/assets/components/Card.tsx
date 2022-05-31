import { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

import { cards } from "../helpers/Cards";
import useLongPress from "../helpers/use-long-press";


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
		setRef(id, nodeRef)
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

	const onLongPress = () => {
        console.log('longpress is triggered');
    };

    const onClick = () => {
        console.log('click is triggered')
    }

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };
    const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

	const maxRotationInDegrees = 10;
	const [rotation, setRotation] = useState(Math.random() * maxRotationInDegrees * 2 - maxRotationInDegrees);
	console.log(onStackType)
	const transform = onStackType === "stack" ? `rotate(${rotation}deg)` : "rotate(0deg)";

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
				style={{position: 'absolute', top: 0, left: 0, zIndex, height: 150, width: 107}} 
				className={transition ? "animation" : null}
				// onTouchStart={touchStart}
				{...longPressEvent}
				// onClick={touchStart}
				>
					<div style={{transform}} className="card">
						{cardToDisplay}
					</div>
				{/* {card.movedAside} */}

			</div>
		</Draggable>

	);
}

export default Card;
