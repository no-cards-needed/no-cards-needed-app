import { MutableRefObject } from "react";
import { cardDimensions } from "./card-dimensions"

export const moveCardsAside = (
	controlledStacks: MutableRefObject<ControlledStacks>, 
	nearestStack: NearestStack, 
	currentCardRef: React.MutableRefObject<HTMLElement>, 
	usedCards: UsedCard[],
	setUsedCards: (usedCards: UsedCard[]) => void,
	cardId: number) => {

	const controlledStack = controlledStacks.current[nearestStack.stackIndex]

	// Moving the Cards in the open Stack aside
	if(controlledStack) {
		for (let loopedCardId = 0; loopedCardId < controlledStack.length; loopedCardId++) {

			if (loopedCardId !== cardId) {
				// Get Position of currently dragged card
				const { left: cardLeft, right: cardRight } = currentCardRef.current.getBoundingClientRect();
	
				const cardWidth = cardDimensions.width;
				const currentCardCenter = cardLeft + cardWidth / 2
	
				const isLeft = cardLeft + cardWidth / 2 < currentCardCenter
				const isRight = cardRight - cardWidth / 2 > currentCardCenter
				// console.log(isLeft, isRight)
				
				// Set Card to Moved Aside
				const tempUsedCards = [...usedCards];
				const movedAside = isLeft ? "left" : isRight ? "right" : "none"
				if(movedAside !== "none" || tempUsedCards[loopedCardId].movedAside !== movedAside) {
					tempUsedCards[loopedCardId].movedAside = movedAside
					setUsedCards(tempUsedCards)
				}
				// TODO: When in "Selection" mode, the collidion shouldnt toggle the stack width
			}
		}
	}
}