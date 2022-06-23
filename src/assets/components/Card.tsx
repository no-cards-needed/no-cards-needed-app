import { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

import { cards, back } from "../helpers/Cards";

import useLongPress from "../helpers/use-long-press";

import {
    ControlledMenu,
    MenuItem,
    useMenuState
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';


function Card({
	handleCardDrag, 
	handleCardDrop, 
	card, 
	setRef,
	shuffle,
	handleLongPress,}) {

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
	// console.log(cards)

	const backSide = back

	const getCardBySymbol = () => {
		try {
			if (cards.filter((card) => card.name === symbol)[0].icon) {
				return cards.filter((card) => card.name === symbol)[0].icon
			} else {
				return null
			}
		} catch(e) {
			console.log(e)
		}
	}

	const [cardToDisplay, setCardToDisplay] = useState(getCardBySymbol());


	let cardStartPosition = {x: 0, y: 0}

	const onLongPress = () => {
		// if(onStackType === "stack") {
		// 	console.log(cardStartPosition, deltaPosition)
		// 	handleLongPress(id, cardStartPosition, deltaPosition)
		// }
    };

	const [lastTouchTimestamp, setLastTouchTimestamp] = useState(0);

    const onClick = (e) => {
		if (e.type === "touchend") {
			setLastTouchTimestamp(e.timeStamp);
		}

		// Open Context Menu on double press
		if(e.detail === 2 || e.timeStamp - lastTouchTimestamp < 500) {
			toggleMenu(true)
			if(e.type === "touchend") {
				setAnchorPoint({x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY})
			} else {
				setAnchorPoint({x: e.clientX, y: e.clientY})
			}
		}
    }

	const onMouseDown = (e) => {
		// Setting cardStartPosition to current position of the card
		//console.log("setting delta position")
		cardStartPosition = deltaPosition
	}

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };
    const longPressEvent = useLongPress(onLongPress, onClick, onMouseDown, defaultOptions);

	const maxRotationInDegrees = 10;
	const [rotation, setRotation] = useState(Math.random() * maxRotationInDegrees * 2 - maxRotationInDegrees);
	
	const [classList, setClassList] = useState("")
	useEffect(() => {
		if (card.animation === "shuffle") {
			setRotation(rotation + 360)
		} else if(card.animation === "stack") {
			setClassList("stack")
		} else if(card.animation === "hidden") {
			setClassList("hidden")	
		} else {
			setClassList("regular")
		}
	}, [card.animation])

	const transform = onStackType === "stack" ? `rotate(${rotation}deg)` : "rotate(0deg)";


	const [menuProps, toggleMenu] = useMenuState();
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
	console.log(card)

	return (
		<>
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
					// onClick={touchStart}
					>
						<div 
						style={{transform}} 
						className={`card ${classList}`}
						{...longPressEvent}
						>
							{
								card.orientation === "front" ?
									cardToDisplay
									: card.orientation === "back" ?
									backSide
									: <p>Hi </p>
							}
							
						</div>
					{/* {card.movedAside} */}

				</div>
			</Draggable>

			<div>

				<ControlledMenu {...menuProps} anchorPoint={anchorPoint}
					onClose={() => toggleMenu(false)}>
					{/* <MenuItem>Pick Up</MenuItem>
					<MenuItem>Remove Pile from Game</MenuItem>
					<MenuItem>Take a Trick</MenuItem> */}
					{onStackType === "stack" ? <MenuItem onClick={() => shuffle(id)}>Shuffle Pile</MenuItem> : null}
					{/* <MenuItem>Deal all Cards Again</MenuItem> */}
				</ControlledMenu>
			</div >
		</>
	);
}

export default Card;
