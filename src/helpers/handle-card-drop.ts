import { calculateCardPosition } from "./calculate-card-position";
import { getPositionAtCenter } from "./get-position-at-center";
import {addCardIntoStack, moveCardToPosition} from "./move-card-to-position";
import { removeCardFromOtherStacks } from "./remove-card-from-other-stacks";

export const handleCardDrop = (
	data, 
	id: number, 
	usedCards: {id: number, symbol: string, controlledPosition: {x: number, y: number}, zIndex: number, movedAside: string, onStackType: string, ref, animation: string, orientation: string}[],
	setUsedCards: (usedCards) => void, 
	isColliding: boolean,
	setIsColliding: (isColliding: boolean) => void,
	stacks: {stackType: string, orientation: string, cards: number[], currentlyNearest: boolean, colliding: boolean, distance: number, height: number, width: number, position: {x: number, y: number}}[], 
	setStacks: (value: React.SetStateAction<{
		stackType: string;
		orientation: string;
		cards: any[];
		currentlyNearest: boolean;
		colliding: boolean;
		distance: number;
		height: number;
		width: number;
		position: {
			x: number;
			y: number;
		};
	}[]>) => void,
	nearestStack: {nearestStack, index: number, distance: number}, 
	updateCardPosition: (cardId: any, { x, y }: {
		x: any;
		y: any;
	}) => void,
	stackRef: React.MutableRefObject<any[]>,
	cardRef: React.MutableRefObject<any[]>,
	currentlyMovingStack: boolean,
	setCurrentlyMovingStack: (currentlyMovingStack: boolean) => void) => {


			const moveAllCardsToNewStack = (previousStackIndex, stackPosition) => {
				// Getting all Cards from previous stack in temp array
				const tempCards = stacks[previousStackIndex].cards

				// Deleting Card from previous stack
				setStacks(stacks.map((stack, i) => {
					if (i === previousStackIndex) {
						stack.cards = []
					}
					return stack;
				}))

				// Adding all Cards from temp array into the new stack
				setStacks(stacks.map((stack, i) => {
					if (i === nearestStack.index) {
						stack.cards = tempCards
					}
					return stack
				}))

				// Removing Stack Animation from all cards
				setUsedCards(usedCards.map((card, i) => {
					card.animation = "";

					// Moving Cards to new Stack
					updateCardPosition(i, {
						x: stackPosition.x - data.current.getBoundingClientRect().width / 2,
						y: stackPosition.y - data.current.getBoundingClientRect().height / 2
					})

					return card;
				}))

				setCurrentlyMovingStack(false)
			}


			// Set movedAside in all cards to false
			setUsedCards(usedCards.map((card, i) => {
				card.movedAside = "false";
				return card;
			}))

			// updateCardPosition(1, { x: 90, y: 110 })
			// Check if Card and Nearest Stack are colliding
			if (isColliding) {
				
				// Getting Previous Stack`
				
				const previousStackIndex = stacks.findIndex(stack => {
					return stack.cards ? stack.cards.includes(id) : false
				});

				// Removing Card-ID from all other stacks
				removeCardFromOtherStacks(setStacks, stacks, id)



				// Stack Position
				const {x: stackX, y: stackY} = getPositionAtCenter(nearestStack.nearestStack, "stackPosition - handle-card-drop.ts 96");

				switch (stacks[nearestStack.index].stackType) {
					// "normal"/closed stack: Cards lie on top of each other
					case "stack":

						if (currentlyMovingStack) {
							moveAllCardsToNewStack(previousStackIndex, {x: stackX, y: stackY})
						}

						moveCardToPosition(stacks, setStacks, usedCards, setUsedCards, nearestStack.index, updateCardPosition, id, {x: stackX, y: stackY})

						break;
					// Open Stack: Cards lie next to each other
					case "openStack":
					case "hand":
						
						// Workaround for moving closed stacks to open stacks
						if (!currentlyMovingStack) {

							const currentCardPos = data.current.getBoundingClientRect().left
							let closestCard = {left: 0, cardIndex: 0}

							if(stacks[nearestStack.index].cards && stacks[nearestStack.index].cards.length > 0) {
								// Cycle through all cards in stack
								for (let i = 0; i < stacks[nearestStack.index].cards.length; i++) {
									const cardIndex = stacks[nearestStack.index].cards[i];
									const card = usedCards.find(card => card.id === cardIndex);
									const cardPosition = cardRef.current[cardIndex].ref.getBoundingClientRect().left;

									if (cardPosition < currentCardPos && cardPosition > closestCard.left) {
										closestCard.left = cardPosition;
										closestCard.cardIndex = i;
									}
								}
							}

							// No card is further to the left
							if (closestCard.left === 0) {
								addCardIntoStack(stacks, setStacks, nearestStack.index, 0, id)
							} else {
								addCardIntoStack(stacks, setStacks, nearestStack.index,closestCard.cardIndex + 1, id)
							}
							updateCardPosition(id, {
								
								x: calculateCardPosition(data, nearestStack.nearestStack, stacks[nearestStack.index], id), 
								// x: newPosition, 
								y: stackY - data.current.getBoundingClientRect().height / 2
							})

							// Set On Stack Type of Card
							setUsedCards(usedCards.map((card, i) => {
								if (card.id === id) {
									card.onStackType = "openStack";
									card.orientation = "front"
								}
								return card;
							}))
						} else {
							// Removing Stack Animation from all cards
							setUsedCards(usedCards.map((card, i) => {
								card.animation = "";
								return card;
							}))
						}

						break;
					default:
						break;
				}

				// Updating all cards in all stacks
				// This is probably not the pest performing variant to do this, but for now its the only I know of
				stacks.map((stack) => {
					if(stack.cards) {
						stack.cards.map((card, i) => {
							if(stack.stackType === "openStack" || stack.stackType === "hand") {
								// Get Card by ID
								const currentCard = usedCards.find(thisCard => thisCard.id === card)

								// Get Stack Index
								const currentStackIndex = stacks.findIndex(thisStack => {
									return thisStack.cards ? thisStack.cards.includes(card) : false
								})
								
								// Get Stack in which the Card is
								// const currentStack = stacks.find(thisStack => thisStack.cards.includes(card))
								const currentStack = stacks[currentStackIndex]
								console.log(stackRef.current[currentStackIndex])
	
								// Get Stack Ref
								const currentStackRef = stackRef.current[currentStackIndex]
	
								const newCardPosition = calculateCardPosition(cardRef.current[card], currentStackRef, currentStack, card)
								updateCardPosition(card, {
									x: newCardPosition,
									y: getPositionAtCenter(currentStackRef, "updateCardPosition - handle-card-drop.ts 188").y - data.current.getBoundingClientRect().height / 2
								})
							}
	
							// Settting Card zIndex in usedCards based on position in stack
							setUsedCards(usedCards.map((cardInUsedCards) => {
								if (cardInUsedCards.id === card) {
									cardInUsedCards.zIndex = i
								}
								return cardInUsedCards
							}))
							return card
						})
					}
					return stack
				})

				setIsColliding(false)
				stacks[nearestStack.index].colliding = false;
			}
}