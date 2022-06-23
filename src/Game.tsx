import { useEffect, useRef, useState } from "react";
import { useSpring } from "react-spring";
import './App.css';

import Card from "./assets/components/Card";
import { Stack } from "./assets/components/Stack";
import { calculateCardPosition } from "./assets/helpers/calculate-card-position";
import { getDistanceBetweenTwoElements } from "./assets/helpers/get-distance-between-two-elements";
import { getPositionAtCenter } from "./assets/helpers/get-position-at-center";
import { handleCardDrag } from "./assets/helpers/handle-card-drag";	
import { handleCardDrop } from "./assets/helpers/handle-card-drop";
import { moveCardsAside } from "./assets/helpers/move-cards-aside";
import { moveCardsToHand } from "./assets/helpers/move-cards-to-hand";
import { shuffleCards } from "./assets/helpers/shuffle-cards";

// https://www.npmjs.com/package/use-dynamic-refs
// import useDynamicRefs from "./assets/helpers/use-dynamic-refs";

function Game() {

	const stackRef = useRef([]);
	const cardRef = useRef([]);
	const [isColliding, setIsColliding] = useState(false);
	const [cardStartPosition, setCardStartPosition] = useState({x: 0, y: 0});
	const [currentlyMovingStack, setCurrentlyMovingStack] = useState(false);

	const [stacks, setStacks] = useState([
		{
			id: 0,
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
			id: 1,
			stackType: "stack",
			orientation: "back",
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
			id: 2,
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
			id: 3,
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
			ref: null,
			animation: "none"
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
			ref: null,
			animation: "none"
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
			ref: null,
			animation: "none"
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
			ref: null,
			animation: "none"
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
			ref: null,
			animation: "none"
		},
	]);

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

	// Shuffle cards by cardId
	const shuffleCardsById = (cardId: number) => {
		// Find stack of card
		const stack = stacks.find((stack, index) => {
			if (stack.cards.includes(cardId)) {
				return stack;
			}
		})

		const tempCards = stack.cards
		const shuffledCards = shuffleCards(tempCards)

		setStacks(stacks.map((updatedStack, index) => {
			if (index === stack.id) {
				updatedStack.cards = shuffledCards;
			}
			return updatedStack;
		}))
		
		// Re-Set zIndex of the shuffled cards
		setUsedCards(usedCards.map((card, i) => {
			if (shuffledCards.includes(card.id)) {
				card.zIndex = shuffledCards.indexOf(card.id)
				card.animation = "shuffle"
				const timeout = setTimeout(() => {
					// card.animation = "none"
					setUsedCards(usedCards.map((card, i) => {
						if (i === i) {
							card.animation = "none"
						}
						return card;
					}))
					clearTimeout(timeout)
				}, 300)
			}
			return card;
		}))

	}

	// Check if LongPress is in proximity of card start position, if so: move stack not single card
	const handleLongPress = (cardId: number, cardStartPosition: {x: number, y: number}, cardCurrentPosition: {x: number, y: number}) => {
		// Check if cardPosition is in specific radius of cardStartPosition

		const distance = Math.sqrt(Math.pow(cardStartPosition.x - cardCurrentPosition.x, 2) + Math.pow(cardStartPosition.y - cardCurrentPosition.y, 2))

		if (distance < 50) {
			setCurrentlyMovingStack(true)

			// Set Animation of current card to "stack" the it's obvious the user is moving a stack
			setUsedCards(usedCards.map((card, i) => {
				if (i === cardId) {
					card.animation = "stack"
				}
				return card;
			}))

			// Get All Cards in current Stack
			const {cards} = stacks.find((stack, index) => {
				if (stack.cards.includes(cardId)) {
					return stack;
				}
			})

			// Set All cards in stack of the moved card expect the one beeing moved to animation "hidden"
			setUsedCards(usedCards.map((card, i) => {
				if (cards.includes(card.id) && card.id !== cardId) {
					card.animation = "hidden"
				}
				return card;
			}))
		}
	}

	useEffect(() => {
		if (currentlyMovingStack) {
			// get all hidden cards to move to the closest stack
			usedCards.map((card, i) => {
				if (card.animation === "hidden") {
					const stackPosition = getPositionAtCenter(nearestStack.nearestStack)
					const {width, height} = card.ref.current.getBoundingClientRect()
					updateCardPosition(card.id, {x: stackPosition.x - width / 2, y: stackPosition.y - height / 2})
				}
			})
			
		}
	}, [isColliding])

	// Move Cards to Hand on Start
	useEffect(() => {

		moveCardsToHand(usedCards, updateCardPosition, stacks, setStacks, stackRef)

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
						return <Card 
								setRef={setCardRef} 
								card={card} 
								key={card.id}
								shuffle={shuffleCardsById}
								handleLongPress={handleLongPress}
								handleCardDrag={(data, id) => handleCardDrag(data, id, usedCards, setUsedCards, getNearestStack, nearestStack, setNearestStack, stacks, setIsColliding)} 
								handleCardDrop={(data, id) => handleCardDrop(data, id, usedCards, setUsedCards, isColliding, setIsColliding, stacks, setStacks, nearestStack, updateCardPosition, stackRef, currentlyMovingStack, setCurrentlyMovingStack)} />
					})
				}
			</div>
		</div>
	);
}

export default Game;
