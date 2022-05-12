import React, { useEffect, useRef, useState } from "react";
import { useSpring } from "react-spring";
import './App.css';

import Card from "./assets/components/Card.tsx";
import { Stack } from "./assets/components/Stack.tsx";

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
			height: 400,
			width: 200,
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
			height: 400,
			width: 200,
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
		},
		{
			id: 1,
			symbol: "TEN_D",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
		},
		{
			id: 2,
			symbol: "TEN_H",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
		},
	]);


	const getStackBoundingClientRect = (stack) => {
		if (stack.current) {
			return stack.current.getBoundingClientRect();
		}
		return null;
	}

	const getPositionAtCenter = (element) => {
		const { top, left, width, height } = element.getBoundingClientRect();
		return {
			x: left + width / 2,
			y: top + height / 2
		};
	}

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

		if (nearestStack && nearestStack.nearestStack && checkCollision(nearestStack.nearestStack, card)) {
			// Set Nearest Stack to Colliding
			stacks[nearestStack.index].colliding = true;

			setIsColliding(true)


			// setStackCardAmount(stackCardAmount + 1)

		} else {
			if(nearestStack && nearestStack.nearestStack) {
				// Set Nearest Stack to Colliding
				stacks[nearestStack.index].colliding = false;
				setIsColliding(false)
			}
		}
		
	}

	const getCardPositionInStack = (card, stack) => {
		let cardPositionInStack;
		for (let i = 0; i < stack.cards.length; i++) {
			const cardInStack = stack.cards[i];
			if (cardInStack === card) {
				cardPositionInStack = i
			}
		}
		return cardPositionInStack
	}

	const calculateCardPosition = (card, stackRef, stacksObject, id) => {	
		// Get Card Position in stack from id
		const cardPositionInStack = getCardPositionInStack(id, stacksObject)

		const stackCenter = getPositionAtCenter(stackRef);
		const { width: cardWidth, height: cardHeight } = card.getBoundingClientRect();
		const offset = 2

		const overallStackSpread = stackCenter.x - cardWidth * stacksObject.cards.length / offset*.75
		const cardPosition = overallStackSpread + cardWidth * cardPositionInStack / offset;

		// console.log(`stackCenter.x - cardWidth * length / 2 = ${overallStackSpread}`)
		// console.log(`${stackCenter.x} - ${cardWidth} * ${stacksObject.cards.length} / 2 = ${overallStackSpread}`)
		// console.log(`overallStackSpread + cardWidth * cardPositionInStack / offset - cardWidth / 2: ${cardPosition}`)
		// console.log(`${overallStackSpread} + ${cardWidth} * ${cardPositionInStack} / ${offset} - ${cardWidth} / 2: ${cardPosition}`)
		// console.log(`CardWidth: ${cardWidth}`)
		return cardPosition;
	}

	const handleCardDrop = (data, id) => {
		// updateCardPosition(1, { x: 90, y: 110 })
		// Check if Card and Nearest Stack are colliding
		if (isColliding) {

			// Removing Card-ID from all other stacks
			setStacks(stacks.map((stack, i) => {
				stack.cards = stack.cards.filter(card => card !== id);
				return stack;
			}))

			// Adding Card-ID into the Stack Object
			setStacks(stacks.map((stack, i) => {
				if (i === nearestStack.index) {
					stack.cards.push(id);
				}
				return stack;
			}))

			// Stack Position
			const {x: stackX, y: stackY} = getPositionAtCenter(nearestStack.nearestStack);

			switch (stacks[nearestStack.index].stackType) {
				case "stack":
					updateCardPosition(id, {
						x: stackX - data.current.getBoundingClientRect().width / 2, 
						y: stackY - data.current.getBoundingClientRect().height / 2
					})
					break;
				case "openStack":
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
				console.log(`Mapping Stack ${i}`)
				stack.cards.map((card, i) => {
					console.log(`Mapping Card ${card}`)
					if(stack.stackType === "openStack") {
						// Get Card by ID
						const currentCard = usedCards.find(thisCard => thisCard.id === card)
						
						// Get Stack in which the Card is
						const currentStack = stacks.find(thisStack => thisStack.cards.includes(card))

						// Get Stack Index
						const currentStackIndex = stacks.findIndex(thisStack => thisStack.cards.includes(card))

						// Get Stack Ref
						const currentStackRef = stackRef[currentStackIndex]
						console.log(stackRef[currentStackIndex])

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
		// console.log(`cardId: ${cardId}`)
		// console.log(`x: ${x}`)
		// console.log(`y: ${y}`)

		// const [springyX] = useSpring(() => ({ springyX: 0, y: 0 }));
		// Update Card Position
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
						return <Card setRef={setCardRef} key={card.id} id={card.id} symbol={card.symbol} zIndex={card.zIndex} handleCardDrag={handleCardDrag} handleCardDrop={handleCardDrop} controlledPosition={card.controlledPosition}/>
					})
				}
			</div>
		</div>
	);
}

export default App;
