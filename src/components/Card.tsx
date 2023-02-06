import { useRef, useState, useEffect } from "react";
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from "react-draggable";

import { cards, back } from "../helpers/Cards";

import {
    ControlledMenu,
    MenuItem,
    useMenuState
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

type CardProps = {
	handleCardDrag: (nodeRef: any, cardId: number) => void,
	handleCardDrop: (nodeRef: any, cardId: number) => void,
	card: UsedCard,
	cardId: number,
	setRef: (ref: HTMLDivElement) => void,
	shuffle: () => void,
	handleLongPress: (cardId: number) => void,
}

function Card({
		handleCardDrag, 
		handleCardDrop, 
		card, 
		cardId,
		setRef,
		shuffle,
		handleLongPress,
	} : CardProps) {

	const {
		symbol,
		zIndex, 
		controlledPosition, 
		onStackType
	} = card;

	const nodeRef = useRef(null)
	const [transition, setTransition] = useState(false)

	const [deltaPosition, setDeltaPosition] = useState({x: 0, y: 0})
	
	// TODO: Causes Performance issues
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

	const handleStart: DraggableEventHandler = () => {
	}

	const handleDrag: DraggableEventHandler = (e: DraggableEvent, ui: DraggableData) => {
		const {x, y} = deltaPosition
		setDeltaPosition(
			{
				x: x + ui.deltaX,
				y: y + ui.deltaY
			}
		)
		handleCardDrag(nodeRef, cardId)
	}
	
	const handleStop: DraggableEventHandler = () => {
		setDroppedTimer()
		handleCardDrop(nodeRef, cardId)
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

	const getCardBySymbol = () => {
		try {
			const cardObj = cards.filter((card) => card.name === symbol)[0]
			if(!cardObj) {
				console.log(card)
				throw new Error("Card not found:")
			}
			if (cardObj.icon) {
				return cardObj.icon
			} else {
				return <></>
			}
		} catch(e) {
			console.log(e)
		}
	}

	const [cardToDisplay] = useState(getCardBySymbol());

	const cardStartPosition = {x: 0, y: 0}

	const onLongPress: DraggableEventHandler = () => {

    };

	const lastTouchTimestamp = useRef(0);
    const onClick = (e: any) => {
		if (e.type === "touchend") {
			lastTouchTimestamp.current = e.timeStamp;
		}

		// Open Context Menu on double press
		if(e.detail === 2 || e.timeStamp - lastTouchTimestamp.current < 500) {
			toggleMenu(true)
			if(e.type === "touchend") {
				setAnchorPoint({x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY})
			} else {
				setAnchorPoint({x: e.clientX, y: e.clientY})
			}
		}
    }

	const onMouseDown = (e: Event) => {
		// Setting cardStartPosition to current position of the card
		// console.log("setting delta position")
		// cardStartPosition = deltaPosition
	}

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };
    // const longPressEvent = useLongPress(onLongPress, onClick, onMouseDown, defaultOptions);

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

	const transform = onStackType === "front" ? `rotate(${rotation}deg)` : "rotate(0deg)";

	const [menuProps, toggleMenu] = useMenuState();
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
	
	// Have the default position be in the center of the screen
	const [defaultPosition, setDefaultPosition] = useState({x: 0, y: 0})

	useEffect(() => {
		setRef(nodeRef.current)
		
		setDefaultPosition({
			x: window.innerWidth / 2 - 40,
			y: window.innerHeight / 2 - 56
		})
		
		return () => clearTimeout(timerRef.current);
	}, [])

	return (
		<>
			<Draggable
				nodeRef={nodeRef}
				defaultPosition={defaultPosition}
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
 					style={{position: 'absolute', top: 0, left: 0, zIndex, height: 112, width: 80}} 
					className={transition ? "animation" : null}
					// onTouchStart={touchStart}
					// onClick={touchStart}
					>
						<div 
							style={{transform, boxShadow: card.hasShadow ? "var(--shadow-elevation-medium)" : "none"}} 
							className={`cardContainer ${classList}`}
							// {...longPressEvent}
							>
							{
								card.onStackType === "front" || card.onStackType === "open" || card.onStackType === "hand" ?
									cardToDisplay
									: back
							}
						</div>
				</div>
			</Draggable>

			<div>

				<ControlledMenu {...menuProps} anchorPoint={anchorPoint}
					onClose={() => toggleMenu(false)}>
					{/* <MenuItem>Pick Up</MenuItem>
					<MenuItem>Remove Pile from Game</MenuItem>
					<MenuItem>Take a Trick</MenuItem> */}
					{onStackType === "back" ? <MenuItem onClick={() => shuffle()}>Shuffle Pile</MenuItem> : null}
					{/* <MenuItem>Deal all Cards Again</MenuItem> */}
				</ControlledMenu>
			</div >
		</>
	);
}

export default Card;
