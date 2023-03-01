import { MutableRefObject } from "react";
import { getCardPositionInStack } from "./get-card-position-in-stack";
import { getPositionAtCenter } from "./get-position-at-center";

export const calculateCardPosition = (
	card: MutableRefObject<Map<number, HTMLDivElement>>, 
	stackRef: MutableRefObject<Map<number | string, HTMLDivElement>>, 
	stackId: number | string,
	stack: Stack, 
	cardId: number) => {

	// Get Card Position in stack from id
	const cardPositionInStack = getCardPositionInStack(cardId, stack)

	// Get count of Cards in the stack where the hasPlayer property is equal to the user ID
	
	const cardCount = stack.cards ? stack.cards?.size : 0;

	const stackCenter = getPositionAtCenter(stackRef.current.get(stackId), "stackCenter - calculate-card-position.ts 14");
	// const { width: cardWidth } = card.current[cardId].getBoundingClientRect();
	const cardWidth = 80
	const overlap = cardWidth / 2
	
	//X - position of first card (most left, bottom of stack)
	let firstCardX = 0 - cardWidth / 2
	
	//odd cards -> one is centered, even number -> no card centered
	if(cardCount%2 === 1) {
		firstCardX += -1 * (cardCount - 1) / 2 * overlap;
	}
	else {
		firstCardX += -1 * cardCount / 2 * overlap + overlap / 2;
	}

	return firstCardX + cardPositionInStack * overlap + stackCenter.x
}

export const calculateZIndex = (stackId: number | string, stack: Stack, cardId: number) => {
    const indexOfCard = stack.cards ? [...stack.cards].indexOf(cardId) : 0
    const cardIndex = indexOfCard === -1
                            ? cardId
                            : indexOfCard

    return cardIndex
}