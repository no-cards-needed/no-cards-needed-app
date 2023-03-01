import { MutableRefObject } from "react";
import { cardDimensions } from "./card-dimensions"

export const moveCardsAside = (
	stackSize: number, 
	currentCardRef: MutableRefObject<HTMLElement>, 
	usedCards: UsedCardsMap,
	setUsedCards: (usedCards: UsedCardsMap) => void,
	cardId: number) => {

	// Moving the Cards in the open Stack aside
	for (let loopedCardId = 0; loopedCardId < stackSize; loopedCardId++) {

		if (loopedCardId !== cardId) {
			// Get Position of currently dragged card
			const { left: cardLeft, right: cardRight } = currentCardRef.current.getBoundingClientRect();

			const cardWidth = cardDimensions.width;
			const currentCardCenter = cardLeft + cardWidth / 2

			const isLeft = cardLeft + cardWidth / 2 < currentCardCenter
			const isRight = cardRight - cardWidth / 2 > currentCardCenter
			// console.log(isLeft, isRight)
			
			// Set Card to Moved Aside
			const tempUsedCards = usedCards;
			const movedAside = isLeft ? "left" : isRight ? "right" : "none"
			if(movedAside !== "none" || tempUsedCards.get(loopedCardId).movedAside !== movedAside) {
				const tempCard = tempUsedCards.get(loopedCardId)
				tempCard.movedAside = movedAside
				tempUsedCards.set(loopedCardId, tempCard)
				setUsedCards(tempUsedCards)
			}
			// TODO: When in "Selection" mode, the collidion shouldnt toggle the stack width
		}
	}
	
}