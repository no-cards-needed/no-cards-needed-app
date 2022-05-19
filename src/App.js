import { React, useEffect, useRef, useState } from "react";
import { useSpring } from "react-spring";
import './App.css';

import Card from "./assets/components/Card.tsx";
import { Stack } from "./assets/components/Stack.tsx";
import { calculateCardPosition } from "./assets/helpers/calculate-card-position.ts";
import { getPositionAtCenter } from "./assets/helpers/get-position-at-center.ts";
import { moveCardsAside } from "./assets/helpers/move-cards-aside.ts";

// https://www.npmjs.com/package/use-dynamic-refs
// import useDynamicRefs from "./assets/helpers/use-dynamic-refs";

function App() {

	const stackRef = useRef([]);
	const cardRef = useRef([]);
	const [isColliding, setIsColliding] = useState(false);

	const [stacks, setStacks] = useState([
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
			onStackType: "none"
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
			onStackType: "none"
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
			onStackType: "none"
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
			onStackType: "none"
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
			onStackType: "none"
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

	const checkCollision = (collider, colliding) => {
		const colliderRect = collider.getBoundingClientRect();
		const collidingRect = colliding.getBoundingClientRect();
 
		return (
			colliderRect.top < collidingRect.top + collidingRect.height / 2 &&
			collidingRect.bottom - collidingRect.height / 2 < colliderRect.bottom &&
			colliderRect.left < collidingRect.left + collidingRect.width / 2 &&
			colliderRect.right > collidingRect.right - collidingRect.width / 2
		);
	}

	const handleCardDrag = (data, id) => {
		// const collisionWithHand = checkCollision(handRef.current, data.current)
		
		// Setting Z-Index of currently dragged Card to the highest
		setUsedCards(usedCards.map((card, i) => {
			if (i === id) {
				card.zIndex = usedCards.length;
			}
			return card;
		}
		))

		const card = data.current
		setNearestStack(getNearestStack(card))

		// Collision
		if (nearestStack && nearestStack.nearestStack && checkCollision(nearestStack.nearestStack, card)) {
			// Set Nearest Stack to Colliding
			stacks[nearestStack.index].colliding = true;

			setIsColliding(true)

			//Getting Stack Type of the Nearest Stack
			const nearestStackType = stacks[nearestStack.index].stackType;
			if (nearestStackType === "openStack") {
				moveCardsAside(stacks, nearestStack, data.current, usedCards, setUsedCards, id)
			}

		} else {
			if(nearestStack && nearestStack.nearestStack) {
				// Set Nearest Stack to Colliding
				stacks[nearestStack.index].colliding = false;
				setIsColliding(false)

			}
			console.log("code block executing")

			setUsedCards(usedCards.map((card, i) => {
				card.movedAside = "false";
				return card;
			}))
		}
		
	}

	// const calculateCardPosition = (card, stackRef, stacksObject, id) => {	
	// 	// Get Card Position in stack from id
	// 	const cardPositionInStack = getCardPositionInStack(id, stacksObject)

	// 	const cardCount = stacksObject.cards.length

	// 	const stackCenter = getPositionAtCenter(stackRef);
	// 	const { width: cardWidth, height: cardHeight } = card.getBoundingClientRect();

	// 	const overlap = cardWidth / 2
		
    //     //X - position of first card (most left, bottom of stack)
	// 	let firstCardX = 0 - cardWidth / 2
		
	// 	//odd cards -> one is centered, even number -> no card centered
	// 	if(cardCount%2 === 1){
	// 		firstCardX += -1 * (cardCount - 1) / 2 * overlap;
	// 	}
	// 	else{
	// 		firstCardX += -1 * cardCount / 2 * overlap + overlap / 2;
	// 	}
	// 	return firstCardX + cardPositionInStack * overlap + stackCenter.x
	// }

	const handleCardDrop = (data, id) => {
		// Set movedAside in all cards to false
		setUsedCards(usedCards.map((card, i) => {
			card.movedAside = "false";
			return card;
		}))

		// updateCardPosition(1, { x: 90, y: 110 })
		// Check if Card and Nearest Stack are colliding
		if (isColliding) {

			// Removing Card-ID from all other stacks
			setStacks(stacks.map((stack, i) => {
				stack.cards = stack.cards.filter(card => card !== id);
				return stack;
			}))

			// Adding Card-ID into the Stack Object
			const addCardIntoStack = (index, cardId) => {
				//Adding Card ID into the Stack Object at a specific index
				setStacks(stacks.map((stack, i) => {
					if (i === nearestStack.index) {
						stack.cards.splice(index, 0, cardId);
					}
					return stack;
				}))
			}

			// Stack Position
			const {x: stackX, y: stackY} = getPositionAtCenter(nearestStack.nearestStack);

			switch (stacks[nearestStack.index].stackType) {
				// "normal"/closed stack: Cards lie on top of each other
				case "stack":
					addCardIntoStack(stacks[nearestStack.index].cards.length, id)
					updateCardPosition(id, {
						x: stackX - data.current.getBoundingClientRect().width / 2, 
						y: stackY - data.current.getBoundingClientRect().height / 2
					})

					// Set On Stack Type of Card
					setUsedCards(usedCards.map((card, i) => {
						if (card.id === id) {
							card.onStackType = "stack";
						}
						return card;
					}))

					break;
				// Open Stack: Cards lie next to each other
				case "openStack":
					const currentCardPos = data.current.getBoundingClientRect().left
					let closestCard = {left: 0, cardIndex: 0}

					// Cycle through all cards in stack
					for (let i = 0; i < stacks[nearestStack.index].cards.length; i++) {
						const cardIndex = stacks[nearestStack.index].cards[i];
						const card = usedCards.find(card => card.id === cardIndex);
						const cardPosition = card.ref.current.getBoundingClientRect().left;
						console.log(`cardPosition: ${cardPosition}`)
						console.log(`currentCardPos: ${currentCardPos}`)
						console.log(`cardPosition < currentCardPos: ${cardPosition < currentCardPos}`)
						console.log(`cardPosition > closestCard.left: ${cardPosition > closestCard.left}`)
						if (cardPosition < currentCardPos && cardPosition > closestCard.left) {
							closestCard.left = cardPosition;
							closestCard.cardIndex = i;
						}
					}

					// No card is further to the left
					if (closestCard.left === 0) {
						addCardIntoStack(0, id)
					} else {
						addCardIntoStack(closestCard.cardIndex + 1, id)
					}

					updateCardPosition(id, {
						x: calculateCardPosition(data.current, nearestStack.nearestStack, stacks[nearestStack.index], id), 
						// x: newPosition, 
						y: stackY - data.current.getBoundingClientRect().height / 2
					})
					break;
				default:
					break;
			}

			// Updating all cards in all stacks
			// This is probably not the pest performing variant to do this, but for now its the only I know of
			stacks.map((stack, i) => {
				stack.cards.map((card, i) => {
					if(stack.stackType === "openStack") {
						// Get Card by ID
						const currentCard = usedCards.find(thisCard => thisCard.id === card)
						
						// Get Stack in which the Card is
						const currentStack = stacks.find(thisStack => thisStack.cards.includes(card))

						// Get Stack Index
						const currentStackIndex = stacks.findIndex(thisStack => thisStack.cards.includes(card))

						// Get Stack Ref
						const currentStackRef = stackRef[currentStackIndex]

						const newCardPosition = calculateCardPosition(currentCard.ref.current, currentStackRef, currentStack, card)
						updateCardPosition(card, {
							x: newCardPosition,
							y: getPositionAtCenter(currentStackRef).y - data.current.getBoundingClientRect().height / 2
						})
					}

					// Settting Card zIndex in usedCards based on position in stack
					setUsedCards(usedCards.map((cardInUsedCards) => {
						if (cardInUsedCards.id === card) {
							cardInUsedCards.zIndex = i
						}
						return cardInUsedCards
					}))
				})
			})
		}
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


	return (
		<div className="App">
			{/* <div className='cardStack' style={{border: isColliding ? '1px solid green' : '1px solid red',}} ref={stackRef}></div> */}
			<p style={{width: 500, margin: "0 auto"}}>{
				JSON.stringify(stacks[1], ["cards"], "\t")
			}</p>
			{
				stacks.map((stack, index) => {
					return (
						<Stack key={index} stack={stack} stackRef={el => stackRef[index] = el} onCardDrag={handleCardDrag} onCardDrop={handleCardDrop} updateCardPosition={updateCardPosition}/>
					)
				})
			}
			{/* <Stack height={500} width={500} position={{x: 0, y: 0}} updateCardPosition={updateCardPosition} isColliding={isColliding} stackRef={stackRef}/> */}

			{/* <div className='hand' style={{border: isColliding ? '1px solid green' : '1px solid red',}}></div> */}
			<div className="hand">
				{
					usedCards.map((card, index) => {
						return <Card setRef={setCardRef} card={card} key={card.id} handleCardDrag={handleCardDrag} handleCardDrop={handleCardDrop} />
					})
				}
			</div>
		</div>
	);
}

export default App;
