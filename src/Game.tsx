import { useEffect, useRef, useState } from "react";
import { useSpring } from "react-spring";
import './App.css';

import Card from "./assets/components/Card";
import { Stack } from "./assets/components/Stack";
import { calculateCardPosition } from "./assets/helpers/calculate-card-position";
import { getPositionAtCenter } from "./assets/helpers/get-position-at-center";
import { handleCardDrag } from "./assets/helpers/handle-card-drag";	
import { handleCardDrop } from "./assets/helpers/handle-card-drop";
import { moveCardsAside } from "./assets/helpers/move-cards-aside";
import { moveCardsToHand } from "./assets/helpers/move-cards-to-hand";

// https://www.npmjs.com/package/use-dynamic-refs
// import useDynamicRefs from "./assets/helpers/use-dynamic-refs";

function Game() {

	const stackRef = useRef([]);
	const cardRef = useRef([]);
	const [isColliding, setIsColliding] = useState(false);
	const [cardStartPosition, setCardStartPosition] = useState({x: 0, y: 0});

	const [stacks, setStacks] = useState([
		{
			stackType: "hand",
			orientation: "front",
			cards: [],
			currentlyNearest: false,
			colliding: false,
			distance: 0,
			height: 200,
			width: 300,
			position: {
				x: 0,
				y: 0
			}
		},
		{
			stackType: "stack",
			orientation: "front",
			cards: [],
			currentlyNearest: false,
			colliding: false,
			distance: 0,
			height: 200,
			width: 300,
			position: {
				x: 0,
				y: 0
			}
		},
		{
			stackType: "openStack",
			orientation: "front",
			cards: [],
			currentlyNearest: false,
			colliding: false,
			distance: 0,
			height: 200,
			width: 300,
			position: {
				x: 0,
				y: 0
			}
		},
	])

	const [nearestStack, setNearestStack] = useState(null);
	
	const [usedCards, setUsedCards] = useState([
		{
			id: 0,
			symbol: "TEN_C",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
			movedAside: "false",
			onStackType: "none",
			ref: null
		},
		{
			id: 1,
			symbol: "TEN_D",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
			movedAside: "false",
			onStackType: "none",
			ref: null
		},
		{
			id: 2,
			symbol: "TEN_H",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
			movedAside: "false",
			onStackType: "none",
			ref: null
		},
		{
			id: 3,
			symbol: "TEN_H",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
			movedAside: "false",
			onStackType: "none",
			ref: null
		},
		{
			id: 4,
			symbol: "TEN_H",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
			movedAside: "false",
			onStackType: "none",
			ref: null
		},
	]);

	const getStackBoundingClientRect = (stack) => {
		if (stack.current) {
			return stack.current.getBoundingClientRect();
		}
		return null;
	}

	// const getPositionAtCenter = (element) => {
	// 	const { top, left, width, height } = element.getBoundingClientRect();
	// 	return {
	// 		x: left + width / 2,
	// 		y: top + height / 2
	// 	};
	// }

	const getDistanceBetweenTwoElements = (element1, element2) => {

		const { x: x1, y: y1 } = getPositionAtCenter(element1);
		const { x: x2, y: y2 } = getPositionAtCenter(element2);
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	}

	const getNearestStack = (card) => {
		const distances = stacks.map((stack, index) => {
			const distance = getDistanceBetweenTwoElements(stackRef[index], card)

			// Update Stack Distance
			setStacks(stacks.map((stack, i) => {
				if (i === index) {
					stack.distance = distance;
				}
				return stack;
			}))

			return distance
		});
		const nearestStack = stackRef[distances.indexOf(Math.min(...distances))];

		return {nearestStack, distance: Math.min(...distances), index: distances.indexOf(Math.min(...distances))};
	}

	const updateCardPosition = (cardId, {x, y}) => {
		setUsedCards(usedCards.map((card, i) => {
			if (i === cardId) {
				card.controlledPosition = {
					x,
					y
				}
			}
			return card;
		}))
	}

	// Setting Card Ref in usedCards State
	const setCardRef = (cardId, ref) => {
		setUsedCards(usedCards.map((card, i) => {
			if (i === cardId) {
				card.ref = ref;
			}
			return card;
		}))
	}

	// Move Cards to Hand on Start
	useEffect(() => {

		moveCardsToHand(usedCards, updateCardPosition, stacks, setStacks, stackRef)
		setTimeout(() => {
		}, 1000)
	}, [])

	return (
		<div className="App">
			{/* <div className='cardStack' style={{border: isColliding ? '1px solid green' : '1px solid red',}} ref={stackRef}></div> */}
			<p style={{width: 500, margin: "0 auto"}}>{
				JSON.stringify(stacks[1], ["cards"], "\t")
			}</p>
			{
				stacks.map((stack, index) => {
					return (
						<Stack key={index} stack={stack} stackRef={el => stackRef[index] = el} updateCardPosition={updateCardPosition}/>
					)
				})
			}
			{/* <Stack height={500} width={500} position={{x: 0, y: 0}} updateCardPosition={updateCardPosition} isColliding={isColliding} stackRef={stackRef}/> */}

			{/* <div className='hand' style={{border: isColliding ? '1px solid green' : '1px solid red',}}></div> */}
			<div className="hand">
				{
					usedCards.map((card, index) => {
						return <Card setRef={setCardRef} card={card} key={card.id} 
						handleCardDrag={(data, id) => handleCardDrag(data, id, usedCards, setUsedCards, getNearestStack, nearestStack, setNearestStack, stacks, setIsColliding, cardStartPosition, setCardStartPosition)} 
						handleCardDrop={(data, id) => handleCardDrop(data, id, usedCards, setUsedCards, isColliding, stacks, setStacks, nearestStack, updateCardPosition, stackRef)} />
					})
				}
			</div>
		</div>
	);
}

export default Game;
